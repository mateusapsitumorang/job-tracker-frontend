import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoImage from "../assets/JT-Logo.webp";

const GREEN = "#15803d";
const GREEN_BG = "#f0fdf4";

const Icons = {
  dashboard: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  lamaran: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  logout: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarIsOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarIsOpen", JSON.stringify(newState));
  };

  const sidebarWidth = isOpen ? "260px" : "80px";

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f4f6f5",
    },
    sidebar: {
      width: sidebarWidth,
      backgroundColor: "#ffffff",
      borderRight: "1px solid #e9edec",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 40,
      transition: "width 0.3s ease",
    },
    brandWrapper: {
      padding: isOpen ? "24px" : "24px 0",
      borderBottom: "1px solid #f1f5f4",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: isOpen ? "space-between" : "center",
      transition: "all 0.3s ease",
    },
    brandImage: {
      width: "140px",
      display: isOpen ? "block" : "none",
      objectFit: "contain",
    },
    toggleBtn: {
      background: "none",
      border: "none",
      color: "#64748b",
      cursor: "pointer",
      padding: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
    },
    navMenu: {
      flex: 1,
      padding: "0 16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    link: (isActive) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: isOpen ? "flex-start" : "center",
      gap: isOpen ? "12px" : "0",
      padding: "12px",
      borderRadius: "12px",
      textDecoration: "none",
      color: isActive ? GREEN : "#64748b",
      backgroundColor: isActive ? GREEN_BG : "transparent",
      fontWeight: isActive ? 700 : 500,
      fontSize: "14px",
      transition: "all 0.2s ease",
    }),
    linkLabel: {
      display: isOpen ? "block" : "none",
    },
    userSection: {
      padding: isOpen ? "20px 16px" : "20px 8px",
      borderTop: "1px solid #f1f5f4",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      alignItems: isOpen ? "stretch" : "center",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: isOpen ? "flex-start" : "center",
      gap: "12px",
      padding: "0 8px",
    },
    userAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: GREEN,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "14px",
      flexShrink: 0,
    },
    userNameWrapper: {
      overflow: "hidden",
      display: isOpen ? "block" : "none",
    },
    userName: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#0f172a",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isOpen ? "8px" : "0",
      width: "100%",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #fee2e2",
      backgroundColor: "#fff",
      color: "#dc2626",
      fontWeight: 600,
      fontSize: "13px",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    logoutText: {
      display: isOpen ? "block" : "none",
    },
    mainContent: {
      flex: 1,
      marginLeft: sidebarWidth,
      width: `calc(100% - ${sidebarWidth})`,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.3s ease",
    },
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Icons.dashboard },
    { path: "/applications", label: "Lamaran", icon: Icons.lamaran },
  ];

  const Spinner = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 36 36"
      style={{ animation: "spin 0.9s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="#fca5a5"
        strokeWidth="3.5"
      />
      <path
        d="M18 4 a14 14 0 0 1 14 14"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.brandWrapper}>
          <img
            src={logoImage}
            alt="Job Tracker Logo"
            style={styles.brandImage}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <button
            onClick={toggleSidebar}
            style={styles.toggleBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f1f5f4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {Icons.menu}
          </button>
        </div>

        <nav style={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={styles.link(isActive)}
                title={!isOpen ? item.label : ""}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#f8faf9";
                    e.currentTarget.style.color = "#0f172a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748b";
                  }
                }}
              >
                {item.icon}
                <span style={styles.linkLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.userSection}>
          <div
            style={styles.userInfo}
            title={!isOpen ? user?.name || user?.email : ""}
          >
            <div style={styles.userAvatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={styles.userNameWrapper}>
              <p style={styles.userName}>
                {user?.name || user?.email || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={styles.logoutBtn}
            title={!isOpen ? "Keluar" : ""}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fee2e2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#fff")
            }
          >
            {Icons.logout}
            <span style={styles.logoutText}>Keluar</span>
          </button>
        </div>
      </aside>

      <main style={styles.mainContent}>{children}</main>

      {/* LOADING OVERLAY LOGOUT */}
      {isLoggingOut && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "40px 36px",
              textAlign: "center",
              boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
              maxWidth: 360,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 36 36"
                style={{ animation: "spin 0.9s linear infinite" }}
              >
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
            </div>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 6px",
              }}
            >
              Sedang Keluar...
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              Mohon tunggu sebentar
            </p>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG LOGOUT */}
      {showLogoutConfirm && !isLoggingOut && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9998,
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 28px 24px",
              width: "100%",
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                color: "#ef4444",
                marginBottom: 16,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {Icons.logout}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 8px",
              }}
            >
              Keluar dari Akun?
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#64748b",
                margin: "0 0 24px",
                lineHeight: 1.5,
              }}
            >
              Anda akan keluar dari sesi ini. Pastikan pekerjaan Anda sudah
              tersimpan.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  background: "#fff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 12,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
