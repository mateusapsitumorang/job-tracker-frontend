import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

const GREEN = "#15803d";
const GREEN_BG = "#f0fdf4";

const WEEKDAY_LABELS = ["S", "S", "R", "K", "J", "S", "M"];
const MONTH_LABELS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const pad2 = (n) => String(n).padStart(2, "0");
const dateKey = (year, month, day) => `${year}-${pad2(month)}-${pad2(day)}`;

const buildMonthGrid = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

const formatLongDate = (year, month, day) =>
  new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const styles = {
  card: { background: "#fff", borderRadius: 14, border: "1px solid #e9edec", padding: 14 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  navBtn: {
    width: 22, height: 22, borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff",
    color: "#475569", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: 12,
  },
  monthLabel: { fontSize: 12.5, fontWeight: 700, color: "#0f172a" },
  grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 },
  weekdayHead: { fontSize: 10, fontWeight: 600, color: "#94a3b8", textAlign: "center", padding: "2px 0" },
  emptyCell: { minHeight: 30 },
  dayCell: (hasActivity, isToday) => ({
    minHeight: 30,
    borderRadius: 7,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    fontSize: 11,
    cursor: "default",
    border: isToday ? `1.5px solid ${GREEN}` : "1px solid transparent",
    background: hasActivity ? GREEN_BG : "transparent",
    color: hasActivity ? GREEN : "#64748b",
    fontWeight: hasActivity ? 700 : 500,
    position: "relative",
  }),
  dot: {
    width: 4, height: 4, borderRadius: "50%", background: GREEN, position: "absolute", bottom: 3,
  },
  tooltip: {
    position: "fixed",
    zIndex: 9999,
    background: "#0f172a",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 11.5,
    minWidth: 130,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    pointerEvents: "none",
    textAlign: "center",
  },
};

const NotesCalendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const cacheRef = useRef(new Map());
  const [days, setDays] = useState({});
  const [hover, setHover] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${year}-${month}`;

    if (cacheRef.current.has(cacheKey)) {
      setDays(cacheRef.current.get(cacheKey));
      return;
    }

    api
      .get("/notes/calendar", { params: { year, month } })
      .then(({ data }) => {
        if (cancelled) return;
        const result = data?.days || {};
        cacheRef.current.set(cacheKey, result);
        setDays(result);
      })
      .catch(() => {
        if (!cancelled) setDays({});
      });

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const goPrev = () => {
    setHover(null);
    setMonth((m) => {
      if (m === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  };
  const goNext = () => {
    setHover(null);
    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  };

  const weeks = buildMonthGrid(year, month);
  const todayKey = dateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const handleEnter = (e, day) => {
    const key = dateKey(year, month, day);
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({ key, day, x: rect.left + rect.width / 2, y: rect.top });
  };

  const hoverCount = hover ? days[hover.key] || 0 : 0;

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <button style={styles.navBtn} onClick={goPrev} title="Bulan sebelumnya">‹</button>
        <span style={styles.monthLabel}>
          {MONTH_LABELS[month - 1]} {year}
        </span>
        <button style={styles.navBtn} onClick={goNext} title="Bulan berikutnya">›</button>
      </div>

      <div style={styles.grid}>
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} style={styles.weekdayHead}>{w}</div>
        ))}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (day === null) return <div key={`${wi}-${di}`} style={styles.emptyCell} />;
            const key = dateKey(year, month, day);
            const count = days[key] || 0;
            const isToday = key === todayKey;
            return (
              <div
                key={`${wi}-${di}`}
                style={styles.dayCell(count > 0, isToday)}
                onMouseEnter={(e) => handleEnter(e, day)}
                onMouseLeave={() => setHover(null)}
              >
                {day}
                {count > 0 && <span style={styles.dot} />}
              </div>
            );
          }),
        )}
      </div>

      {hover && (
        <div
          style={{
            ...styles.tooltip,
            left: hover.x,
            top: hover.y,
            transform: "translate(-50%, calc(-100% - 8px))",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 2 }}>
            {formatLongDate(year, month, hover.day)}
          </div>
          <div style={{ color: hoverCount > 0 ? "#bbf7d0" : "#94a3b8" }}>
            {hoverCount > 0 ? `${hoverCount} Catatan` : "Tidak ada catatan"}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesCalendar;
