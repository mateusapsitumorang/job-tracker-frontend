import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/axios.js";
import { STATUS_OPTIONS, statusLabel } from "../constants.js";
import Layout from "../components/Layout.jsx";
import ApplicationForm from "../components/ApplicationForm.jsx";
import * as XLSX from "xlsx";
import PageLoader from "../components/PageLoader.jsx";
import CustomStatusSelect from "../components/CustomStatusSelect";

const GREEN = "#15803d";
const GREEN_LIGHT = "#dcfce7";
const GREEN_BG = "#f0fdf4";
const GREEN_BORDER = "#bbf7d0";
const GREEN_HOVER = "#166534";
const GREEN_SHADOW = "rgba(21,128,61,0.25)";
const GREEN_SHADOW_HOVER = "rgba(21,128,61,0.4)";

const Icons = {
  plus: (
    <svg
      width="18"
      height="18"
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
  upload: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  download: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  edit: (
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  search: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  chevronUp: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  chevronDown: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  x: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  alertCircle: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  checkCircle: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
    </svg>
  ),
  checkSquare: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  square: (
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  ),
  minusSquare: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  ),
  spinner: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#e2e8f0"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          transformOrigin: "center",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </svg>
  ),
};

const LoadingOverlay = ({ message, subMessage, progress }) => {
  if (!message) return null;
  return (
    <div style={styles.loadingOverlay}>
      <div style={styles.loadingCard}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 36 36"
          style={{ animation: "spin 0.9s linear infinite", marginBottom: 20 }}
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
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px",
          }}
        >
          {message}
        </h3>
        {subMessage && (
          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              margin: "0 0 16px",
              lineHeight: 1.4,
            }}
          >
            {subMessage}
          </p>
        )}
        {progress !== undefined && progress !== null && (
          <>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "#e2e8f0",
                borderRadius: 99,
                overflow: "hidden",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#15803d",
                  borderRadius: 99,
                  transition: "width 0.4s ease",
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                }}
              />
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#64748b",
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {Math.round(progress)}%
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  confirmStyle,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!visible) return null;
  return (
    <div
      style={styles.dialogOverlay}
      onClick={isLoading ? undefined : onCancel}
    >
      <div style={styles.dialogCard} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "#ef4444",
          }}
        >
          {Icons.alertCircle}
        </div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px",
          }}
        >
          {title || "Konfirmasi"}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            margin: "0 0 24px",
            lineHeight: 1.5,
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              color: "#475569",
              fontWeight: 600,
              fontSize: 14,
              cursor: isLoading ? "not-allowed" : "pointer",
              flex: 1,
              transition: "all 0.15s",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: confirmStyle?.background || "#ef4444",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: isLoading ? "not-allowed" : "pointer",
              flex: 1,
              transition: "all 0.15s",
              boxShadow:
                confirmStyle?.boxShadow || "0 2px 8px rgba(239,68,68,0.3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {Icons.spinner} Menghapus...
              </span>
            ) : (
              confirmLabel || "Ya"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    width: "100%",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    position: "relative",
    margin: 0,
    padding: 0,
  },
  container: {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "24px 24px 40px 24px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  btnPrimary: {
    background: GREEN,
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "box-shadow 0.2s, transform 0.15s, background 0.15s",
    boxShadow: `0 2px 8px ${GREEN_SHADOW}`,
  },
  btnOutline: {
    background: "#fff",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    padding: "10px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "box-shadow 0.2s, background 0.15s",
  },
  btnDanger: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "box-shadow 0.2s, transform 0.15s",
    boxShadow: "0 2px 8px rgba(239,68,68,0.25)",
  },
  btnDisabled: {
    background: "#e2e8f0",
    color: "#94a3b8",
    border: "none",
    padding: "10px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "not-allowed",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  filtersRow: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
    alignItems: "center",
    flexShrink: 0,
  },
  searchWrapper: { flex: 1, minWidth: 280, position: "relative" },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 42px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    background: "#fff",
    boxSizing: "border-box",
  },
  selectFilter: {
    padding: "12px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    background: "#fff",
    cursor: "pointer",
    minWidth: 200,
    color: "#1e293b",
  },
  selectedCount: {
    fontSize: 13,
    color: GREEN,
    fontWeight: 600,
    padding: "8px 0",
  },
  alertError: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 12,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  alertSuccess: {
    background: GREEN_BG,
    color: GREEN,
    border: `1px solid ${GREEN_BORDER}`,
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 12,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  tableOuterWrapper: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    overflowX: "auto",
    overflowY: "auto",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  table: {
    width: "100%",
    minWidth: 1300,
    borderCollapse: "collapse",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  thSortable: {
    textAlign: "left",
    padding: "14px 12px",
    fontWeight: 600,
    color: "#64748b",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    userSelect: "none",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  thNormal: {
    textAlign: "left",
    padding: "14px 12px",
    fontWeight: 600,
    color: "#64748b",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "default",
    userSelect: "none",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  thCheckbox: {
    padding: "14px 8px",
    width: 40,
    textAlign: "center",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  td: {
    padding: "12px 12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    verticalAlign: "middle",
  },
  tdCheckbox: {
    padding: "12px 8px",
    width: 40,
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },
  tdNo: {
    padding: "12px 8px",
    width: 40,
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    color: "#94a3b8",
    fontSize: 12,
    verticalAlign: "middle",
  },
  companyName: { fontWeight: 600, color: "#0f172a", fontSize: 14 },
  positionName: { color: "#475569", fontSize: 14 },
  sourceText: { color: "#64748b", fontSize: 13 },
  notesText: {
    color: "#64748b",
    fontSize: 13,
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "inline-block",
  },
  statusBadge: (value) => {
    const colorMap = {
      WISHLIST: { bg: GREEN_BG, text: GREEN, border: GREEN_BORDER },
      APPLIED: { bg: "#eff6ff", text: "#2563eb", border: "#dbeafe" },
      WAITING_REVIEW: { bg: "#fffbeb", text: "#d97706", border: "#fef3c7" },
      INTERVIEW_HR: { bg: "#fdf2f8", text: "#db2777", border: "#fce7f3" },
      INTERVIEW_USER: { bg: "#fdf2f8", text: "#db2777", border: "#fce7f3" },
      INTERVIEW_FINAL: { bg: "#f5f3ff", text: "#7c3aed", border: "#ede9fe" },
      OFFER: { bg: GREEN_BG, text: GREEN, border: GREEN_BORDER },
      REJECTED: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
      ACCEPTED: { bg: GREEN_BG, text: GREEN, border: GREEN_BORDER },
      WITHDRAWN: { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
    };
    const c = colorMap[value] || {
      bg: "#f8fafc",
      text: "#64748b",
      border: "#e2e8f0",
    };
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 12px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      cursor: "pointer",
      transition: "box-shadow 0.15s, transform 0.1s",
      lineHeight: "1.4",
    };
  },
  statusSelectWrapper: {
    position: "relative",
    display: "inline-block",
  },
  statusSelect: {
    padding: "6px 10px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    border: `2px solid ${GREEN}`,
    outline: "none",
    background: "#fff",
    cursor: "pointer",
    color: "#1e293b",
    minWidth: 160,
  },
  checkboxBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: 4,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    transition: "all 0.15s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 32px",
    width: "100%",
    maxWidth: 600,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    position: "relative",
    animation: "scaleIn 0.2s ease",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 20px 0",
  },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f1f5f9",
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
    transition: "all 0.15s",
  },
  hiddenInput: { display: "none" },
  emptyState: { textAlign: "center", padding: "80px 20px", color: "#94a3b8" },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    color: "#94a3b8",
  },
  dateText: { color: "#64748b", fontSize: 14 },
  loadingOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2500,
    animation: "fadeIn 0.2s ease",
  },
  loadingCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 36px",
    textAlign: "center",
    boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
    animation: "scaleIn 0.25s ease",
    maxWidth: 420,
    width: "100%",
  },
  dialogOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.5)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: 20,
    animation: "fadeIn 0.2s ease",
  },
  dialogCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px 28px 24px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
    textAlign: "center",
    animation: "scaleIn 0.25s ease",
  },
  chevronDownSmall: {
    width: 10,
    height: 10,
    display: "inline-flex",
    alignItems: "center",
    marginLeft: 2,
    opacity: 0.6,
  },
  dataInfo: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
    flexShrink: 0,
  },
};

const formatDate = (iso) => {
  if (!iso) return "—";
  let d;
  if (typeof iso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    d = new Date(iso + "T00:00:00");
  } else {
    d = new Date(iso);
  }
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const parseExcelDate = (val) => {
  if (!val) return null;
  if (typeof val === "number") {
    const d = XLSX.SSF.parse_date_code(val);
    if (d)
      return `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
    return null;
  }
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [dd, mm, yyyy] = s.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
};

const mapImportedStatus = (label) => {
  if (!label) return "APPLIED";
  const s = String(label).trim().toUpperCase();
  const found = STATUS_OPTIONS.find((opt) => opt.value === s);
  if (found) return found.value;
  const byLabel = STATUS_OPTIONS.find((opt) => opt.label.toUpperCase() === s);
  if (byLabel) return byLabel.value;
  const map = {
    MELAMAR: "APPLIED",
    "SUDAH MELAMAR": "APPLIED",
    "MENUNGGU REVIEW": "WAITING_REVIEW",
    "WAITING REVIEW": "WAITING_REVIEW",
    "INTERVIEW HR": "INTERVIEW_HR",
    "INTERVIEW USER": "INTERVIEW_USER",
    "INTERVIEW FINAL": "INTERVIEW_FINAL",
    OFFER: "OFFER",
    DITAWARI: "OFFER",
    DITOLAK: "REJECTED",
    REJECTED: "REJECTED",
    DITERIMA: "ACCEPTED",
    ACCEPTED: "ACCEPTED",
    DIBATALKAN: "WITHDRAWN",
    WITHDRAWN: "WITHDRAWN",
    WISHLIST: "WISHLIST",
    APPLIED: "APPLIED",
  };
  return map[s] || "APPLIED";
};

const DetailModal = ({ item, onClose, onEdit, onDelete }) => {
  if (!item) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={{ ...styles.modalCard, maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#94a3b8";
          }}
          title="Tutup"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
              {item.companyName || "—"}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>
              {item.position || "—"}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span style={styles.statusBadge(item.status)}>
            {statusLabel(item.status)}
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#94a3b8",
            marginBottom: 10,
            paddingBottom: 8,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          Informasi Lamaran
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Tanggal Lamar",
              value: formatDate(item.appliedDate || item.createdAt),
            },
            {
              label: "Tanggal Interview",
              value: formatDate(item.interviewDate),
            },
            { label: "Sumber", value: item.source || "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
                {label}
              </div>
              <div style={{ fontSize: 14, color: "#0f172a" }}>{value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#94a3b8",
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          Catatan
        </div>
        <div
          style={{
            background: "#f8fafc",
            borderRadius: 8,
            padding: 12,
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
            minHeight: 48,
          }}
        >
          {item.notes || "Tidak ada catatan."}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <button
            style={{ ...styles.btnPrimary, flex: 1, justifyContent: "center" }}
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#166534";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(21,128,61,0.4)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = GREEN;
              e.currentTarget.style.boxShadow = `0 2px 8px ${GREEN_SHADOW}`;
              e.currentTarget.style.transform = "none";
            }}
          >
            {Icons.edit} Edit Lamaran
          </button>
          <button
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "#fff",
              color: "#ef4444",
              border: "1px solid #fecaca",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
            onClick={() => {
              onClose();
              onDelete(item);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2";
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.borderColor = "#fecaca";
              e.currentTarget.style.transform = "none";
            }}
          >
            {Icons.trash} Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

const Applications = () => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortDir, setSortDir] = useState("desc");
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [detailItem, setDetailItem] = useState(null);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingSub, setLoadingSub] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef(null);
  const alertTimerRef = useRef(null);

  const showError = (msg, duration = 5000) => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setErrorMsg(msg);
    setSuccessMsg("");
    if (duration > 0)
      alertTimerRef.current = setTimeout(() => setErrorMsg(""), duration);
  };
  const showSuccess = (msg, duration = 4000) => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setSuccessMsg(msg);
    setErrorMsg("");
    if (duration > 0)
      alertTimerRef.current = setTimeout(() => setSuccessMsg(""), duration);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status: statusFilter || undefined,
        sort_by: sortBy,
        sort_dir: sortDir,
        limit: 1000,
      };
      const { data } = await api.get("/applications", { params });
      const fetchedItems = data.items || data.data || data || [];
      const total =
        data.total || data.totalItems || data.count || fetchedItems.length;
      setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      setTotalItems(total);
    } catch (err) {
      showError("Gagal memuat data lamaran.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [items]);
  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  /* —————————————————————————————————————————————— */
  const handleCreate = async (form) => {
    setShowForm(false);
    setIsProcessing(true);
    setLoadingMessage("Menyimpan lamaran...");
    setLoadingSub("Mohon tunggu sebentar");
    setLoadingProgress(null);
    try {
      const payload = {
        companyName: form.companyName || "",
        position: form.position || "",
        status: form.status || "APPLIED",
        source: form.source || "",
        appliedDate: form.appliedDate || null,
        interviewDate: form.interviewDate || null,
        notes: form.notes || "",
      };
      await api.post("/applications", payload);
      setShowForm(false);
      showSuccess("Lamaran berhasil ditambahkan!");
      fetchItems();
    } catch (err) {
      showError(err?.response?.data?.message || "Gagal menambahkan lamaran.");
    } finally {
      setLoading(false);
      setIsProcessing(false);
      setLoadingMessage("");
      setLoadingSub("");
    }
  };

  const handleUpdate = async (form) => {
    setShowForm(false);
    setIsProcessing(true);
    setLoadingMessage("Memperbarui lamaran...");
    setLoadingSub("Mohon tunggu sebentar");
    setLoadingProgress(null);
    try {
      const targetId = editing?.id;
      const payload = {
        companyName: form.companyName || "",
        position: form.position || "",
        status: form.status || "APPLIED",
        source: form.source || "",
        appliedDate: form.appliedDate || null,
        interviewDate: form.interviewDate || null,
        notes: form.notes || "",
      };
      await api.put(`/applications/${targetId}`, payload);
      setEditing(null);
      setShowForm(false);
      showSuccess("Lamaran berhasil diperbarui!");
      fetchItems();
    } catch (err) {
      showError(err?.response?.data?.message || "Gagal memperbarui lamaran.");
    } finally {
      setIsProcessing(false);
      setLoadingMessage("");
      setLoadingSub("");
    }
  };

  const handleDeleteSingle = async () => {
    if (!deleteTarget) return;

    const idToDelete = deleteTarget.id;
    const nameToDelete = deleteTarget.companyName;

    setDeleteTarget(null);

    setIsProcessing(true);
    setLoadingMessage("Menghapus lamaran...");
    setLoadingSub(`"${nameToDelete || "—"}"`);
    setLoadingProgress(null);

    try {
      await api.delete(`/applications/${idToDelete}`);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(idToDelete);
        return next;
      });
      showSuccess("Lamaran berhasil dihapus!");
      fetchItems();
    } catch (err) {
      showError("Gagal menghapus lamaran.");
    } finally {
      setIsProcessing(false);
      setLoadingMessage("");
      setLoadingSub("");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkDeleteConfirm(false);
    setIsProcessing(true);
    setLoadingMessage(`Menghapus ${ids.length} lamaran...`);
    setLoadingSub("Proses satu per satu");
    setLoadingProgress(0);
    let successCount = 0,
      failCount = 0;
    for (let i = 0; i < ids.length; i++) {
      setLoadingSub(`Menghapus data ${i + 1} dari ${ids.length}...`);
      setLoadingProgress(Math.round(((i + 1) / ids.length) * 100));
      try {
        await api.delete(`/applications/${ids[i]}`);
        successCount++;
      } catch (err) {
        failCount++;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    setIsProcessing(false);
    setLoadingMessage("");
    setLoadingSub("");
    setLoadingProgress(null);
    setSelectedIds(new Set());
    if (successCount > 0 && failCount === 0)
      showSuccess(`${successCount} lamaran berhasil dihapus!`);
    else if (successCount > 0)
      showSuccess(`${successCount} berhasil, ${failCount} gagal.`, 5000);
    else showError("Gagal menghapus semua lamaran.", 5000);
    fetchItems();
  };

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const isSomeSelected =
    selectedIds.size > 0 && selectedIds.size < items.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((i) => i.id)));
  };
  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStatusClick = (item) => {
    if (editingStatusId === item.id) return;
    setEditingStatusId(item.id);
  };
  const handleStatusChange = async (item, newStatus) => {
    const prevStatus = item.status;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)),
    );
    setEditingStatusId(null);
    try {
      await api.patch(`/applications/${item.id}`, { status: newStatus });
      showSuccess("Status berhasil diperbarui!");
      fetchItems();
    } catch (err) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: prevStatus } : i)),
      );
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Gagal memperbarui status.";
      showError(errMsg);
    }
  };

  const handleStatusBlur = () => {
    setEditingStatusId(null);
  };

  const handleExport = () => {
    if (items.length === 0) {
      showError("Tidak ada data untuk diexport.", 3000);
      return;
    }
    const rows = items.map((item, i) => ({
      No: i + 1,
      Tanggal: formatDate(item.appliedDate || item.createdAt),
      Perusahaan: item.companyName || "",
      Posisi: item.position || "",
      Status: statusLabel(item.status),
      Sumber: item.source || "",
      "Tanggal Interview": formatDate(item.interviewDate),
      Catatan: item.notes || "",
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    const colWidths = Object.keys(rows[0] || {}).map((k) => ({
      wch:
        Math.max(k.length, ...rows.map((r) => String(r[k] || "").length)) + 4,
    }));
    ws["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, "Lamaran");
    XLSX.writeFile(
      wb,
      `Lamaran_Kerja_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    showSuccess("File berhasil diexport!");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["xlsx", "xls"].includes(file.name.split(".").pop().toLowerCase())) {
      showError("Format file harus .xlsx atau .xls", 4000);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
          defval: "",
        });
        if (json.length === 0) {
          showError("File tidak mengandung data.", 4000);
          e.target.value = "";
          return;
        }
        const imported = json.map((row) => ({
          companyName: String(
            row["Perusahaan"] ||
              row["perusahaan"] ||
              row["Company"] ||
              row["company"] ||
              "",
          ).trim(),
          position: String(
            row["Posisi"] ||
              row["posisi"] ||
              row["Position"] ||
              row["position"] ||
              "",
          ).trim(),
          status: mapImportedStatus(row["Status"] || row["status"]),
          source: String(
            row["Sumber"] ||
              row["sumber"] ||
              row["Source"] ||
              row["source"] ||
              "",
          ).trim(),
          appliedDate: parseExcelDate(
            row["Tanggal"] || row["tanggal"] || row["Date"] || row["date"],
          ),
          interviewDate: parseExcelDate(
            row["Tanggal Interview"] ||
              row["interviewDate"] ||
              row["Interview Date"],
          ),
          notes: String(
            row["Catatan"] ||
              row["catatan"] ||
              row["Notes"] ||
              row["notes"] ||
              "",
          ).trim(),
        }));
        const validData = imported.filter(
          (item) => item.companyName || item.position,
        );
        if (validData.length === 0) {
          showError("Tidak ada data valid.", 6000);
          e.target.value = "";
          return;
        }
        setIsProcessing(true);
        setLoadingMessage(`Mengimpor ${validData.length} data...`);
        setLoadingSub("Data sedang dikirim ke server");
        setLoadingProgress(0);
        let successCount = 0,
          errors = [];
        for (let i = 0; i < validData.length; i++) {
          setLoadingSub(
            `Mengimpor ${i + 1} dari ${validData.length}: "${validData[i].companyName || validData[i].position}"`,
          );
          setLoadingProgress(Math.round(((i + 1) / validData.length) * 100));
          try {
            await api.post("/applications", validData[i]);
            successCount++;
          } catch (err) {
            errors.push({
              item: validData[i],
              error: err?.response?.data?.message || err.message,
            });
          }
          await new Promise((r) => setTimeout(r, 150));
        }
        setIsProcessing(false);
        setLoadingMessage("");
        setLoadingSub("");
        setLoadingProgress(null);
        if (successCount === 0)
          showError(
            `0 dari ${validData.length} berhasil.\n${errors[0]?.error || "Unknown"}`,
            6000,
          );
        else if (successCount < validData.length)
          showSuccess(
            `${successCount} dari ${validData.length} berhasil! ${errors.length} gagal.`,
            5000,
          );
        else
          showSuccess(
            `${successCount} dari ${validData.length} berhasil!`,
            5000,
          );
        fetchItems();
      } catch (err) {
        setIsProcessing(false);
        setLoadingMessage("");
        setLoadingSub("");
        setLoadingProgress(null);
        showError("Gagal membaca file.", 5000);
      }
    };
    reader.onerror = () => {
      showError("Gagal membaca file.", 4000);
      setIsProcessing(false);
      setLoadingMessage("");
      setLoadingSub("");
      setLoadingProgress(null);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleSort = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const sortIcon = () =>
    sortDir === "asc" ? Icons.chevronUp : Icons.chevronDown;

  if (loading) return <PageLoader message="Memuat lamaran..." />;

  return (
    <Layout>
      <style>{`
        html, body, #root {
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .btn-action-edit { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 8px 10px; border-radius: 8px; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; }
        .btn-action-edit:hover { color: ${GREEN} !important; background: ${GREEN_BG} !important; }
        .btn-action-delete { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 8px 10px; border-radius: 8px; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; }
        .btn-action-delete:hover { color: #ef4444 !important; background: #fef2f2 !important; }
      `}</style>

      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Lamaran Kerja</h1>
            <div style={styles.headerActions}>
              {selectedIds.size > 0 && (
                <button
                  style={isProcessing ? styles.btnDisabled : styles.btnDanger}
                  onClick={() => setBulkDeleteConfirm(true)}
                  disabled={isProcessing}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                      e.currentTarget.style.boxShadow =
                        "0 4px 14px rgba(239,68,68,0.4)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = "#ef4444";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(239,68,68,0.25)";
                      e.currentTarget.style.transform = "none";
                    }
                  }}
                >
                  {Icons.trash} Hapus ({selectedIds.size})
                </button>
              )}
              <button
                style={isProcessing ? styles.btnDisabled : styles.btnOutline}
                onClick={handleImportClick}
                disabled={isProcessing}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = "#f8fafc";
                    e.target.style.borderColor = "#cbd5e1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = "#fff";
                    e.target.style.borderColor = "#e2e8f0";
                  }
                }}
              >
                {Icons.upload} Import XLSX
              </button>
              <button
                style={isProcessing ? styles.btnDisabled : styles.btnOutline}
                onClick={handleExport}
                disabled={isProcessing}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = "#f8fafc";
                    e.target.style.borderColor = "#cbd5e1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = "#fff";
                    e.target.style.borderColor = "#e2e8f0";
                  }
                }}
              >
                {Icons.download} Export XLSX
              </button>
              <button
                style={isProcessing ? styles.btnDisabled : styles.btnPrimary}
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                disabled={isProcessing}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.backgroundColor = "#166534";
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(21,128,61,0.4)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.backgroundColor = GREEN;
                    e.currentTarget.style.boxShadow = `0 2px 8px ${GREEN_SHADOW}`;
                    e.currentTarget.style.transform = "none";
                  }
                }}
              >
                {Icons.plus} Tambah Lamaran
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={styles.hiddenInput}
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />

          {/* FILTERS */}
          <div style={styles.filtersRow}>
            <div style={{ ...styles.searchWrapper, display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={styles.searchIcon}>{Icons.search}</span>
                <input
                  type="text"
                  placeholder="Cari perusahaan atau posisi... (Enter untuk cari)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSearch(searchInput);
                  }}
                  style={styles.searchInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = GREEN;
                    e.target.style.boxShadow = `0 0 0 3px ${GREEN_SHADOW}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                style={{
                  ...styles.btnPrimary,
                  padding: "10px 16px",
                  gap: 0,
                  flexShrink: 0,
                }}
                onClick={() => setSearch(searchInput)}
                title="Cari"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#166534";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(21,128,61,0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = GREEN;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${GREEN_SHADOW}`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                {Icons.search}
              </button>
            </div>
            <CustomStatusSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={STATUS_OPTIONS}
              placeholder="Semua Status"
            />
            {selectedIds.size > 0 && (
              <span style={styles.selectedCount}>
                {selectedIds.size} item dipilih
              </span>
            )}
          </div>

          {/* ALERTS */}
          {errorMsg && (
            <div style={styles.alertError}>
              <span style={{ flexShrink: 0 }}>{Icons.alertCircle}</span>
              <span style={{ whiteSpace: "pre-line", fontSize: 13, flex: 1 }}>
                {errorMsg}
              </span>
              <button
                onClick={() => setErrorMsg("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc2626",
                  padding: 4,
                  display: "flex",
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              >
                {Icons.x}
              </button>
            </div>
          )}
          {successMsg && (
            <div style={styles.alertSuccess}>
              <span style={{ flexShrink: 0 }}>{Icons.checkCircle}</span>
              <span style={{ whiteSpace: "pre-line", fontSize: 13, flex: 1 }}>
                {successMsg}
              </span>
              <button
                onClick={() => setSuccessMsg("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: GREEN,
                  padding: 4,
                  display: "flex",
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              >
                {Icons.x}
              </button>
            </div>
          )}

          {/* EMPTY */}
          {items.length === 0 && !errorMsg && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>{Icons.building}</div>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "#64748b",
                }}
              >
                Belum ada data lamaran
              </p>
              <p style={{ fontSize: 13, margin: 0 }}>
                Tambahkan data baru atau import dari file XLSX.
              </p>
            </div>
          )}

          {/* TABLE — ✅ flex: 1 agar mengisi sisa tinggi halaman */}
          {items.length > 0 && (
            <>
              <div style={styles.tableOuterWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.thCheckbox}>
                        <button
                          style={{
                            ...styles.checkboxBtn,
                            color: isAllSelected
                              ? GREEN
                              : isSomeSelected
                                ? "#86efac"
                                : "#cbd5e1",
                          }}
                          onClick={toggleSelectAll}
                          title={
                            isAllSelected ? "Batal pilih semua" : "Pilih semua"
                          }
                        >
                          {isAllSelected
                            ? Icons.checkSquare
                            : isSomeSelected
                              ? Icons.minusSquare
                              : Icons.square}
                        </button>
                      </th>
                      <th
                        style={{
                          ...styles.thNormal,
                          width: 45,
                          textAlign: "center",
                        }}
                      >
                        No
                      </th>
                      <th style={{ ...styles.thNormal, minWidth: 160 }}>
                        Perusahaan
                      </th>
                      <th style={{ ...styles.thNormal, minWidth: 200 }}>
                        Posisi
                      </th>
                      <th style={{ ...styles.thNormal, minWidth: 150 }}>
                        Status
                      </th>
                      <th style={{ ...styles.thNormal, minWidth: 120 }}>
                        Sumber
                      </th>
                      <th
                        style={{ ...styles.thSortable, minWidth: 130 }}
                        onClick={handleSort}
                        onMouseEnter={(e) => {
                          e.target.style.color = GREEN;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#64748b";
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          Tgl Lamar {sortIcon()}
                        </span>
                      </th>
                      <th style={{ ...styles.thNormal, minWidth: 120 }}>
                        Tgl Interview
                      </th>
                      <th style={{ ...styles.thNormal, minWidth: 150 }}>
                        Catatan
                      </th>
                      <th
                        style={{
                          ...styles.thNormal,
                          textAlign: "center",
                          width: 90,
                        }}
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const isSelected = selectedIds.has(item.id);
                      const isEditingStatus = editingStatusId === item.id;
                      return (
                        <tr
                          key={item.id}
                          style={{
                            transition: "background 0.15s",
                            background: isSelected ? GREEN_BG : "",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.background = "#f8fafc";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.background = "";
                          }}
                        >
                          <td style={styles.tdCheckbox}>
                            <button
                              style={{
                                ...styles.checkboxBtn,
                                color: isSelected ? GREEN : "#cbd5e1",
                              }}
                              onClick={() => toggleSelectOne(item.id)}
                            >
                              {isSelected ? Icons.checkSquare : Icons.square}
                            </button>
                          </td>
                          <td style={styles.tdNo}>{index + 1}</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.companyName,
                                cursor: "pointer",
                                padding: "2px 6px",
                                borderRadius: 6,
                                transition: "all 0.15s",
                                display: "inline-block",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailItem(item);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = GREEN;
                                e.currentTarget.style.background = GREEN_BG;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "";
                                e.currentTarget.style.background = "";
                              }}
                              title="Lihat detail"
                            >
                              {item.companyName || "—"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.positionName}>
                              {item.position || "—"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.statusSelectWrapper}>
                              {isEditingStatus ? (
                                <div style={{ minWidth: 180 }}>
                                  <CustomStatusSelect
                                    value={item.status}
                                    onChange={(val) => {
                                      handleStatusChange(item, val);
                                      setEditingStatusId(null);
                                    }}
                                    options={STATUS_OPTIONS}
                                    placeholder="Pilih Status"
                                  />
                                </div>
                              ) : (
                                <button
                                  style={styles.statusBadge(item.status)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusClick(item);
                                  }}
                                  title="Klik untuk edit status"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 8px rgba(0,0,0,0.1)";
                                    e.currentTarget.style.transform =
                                      "translateY(-1px)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "none";
                                  }}
                                >
                                  {statusLabel(item.status)}
                                  <span style={styles.chevronDownSmall}>
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </span>
                                </button>
                              )}
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.sourceText}>
                              {item.source || "—"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.dateText}>
                              {formatDate(item.appliedDate || item.createdAt)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.dateText}>
                              {formatDate(item.interviewDate)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span
                              style={styles.notesText}
                              title={item.notes || ""}
                            >
                              {item.notes || "—"}
                            </span>
                          </td>
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <button
                              className="btn-action-edit"
                              title="Edit"
                              onClick={() => {
                                setEditing(item);
                                setShowForm(true);
                              }}
                            >
                              {Icons.edit}
                            </button>
                            <button
                              className="btn-action-delete"
                              title="Hapus"
                              onClick={() => setDeleteTarget(item)}
                            >
                              {Icons.trash}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {totalItems > items.length && (
                <div style={styles.dataInfo}>
                  Menampilkan {items.length} dari {totalItems} data
                </div>
              )}
            </>
          )}

          {/* MODAL FORM */}
          {showForm && (
            <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
              <div
                style={styles.modalCard}
                onClick={(e) => e.stopPropagation()}
              >
                <ApplicationForm
                  initialData={editing}
                  onSubmit={editing ? handleUpdate : handleCreate}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          {/* CONFIRM DIALOGS */}
          <ConfirmDialog
            visible={!!deleteTarget}
            title="Hapus Lamaran"
            message={`Apakah Anda yakin ingin menghapus lamaran di "${deleteTarget?.companyName || "—"}"?`}
            confirmLabel="Ya, Hapus"
            confirmStyle={{
              background: "#ef4444",
              boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
            }}
            onConfirm={handleDeleteSingle}
            onCancel={() => setDeleteTarget(null)}
            isLoading={isProcessing}
          />
          <ConfirmDialog
            visible={bulkDeleteConfirm}
            title="Hapus Banyak Lamaran"
            message={`Apakah Anda yakin ingin menghapus ${selectedIds.size} lamaran yang dipilih?\n\nTindakan ini tidak dapat dibatalkan.`}
            confirmLabel={`Ya, Hapus ${selectedIds.size} Data`}
            confirmStyle={{
              background: "#ef4444",
              boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
            }}
            onConfirm={handleBulkDelete}
            onCancel={() => setBulkDeleteConfirm(false)}
            isLoading={isProcessing}
          />
        </div>
      </div>
      <DetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => {
          setEditing(item);
          setShowForm(true);
        }}
        onDelete={(item) => setDeleteTarget(item)}
      />
      <LoadingOverlay
        message={loadingMessage}
        subMessage={loadingSub}
        progress={loadingProgress}
      />
    </Layout>
  );
};

export default Applications;
