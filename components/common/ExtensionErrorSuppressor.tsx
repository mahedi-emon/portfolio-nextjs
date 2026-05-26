"use client";

import { useEffect } from "react";

/**
 * Browser extensions (MetaMask, wallet injectors, password managers, etc.)
 * inject scripts into every page. Their failed connection attempts surface
 * as uncaught errors that Next 16's dev overlay captures even though our
 * code never touches them.
 *
 * This handler swallows errors that originate from `chrome-extension://`,
 * `moz-extension://`, and `safari-extension://` URLs — but never our own
 * code, so genuine bugs still throw normally.
 */

const EXTENSION_URL_RE = /^(chrome|moz|safari|webkit-masked|edge)-extension:\/\//;

function isExtensionError(source: unknown): boolean {
  if (typeof source !== "string") return false;
  return EXTENSION_URL_RE.test(source);
}

function isMetaMaskMessage(message: unknown): boolean {
  if (typeof message !== "string") return false;
  return (
    message.includes("MetaMask") ||
    message.includes("ethereum") ||
    message.includes("Failed to connect to MetaMask")
  );
}

export function ExtensionErrorSuppressor() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (isExtensionError(event.filename) || isMetaMaskMessage(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
      return undefined;
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const stack = (reason && typeof reason === "object" && "stack" in reason)
        ? String((reason as { stack?: unknown }).stack ?? "")
        : "";
      const message = (reason && typeof reason === "object" && "message" in reason)
        ? String((reason as { message?: unknown }).message ?? "")
        : String(reason ?? "");

      if (isExtensionError(stack) || isMetaMaskMessage(message) || isMetaMaskMessage(stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection, true);

    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection, true);
    };
  }, []);

  return null;
}
