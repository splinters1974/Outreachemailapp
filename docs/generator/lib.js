const {
  Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, PageBreak,
} = require('docx');

// ---- Brand palette -------------------------------------------------------
const C = {
  dark:    '10362B', // deep green - H1
  mid:     '1C6B4C', // mid green  - H2
  accent:  '4C9A2A', // accent     - H3 / rules
  ink:     '222222',
  grey:    '5A5A5A',
  rule:    'C9D6CF',
  headBg:  '10362B',
  headTx:  'FFFFFF',
  zebra:   'F1F5F2',
  crit:    'F6D2D2',
  high:    'FBE3CB',
  med:     'FBF3CB',
  low:     'E4F0DC',
  partner: 'DCE9F5',
  callout: 'EDF4EE',
};

const CONTENT_W = 9700; // usable table width in DXA

// ---- Text ----------------------------------------------------------------
const NOBORDER = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
};

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 6 } },
    children: [new TextRun({ text, bold: true, size: 34, color: C.dark, font: 'Calibri' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 340, after: 140 },
    children: [new TextRun({ text, bold: true, size: 26, color: C.mid, font: 'Calibri' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: C.accent, font: 'Calibri' })],
  });
}

function h4(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, italics: true, size: 20, color: C.grey, font: 'Calibri' })],
  });
}

// Inline markup: **bold** segments
function runs(text, opts = {}) {
  const base = { size: opts.size || 20, color: opts.color || C.ink, font: 'Calibri', italics: !!opts.italics };
  const out = [];
  String(text).split(/(\*\*[^*]+\*\*)/g).forEach((chunk) => {
    if (!chunk) return;
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      out.push(new TextRun({ ...base, text: chunk.slice(2, -2), bold: true }));
    } else {
      out.push(new TextRun({ ...base, text: chunk }));
    }
  });
  return out;
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after === undefined ? 140 : opts.after, line: 276 },
    alignment: opts.align || AlignmentType.LEFT,
    children: runs(text, opts),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 70, line: 264 },
    children: runs(text),
  });
}

function num(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbers', level },
    spacing: { after: 70, line: 264 },
    children: runs(text),
  });
}

function callout(title, text) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: C.callout },
        margins: { top: 140, bottom: 140, left: 180, right: 180 },
        borders: {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          left: { style: BorderStyle.SINGLE, size: 18, color: C.accent },
        },
        children: [
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: title, bold: true, size: 20, color: C.dark, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 0 }, children: runs(text, { size: 19 }) }),
        ],
      })],
    })],
  });
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { after: size }, children: [new TextRun({ text: '' })] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ---- Tables --------------------------------------------------------------
function cellPara(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 20, after: 20, line: 240 },
    alignment: opts.align || AlignmentType.LEFT,
    children: runs(text, { size: opts.size || 17, color: opts.color || C.ink, italics: opts.italics }),
  });
}

function shadeFor(text) {
  const t = String(text).trim().toUpperCase();
  if (t === 'CRITICAL') return C.crit;
  if (t === 'HIGH') return C.high;
  if (t === 'MEDIUM' || t === 'MED') return C.med;
  if (t === 'LOW') return C.low;
  if (t.startsWith('PARTNER')) return C.partner;
  return null;
}

/**
 * table(headers, rows, widths, opts)
 * - widths: array of relative weights (normalised to CONTENT_W)
 * - opts.autoShade: shade threat-rating words
 * - opts.firstColBold
 */
function table(headers, rows, widths, opts = {}) {
  const total = opts.width || CONTENT_W;
  const sum = widths.reduce((a, b) => a + b, 0);
  const cols = widths.map((w) => Math.round((w / sum) * total));
  // fix rounding drift
  cols[cols.length - 1] += total - cols.reduce((a, b) => a + b, 0);

  const border = { style: BorderStyle.SINGLE, size: 2, color: C.rule };
  const borders = { top: border, bottom: border, left: border, right: border };

  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((htxt, i) => new TableCell({
      width: { size: cols[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: C.headBg },
      margins: { top: 70, bottom: 70, left: 90, right: 90 },
      borders,
      children: [new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [new TextRun({ text: htxt, bold: true, size: 17, color: C.headTx, font: 'Calibri' })],
      })],
    })),
  });

  const bodyRows = rows.map((r, ri) => new TableRow({
    children: r.map((ctxt, i) => {
      const shade = (opts.autoShade && shadeFor(ctxt)) || (ri % 2 === 1 ? C.zebra : null);
      return new TableCell({
        width: { size: cols[i], type: WidthType.DXA },
        margins: { top: 70, bottom: 70, left: 90, right: 90 },
        borders,
        ...(shade ? { shading: { type: ShadingType.CLEAR, fill: shade } } : {}),
        children: [cellPara(
          (opts.firstColBold && i === 0) ? `**${ctxt}**` : ctxt,
          { align: opts.centreCols && opts.centreCols.includes(i) ? AlignmentType.CENTER : undefined },
        )],
      });
    }),
  }));

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cols,
    rows: [headRow, ...bodyRows],
  });
}

/** Two-column snapshot block used on battlecards */
function snapshot(pairs) {
  return table(['Attribute', 'Detail'], pairs, [26, 74], { firstColBold: true });
}

function caption(text) {
  return new Paragraph({
    spacing: { before: 60, after: 200 },
    children: [new TextRun({ text, italics: true, size: 16, color: C.grey, font: 'Calibri' })],
  });
}

module.exports = { C, CONTENT_W, h1, h2, h3, h4, p, bullet, num, table, snapshot, callout, spacer, pageBreak, caption, runs, NOBORDER };
