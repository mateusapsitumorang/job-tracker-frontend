import { useState, useRef, useEffect } from "react";

const GREEN = "#15803d";
const GREEN_LIGHT = "#dcfce7";
const GREEN_BG = "#f0fdf4";
const GREEN_BORDER = "#bbf7d0";

// ── ikon chevron inline ──────────────────────────────────────
const ChevronDown = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.2s ease",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      flexShrink: 0,
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const CustomStatusSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Semua Status",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup saat tekan Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const selectedLabel = value
    ? (options.find((o) => o.value === value)?.label ?? placeholder)
    : placeholder;

  const allOptions = [{ value: "", label: placeholder }, ...options];

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", minWidth: 220, userSelect: "none" }}
    >
      {/* ── Trigger ─────────────────────────────────────────── */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => {
          if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = Math.min(options.length * 44 + 44, 260);
            const showAbove =
              spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
            setDropdownPos({
              top: showAbove ? rect.top - dropdownHeight : rect.bottom,
              left: rect.left,
              width: rect.width,
              showAbove,
            });
          }
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isOpen && containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom;
              const spaceAbove = rect.top;
              const dropdownHeight = Math.min(options.length * 44 + 44, 260);
              const showAbove =
                spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
              setDropdownPos({
                top: showAbove ? rect.top - dropdownHeight : rect.bottom,
                left: rect.left,
                width: rect.width,
                showAbove,
              });
            }
            setIsOpen((prev) => !prev);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "11px 14px",
          border: isOpen ? `1.5px solid ${GREEN}` : "1.5px solid #e2e8f0",
          borderRadius: 10,
          background: "#fff",
          cursor: "pointer",
          fontSize: 14,
          color: value ? "#1e293b" : "#94a3b8",
          fontWeight: value ? 600 : 400,
          outline: "none",
          boxShadow: isOpen ? `0 0 0 3px rgba(21,128,61,0.15)` : "none",
          transition:
            "border-color 0.15s, box-shadow 0.15s, border-radius 0.1s",
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedLabel}
        </span>
        <span style={{ color: isOpen ? GREEN : "#94a3b8", display: "flex" }}>
          <ChevronDown isOpen={isOpen} />
        </span>
      </div>

      {/* ── Dropdown list ────────────────────────────────────── */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            background: "#fff",
            border: `1.5px solid ${GREEN}`,
            borderRadius: dropdownPos.showAbove
              ? "10px 10px 0 0"
              : "0 0 10px 10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            zIndex: 9999,
            maxHeight: 260,
            overflowY: "auto",
            animation: "cssFadeDown 0.15s ease",
          }}
        >
          <style>{`
      @keyframes cssFadeDown {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>

          {allOptions.map((opt) => {
            const isSelected =
              opt.value === value || (!value && opt.value === "");
            const isHovered = hoveredValue === opt.value;

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredValue(opt.value)}
                onMouseLeave={() => setHoveredValue(null)}
                style={{
                  padding: "10px 14px",
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  color: isSelected ? GREEN : isHovered ? "#1e293b" : "#374151",
                  background: isSelected
                    ? GREEN_BG
                    : isHovered
                      ? "#f8fafc"
                      : "#fff",
                  transition: "background 0.1s, color 0.1s",
                  borderLeft: isSelected
                    ? `3px solid ${GREEN}`
                    : "3px solid transparent",
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={GREEN}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomStatusSelect;
