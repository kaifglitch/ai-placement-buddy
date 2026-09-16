function Button({ children, onClick, type = "button", variant = "primary", disabled = false }) {
  const base = "px-6 py-3 rounded-lg font-semibold font-display transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  const variants = {
    primary: "bg-gold text-ink hover:brightness-110",
    secondary: "border border-teal/40 text-teal hover:bg-teal/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
