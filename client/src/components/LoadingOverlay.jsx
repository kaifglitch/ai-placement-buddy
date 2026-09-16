function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-ink/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-teal"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <div
          className="absolute inset-3 rounded-full bg-gradient-to-br from-gold/20 to-teal/20"
          style={{ animation: "pulse-scale 1.6s ease-in-out infinite" }}
        />
      </div>

      <p className="font-display text-lg font-semibold text-offwhite mb-2">
        {message}
      </p>

      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-gold" style={{ animation: "bounce-dot 1.4s ease-in-out infinite", animationDelay: "0s" }} />
        <span className="w-2 h-2 rounded-full bg-teal" style={{ animation: "bounce-dot 1.4s ease-in-out infinite", animationDelay: "0.2s" }} />
        <span className="w-2 h-2 rounded-full bg-gold" style={{ animation: "bounce-dot 1.4s ease-in-out infinite", animationDelay: "0.4s" }} />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(0.85); opacity: 0.6; }
          50% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default LoadingOverlay;