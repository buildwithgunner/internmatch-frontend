function Checkbox({
  label,
  id,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`form-control ${className}`}>
      <label className="label cursor-pointer flex gap-3 justify-start items-center">
        <input
          id={id}
          type="checkbox"
          className="w-6 h-6 border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-white checked:after:font-bold checked:after:text-sm"
          {...props}
        />
        {label && (
          <span className="label-text font-bold text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
      </label>
      {error && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{error}</p>}
    </div>
  );
}

export default Checkbox;