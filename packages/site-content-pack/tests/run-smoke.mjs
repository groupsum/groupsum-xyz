import { siteContent } from "../dist/index.js";

if (!siteContent.product?.canonicalUrl) throw new Error("canonicalUrl missing");
if (!Array.isArray(siteContent.pages) || siteContent.pages.length < 1) throw new Error("pages missing");
if (!siteContent.pages[0].schema?.length) throw new Error("structured data intents missing");
console.log(`content-pack ok: ${siteContent.product.name} (${siteContent.pages.length} pages)`);
