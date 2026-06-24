import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { statusLabel } from "../constants.js";
import Layout from "../components/Layout.jsx";
import PageLoader from "../components/PageLoader.jsx";

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const GREEN = "#15803d";
const GREEN_DARK = "#166534";
const GREEN_LIGHT = "#dcfce7";
const GREEN_BG = "#f0fdf4";
const GREEN_BORDER = "#bbf7d0";

const Icons = {
  arrowUpRight: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  trendUp: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  plus: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  building: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
    </svg>
  ),
};

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    background: "#f4f6f5",
    padding: 24,
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  pageTitle: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#64748b", margin: "4px 0 0" },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 16,
  },
  statCardGreen: {
    background: GREEN,
    borderRadius: 16,
    padding: 20,
    color: "#fff",
    position: "relative",
    minHeight: 120,
  },
  statCardWhite: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e9edec",
    minHeight: 120,
    position: "relative",
  },
  statTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  statLabel: { fontSize: 13, fontWeight: 600 },
  statArrowCircleLight: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statArrowCircleDark: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "#f1f5f4",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 32, fontWeight: 700, margin: "0 0 8px" },
  statFooterLight: {
    fontSize: 11,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.15)",
    padding: "3px 8px",
    borderRadius: 999,
  },
  statFooterDark: {
    fontSize: 11,
    color: GREEN,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: GREEN_BG,
    padding: "3px 8px",
    borderRadius: 999,
    fontWeight: 600,
  },
  cardWhite: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e9edec",
  },
  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 },
  midGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  reminderBox: {
    background: GREEN,
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    marginTop: 4,
    maxHeight: "180px", // Membatasi tinggi agar bisa di-scroll
    overflowY: "auto", // Menambahkan scroll
  },
  reminderTitle: { fontSize: 14, fontWeight: 700, margin: "0 0 4px" },
  reminderTime: { fontSize: 12, opacity: 0.85, margin: "0 0 12px" },
  listRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 0",
    borderBottom: "1px solid #f1f5f4",
  },
  listIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: GREEN_BG,
    color: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  listText: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 },
  listSub: { fontSize: 11, color: "#94a3b8", margin: 0 },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr", // Diubah menjadi 2 kolom karena kartu Waktu dicabut
    gap: 16,
  },
  memberRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f4",
  },
  memberName: { fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 },
  memberTask: { fontSize: 11, color: "#94a3b8", margin: 0 },
  pillStatus: (variant) => {
    const map = {
      done: { bg: GREEN_BG, text: GREEN },
      progress: { bg: "#fff7ed", text: "#d97706" },
      pending: { bg: "#fef2f2", text: "#dc2626" },
    };
    const c = map[variant] || map.progress;
    return {
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 999,
      background: c.bg,
      color: c.text,
      marginLeft: "auto",
    };
  },
};

const statusToVariant = (status) => {
  if (["ACCEPTED", "OFFER"].includes(status)) return "done";
  if (["REJECTED", "WITHDRAWN"].includes(status)) return "pending";
  return "progress";
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/applications/summary");
        setSummary(data);
      } catch (err) {
        setError("Gagal memuat ringkasan dashboard.");
      }
    };
    fetchSummary();
  }, []);

  if (error)
    return (
      <Layout>
        <div style={styles.page}>{error}</div>
      </Layout>
    );

  if (!summary) return <PageLoader message="Memuat dashboard..." />;

  // Jika API tidak mengirimkan summary.weekly, gunakan data dummy ini (Singkatan Bahasa Indonesia)
  const weekData = summary.weekly || [
    { day: "Sn", value: 4 },
    { day: "Sl", value: 7 },
    { day: "R", value: 9 },
    { day: "K", value: 6 },
    { day: "J", value: 3 },
    { day: "S", value: 5 },
    { day: "M", value: 2 },
  ];

  const progressPct = summary.successRate ?? 0;
  const radialData = [{ name: "progress", value: progressPct, fill: GREEN }];

  const ongoingStatuses = [
    "APPLIED",
    "WAITING_REVIEW",
    "INTERVIEW_HR",
    "INTERVIEW_USER",
    "INTERVIEW_FINAL",
  ];

  const ongoingCount = summary.byStatus
    .filter((s) => ongoingStatuses.includes(s.status))
    .reduce((acc, s) => acc + s._count._all, 0);

  return (
    <Layout>
      <div style={styles.page}>
        {/* HEADER */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>
              Pantau dan kelola progres lamaran kerjamu dengan mudah.
            </p>
          </div>
          {/* Header Actions (Tambah Lamaran & Import) telah dihapus */}
        </div>

        {/* STAT CARDS */}
        <div style={styles.grid4}>
          <div style={styles.statCardGreen}>
            <div style={styles.statTopRow}>
              <span style={styles.statLabel}>Total Lamaran</span>
              <span style={styles.statArrowCircleLight}>
                {Icons.arrowUpRight}
              </span>
            </div>
            <h2 style={styles.statValue}>{summary.total}</h2>
            <span style={styles.statFooterLight}>
              {Icons.trendUp} Bertambah bulan ini
            </span>
          </div>

          <div style={styles.statCardWhite}>
            <div style={styles.statTopRow}>
              <span style={{ ...styles.statLabel, color: "#475569" }}>
                Lamaran Diterima
              </span>
              <span style={styles.statArrowCircleDark}>
                {Icons.arrowUpRight}
              </span>
            </div>
            <h2 style={{ ...styles.statValue, color: "#0f172a" }}>
              {summary.byStatus.find((s) => s.status === "ACCEPTED")?._count
                ._all || 0}
            </h2>
            <span style={styles.statFooterDark}>
              {Icons.trendUp} Bertambah bulan ini
            </span>
          </div>

          <div style={styles.statCardWhite}>
            <div style={styles.statTopRow}>
              <span style={{ ...styles.statLabel, color: "#475569" }}>
                Sedang Berjalan
              </span>
              <span style={styles.statArrowCircleDark}>
                {Icons.arrowUpRight}
              </span>
            </div>
            <h2 style={{ ...styles.statValue, color: "#0f172a" }}>
              {ongoingCount}
            </h2>
            <span style={styles.statFooterDark}>
              {Icons.trendUp} Proses aktif
            </span>
          </div>

          <div style={styles.statCardWhite}>
            <div style={styles.statTopRow}>
              <span style={{ ...styles.statLabel, color: "#475569" }}>
                Ditolak
              </span>
              <span style={styles.statArrowCircleDark}>
                {Icons.arrowUpRight}
              </span>
            </div>
            <h2 style={{ ...styles.statValue, color: "#0f172a" }}>
              {summary.rejected}
            </h2>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              Perlu dievaluasi
            </span>
          </div>
        </div>

        {/* MIDDLE GRID: Analytics, Reminder, Project List */}
        <div style={styles.midGrid}>
          <div style={styles.cardWhite}>
            <div style={styles.cardTitleRow}>
              <h3 style={styles.cardTitle}>Aktivitas Lamaran</h3>
            </div>
            <ResponsiveContainer
              width="100%"
              height={200}
              style={{ outline: "none" }}
            >
              <BarChart data={weekData} style={{ outline: "none" }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="value"
                  fill={GREEN}
                  radius={[10, 10, 10, 10]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pengingat (Scrollable & Multiple items) */}
          <div style={styles.cardWhite}>
            <div style={styles.cardTitleRow}>
              <h3 style={styles.cardTitle}>Pengingat</h3>
            </div>
            <div style={styles.reminderBox}>
              {summary.upcomingInterviews &&
              summary.upcomingInterviews.length > 0 ? (
                summary.upcomingInterviews.map((item, idx) => (
                  <div key={idx}>
                    <p style={styles.reminderTitle}>
                      Interview {item.companyName}
                    </p>
                    <p style={styles.reminderTime}>
                      {new Date(item.interviewDate).toLocaleDateString(
                        "id-ID",
                        {
                          dateStyle: "long", // Menampilkan format seperti "25 Juni 2026"
                        },
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p style={styles.reminderTitle}>Tidak ada pengingat</p>
              )}
            </div>
          </div>

          <div style={styles.cardWhite}>
            <div style={styles.cardTitleRow}>
              <h3 style={styles.cardTitle}>Interview Mendatang</h3>
              <span style={{ color: GREEN }}>{Icons.plus}</span>
            </div>
            {summary.upcomingInterviews.length === 0 ? (
              <p style={{ fontSize: 12, color: "#94a3b8" }}>
                Belum ada jadwal.
              </p>
            ) : (
              summary.upcomingInterviews.slice(0, 5).map((item) => (
                <div style={styles.listRow} key={item.id}>
                  <span style={styles.listIcon}>{Icons.building}</span>
                  <div>
                    <p style={styles.listText}>{item.companyName}</p>
                    <p style={styles.listSub}>
                      {item.position} •{" "}
                      {new Date(item.interviewDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM GRID: Status list, Progress radial (Diubah jadi 2 kolom, Waktu dihapus) */}
        <div style={styles.bottomGrid}>
          <div style={styles.cardWhite}>
            <div style={styles.cardTitleRow}>
              <h3 style={styles.cardTitle}>Rincian Status</h3>
            </div>
            {/* Hapus bagian avatar dari list status */}
            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
              {summary.byStatus.map((s) => (
                <div style={styles.memberRow} key={s.status}>
                  <div>
                    <p style={styles.memberName}>{statusLabel(s.status)}</p>
                    <p style={styles.memberTask}>{s._count._all} lamaran</p>
                  </div>
                  <span style={styles.pillStatus(statusToVariant(s.status))}>
                    {s._count._all}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.cardWhite}>
            <div style={styles.cardTitleRow}>
              <h3 style={styles.cardTitle}>Progres Keberhasilan</h3>
            </div>

            <div style={{ position: "relative", height: 180 }}>
              <ResponsiveContainer
                width="100%"
                height="100%"
                style={{ outline: "none" }}
              >
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                  style={{ outline: "none" }}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={20}
                    fill={GREEN}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, color: GREEN }}>
                  {progressPct}%
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  Tingkat Keberhasilan
                </div>
              </div>
            </div>

            {/* --- TEKS PENJELASAN BARU DITAMBAHKAN DI SINI --- */}
            <p
              style={{
                fontSize: 11,
                color: "#64748b",
                textAlign: "center",
                marginTop: 16,
                marginBottom: 0,
                lineHeight: 1.5,
                paddingTop: 12,
                borderTop: "1px dashed #e2e8f0",
              }}
            >
              *Persentase ini dihitung dari jumlah lamaran dengan status{" "}
              <b>Diterima (Accepted/Offer)</b> dibagi dengan{" "}
              <b>Total Seluruh Lamaran</b>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
