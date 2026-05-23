"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Global toast notification host.
 * Styled to match the portfolio's dark theme.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "rgba(11, 19, 32, 0.95)",
          border: "1px solid rgba(199, 125, 255, 0.3)",
          color: "#C9D1D9",
          backdropFilter: "blur(12px)",
        },
        className: "font-sans",
      }}
    />
  );
}
