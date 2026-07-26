export default function Icon({
  d,
  size = 18,
  color = "currentColor",
  strokeWidth = 2,
  fill = "none",
  viewBox = "0 0 24 24",
  className = "",
  style,
  children,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      {...props}
    >
      {d && <path d={d} />}
      {children}
    </svg>
  );
}
