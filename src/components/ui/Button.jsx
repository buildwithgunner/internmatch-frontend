function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 rounded-xl disabled:opacity-50 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40",
    secondary: "bg-slate-900 text-white hover:bg-black",
    outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white",
    ghost: "text-slate-600 hover:bg-slate-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
      {children}
    </button>
  );
}
export default Button;