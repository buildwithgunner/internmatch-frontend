function Textarea({
  label,
  id,
  error,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label" htmlFor={id}>
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`textarea textarea-bordered w-full ${error ? "textarea-error" : ""} ${className}`}
        {...props}
      />
      {error && <span className="text-error text-sm mt-1">{error}</span>}
    </div>
  );
}

export default Textarea;