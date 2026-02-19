function Input({ label, error, className = '', ...props }) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-black text-slate-900 uppercase tracking-widest text-[10px]">
            {label}
          </span>
        </label>
      )}
      <input
        className={`input input-bordered w-full bg-white border-slate-300 text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
}
export default Input;