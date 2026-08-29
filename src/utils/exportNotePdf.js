import { jsPDF } from "jspdf";
import { tiptapJsonToBlocks, safeFileName } from "./noteDocModel.js";

const PAGE_MARGIN = 56; // ~20mm in pt-ish units (jsPDF default unit = pt via 'px' fallback below)
const LINE_HEIGHT = 16;

const FONT_SIZES = {
  heading1: 20,
  heading2: 16,
  heading3: 13,
  paragraph: 11,
};

// Bungkus teks manual per-run supaya bold/italic per kata tetap didukung
// (jsPDF tidak mendukung rich inline styling langsung, jadi kita ukur
// lebar tiap kata dan bungkus baris sendiri).
const wrapRuns = (doc, runs, maxWidth, baseFontSize) => {
  const lines = [];
  let current = [];
  let currentWidth = 0;
  const spaceWidth = (fontStyle) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(baseFontSize);
    return doc.getTextWidth(" ");
  };

  for (const run of runs) {
    const words = run.text.split(/(\s+)/).filter((w) => w !== "");
    for (const word of words) {
      const isSpace = /^\s+$/.test(word);
      const fontStyle =
        run.bold && run.italic
          ? "bolditalic"
          : run.bold
            ? "bold"
            : run.italic
              ? "italic"
              : "normal";
      doc.setFont("helvetica", fontStyle);
      doc.setFontSize(baseFontSize);
      const wordWidth = doc.getTextWidth(word);

      if (!isSpace && currentWidth + wordWidth > maxWidth && current.length > 0) {
        lines.push(current);
        current = [];
        currentWidth = 0;
      }

      current.push({ text: word, bold: run.bold, italic: run.italic, underline: run.underline });
      currentWidth += wordWidth;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
};

const drawRunLine = (doc, lineRuns, x, y, fontSize) => {
  let cursorX = x;
  for (const r of lineRuns) {
    const fontStyle =
      r.bold && r.italic ? "bolditalic" : r.bold ? "bold" : r.italic ? "italic" : "normal";
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.text(r.text, cursorX, y);
    const w = doc.getTextWidth(r.text);
    if (r.underline) {
      doc.setLineWidth(0.5);
      doc.line(cursorX, y + 1.5, cursorX + w, y + 1.5);
    }
    cursorX += w;
  }
};

export const exportNoteAsPdf = (title, tiptapDocJson) => {
  const blocks = tiptapJsonToBlocks(tiptapDocJson);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PAGE_MARGIN * 2;

  let y = PAGE_MARGIN;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
  };

  // Judul dokumen
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(title || "Catatan", maxWidth);
  titleLines.forEach((line) => {
    ensureSpace(26);
    doc.text(line, PAGE_MARGIN, y);
    y += 26;
  });
  y += 10;

  const renderRunsBlock = (runs, fontSize, indent = 0, bullet = null) => {
    if (!runs || runs.length === 0) {
      y += LINE_HEIGHT * (fontSize / 11);
      return;
    }
    const lines = wrapRuns(doc, runs, maxWidth - indent, fontSize);
    lines.forEach((lineRuns, idx) => {
      ensureSpace(LINE_HEIGHT * (fontSize / 11) + 4);
      const x = PAGE_MARGIN + indent;
      if (bullet && idx === 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.text(bullet, PAGE_MARGIN + indent - 14, y);
      }
      drawRunLine(doc, lineRuns, x, y, fontSize);
      y += LINE_HEIGHT * (fontSize / 11) + 4;
    });
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      const size = FONT_SIZES[`heading${block.level}`] || FONT_SIZES.heading3;
      ensureSpace(size + 10);
      y += 6;
      renderRunsBlock(block.runs, size);
      y += 4;
    } else if (block.type === "paragraph") {
      renderRunsBlock(block.runs, FONT_SIZES.paragraph);
      y += 4;
    } else if (block.type === "bulletList") {
      block.items.forEach((itemRuns) => {
        renderRunsBlock(itemRuns, FONT_SIZES.paragraph, 16, "•");
      });
      y += 4;
    } else if (block.type === "orderedList") {
      block.items.forEach((itemRuns, i) => {
        renderRunsBlock(itemRuns, FONT_SIZES.paragraph, 16, `${i + 1}.`);
      });
      y += 4;
    }
  }

  doc.save(`${safeFileName(title)}.pdf`);
};
