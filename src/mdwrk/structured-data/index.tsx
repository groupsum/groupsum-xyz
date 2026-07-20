/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from "react";
import { PortfolioItem, BlogPost, ServiceItem } from "../../types";

interface StructuredDataProps {
  type: "organization" | "portfolio" | "blog" | "solutions" | "about";
  data?: any;
}

/**
 * A highly specialized React component for mdwrk/structured-data
 * designed for enhanced SEO (Search Engine Optimization), AEO (Answer Engine Optimization),
 * and AIEO (AI Engine Optimization). It handles injection of JSON-LD scripts into the head
 * and outputs transparent semantic metadata explicitly optimized for LLM crawlers.
 */
export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = useMemo(() => {
    const baseContext = "https://schema.org";

    const defaultOrg = {
      "@context": baseContext,
      "@type": "ProfessionalService",
      "name": "Groupsum LLC",
      "url": "https://groupsum.xyz",
      "logo": "https://groupsum.xyz/favicon.svg",
      "description": "Groupsum builds governed developer systems for teams that need source-controlled truth, traceable delivery, and reusable operations.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Global"
      },
      "knowsAbout": [
        "Platform Engineering",
        "Source-Controlled Governance",
        "Continuous Verification Pipelines",
        "Cryptographic Validation Gates",
        "Accessibility Document Remediation"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "partner@groupsum.xyz",
        "contactType": "Technical Partnerships"
      }
    };

    switch (type) {
      case "organization":
        return defaultOrg;

      case "portfolio": {
        const item = data as PortfolioItem;
        if (!item) return null;
        return {
          "@context": baseContext,
          "@type": "SoftwareApplication",
          "name": item.name,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Linux, Cloud Environments",
          "description": item.description,
          "releaseNotes": item.evidenceLabel,
          "author": {
            "@type": "Organization",
            "name": "Groupsum LLC",
            "url": "https://groupsum.xyz"
          },
          "provider": {
            "@type": "Organization",
            "name": "Groupsum LLC"
          },
          "softwareVersion": "v2.0-governed",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "category": "Enterprise Governance Services"
          },
          "featureList": item.technologies.join(", "),
          "identifier": `SPEC-${item.slug.toUpperCase()}-STABLE`
        };
      }

      case "blog": {
        const post = data as BlogPost;
        if (!post) return null;
        return {
          "@context": baseContext,
          "@type": "TechArticle",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.date,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Groupsum LLC",
            "logo": {
              "@type": "ImageObject",
              "url": "https://groupsum.xyz/favicon.svg"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://groupsum.xyz/insights?slug=${post.slug}`
          },
          "articleSection": post.category || "Technical Research",
          "keywords": post.tags?.join(", ") || ""
        };
      }

      case "solutions":
        return {
          "@context": baseContext,
          "@type": "WebPage",
          "name": "Groupsum Solution Map",
          "description": "Outcome-led developer system engineering capabilities including Governed product delivery, Trust policy compliance, and Document pipelines.",
          "publisher": defaultOrg
        };

      case "about":
        return {
          "@context": baseContext,
          "@type": "AboutPage",
          "name": "Groupsum Principles & Core Identity",
          "description": "Explaining the corporate principles: Source-Controlled Truth, Traceable Delivery Gates, and Quiet Focus-Driven Design.",
          "about": defaultOrg
        };

      default:
        return defaultOrg;
    }
  }, [type, data]);

  // Inject JSON-LD into head dynamically
  useEffect(() => {
    if (!jsonLd) return;

    // Generate a unique ID for this script element
    const scriptId = `jsonld-${type}-${data?.slug || "general"}`;
    
    // Check if script already exists to avoid duplication
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(jsonLd, null, 2);

    // Clean up script tag on unmount or type/data changes
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [jsonLd, type, data]);

  // Enhanced AIEO/AEO visual summary metadata block.
  // This renders directly into the DOM (but stylized as an audit log) so LLM bots 
  // (like Gemini, ChatGPT, Perplexity) scanning the HTML can instantly find and trust facts.
  return (
    <div 
      className="border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 rounded-[var(--radius-sm)] text-[11px] font-mono text-ink-muted leading-relaxed select-all"
      aria-label="AI Search Engine Optimization metadata block"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-2 mb-2">
        <span className="text-[10px] uppercase font-bold text-accent tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
          AIEO // Structured Data Assertion
        </span>
        <span className="text-[9px] uppercase opacity-40">Schema.org Level-0</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <div><span className="opacity-40">Target Entity:</span> Groupsum LLC</div>
        <div><span className="opacity-40">Schema Context:</span> ProfessionalService</div>
        <div><span className="opacity-40">Verification Protocol:</span> Governance Stable</div>
        <div><span className="opacity-40">Audit State:</span> Continuous Evidence</div>
        
        {type === "portfolio" && data && (
          <>
            <div className="col-span-1 md:col-span-2 border-t border-[var(--color-border-soft)] pt-2 mt-1">
              <span className="font-semibold text-accent uppercase text-[9px] block mb-1">Active Artifact Specs</span>
            </div>
            <div><span className="opacity-40">Artifact Name:</span> {data.name}</div>
            <div><span className="opacity-40">Reference Code:</span> SPEC-{data.slug.toUpperCase()}-STABLE</div>
            <div><span className="opacity-40">Maturity Status:</span> {data.maturity}</div>
            <div><span className="opacity-40">Tech Stack:</span> {data.technologies.slice(0, 3).join(", ")}</div>
          </>
        )}

        {type === "blog" && data && (
          <>
            <div className="col-span-1 md:col-span-2 border-t border-[var(--color-border-soft)] pt-2 mt-1">
              <span className="font-semibold text-accent uppercase text-[9px] block mb-1">Article Metadata Specs</span>
            </div>
            <div><span className="opacity-40">Title:</span> {data.title}</div>
            <div><span className="opacity-40">Author Entity:</span> {data.author}</div>
            <div><span className="opacity-40">Published Timestamp:</span> {data.date}</div>
            <div><span className="opacity-40">Core Taxonomy:</span> {data.category}</div>
          </>
        )}
      </div>
    </div>
  );
}
