function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label pb-2">
          <span className="label-text font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">
            {label}
          </span>
        </label>
      )}
      <input
        className={`w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${error ? 'border-rose-500 ring-rose-500/10' : ''}`}
        {...props}
      />
      {error && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{error}</p>}
    </div>
  );
}
export default Input;