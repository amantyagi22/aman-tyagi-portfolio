"use client";

import { useState } from "react";

/* A mailto link that copies the address instead when JS and the clipboard
   are available. Without JS it still opens the mail app. */
export function CopyEmail({
  email,
  label = "Copy email",
  className = "",
}: {
  email: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const address = email.replace(/^mailto:/, "");

  return (
    <a
      href={email}
      onClick={(e) => {
        if (!navigator.clipboard) return;
        e.preventDefault();
        navigator.clipboard.writeText(address).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className={`press inline-flex items-center gap-2 rounded-full ${className}`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        {copied ? (
          <path d="M3 8.5l3 3 7-7" />
        ) : (
          <>
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 3.5v-1h-8v8h1" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </a>
  );
}
