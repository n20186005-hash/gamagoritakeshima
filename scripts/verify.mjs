import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const notes = [];

const requiredFiles = [
  "package.json",
  "astro.config.mjs",
  "wrangler.jsonc",
  "src/layouts/BaseLayout.astro",
  "src/pages/index.astro",
  "src/pages/404.astro",
  "src/pages/sitemap.xml.ts",
  "src/styles/global.css",
  "public/robots.txt",
  "public/site.webmanifest",
  "public/images/og-image.jpg"
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) errors.push(`必須ファイルがありません: ${file}`);
}

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const sourceFiles = walk(join(root, "src")).filter((file) => [".astro", ".ts", ".css"].includes(extname(file)));
const sourceText = new Map(sourceFiles.map((file) => [file, readFileSync(file, "utf8")]));
const joinedSource = [...sourceText.values()].join("\n");

if (!joinedSource.includes("G-HXM22WWPKP")) errors.push("GA4測定IDが見つかりません。");
if (!joinedSource.includes("gamagoritakeshima.com")) errors.push("正規ドメインがソース内に見つかりません。");
if (!readFileSync(join(root, "astro.config.mjs"), "utf8").includes('site: "https://gamagoritakeshima.com"')) {
  errors.push("Astroのsite設定が正規ドメインと一致しません。");
}

const imageReferences = new Set();
const localLinks = new Set();
for (const [file, text] of sourceText) {
  for (const match of text.matchAll(/(?:src|image|href)=[{"'](\/images\/[A-Za-z0-9._/-]+)[}"']/g)) {
    imageReferences.add(match[1]);
  }
  for (const match of text.matchAll(/href=[{"'](\/[A-Za-z0-9_./#?=&%-]*)[}"']/g)) {
    localLinks.add(match[1]);
  }
  if (/<img\s+[^>]*src=["']https?:\/\//s.test(text)) {
    errors.push(`外部画像の直リンクがあります: ${relative(root, file)}`);
  }
}

for (const image of imageReferences) {
  const imagePath = join(root, "public", image.replace(/^\//, ""));
  if (!existsSync(imagePath)) {
    errors.push(`参照画像がありません: ${image}`);
  } else if (statSync(imagePath).size > 700 * 1024) {
    notes.push(`画像が700KBを超えています: ${image}`);
  }
}

const pageFiles = readdirSync(join(root, "src/pages"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".astro"))
  .map((entry) => entry.name);
const routeSet = new Set(["/"]);
for (const page of pageFiles) {
  if (page === "index.astro" || page === "404.astro") continue;
  routeSet.add(`/${page.replace(/\.astro$/, "")}/`);
}

for (const href of localLinks) {
  if (href.startsWith("/images/") || href.startsWith("/favicon") || href.startsWith("/site.webmanifest")) continue;
  const pathname = href.split(/[?#]/)[0] || "/";
  if (!routeSet.has(pathname)) errors.push(`リンク先ページが見つかりません: ${href}`);
}

const pageCount = pageFiles.filter((name) => name !== "404.astro").length;
const imageCount = readdirSync(join(root, "public/images"), { withFileTypes: true }).filter((entry) => entry.isFile()).length;
const externalAnchors = [...sourceText.entries()].flatMap(([file, text]) =>
  [...text.matchAll(/<a\b[^>]*href=[{"']https?:\/\//g)].map(() => relative(root, file))
);
const normalizePath = (p) => p.replace(/\\/g, "/");
const allowedExternalFiles = ["src/pages/access.astro", "src/pages/credits.astro"].map(normalizePath);
const unexpectedExternalFiles = [...new Set(externalAnchors.map(normalizePath))].filter((file) => !allowedExternalFiles.includes(file));
if (unexpectedExternalFiles.length) {
  errors.push(`想定外の外部リンクがあります: ${unexpectedExternalFiles.join(", ")}`);
}

for (const [file, text] of sourceText) {
  for (const match of text.matchAll(/<img\b[^>]*>/gs)) {
    if (!/\balt=/.test(match[0])) errors.push(`altのない画像があります: ${relative(root, file)}`);
  }
}

if (errors.length) {
  console.error("\nSource verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Source verification passed: ${pageCount} content pages, ${imageCount} local image assets, ${imageReferences.size} referenced images, ${localLinks.size} local links.`);
for (const note of notes) console.warn(`Note: ${note}`);
