import { NextApiRequest, NextApiResponse } from 'next';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { report } = req.body;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: report.name || 'Untitled Report',
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              text: report.description || '',
            }),
            ...report.pages.map((page: any, i: number) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `Page ${i + 1}: ${page.title || `Page ${i + 1}`}`, bold: true }),
                  new TextRun('\n'),
                  new TextRun(page.comment || ''),
                  new TextRun('\n[Zone réservée pour contenu : Graphique, Tableau, etc...]'),
                ],
              })
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Disposition', 'attachment; filename=rapport.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Word document:', error);
    res.status(500).json({ message: 'Erreur lors de la génération du fichier Word' });
  }
}
