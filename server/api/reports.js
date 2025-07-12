const express = require('express');
const { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, ImageRun, Header, Footer, PageNumber, PageBreak } = require('docx');
const router = express.Router();

// Generate Word document from report configuration
router.post('/generate', async (req, res) => {
  try {
    const report = req.body;
    
    const doc = new Document({
      creator: 'IoT Reporting System',
      title: report.name,
      description: report.description,
      sections: await generateSections(report)
    });

    const buffer = await Packer.toBuffer(doc);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${report.name}.docx"`);
    res.send(buffer);
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

async function generateSections(report) {
  const sections = [];
  const docSettings = report.documentSettings || getDefaultDocumentSettings();
  
  for (const page of report.pages) {
    const section = {
      properties: {
        page: {
          size: getPageSize(page.size),
          orientation: page.orientation === 'landscape' ? 'landscape' : 'portrait',
          margin: {
            top: docSettings.margins.top * 567, // Convert cm to twips
            bottom: docSettings.margins.bottom * 567,
            left: docSettings.margins.left * 567,
            right: docSettings.margins.right * 567
          }
        }
      },
      children: []
    };

    // Add header if enabled
    if (page.header?.enabled) {
      section.headers = {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: formatHeaderFooterText(page.header.content, report),
                  bold: true,
                  font: docSettings.fonts.header.name,
                  size: docSettings.fonts.header.size * 2 // Convert to half-points
                })
              ],
              alignment: AlignmentType.CENTER
            })
          ]
        })
      };
    }

    // Add footer if enabled
    if (page.footer?.enabled) {
      section.footers = {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: formatHeaderFooterText(page.footer.content, report),
                  font: docSettings.fonts.footer.name,
                  size: docSettings.fonts.footer.size * 2
                }),
                ...(page.footer.showPageNumber ? [
                  new TextRun(' - Page '),
                  new PageNumber()
                ] : [])
              ],
              alignment: AlignmentType.CENTER
            })
          ]
        })
      };
    }

    // Add page elements
    await addPageElements(section, page, report);
    
    sections.push(section);
  }
  
  return sections;
}

async function addPageElements(section, page, report) {
  const elements = page.elements || [];
  
  // Create layout based on page.layout
  const layoutConfig = getLayoutConfig(page.layout);
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    // Add title
    section.children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: element.title,
            bold: report.documentSettings?.fonts.title.bold || true,
            size: (report.documentSettings?.fonts.title.size || 14) * 2,
            font: report.documentSettings?.fonts.title.name || 'Calibri',
            color: report.documentSettings?.colors.primary?.replace('#', '') || '2563EB'
          })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { 
          before: (report.documentSettings?.spacing.sectionSpacing || 12) * 20,
          after: (report.documentSettings?.spacing.paragraphSpacing || 6) * 20
        }
      })
    );

    // Add element content based on type
    await addElementContent(section, element, report);
    
    // Add comment if not default
    if (element.comment && element.comment !== 'RAS') {
      section.children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Commentaire: ',
              bold: true,
              font: report.documentSettings?.fonts.body.name || 'Calibri',
              size: (report.documentSettings?.fonts.body.size || 11) * 2
            }),
            new TextRun({
              text: element.comment,
              font: report.documentSettings?.fonts.body.name || 'Calibri',
              size: (report.documentSettings?.fonts.body.size || 11) * 2,
              color: report.documentSettings?.colors.text?.replace('#', '') || '1F2937'
            })
          ],
          spacing: { 
            before: (report.documentSettings?.spacing.paragraphSpacing || 6) * 20,
            after: (report.documentSettings?.spacing.sectionSpacing || 12) * 20
          }
        })
      );
    }
  }
}

async function addElementContent(section, element, report) {
  switch (element.type) {
    case 'chart':
      await addChartElement(section, element, report);
      break;
    case 'widget':
      await addWidgetElement(section, element, report);
      break;
    case 'table':
      await addTableElement(section, element, report);
      break;
    case 'text':
      addTextElement(section, element);
      break;
  }
}

async function addChartElement(section, element, report) {
  // For now, add placeholder for chart
  // In real implementation, generate chart image using libraries like Chart.js or D3
  section.children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '[Graphique généré dynamiquement]',
          italics: true,
          color: '666666'
        })
      ],
      spacing: { before: 200, after: 200 }
    })
  );
  
  // Add sample data table for demonstration
  const chartData = generateSampleChartData(element, report);
  if (chartData.length > 0) {
    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Timestamp')] }),
            new TableCell({ children: [new Paragraph('Valeur')] }),
            new TableCell({ children: [new Paragraph('Unité')] })
          ]
        }),
        ...chartData.map(row => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(row.timestamp)] }),
            new TableCell({ children: [new Paragraph(row.value.toString())] }),
            new TableCell({ children: [new Paragraph(row.unit || '')] })
          ]
        }))
      ]
    });
    section.children.push(table);
  }
}

async function addWidgetElement(section, element, report) {
  const widgetData = generateSampleWidgetData(element, report);
  
  section.children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Valeur actuelle: ${widgetData.value} ${widgetData.unit}`,
          size: 32,
          bold: true
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 }
    })
  );
  
  section.children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Status: ${widgetData.status}`,
          color: widgetData.status === 'Normal' ? '00AA00' : 
                 widgetData.status === 'Attention' ? 'FF8800' : 'FF0000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );
}

async function addTableElement(section, element, report) {
  const alertsData = generateSampleAlertsData(report);
  
  if (alertsData.length === 0) {
    section.children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Aucune alerte pour la période sélectionnée.',
            italics: true
          })
        ]
      })
    );
    return;
  }
  
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ 
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Date/Heure', bold: true })]
            })]
          }),
          new TableCell({ 
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Niveau', bold: true })]
            })]
          }),
          new TableCell({ 
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Source', bold: true })]
            })]
          }),
          new TableCell({ 
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Message', bold: true })]
            })]
          })
        ]
      }),
      ...alertsData.map(alert => new TableRow({
        children: [
          new TableCell({ 
            children: [new Paragraph(alert.timestamp.toLocaleString())]
          }),
          new TableCell({ 
            children: [new Paragraph({
              children: [new TextRun({
                text: alert.level.toUpperCase(),
                color: alert.level === 'critical' ? 'FF0000' :
                       alert.level === 'error' ? 'FF4400' :
                       alert.level === 'warning' ? 'FF8800' : '0088FF'
              })]
            })]
          }),
          new TableCell({ 
            children: [new Paragraph(alert.source)]
          }),
          new TableCell({ 
            children: [new Paragraph(alert.message)]
          })
        ]
      }))
    ]
  });
  
  section.children.push(table);
}

function addTextElement(section, element) {
  section.children.push(
    new Paragraph({
      children: [
        new TextRun(element.comment || 'Contenu texte libre')
      ],
      spacing: { before: 200, after: 200 }
    })
  );
}

function formatHeaderFooterText(text, report) {
  return text
    .replace('{date}', new Date().toLocaleDateString())
    .replace('{time}', new Date().toLocaleTimeString())
    .replace('{reportName}', report.name);
}

function getPageSize(size) {
  switch (size) {
    case 'A3':
      return { width: 11906, height: 16838 };
    case 'Letter':
      return { width: 12240, height: 15840 };
    case 'A4':
    default:
      return { width: 8391, height: 11906 };
  }
}

function getLayoutConfig(layout) {
  switch (layout) {
    case '1x1': return { rows: 1, cols: 1 };
    case '1x2': return { rows: 2, cols: 1 };
    case '2x1': return { rows: 1, cols: 2 };
    case '2x2': return { rows: 2, cols: 2 };
    default: return { rows: 1, cols: 2 };
  }
}

function generateSampleChartData(element, report) {
  // Generate sample data based on report period
  const data = [];
  const start = new Date(report.period.start);
  const end = new Date(report.period.end);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    data.push({
      timestamp: date.toLocaleDateString(),
      value: Math.round(Math.random() * 100 + 20),
      unit: '°C'
    });
  }
  
  return data;
}

function generateSampleWidgetData(element, report) {
  const value = Math.round(Math.random() * 100 + 20);
  return {
    value,
    unit: '°C',
    status: value > 80 ? 'Critique' : value > 60 ? 'Attention' : 'Normal'
  };
}

function generateSampleAlertsData(report) {
  const alerts = [];
  const start = new Date(report.period.start);
  const end = new Date(report.period.end);
  
  // Generate 3-8 sample alerts
  const alertCount = Math.floor(Math.random() * 6) + 3;
  
  for (let i = 0; i < alertCount; i++) {
    const alertTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const levels = ['info', 'warning', 'error', 'critical'];
    const sources = ['Capteur-01', 'Capteur-02', 'Système-A', 'Réseau', 'Alimentation'];
    const messages = [
      'Température élevée détectée',
      'Perte de communication',
      'Seuil de pression dépassé',
      'Maintenance requise',
      'Erreur de calibration'
    ];
    
    alerts.push({
      timestamp: alertTime,
      level: levels[Math.floor(Math.random() * levels.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function getDefaultDocumentSettings() {
  return {
    margins: { top: 2.5, bottom: 2.5, left: 2.5, right: 2.5 },
    fonts: {
      title: { name: 'Calibri', size: 16, bold: true },
      body: { name: 'Calibri', size: 11 },
      header: { name: 'Calibri', size: 10 },
      footer: { name: 'Calibri', size: 9 }
    },
    spacing: { lineHeight: 1.15, paragraphSpacing: 6, sectionSpacing: 12 },
    colors: { primary: '#2563EB', secondary: '#64748B', text: '#1F2937', accent: '#059669' }
  };
}

module.exports = router;