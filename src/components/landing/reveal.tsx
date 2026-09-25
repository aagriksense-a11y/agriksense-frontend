"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/components/ui";

/**
 * Scroll-reveal from js/main.js: one IntersectionObserver per element, threshold .12.
 * `as` keeps the original element (grid items must stay direct children).
 */
export function Reveal({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "p" | "article" | "section" | "span";
  className?: string;
  children: ReactNode;
}) {
  const node = useRef<HTMLElement | null>(null);

  const attach = useCallback((el: HTMLElement | null) => {
    node.current = el;
  }, []);

  useEffect(() => {
    const el = node.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const props = { ref: attach, className: cx("reveal", className), children };
  switch (as) {
    case "p":
      return <p {...props} />;
    case "span":
      return <span {...props} />;
    case "article":
      return <article {...props} />;
    case "section":
      return <section {...props} />;
    default:
      return <div {...props} />;
  }
}
