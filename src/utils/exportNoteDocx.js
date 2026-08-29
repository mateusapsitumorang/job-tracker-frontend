import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
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
