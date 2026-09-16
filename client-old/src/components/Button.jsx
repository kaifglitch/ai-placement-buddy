function Button({ children, onClick, type = "button", variant = "primary" }) {
  const baseStyle = {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const variants = {
    primary: { background: "#4f46e5", color: "#fff" },
    secondary: { background: "#e5e7eb", color: "#111827" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </button>
  );
}

export default Button;
