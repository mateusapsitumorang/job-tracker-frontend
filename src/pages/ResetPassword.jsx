import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import logoJT from "../assets/JT-Logo.webp";
import resetBg from "../assets/Reset-Bc.webp";
import pageBg from "../assets/BackgroundLGRGF.webp";

const RULES = [
  { id: "len", label: "Min. 8 karakter", test: (v) => v.length >= 8 },
  { id: "up", label: "Huruf kapital (A-Z)", test: (v) => /[A-Z]/.test(v) },
  { id: "num", label: "Mengandung angka", test: (v) => /[0-9]/.test(v) },
  { id: "sym", label: "Simbol (!@#$…)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH = [
  { label: "Sangat lemah", color: "#ef4444" },
  { label: "Lemah", color: "#f97316" },
  { label: "Cukup kuat", color: "#eab308" },
  { label: "Kuat", color: "#22c55e" },
];

const EyeIcon = () => (
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
);

const EyeOffIcon = () => (
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
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ruleResults = useMemo(
    () => RULES.map((r) => ({ ...r, ok: r.test(password) })),
    [password],
  );
  const score = ruleResults.filter((r) => r.ok).length;
  const strengthInfo = password ? (STRENGTH[score - 1] ?? STRENGTH[0]) : null;

  const passwordMatch = confirm !== "" && password === confirm;
  const passwordMismatch = confirm !== "" && password !== confirm;

  if (!token)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f4f0",
        }}
      >
        <p style={{ color: "#dc2626", fontSize: 14 }}>Tautan tidak valid.</p>
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score < 4) {
      setError("Kata sandi belum memenuhi semua persyaratan.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess("Kata sandi berhasil diubah! Mengalihkan ke halaman masuk...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah kata sandi.");
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
      <div style={{ ...s.container, minHeight: isMobile ? "100vh" : 540 }}>
        {/* Panel Kiri */}
        <div
          style={{
            ...s.left,
            width: isMobile ? "100%" : "52%",
            padding: isMobile ? "40px 24px" : "48px 48px",
          }}
        >
          <img src={logoJT} alt="Job Tracker Logo" style={s.logo} />
          <h1 style={s.heading}>Buat Kata Sandi Baru</h1>
          <p style={s.sub}>
            Masukkan kata sandi baru yang kuat untuk akun Anda.
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
          {success && <div style={s.alertOk}>{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Password baru */}
            <div style={s.passwordWrapper}>
              <input
                style={{ ...s.inp, marginBottom: 0, paddingRight: 42 }}
                type={showPassword ? "text" : "password"}
                placeholder="Kata sandi baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Bar kekuatan */}
            <div style={{ ...s.bars, marginTop: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    ...s.bar,
                    background:
                      password && i < score ? strengthInfo?.color : "#e5e7eb",
                  }}
                />
              ))}
            </div>
            <p
              style={{ ...s.strLabel, color: strengthInfo?.color ?? "#9ca3af" }}
            >
              {strengthInfo
                ? `Kekuatan: ${strengthInfo.label}`
                : "Masukkan kata sandi untuk melihat kekuatannya"}
            </p>

            {/* Checklist syarat */}
            <ul style={s.ruleList}>
              {ruleResults.map((r) => (
                <li
                  key={r.id}
                  style={{ ...s.ruleItem, color: r.ok ? "#16a34a" : "#9ca3af" }}
                >
                  <span>{r.ok ? "✓" : "○"}</span> {r.label}
                </li>
              ))}
            </ul>

            {/* Konfirmasi password */}
            <div style={s.passwordWrapper}>
              <input
                style={{
                  ...s.inp,
                  marginBottom: 0,
                  paddingRight: 42,
                  borderColor: passwordMismatch
                    ? "#fca5a5"
                    : passwordMatch
                      ? "#86efac"
                      : "#d1d5db",
                }}
                type={showConfirm ? "text" : "password"}
                placeholder="Konfirmasi kata sandi"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                style={s.eyeBtn}
                aria-label={
                  showConfirm
                    ? "Sembunyikan konfirmasi"
                    : "Tampilkan konfirmasi"
                }
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Status kecocokan */}
            {confirm !== "" && (
              <p
                style={{
                  ...s.matchLabel,
                  color: passwordMatch ? "#16a34a" : "#ef4444",
                }}
              >
                {passwordMatch
                  ? "✓ Kata sandi cocok"
                  : "✗ Kata sandi tidak cocok"}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || score < 4 || !passwordMatch}
              style={{
                ...s.btn,
                marginTop: 16,
                opacity: score < 4 || !passwordMatch ? 0.45 : 1,
                cursor: score < 4 || !passwordMatch ? "not-allowed" : "pointer",
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
                  Menyimpan...
                </span>
              ) : (
                "Simpan Kata Sandi Baru"
              )}
            </button>
          </form>
        </div>

        {/* Panel Kanan */}
        {!isMobile && (
          <div style={s.right}>
            <div style={s.glass}>
              <p style={s.glassTitle}>Keamanan Akun Anda</p>
              <p style={s.glassBody}>
                Buat kata sandi yang kuat dan unik untuk melindungi akun Job
                Tracker Anda. Pastikan tidak menggunakan kata sandi yang sama di
                platform lain.
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
  logo: { width: 100, height: 80, marginBottom: 2, objectFit: "contain" },
  heading: { fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 6 },
  sub: { fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 20 },
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
  alertOk: {
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
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
    marginBottom: 0,
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
  },
  bars: { display: "flex", gap: 6, marginBottom: 2 },
  bar: { flex: 1, height: 4, borderRadius: 2, transition: "background 0.3s" },
  strLabel: { fontSize: 12, fontWeight: 500, marginBottom: 6 },
  matchLabel: { fontSize: 12, fontWeight: 500, marginTop: 6, marginBottom: 0 },
  ruleList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 14px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px 12px",
  },
  ruleItem: {
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    transition: "color .2s",
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
    marginBottom: 2,
    display: "block",
    transition: "opacity .2s",
  },
  right: {
    flex: 1,
    backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(${resetBg})`,
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

export default ResetPassword;
