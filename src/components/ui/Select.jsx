function Select({
  label,
  id,
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label" htmlFor={id}>
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <select
        id={id}
        className={`select select-bordered w-full ${error ? "select-error" : ""} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-error text-sm mt-1">{error}</span>}
    </div>
  );
}

export default Select;