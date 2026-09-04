/** The prototype's flat kiwi-slice SVG, parameterized per placement. */
export function BKiwi({
  seeds = 12,
  flesh = "#B7D24F",
  withGuides = false,
  className = "",
  style,
  dataAttr,
}: {
  seeds?: number;
  flesh?: string;
  withGuides?: boolean;
  className?: string;
  style?: React.CSSProperties;
  dataAttr?: string;
}) {
  const seedEls = Array.from({ length: seeds }, (_, i) => (
    <ellipse
      key={i}
      cx="50"
      cy="22"
      rx="2.4"
      ry="6.2"
      transform={`rotate(${(360 / seeds) * i} 50 50)`}
    />
  ));
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      {...(dataAttr ? { [dataAttr]: "1" } : {})}
    >
      <circle cx="50" cy="50" r="48" fill="#71864F" />
      <circle cx="50" cy="50" r="41" fill={flesh} />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#DCEB9C" strokeWidth="0.6" opacity="0.7" />
      <circle cx="50" cy="50" r="10.5" fill="#F4F7E4" />
      <g fill="#2C1830">{seedEls}</g>
      {withGuides && (
        <g stroke="#E9F2BE" strokeWidth="0.35" opacity="0.55">
          <line x1="50" y1="12" x2="50" y2="88" />
          <line x1="12" y1="50" x2="88" y2="50" />
          <line x1="23" y1="23" x2="77" y2="77" />
          <line x1="77" y1="23" x2="23" y2="77" />
        </g>
      )}
    </svg>
  );
}
