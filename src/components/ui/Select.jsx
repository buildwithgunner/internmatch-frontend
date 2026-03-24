function Select({
  label,
  id,
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label pb-2" htmlFor={id}>
          <span className="label-text font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">
            {label}
          </span>
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-semibold text-slate-900 dark:text-white appearance-none cursor-pointer ${error ? 'border-rose-500 ring-rose-500/10' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      {error && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{error}</p>}
    </div>
  );
}

export default Select;