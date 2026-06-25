import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoJT from "../assets/JT-Logo.webp";
import forgotBg from "../assets/Forgot-Bc.webp";
import pageBg from "../assets/BackgroundLGRGF.webp";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
      await forgotPassword(email);
      setSent(true);
      setSuccess(
        `Tautan reset kata sandi telah dikirim ke ${email}. Periksa kotak masuk Anda.`,
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengirim email. Periksa alamat email Anda.",
      );
    } finally {
      setSubmitting(false);
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
      <div style={s.container}>
        {/* Panel Kiri */}
        <div
          style={{
            ...s.left,
            width: isMobile ? "100%" : "52%",
            padding: isMobile ? "40px 24px" : "48px 48px",
          }}
        >
          <img src={logoJT} alt="Job Tracker Logo" style={s.logo} />

          <h1 style={s.heading}>Lupa kata sandi?</h1>
          <p style={s.sub}>
            Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk
            mengatur ulang kata sandi.
          </p>

          {error && <div style={s.alertErr}>{error}</div>}
          {success && <div style={s.alertOk}>{success}</div>}

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <input
                style={s.inp}
                type="email"
                placeholder="Alamat email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" disabled={submitting} style={s.btn}>
                {submitting ? "Mengirim..." : "Kirim tautan reset"}
              </button>
            </form>
          ) : (
            <div style={s.sentBox}>
              <div style={s.sentIcon}>✉</div>
              <p style={s.sentText}>
                Cek folder <strong>Spam</strong> jika email tidak masuk dalam
                beberapa menit.
              </p>
              <button
                style={{ ...s.btn, ...s.btnOutline }}
                onClick={() => {
                  setSent(false);
                  setSuccess("");
                  setEmail("");
                }}
              >
                Kirim ulang
              </button>
            </div>
          )}

          <hr style={s.hr} />
          <p style={s.switch_}>
            Ingat kata sandi Anda?{" "}
            <Link to="/masuk" style={s.link}>
              Masuk di sini
            </Link>
          </p>
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

        {!isMobile && (
          <div style={s.right}>
            <div style={s.glass}>
              <p style={s.glassTitle}>Lupa Kata Sandi?</p>
              <p style={s.glassBody}>
                Jangan khawatir. Masukkan alamat email yang terdaftar, dan kami
                akan mengirimkan tautan untuk mengatur ulang kata sandi akun
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
    minHeight: 520,
    borderRadius: 16,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
  },
  left: {
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
  heading: { fontSize: 28, fontWeight: 700, color: "#111", marginBottom: 8 },
  sub: { fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 24 },
  alertErr: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 14,
  },
  alertOk: {
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 14,
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
    marginBottom: 20,
    display: "block",
  },
  btnOutline: {
    background: "transparent",
    color: "#111",
    border: "1px solid #d1d5db",
  },
  sentBox: {
    textAlign: "center",
    padding: "8px 0 4px",
  },
  sentIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  sentText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.7,
    marginBottom: 20,
  },
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
    backgroundImage: `
     linear-gradient(
       rgba(15, 23, 42, 0.55),
       rgba(15, 23, 42, 0.55)
     ),
     url(${forgotBg})
   `,
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

export default ForgotPassword;
