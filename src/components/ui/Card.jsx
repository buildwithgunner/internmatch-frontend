function Card({ children, className = "", hover = true }) {
  return (
    <div className={`card bg-base-200 shadow-xl ${hover ? "hover:shadow-2xl transition-shadow" : ""} ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;