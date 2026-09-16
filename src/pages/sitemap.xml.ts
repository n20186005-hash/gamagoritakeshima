import type { APIRoute } from "astro";
import { site } from "../data/site";

const pages = [
  "",
  "highlights/",
  "courses/",
  "photography/",
  "food/",
  "access/",
  "faq/",
  "privacy/",
  "credits/"
];

export const GET: APIRoute = () => {
  const lastmod = "2026-09-16";
  const entries = pages
    .map((path) => `  <url>\n    <loc>${site.url}/${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${path === "" ? "weekly" : "monthly"}</changefreq>\n    <priority>${path === "" ? "1.0" : path === "privacy/" || path === "credits/" ? "0.3" : "0.8"}</priority>\n  </url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
