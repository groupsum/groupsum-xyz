/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from "react";
import { PortfolioItem, PortfolioEntity, BlogPost, ServiceItem } from "../../types";

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
        const item = data as PortfolioItem | PortfolioEntity;
        if (!item) return null;
        const name = "name" in item ? item.name : item.displayName;
        const description = "description" in item ? item.description : item.summary;
        const evidence = "evidenceLabel" in item ? item.evidenceLabel : item.evidence.map((entry) => entry.label).join("; ");
        const links = "links" in item ? item.links.map((link) => ("href" in link ? link.href : "" )).filter(Boolean) : [];
        return {
          "@context": baseContext,
          "@type": "SoftwareApplication",
          "name": name,
          "url": `https://groupsum.xyz/portfolio/${item.slug}`,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Linux, Cloud Environments",
          "description": description,
          "releaseNotes": evidence,
          "author": {
            "@type": "Organization",
            "name": "Groupsum LLC",
            "url": "https://groupsum.xyz"
          },
          "provider": {
            "@type": "Organization",
            "name": "Groupsum LLC"
          },
          "featureList": item.technologies.join(", "),
          "sameAs": links,
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
    if (document.querySelector('script[type="application/ld+json"]')) return;

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

  // JSON-LD is intentionally head-only; this component has no visual output.
  return null;
}
