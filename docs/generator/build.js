const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, Header, Footer, PageNumber, LevelFormat, TableOfContents,
  BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType, ShadingType,
} = require('docx');

const { C, CONTENT_W } = require('./lib');

const body = [
  ...require('./part1'),
  ...require('./part2'),
  ...require('./part3'),
  ...require('./part4'),
  ...require('./part5'),
];

// ---------------------------------------------------------------- cover
function coverRule() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.accent, space: 4 } },
    children: [new TextRun({ text: '' })],
  });
}

const cover = [
  new Paragraph({ spacing: { before: 2600, after: 0 }, children: [
    new TextRun({ text: 'COMPANY CONFIDENTIAL', bold: true, size: 18, color: C.accent, font: 'Calibri', characterSpacing: 60 }),
  ] }),
  coverRule(),
  new Paragraph({ spacing: { before: 260, after: 60 }, children: [
    new TextRun({ text: 'UK Competitor Analysis', bold: true, size: 68, color: C.dark, font: 'Calibri' }),
  ] }),
  new Paragraph({ spacing: { after: 320 }, children: [
    new TextRun({ text: 'The full 360° market', size: 44, color: C.mid, font: 'Calibri' }),
  ] }),
  new Paragraph({ spacing: { after: 120 }, children: [
    new TextRun({ text: 'Who competes with Ameresco in the UK — across Industrial & Commercial, Public Sector, Grid-Scale, Cities, Data Centres, Retrofit and EV — and how we counter them.', size: 24, color: C.grey, font: 'Calibri' }),
  ] }),
  coverRule(),
  new Paragraph({ spacing: { before: 200, after: 40 }, children: [
    new TextRun({ text: 'Prepared for: Ameresco UK', size: 22, color: C.ink, font: 'Calibri', bold: true }),
  ] }),
  new Paragraph({ spacing: { after: 40 }, children: [
    new TextRun({ text: 'Companion to: The Ameresco UK Value Proposition (June 2026)', size: 20, color: C.grey, font: 'Calibri' }),
  ] }),
  new Paragraph({ spacing: { after: 40 }, children: [
    new TextRun({ text: 'Date: August 2026', size: 20, color: C.grey, font: 'Calibri' }),
  ] }),
  new Paragraph({ spacing: { after: 0 }, children: [
    new TextRun({ text: 'Scope: 10 competitors in detail · 3 challengers · 7 segment maps · c.200 organisations indexed', size: 20, color: C.grey, font: 'Calibri' }),
  ] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------------------------------------------------------------- contents
const contents = [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 6 } },
    children: [new TextRun({ text: 'Contents', bold: true, size: 34, color: C.dark, font: 'Calibri' })],
  }),
  new Paragraph({ spacing: { after: 160 }, children: [
    new TextRun({ text: 'Right-click and choose "Update Field" to refresh page numbers after editing.', italics: true, size: 17, color: C.grey, font: 'Calibri' }),
  ] }),
  new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------------------------------------------------------------- document
const doc = new Document({
  creator: 'Ameresco UK',
  title: 'UK Competitor Analysis — The Full 360° Market',
  description: 'Competitor analysis across I&C, public sector, grid-scale, cities, data centres, retrofit and EV.',
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 20, color: C.ink } },
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Calibri', size: 34, bold: true, color: C.dark } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Calibri', size: 26, bold: true, color: C.mid } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Calibri', size: 22, bold: true, color: C.accent } },
      { id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: 'Calibri', size: 20, bold: true, italics: true, color: C.grey } },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 400, hanging: 220 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 780, hanging: 220 } } } },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 430, hanging: 250 } } } },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080, header: 620, footer: 560 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 4 } },
          children: [new TextRun({ text: 'UK Competitor Analysis  ·  Ameresco UK  ·  Company Confidential', size: 15, color: C.grey, font: 'Calibri' })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 15, color: C.grey, font: 'Calibri' })],
        })],
      }),
    },
    children: [...cover, ...contents, ...body],
  }],
});

const outDir = process.argv[2] || __dirname;
const out = path.join(outDir, 'Ameresco-UK-Competitor-Analysis-2026.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(out, buf);
  console.log('Wrote', out, (buf.length / 1024).toFixed(0) + 'KB');
});
