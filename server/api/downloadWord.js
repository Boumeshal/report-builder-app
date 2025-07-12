import { Document, Packer, Paragraph, TextRun } from "docx";

export const generateWordReport = (report) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: report.name,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            text: report.description || "No description provided.",
            spacing: { before: 300 },
          }),
          ...report.pages.map((page) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `Page: ${page.title || "Untitled"}`,
                  bold: true,
                  break: 2,
                }),
                new TextRun({
                  text: `Comment: ${page.comment || "No comment"}`,
                  break: 1,
                }),
                new TextRun({
                  text: "[ Graph / Chart Placeholder ]",
                  italics: true,
                  break: 1,
                }),
              ],
              spacing: { before: 300 },
            })
          ),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
};
