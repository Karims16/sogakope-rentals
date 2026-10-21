"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function GpsAddressBadge({ address }: { address: string }) {
  const [copyStatus, setCopyStatus] = useState("");
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setCopyStatus("GPS address copied.");
    } catch (error) {
      console.error("Unable to copy the GhanaPost GPS address:", error);
      setCopied(false);
      setCopyStatus("Copy failed. Please copy the address manually.");
    }
  }

  return (
    <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#dce6d8] bg-[#f5f8f2] px-3 py-2 text-xs font-semibold text-[#33413b]">
      <span>📍 GPS: {address}</span>
      <button
        aria-label={copied ? "GPS address copied" : "Copy GPS address"}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[#176b50] transition hover:bg-white"
        onClick={() => void copyAddress()}
        type="button"
      >
        {copied ? (
          <>
            <Check aria-hidden="true" size={13} />
            Copied
          </>
        ) : (
          <>
            <Copy aria-hidden="true" size={13} />
            Copy
          </>
        )}
      </button>
      <span aria-live="polite" className="sr-only" role="status">
        {copyStatus}
      </span>
    </div>
  );
}
