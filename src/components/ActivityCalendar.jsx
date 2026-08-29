import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

const GREEN = "#15803d";
const GREEN_BG = "#f0fdf4";
const GREEN_BORDER = "#bbf7d0";

const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const MONTH_LABELS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const pad2 = (n) => String(n).padStart(2, "0");

const dateKey = (year, month, day) => `${year}-${pad2(month)}-${pad2(day)}`;

// Bangun grid kalender (Senin-Minggu) untuk bulan tertentu.
// Mengembalikan array of week-rows, tiap row berisi 7 cell ({day} atau null).
const buildMonthGrid = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  // getDay(): 0=Minggu..6=Sabtu -> geser supaya Senin=0..Minggu=6
  const firstWeekday = (firstDay.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e9edec",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 },
  navRow: { display: "flex", alignItems: "center", gap: 10 },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    minWidth: 130,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
  },
  weekdayHead: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textAlign: "center",
    padding: "4px 0",
  },
  emptyCell: { minHeight: 52 },
  dayCell: (hasActivity, isToday) => ({
    minHeight: 52,
    borderRadius: 10,
    padding: "6px 4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    cursor: "default",
    border: isToday ? `1.5px solid ${GREEN}` : "1px solid transparent",
    background: hasActivity ? GREEN_BG : "transparent",
    transition: "background 0.15s, box-shadow 0.15s",
  }),
  dayNumber: (hasActivity) => ({
    fontSize: 12,
    fontWeight: hasActivity ? 700 : 500,
    color: hasActivity ? GREEN : "#64748b",
  }),
  countBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: "#fff",
    background: GREEN,
    borderRadius: 999,
    padding: "1px 6px",
    lineHeight: "1.4",
  },
  tooltip: {
    position: "fixed",
    zIndex: 9999,
    background: "#0f172a",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 12,
    minWidth: 160,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    pointerEvents: "none",
  },
  tooltipDate: { fontWeight: 700, marginBottom: 6, fontSize: 12.5 },
  tooltipRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "1.5px 0",
    color: "#cbd5e1",
  },
  tooltipRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "1.5px 0 4px",
    marginBottom: 4,
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    fontWeight: 700,
    color: "#fff",
  },
  legendRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    background: GREEN_BG,
    border: `1px solid ${GREEN_BORDER}`,
    display: "inline-block",
  },
};

const CATEGORY_LABELS = {
  applied: "Applied",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

const formatLongDate = (year, month, day) =>
  new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const ActivityCalendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12

  // Cache per "YYYY-M" supaya pindah-pindah bulan tidak fetch ulang,
  // dan hover TIDAK PERNAH memicu request baru — hover hanya membaca cache ini.
  const cacheRef = useRef(new Map());
  const [days, setDays] = useState({});
  const [loading, setLoading] = useState(true);

  const [hover, setHover] = useState(null); // { key, day, x, y }

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${year}-${month}`;

    const applyData = (data) => {
      if (cancelled) return;
      setDays(data);
      setLoading(false);
    };

    if (cacheRef.current.has(cacheKey)) {
      applyData(cacheRef.current.get(cacheKey));
      return;
    }

    setLoading(true);
    api
      .get("/applications/calendar", { params: { year, month } })
      .then(({ data }) => {
        const result = data?.days || {};
        cacheRef.current.set(cacheKey, result);
        applyData(result);
      })
      .catch(() => {
        if (!cancelled) {
          setDays({});
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const goPrevMonth = () => {
    setHover(null);
    setMonth((m) => {
      if (m === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  };
  const goNextMonth = () => {
    setHover(null);
    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  };
  const goToday = () => {
    setHover(null);
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  };

  const weeks = buildMonthGrid(year, month);
  const todayKey = dateKey(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  const handleEnter = (e, day) => {
    const key = dateKey(year, month, day);
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({
      key,
      day,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };
  const handleLeave = () => setHover(null);

  const hoverData = hover ? days[hover.key] : null;

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Kalender Aktivitas</h3>
        <div style={styles.navRow}>
          <button style={styles.navBtn} onClick={goPrevMonth} title="Bulan sebelumnya">
            ‹
          </button>
          <span style={styles.monthLabel}>
            {MONTH_LABELS[month - 1]} {year}
          </span>
          <button style={styles.navBtn} onClick={goNextMonth} title="Bulan berikutnya">
            ›
          </button>
          <button
            style={{ ...styles.navBtn, width: "auto", padding: "0 10px", fontSize: 11 }}
            onClick={goToday}
          >
            Hari Ini
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} style={styles.weekdayHead}>
            {w}
          </div>
        ))}

        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (day === null) {
              return <div key={`${wi}-${di}`} style={styles.emptyCell} />;
            }
            const key = dateKey(year, month, day);
            const info = days[key];
            const total = info?.total || 0;
            const isToday = key === todayKey;

            return (
              <div
                key={`${wi}-${di}`}
                style={styles.dayCell(total > 0, isToday)}
                onMouseEnter={(e) => handleEnter(e, day)}
                onMouseLeave={handleLeave}
              >
                <span style={styles.dayNumber(total > 0)}>{day}</span>
                {total > 0 && <span style={styles.countBadge}>{total}</span>}
              </div>
            );
          }),
        )}
      </div>

      <div style={styles.legendRow}>
        <span style={styles.legendDot} />
        <span>
          {loading
            ? "Memuat data aktivitas..."
            : "Hover tanggal untuk melihat rincian lamaran"}
        </span>
      </div>

      {hover &&
        (() => {
          const info = hoverData;
          return (
            <div
              style={{
                ...styles.tooltip,
                left: hover.x,
                top: hover.y,
                transform: "translate(-50%, calc(-100% - 8px))",
              }}
            >
              <div style={styles.tooltipDate}>
                {formatLongDate(year, month, hover.day)}
              </div>
              {!info || info.total === 0 ? (
                <div style={{ color: "#94a3b8" }}>Tidak ada aktivitas</div>
              ) : (
                <>
                  <div style={styles.tooltipRowTotal}>
                    <span>Total</span>
                    <span>{info.total}</span>
                  </div>
                  {Object.entries(CATEGORY_LABELS).map(([k, label]) =>
                    info[k] > 0 ? (
                      <div style={styles.tooltipRow} key={k}>
                        <span>{label}</span>
                        <span>{info[k]}</span>
                      </div>
                    ) : null,
                  )}
                </>
              )}
            </div>
          );
        })()}
    </div>
  );
};

export default ActivityCalendar;
