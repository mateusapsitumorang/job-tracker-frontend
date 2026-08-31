import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";
import { tiptapJsonToBlocks, safeFileName } from "./noteDocModel.js";

const HEADING_MAP = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
};

const ALIGN_MAP = {
  left: AlignmentType.LEFT,
  center: AlignmentType.CENTER,
  right: AlignmentType.RIGHT,
  justify: AlignmentType.JUSTIFIED,
};

const runsToDocxChildren = (runs = []) =>
  runs.map((r) => {
    if (r.link) {
      return new ExternalHyperlink({
        link: r.link,
        children: [
          new TextRun({
            text: r.text,
            bold: r.bold,
            italics: r.italic,
            underline: r.underline ? {} : undefined,
            color: "1D4ED8",
          }),
        ],
      });
    }
    return new TextRun({
      text: r.text,
      bold: r.bold,
      italics: r.italic,
      underline: r.underline ? {} : undefined,
    });
  });

// Sama seperti runsToDocxChildren, tapi run bertipe newline ("\n", dipakai
// untuk memisahkan paragraph di dalam satu sel tabel) diubah jadi line break
// docx (bukan karakter newline literal yang diabaikan Word), dan mendukung
// "forceBold" supaya sel header otomatis tebal walau teksnya tidak diberi
// mark bold secara eksplisit oleh user.
const cellRunsToDocxChildren = (runs = [], forceBold = false) => {
  if (runs.length === 0) return [new TextRun({ text: "" })];
  return runs.map((r) => {
    if (r.text === "\n" && !r.link) {
      return new TextRun({ text: "", break: 1 });
    }
    if (r.link) {
      return new ExternalHyperlink({
        link: r.link,
        children: [
          new TextRun({
            text: r.text,
            bold: r.bold || forceBold,
            italics: r.italic,
            underline: r.underline ? {} : undefined,
            color: "1D4ED8",
          }),
        ],
      });
    }
    return new TextRun({
      text: r.text,
      bold: r.bold || forceBold,
      italics: r.italic,
      underline: r.underline ? {} : undefined,
    });
  });
};

const blockToDocxTable = (block) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: block.rows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                columnSpan: cell.colspan > 1 ? cell.colspan : undefined,
                rowSpan: cell.rowspan > 1 ? cell.rowspan : undefined,
                verticalAlign: VerticalAlign.TOP,
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                shading: cell.header
                  ? { type: ShadingType.CLEAR, color: "auto", fill: "F0FDF4" }
                  : undefined,
                children: [
                  new Paragraph({
                    children: cellRunsToDocxChildren(cell.runs, cell.header),
                  }),
                ],
              }),
          ),
        }),
    ),
  });

const blocksToDocxParagraphs = (blocks) => {
  const paragraphs = [];

  for (const block of blocks) {
    if (block.type === "heading") {
      paragraphs.push(
        new Paragraph({
          heading: HEADING_MAP[block.level] || HeadingLevel.HEADING_3,
          alignment: ALIGN_MAP[block.align] || AlignmentType.LEFT,
          children: runsToDocxChildren(block.runs),
        }),
      );
    } else if (block.type === "paragraph") {
      paragraphs.push(
        new Paragraph({
          alignment: ALIGN_MAP[block.align] || AlignmentType.LEFT,
          spacing: { after: 160 },
          children: runsToDocxChildren(block.runs),
        }),
      );
    } else if (block.type === "bulletList") {
      block.items.forEach((itemRuns) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: runsToDocxChildren(itemRuns),
          }),
        );
      });
    } else if (block.type === "orderedList") {
      block.items.forEach((itemRuns) => {
        paragraphs.push(
          new Paragraph({
            numbering: { reference: "note-ordered-list", level: 0 },
            children: runsToDocxChildren(itemRuns),
          }),
        );
      });
    } else if (block.type === "table" && block.rows.length > 0) {
      paragraphs.push(blockToDocxTable(block));
      // Spacer setelah tabel supaya tidak nempel dengan konten berikutnya.
      paragraphs.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  }

  return paragraphs;
};

export const exportNoteAsDocx = async (title, tiptapDocJson) => {
  const blocks = tiptapJsonToBlocks(tiptapDocJson);

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "note-ordered-list",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            spacing: { after: 240 },
            children: [new TextRun({ text: title || "Catatan", bold: true })],
          }),
          ...blocksToDocxParagraphs(blocks),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFileName(title)}.docx`);
};
