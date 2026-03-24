import Badge from "../ui/Badge.jsx";

function StatCard({
  title,
  value,
  badge,
  icon,
  color = "base-200", // base-200, primary, neutral, success, etc.
}) {
  const textColor = color.includes("primary") || color.includes("neutral") || color.includes("success")
    ? `text-${color}-content`
    : "";

  return (
    <div className={`card bg-${color} shadow-xl ${textColor}`}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-80">{title}</h3>
            <p className="text-4xl font-bold mt-3">{value}</p>
            {badge && (
              <Badge variant={badge.variant} className="mt-3">
                {badge.text}
              </Badge>
            )}
          </div>
          {icon && <div className="text-6xl opacity-60">{icon}</div>}
        </div>
      </div>
    </div>
  );
}

export default StatCard;