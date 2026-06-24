const PageLoader = ({ message = "Memuat..." }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 16,
    }}
  >
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      style={{ animation: "spin 0.9s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="3.5"
      />
      <path
        d="M18 4 a14 14 0 0 1 14 14"
        fill="none"
        stroke="#15803d"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
    <span
      style={{
        fontSize: 14,
        color: "#64748b",
        fontWeight: 500,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {message}
    </span>
  </div>
);

export default PageLoader;
