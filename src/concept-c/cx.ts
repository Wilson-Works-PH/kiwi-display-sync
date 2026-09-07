/** Tiny class joiner for Concept C (keeps the concept self-contained). */
export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");
