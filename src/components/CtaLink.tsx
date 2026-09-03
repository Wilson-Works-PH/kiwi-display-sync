import type { ReactNode } from "react";

const styles = {
  primary:
    "bg-lime-400 text-plum-900 hover:bg-lime-300 hover:-translate-y-0.5 focus-visible:outline-current",
  ghost:
    "border border-ink/30 text-ink hover:border-accent-text hover:text-accent-text focus-visible:outline-current",
} as const;

export function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <a
      href={href}
      data-magnetic
      className={`font-header inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
