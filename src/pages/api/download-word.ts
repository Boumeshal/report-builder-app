import { NextApiRequest, NextApiResponse } from 'next';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const report = req.body;

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: report.name || 'Untitled Report',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: report.description || '',
            spacing: { after: 300 },
          }),
          ...report.pages.map((page: any, index: number) => [
            new Paragraph({
              text: page.title || `Page ${index + 1}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            ...(page.elements || []).map((element: any, i: number) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: element.title || `Élément ${i + 1}`,
                    bold: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: element.comment || '',
                    italics: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: '[Zone réservée pour le graphique/tableau]',
                    color: '888888',
                    break: 2,
                  }),
                ],
                spacing: { after: 300 },
              })
            ),
          ]).flat(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  res.setHeader('Content-Disposition', 'attachment; filename=rapport.docx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(buffer);
}
