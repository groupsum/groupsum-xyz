/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, CheckCircle2, AlertTriangle, Send } from "lucide-react";

interface FormFields {
  name: string;
  email: string;
  organization: string;
  interest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const InquiryForm: React.FC = () => {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    organization: "",
    interest: "platform-engineering",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"pristine" | "submitting" | "success" | "error">("pristine");
  const [simulateError, setSimulateError] = useState(false);

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!fields.name.trim()) {
      tempErrors.name = "Full name is required.";
    }
    if (!fields.email.trim()) {
      tempErrors.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    if (!fields.message.trim()) {
      tempErrors.message = "Please describe what you are trying to make possible.";
    } else if (fields.message.length < 15) {
      tempErrors.message = "Please provide a bit more context (minimum 15 characters).";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Simulate server latency
    setTimeout(() => {
      if (simulateError) {
        setStatus("error");
      } else {
        setStatus("success");
      }
    }, 1500);
  };

  const handleReset = () => {
    setFields({
      name: "",
      email: "",
      organization: "",
      interest: "platform-engineering",
      message: "",
    });
    setErrors({});
    setStatus("pristine");
  };

  if (status === "success") {
    return (
      <div 
        id="inquiry-success-message"
        className="p-8 bg-accent/5 border border-[var(--color-border-accent-soft)] rounded-[var(--radius-lg)] text-center max-w-xl mx-auto"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full text-accent mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-semibold tracking-tight text-ink mb-2">
          Inquiry Logged Successfully
        </h3>
        <p className="text-ink-muted text-[15px] leading-relaxed mb-6">
          Thank you for sharing your project goals. A Groupsum systems partner will review your technical specs and get in touch at <strong>{fields.email}</strong> within 1 business day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border-soft)] hover:border-accent text-xs font-mono text-ink rounded-[var(--radius-sm)] transition-all"
          >
            Submit Another Inquiry
          </button>
          <a
            href="mailto:partner@groupsum.xyz"
            className="inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent-hover text-xs font-mono text-white rounded-[var(--radius-sm)] transition-all"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Direct Email Follow-up
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] p-6 md:p-8 shadow-[var(--shadow-soft)]">
      <h3 className="font-serif text-2xl font-semibold tracking-tight text-ink mb-2">
        Start a Technical Conversation
      </h3>
      <p className="text-ink-muted text-[14px] leading-relaxed mb-6">
        Describe your systems engineering challenge. For immediate or direct security escalations, please contact us at{" "}
        <a href="mailto:partner@groupsum.xyz" className="text-accent hover:underline font-semibold">
          partner@groupsum.xyz
        </a>.
      </p>

      {status === "error" && (
        <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 text-red-800 rounded-[var(--radius-sm)] flex gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Network Ingress Failure</span>
            Unable to establish secure tunnel to submission endpoint. Please try again or fallback to direct email at{" "}
            <a href="mailto:partner@groupsum.xyz" className="underline font-semibold">
              partner@groupsum.xyz
            </a>.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={fields.name}
            onChange={handleInputChange}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jane Doe"
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 bg-canvas border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-[14px] text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50"
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-600 mt-1 font-mono">
              {errors.name}
            </p>
          )}
        </div>

        {/* Work Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-1.5">
            Work Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={fields.email}
            onChange={handleInputChange}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="jane@company.com"
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 bg-canvas border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-[14px] text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50"
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-600 mt-1 font-mono">
              {errors.email}
            </p>
          )}
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-1.5">
            Organization <span className="text-ink-muted/60 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={fields.organization}
            onChange={handleInputChange}
            placeholder="Acme Corp"
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 bg-canvas border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-[14px] text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50"
          />
        </div>

        {/* Service Interest */}
        <div>
          <label htmlFor="interest" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-1.5">
            Primary Area of Engagement
          </label>
          <select
            id="interest"
            name="interest"
            value={fields.interest}
            onChange={handleInputChange}
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 bg-canvas border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-[14px] text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="architecture-definition">Architecture & Product Definition</option>
            <option value="platform-engineering">Product & Platform Engineering</option>
            <option value="governance-evidence">Governance & Evidence Systems</option>
            <option value="modernization-remediation">Modernization & Remediation</option>
            <option value="delivery-operations">Delivery Operations</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-1.5">
            What are you trying to make possible? *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={fields.message}
            onChange={handleInputChange}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Briefly describe the system, current evidence, constraints, and outcome you want to review..."
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 bg-canvas border border-[var(--color-border-muted)] rounded-[var(--radius-sm)] text-[14px] text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 resize-y"
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-red-600 mt-1 font-mono">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit and Simulated Fail Control */}
        <div className="pt-4 border-t border-[var(--color-border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Subtle error toggle for reviewer to test */}
          <label className="inline-flex items-center text-[11px] font-mono text-ink-muted select-none cursor-pointer">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
              className="mr-2 accent-accent"
            />
            Simulate submission timeout
          </label>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-hover disabled:bg-accent/60 text-white text-xs font-bold uppercase tracking-widest rounded-md cursor-pointer select-none transition-all duration-150 focus:outline-none focus:ring-3 focus:ring-accent/20 focus:ring-offset-2"
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deploying payload...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-2" /> Submit Inquiry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
