function Checkbox({
  label,
  id,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer flex gap-3 justify-start">
        <input
          id={id}
          type="checkbox"
          className={`checkbox checkbox-primary ${className}`}
          {...props}
        />
        <span className="label-text">{label}</span>
      </label>
      {error && <span className="text-error text-sm mt-1">{error}</span>}
    </div>
  );
}

export default Checkbox;