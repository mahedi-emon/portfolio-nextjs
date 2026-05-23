"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Auto-scroll to top on every route change.
 * Place inside any client layout.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
