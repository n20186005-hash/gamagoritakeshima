interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
}

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.open-meteo.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "upgrade-insecure-requests"
].join("; ");

function applyCacheHeaders(url: URL, headers: Headers, contentType: string): void {
  if (contentType.includes("text/html")) {
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return;
  }

  if (url.pathname.startsWith("/_astro/")) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return;
  }

  if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i.test(url.pathname)) {
    headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
    return;
  }

  if (contentType.includes("xml") || contentType.includes("manifest")) {
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const headers = new Headers(assetResponse.headers);
    const contentType = headers.get("Content-Type") ?? "";

    headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Resource-Policy", "same-site");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");

    applyCacheHeaders(url, headers, contentType);

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers
    });
  }
};
