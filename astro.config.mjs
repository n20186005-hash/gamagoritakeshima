import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://gamagoritakeshima.com",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory"
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
