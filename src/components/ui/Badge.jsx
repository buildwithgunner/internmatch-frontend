function Badge({ variant = "secondary", size = "md", children }) {
  const variants = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    success: "badge-success",
    error: "badge-error",
    warning: "badge-warning",
    ghost: "badge-ghost",
    outline: "badge-outline",
  };

  const sizes = {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg",
  };

  return (
    <span className={`badge ${variants[variant] || variants.secondary} ${sizes[size] || sizes.md}`}>
      {children}
    </span>
  );
}

export default Badge;