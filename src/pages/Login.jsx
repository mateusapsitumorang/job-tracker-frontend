import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoJT from "../assets/JT-Logo.webp";
import loginBg from "../assets/Login-Bc.webp";
import pageBg from "../assets/BackgroundLGRGF.webp";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.log("1. catch triggered, status:", err.response?.status);
      const status = err.response?.status;
      let msg = "";
      if (status === 401 || status === 400) {
        msg = "Email atau kata sandi yang Anda masukkan salah.";
      } else if (status === 404) {
        msg = "Akun dengan email ini tidak ditemukan.";
      } else {
        msg = "Terjadi kesalahan. Silakan coba beberapa saat lagi.";
      }
      setError(msg);
      console.log("2. setError called with:", msg);
      setSubmitting(false);
      console.log("3. setSubmitting false");
    }
  };

  return (
    <div
      style={{
        ...s.page,
        backgroundImage: `url(${pageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ ...s.container, minHeight: isMobile ? "100vh" : 560 }}>
        {/* Panel Kiri */}
        <div
          style={{
            ...s.left,
            width: isMobile ? "100%" : "52%",
            padding: isMobile ? "40px 24px" : "48px 48px",
          }}
        >
          <img src={logoJT} alt="Job Tracker Logo" style={s.logo} />
          <h1 style={s.heading}>Selamat datang!</h1>
          <p style={s.sub}>
            Masukkan email dan kata sandi Anda untuk melanjutkan.
          </p>

          {error && (
            <div style={s.alertErr}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              style={{
                ...s.inp,
                borderColor: error ? "#fca5a5" : "#d1d5db",
              }}
              type="email"
              placeholder="Alamat email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              autoComplete="email"
            />

            {/* Password field with toggle */}
            <div style={s.passwordWrapper}>
              <input
                style={{
                  ...s.inp,
                  marginBottom: 0,
                  paddingRight: 42,
                  borderColor: error ? "#fca5a5" : "#d1d5db",
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={s.eyeBtn}
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <Link to="/lupa-password" style={{ ...s.forgot, marginTop: 10 }}>
              Lupa kata sandi?
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...s.btn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 36 36"
                    style={{ animation: "spin 0.9s linear infinite" }}
                  >
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 4 a14 14 0 0 1 14 14"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <hr style={s.hr} />
          <p style={s.switch_}>
            Belum punya akun?{" "}
            <Link to="/register" style={s.link}>
              Daftar sekarang
            </Link>
          </p>
          <p style={s.support}>
            Butuh bantuan?{" "}
            <a href="mailto:jobtracker.noreplyy@gmail.com" style={s.link}>
              jobtracker.noreplyy@gmail.com
            </a>
          </p>
        </div>

        {/* Panel Kanan */}
        {!isMobile && (
          <div style={s.right}>
            <div style={s.glass}>
              <p style={s.glassTitle}>Kelola Perjalanan Karier Anda</p>
              <p style={s.glassBody}>
                Masuk ke Job Tracker untuk memantau status lamaran, mengelola
                wawancara, dan mengikuti setiap langkah menuju karier impian
                Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    display: "flex",
    width: "100%",
    maxWidth: 900,
    minHeight: 560,
    borderRadius: 16,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
  },
  left: {
    width: "52%",
    padding: "48px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 80,
    marginBottom: 2,
    objectFit: "contain",
  },
  inp: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    color: "#111",
    background: "#f9fafb",
    marginBottom: 12,
    outline: "none",
    display: "block",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  forgot: {
    fontSize: 13,
    color: "#16a34a",
    textDecoration: "none",
    display: "block",
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    padding: 13,
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 2,
    display: "block",
    transition: "opacity 0.2s",
  },
  alertErr: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    lineHeight: 1.5,
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
  },
  heading: { fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 6 },
  sub: { fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 20 },
  hr: { border: "none", borderTop: "1px solid #f3f4f6", marginBottom: 20 },
  switch_: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 10,
  },
  support: { fontSize: 12, color: "#9ca3af", textAlign: "center" },
  link: { color: "#16a34a", textDecoration: "none", fontWeight: 500 },
  right: {
    flex: 1,
    backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(${loginBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "flex-end",
    padding: 32,
  },
  glass: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 14,
    padding: "22px 24px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  glassTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#fff",
    lineHeight: 1.4,
    marginBottom: 8,
  },
  glassBody: { fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 },
};

export default Login;
