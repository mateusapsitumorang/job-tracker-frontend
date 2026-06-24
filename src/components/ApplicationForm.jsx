import { useState, useEffect } from "react";
import { STATUS_OPTIONS } from "../constants.js";
import CustomStatusSelect from "../components/CustomStatusSelect";

const GREEN = "#15803d";
const GREEN_DARK = "#166534";

const emptyForm = {
  companyName: "",
  position: "",
  status: "APPLIED",
  appliedDate: "",
  interviewDate: "",
  source: "",
  notes: "",
};

const ApplicationForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        companyName: initialData.companyName || "",
        position: initialData.position || "",
        status: initialData.status || "APPLIED",
        appliedDate: initialData.appliedDate
          ? initialData.appliedDate.slice(0, 10)
          : "",
        interviewDate: initialData.interviewDate
          ? initialData.interviewDate.slice(0, 10)
          : "",
        source: initialData.source || "",
        notes: initialData.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
      paddingBottom: "12px",
      borderBottom: "1px solid #f1f5f4",
    },
    title: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#0f172a",
      margin: 0,
    },
    closeBtn: {
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
    },
    row: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minWidth: "200px",
      gap: "6px",
    },
    label: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#475569",
    },
    input: (isFocused) => ({
      width: "100%",
      padding: "10px 12px",
      border: `1.5px solid ${isFocused ? GREEN : "#e2e8f0"}`,
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#fff",
      color: "#0f172a",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    }),
    actions: {
      display: "flex",
      gap: "12px",
      marginTop: "12px",
      paddingTop: "16px",
      borderTop: "1px solid #f1f5f4",
    },
    btnPrimary: {
      background: GREEN,
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "10px",
      fontWeight: 600,
      fontSize: "14px",
      cursor: submitting ? "not-allowed" : "pointer",
      opacity: submitting ? 0.7 : 1,
      flex: 1,
      transition: "background 0.2s",
    },
    btnCancel: {
      background: "#fff",
      color: "#64748b",
      border: "1px solid #e2e8f0",
      padding: "10px 20px",
      borderRadius: "10px",
      fontWeight: 600,
      fontSize: "14px",
      cursor: "pointer",
      flex: 1,
      transition: "all 0.2s",
    },
  };

  return (
    <form style={styles.formContainer} onSubmit={handleSubmit}>
      {/* HEADER & TOMBOL X */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          {initialData ? "Edit Lamaran" : "Tambah Lamaran Baru"}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={styles.closeBtn}
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
        )}
      </div>

      <div style={styles.row}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Nama Perusahaan *</label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            onFocus={() => setFocusedInput("companyName")}
            onBlur={() => setFocusedInput(null)}
            style={styles.input(focusedInput === "companyName")}
            required
            placeholder="Contoh: Google"
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Posisi *</label>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            onFocus={() => setFocusedInput("position")}
            onBlur={() => setFocusedInput(null)}
            style={styles.input(focusedInput === "position")}
            required
            placeholder="Contoh: IT Manager"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Status</label>
          <CustomStatusSelect
            value={form.status}
            onChange={(val) => setForm({ ...form, status: val })}
            options={STATUS_OPTIONS}
            placeholder="Pilih Status"
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Sumber Lowongan</label>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            onFocus={() => setFocusedInput("source")}
            onBlur={() => setFocusedInput(null)}
            style={styles.input(focusedInput === "source")}
            placeholder="LinkedIn, Jobstreet, dll"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Tanggal Lamar</label>
          <input
            type="date"
            name="appliedDate"
            value={form.appliedDate}
            onChange={handleChange}
            onFocus={() => setFocusedInput("appliedDate")}
            onBlur={() => setFocusedInput(null)}
            style={styles.input(focusedInput === "appliedDate")}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Tanggal Interview</label>
          <input
            type="date"
            name="interviewDate"
            value={form.interviewDate}
            onChange={handleChange}
            onFocus={() => setFocusedInput("interviewDate")}
            onBlur={() => setFocusedInput(null)}
            style={styles.input(focusedInput === "interviewDate")}
          />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Catatan Khusus</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          onFocus={() => setFocusedInput("notes")}
          onBlur={() => setFocusedInput(null)}
          style={{
            ...styles.input(focusedInput === "notes"),
            resize: "vertical",
          }}
          rows={3}
          placeholder="Tambahkan detail penting di sini..."
        />
      </div>

      <div style={styles.actions}>
        {onCancel && (
          <button
            type="button"
            style={styles.btnCancel}
            onClick={onCancel}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f8faf9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#fff")
            }
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          style={styles.btnPrimary}
          disabled={submitting}
          onMouseEnter={(e) => {
            if (!submitting) e.currentTarget.style.backgroundColor = GREEN_DARK;
          }}
          onMouseLeave={(e) => {
            if (!submitting) e.currentTarget.style.backgroundColor = GREEN;
          }}
        >
          {submitting
            ? "Menyimpan..."
            : initialData
              ? "Simpan Perubahan"
              : "Tambah Lamaran"}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
