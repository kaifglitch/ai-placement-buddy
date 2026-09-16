import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assessment/select", label: "Assessments" },
  { to: "/coding/select", label: "Coding" },
  { to: "/interview/select", label: "Interview" },
  { to: "/career", label: "Career AI" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-lg bg-ink/90 border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-teal flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#0F1229" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18 L9 12 L13 15 L20 7" />
              <path d="M15 7 L20 7 L20 12" />
            </svg>
          </div>
          <span className="font-display font-bold hidden sm:inline">
            <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">AI</span> Placement Buddy
          </span>
        </Link>

        <div className="flex items-center gap-2 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                location.pathname === l.to
                  ? "bg-gold/15 text-gold"
                  : "text-offwhite/60 hover:text-offwhite hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg text-sm text-teal border border-teal/30 hover:bg-teal/10 transition shrink-0"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
