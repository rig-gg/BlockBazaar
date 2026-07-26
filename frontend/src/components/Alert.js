import Icon from "./Icon";
import ICONS from "../constants/icons";

export default function Alert({
  type = "error",
  icon,
  iconSize = 18,
  className = "animate-scale-in",
  children,
}) {
  const resolvedIcon = icon || (type === "success" ? ICONS.check : ICONS.alertCircle);

  return (
    <div className={`bb-alert bb-alert-${type} ${className}`.trim()}>
      <Icon d={resolvedIcon} size={iconSize} />
      <span>{children}</span>
    </div>
  );
}
