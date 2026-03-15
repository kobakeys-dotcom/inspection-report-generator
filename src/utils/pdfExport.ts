import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RfiFormData, PROJECT_INFO } from '@/types/rfi';

function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = src;
  });
}

function formatDatePdf(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export async function generateRfiPdf(data: RfiFormData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const m = 15; // margin
  const cW = pageW - m * 2; // content width
  let y = m;
  const lw = 0.2; // line weight matching original thin borders
  const green: [number, number, number] = [76, 175, 80];
  const amber: [number, number, number] = [230, 168, 23];
  const rh = 5; // row height (slightly taller to match original)
  const fs = 7.5; // font size
  const rcvX = pageW / 2; // right column value start X
  const labelW = 22; // label column width
  const rx = pageW - m; // right edge

  doc.setLineWidth(lw);
  doc.setDrawColor(120);

  let hdcB64: string | null = null;
  let bltB64: string | null = null;
  try { const m = await import('@/assets/hdc-logo.png'); hdcB64 = await loadImageAsBase64(m.default); } catch {}
  try { const m = await import('@/assets/blt-logo.png'); bltB64 = await loadImageAsBase64(m.default); } catch {}

  const box = (x: number, yy: number, w: number, h: number) => {
    doc.setLineWidth(lw); doc.setDrawColor(120); doc.rect(x, yy, w, h);
  };
  const fillBox = (x: number, yy: number, w: number, h: number, c: [number, number, number]) => {
    doc.setFillColor(c[0], c[1], c[2]); doc.rect(x, yy, w, h, 'F'); box(x, yy, w, h);
  };
  const label = (text: string, x: number, yy: number) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(fs); doc.text(text, x, yy);
  };
  const val = (text: string, x: number, yy: number) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(fs); doc.text(text, x, yy);
  };
  const underline = (x1: number, yy: number, x2: number) => {
    doc.setLineWidth(0.3); doc.setDrawColor(60); doc.line(x1, yy, x2, yy); doc.setDrawColor(120); doc.setLineWidth(lw);
  };

  // Helper for text vertical center in row
  const textY = (rowY: number, rowH: number = rh) => rowY + rowH * 0.7;

  // ====== PAGE 1 ======

  // HDC Logo
  if (hdcB64) doc.addImage(hdcB64, 'PNG', m, y, 28, 10);
  // Inspection NO
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text(`INSPECTION NO: IR-${data.inspection_no ?? '____'}`, rx, y + 4, { align: 'right' });
  y += 12;

  // Form number
  doc.setFontSize(6.5); doc.text('PMD-2021-FRM-108 _ V 1.2', m, y); y += 5;

  // Title
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('REQUEST FOR INSPECTION', m, y);

  // HDC address right
  doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
  doc.text('Housing Development Corporation Limited', rx, y - 5, { align: 'right' });
  doc.text('HDC Building, Hulhumalé, Republic of Maldives', rx, y - 2, { align: 'right' });
  doc.text('Hotline 1516   T +960 335 3535', rx, y + 1, { align: 'right' });
  doc.text('E hello@hdc.mv  W www.hdc.mv', rx, y + 4, { align: 'right' });

  y += 3;
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text('Project Management Section', m, y); y += 3.5;
  doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text('PROJECT MANAGEMENT & DEVELOPMENT', m, y); y += 3;

  // Green line - thick
  doc.setDrawColor(green[0], green[1], green[2]); doc.setLineWidth(1.5);
  doc.line(m, y, rx, y); doc.setDrawColor(120); doc.setLineWidth(lw);
  y += 5;

  // ---- Project Details (58% width) ----
  const projW = cW * 0.58;
  fillBox(m, y, projW, rh, green);
  doc.setFontSize(fs); doc.setFont('helvetica', 'bold'); doc.setTextColor(255);
  doc.text('Project Details', m + 2, textY(y)); doc.setTextColor(0); y += rh;

  const projLabelW = 24;
  const projRows = [
    ['Project', PROJECT_INFO.project],
    ['Contractor', PROJECT_INFO.contractor],
    ['Contract No', PROJECT_INFO.contract_no],
    ['Client', PROJECT_INFO.client],
  ];
  projRows.forEach(([l, v]) => {
    box(m, y, projLabelW, rh); box(m + projLabelW, y, projW - projLabelW, rh);
    label(l, m + 1.5, textY(y)); val(v, m + projLabelW + 1.5, textY(y)); y += rh;
  });

  // BLT logo - right of Project Details, vertically centered against data rows
  if (bltB64) doc.addImage(bltB64, 'PNG', m + projW + 8, y - rh * 3, 44, 15);
  y += 3;

  // ---- Inspection Details ----
  fillBox(m, y, cW, rh, green);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(255); doc.setFontSize(fs);
  doc.text('Inspection Details', m + 2, textY(y)); doc.setTextColor(0); y += rh;

  const midX = m + cW * 0.5;
  const dateLabelW = 12;
  // Row 1: Ref Drawing | Date
  box(m, y, labelW, rh); box(m + labelW, y, midX - m - labelW, rh);
  box(midX, y, dateLabelW, rh); box(midX + dateLabelW, y, m + cW - midX - dateLabelW, rh);
  label('Ref. Drawing', m + 1.5, textY(y)); val(data.ref_drawing || '', m + labelW + 1.5, textY(y));
  label('Date', midX + 1.5, textY(y)); val(data.inspection_date || '', midX + dateLabelW + 1.5, textY(y)); y += rh;

  // Row 2: Work Site | Time
  box(m, y, labelW, rh); box(m + labelW, y, midX - m - labelW, rh);
  box(midX, y, dateLabelW, rh); box(midX + dateLabelW, y, m + cW - midX - dateLabelW, rh);
  label('Work Site', m + 1.5, textY(y)); val(data.work_site || '', m + labelW + 1.5, textY(y));
  label('Time', midX + 1.5, textY(y)); val(data.inspection_time || '', midX + dateLabelW + 1.5, textY(y)); y += rh;

  // Row 3: Location (full width)
  box(m, y, labelW, rh); box(m + labelW, y, cW - labelW, rh);
  label('Location', m + 1.5, textY(y)); val(data.location || '', m + labelW + 1.5, textY(y)); y += rh + 2;

  // ---- Received by [Client] ----
  const rcvH = 24;
  box(m, y, cW, rcvH);
  label('Received by [Client]', m + 2, y + 5);
  const ndy = y + 9;
  const nameFieldX = rcvX + 18;
  label('Name:', rcvX, ndy); underline(nameFieldX, ndy + 0.5, rx - 2);
  val(data.received_by_name || '', nameFieldX, ndy);
  label('Designation:', rcvX, ndy + 6); underline(nameFieldX, ndy + 6.5, rx - 2);
  val(data.received_by_designation || '', nameFieldX, ndy + 6);
  label('Date:', rcvX, ndy + 12); underline(nameFieldX, ndy + 12.5, rx - 2);
  val(data.received_by_date || '', nameFieldX, ndy + 12);
  y += rcvH + 2;

  // ---- Arrange Inspection for ----
  fillBox(m, y, cW, rh, green);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(255);
  doc.text('Arrange Inspection for:', m + 2, textY(y)); doc.setTextColor(0); y += rh;

  const items = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5];
  items.forEach((item, i) => {
    box(m, y, 6, rh); box(m + 6, y, cW - 6, rh);
    val(String(i + 1), m + 2, textY(y)); val(item || '', m + 7.5, textY(y)); y += rh;
  });

  // ---- Weather condition ----
  fillBox(m, y, cW, rh, green);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(255);
  doc.text('Weather condition:', m + 2, textY(y)); doc.setTextColor(0); y += rh;
  const weatherH = 12;
  box(m, y, cW, weatherH);
  val(data.weather_condition || '', m + 2, y + 5);
  y += weatherH + 2;

  // ---- Pre-Inspection checked by Contractor ----
  const preH = 24;
  box(m, y, cW, preH);
  label('Pre-Inspection checked by Contractor', m + 2, y + 5);
  const py = y + 9;
  label('Name:', rcvX, py); val(data.pre_inspection_name || '', nameFieldX, py); underline(nameFieldX, py + 0.5, rx - 2);
  label('Designation:', rcvX, py + 6); val(data.pre_inspection_designation || '', nameFieldX, py + 6); underline(nameFieldX, py + 6.5, rx - 2);
  label('Date:', rcvX, py + 12); val(data.pre_inspection_date || '', nameFieldX, py + 12); underline(nameFieldX, py + 12.5, rx - 2);
  y += preH + 2;

  // ---- Comments (URBANCO USE ONLY) ----
  // Green accent on left edge of amber bar
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(m, y, 1.2, rh, 'F');
  fillBox(m + 1.2, y, cW - 1.2, rh, amber);
  box(m, y, cW, rh);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(fs); doc.setTextColor(0);
  doc.text('Comments (URBANCO USE ONLY):', pageW / 2, textY(y), { align: 'center' }); y += rh;
  box(m, y, 38, rh); box(m + 38, y, cW - 38, rh);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
  doc.text('Relevant Sub-clause/Term', m + 1.5, textY(y)); y += rh;
  const commentBoxH = 16;
  box(m, y, cW, commentBoxH);
  doc.setFontSize(fs); val(data.comments || '', m + 2, y + 5);
  y += commentBoxH + 2;

  // ---- Client Representative ----
  const repH = 24;
  box(m, y, cW, repH);
  label('Client Representative', m + 2, y + 5);
  // vertical divider
  doc.setLineWidth(lw); doc.line(rcvX - 2, y, rcvX - 2, y + repH);
  doc.setFont('helvetica', 'italic'); doc.setTextColor(180); doc.setFontSize(8);
  doc.text('Signature', m + 20, y + 14); doc.setTextColor(0);
  const cy = y + 9;
  label('Name:', rcvX, cy); val(data.client_rep_name || '', nameFieldX, cy); underline(nameFieldX, cy + 0.5, rx - 2);
  label('Designation:', rcvX, cy + 6); val(data.client_rep_designation || '', nameFieldX, cy + 6); underline(nameFieldX, cy + 6.5, rx - 2);
  label('Date:', rcvX, cy + 12); val(data.client_rep_date || '', nameFieldX, cy + 12); underline(nameFieldX, cy + 12.5, rx - 2);
  y += repH + 1;

  // ---- Contractor Representative ----
  const contRepH = 20;
  box(m, y, cW, contRepH);
  label('Contractor Representative', m + 2, y + 5);
  const cty = y + 8;
  label('Name:', rcvX, cty); val(data.contractor_rep_name || '', nameFieldX, cty); underline(nameFieldX, cty + 0.5, rx - 2);
  label('Designation:', rcvX, cty + 6); val(data.contractor_rep_designation || '', nameFieldX, cty + 6); underline(nameFieldX, cty + 6.5, rx - 2);
  label('Date:', rcvX, cty + 12); val(data.contractor_rep_date || '', nameFieldX, cty + 12); underline(nameFieldX, cty + 12.5, rx - 2);

  // Page 1 footer
  doc.setFontSize(6); doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 2', rx, pageH - 8, { align: 'right' });

  // ====== PAGE 2 ======
  doc.addPage(); y = m;

  // Title - centered and underlined
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  const title = 'CHECKLIST FOR CLADDING INSTALLATION COMPLETION';
  doc.text(title, pageW / 2, y + 4, { align: 'center' });
  const tw = doc.getTextWidth(title);
  doc.setLineWidth(0.3); doc.setDrawColor(0);
  doc.line((pageW - tw) / 2, y + 5, (pageW + tw) / 2, y + 5);
  doc.setDrawColor(120); doc.setLineWidth(lw);

  // HDC logo top right
  if (hdcB64) doc.addImage(hdcB64, 'PNG', rx - 28, y - 2, 28, 10);
  y += 10;

  // Project info (left side, italic bold labels)
  doc.setFontSize(fs);
  const piLabelX = m + 8;
  const piValueX = m + 32;
  const piRows = [
    ['PROJECT:', PROJECT_INFO.project.toUpperCase()],
    ['CLIENT:', PROJECT_INFO.client.toUpperCase()],
    ['CONTRACTOR:', PROJECT_INFO.contractor.toUpperCase()],
    ['CONTRACT NO', PROJECT_INFO.contract_no],
  ];
  piRows.forEach(([l, v], i) => {
    doc.setFont('helvetica', 'bolditalic'); doc.setFontSize(fs);
    doc.text(l, piLabelX, y + i * 4.5, { align: 'left' });
    doc.setFont('helvetica', 'bold');
    doc.text(v, piValueX, y + i * 4.5);
  });

  // Inspection info table (right side)
  const tblX = rx - 50;
  const inspRows = [
    ['Inspection #:', `RFI-${data.inspection_no ?? ''}`],
    ['Date:', formatDatePdf(data.inspection_date)],
    ['Time:', data.inspection_time || ''],
    ['Location:', data.location || ''],
  ];
  inspRows.forEach(([l, v], i) => {
    const ry = y - 3 + i * rh;
    box(tblX, ry, 20, rh); box(tblX + 20, ry, 30, rh);
    label(l, tblX + 1, textY(ry));
    val(v, tblX + 21, textY(ry));
  });

  y += 20;

  // Checklist table
  const sym = (r: string) => r === 'pass' ? '✓' : r === 'fail' ? '✗' : r === 'na' ? 'N/A' : '';

  autoTable(doc, {
    startY: y,
    margin: { left: m, right: m },
    head: [['WORKS INSPECTED', '✓/✗/NA', 'COMMENTS']],
    body: data.checklist_items.map((item) => [item.description, sym(item.result), item.comments || '']),
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [120, 120, 120],
      lineWidth: lw,
      textColor: [0, 0, 0],
      minCellHeight: 6,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineColor: [120, 120, 120],
      lineWidth: 0.2,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 16, halign: 'center' },
      2: { cellWidth: 42 },
    },
    theme: 'grid',
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Comments on completed works
  box(m, y, cW, rh);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(fs);
  const commText = 'Comments on completed works:';
  doc.text(commText, m + 2, textY(y));
  // Underline the text
  const commTW = doc.getTextWidth(commText);
  doc.setLineWidth(0.2); doc.setDrawColor(0);
  doc.line(m + 2, textY(y) + 0.5, m + 2 + commTW, textY(y) + 0.5);
  doc.setDrawColor(120); doc.setLineWidth(lw);
  y += rh;

  const commentRowH = 4.5;
  for (let i = 0; i < 10; i++) {
    box(m, y, cW, commentRowH);
    if (i === 0 && data.completed_works_comments) {
      doc.setFontSize(7); val(data.completed_works_comments, m + 2, y + 3);
    }
    y += commentRowH;
  }
  y += 6;

  // Representatives side by side
  const halfW = cW / 2;
  box(m, y, halfW, rh); box(m + halfW, y, halfW, rh);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(fs);
  doc.text('Contractor Representative', m + halfW / 2, textY(y), { align: 'center' });
  doc.text('Client Representative', m + halfW + halfW / 2, textY(y), { align: 'center' });
  y += rh;

  const repLabels = ['Name:', 'Designation:', 'Signature:'];
  const cVals = [data.page2_contractor_name, data.page2_contractor_designation, ''];
  const clVals = [data.page2_client_name, data.page2_client_designation, ''];

  repLabels.forEach((rl, i) => {
    const rowH = i === 2 ? 8 : rh;
    box(m, y, halfW, rowH); box(m + halfW, y, halfW, rowH);
    label(rl, m + 2, textY(y, rowH)); val(cVals[i] || '', m + 24, textY(y, rowH));
    label(rl, m + halfW + 2, textY(y, rowH)); val(clVals[i] || '', m + halfW + 24, textY(y, rowH));
    y += rowH;
  });

  // Page 2 footer
  doc.setFontSize(6); doc.setFont('helvetica', 'normal');
  doc.text('Page 2 of 2', rx, pageH - 8, { align: 'right' });

  doc.save(`RFI-IR-${data.inspection_no ?? 'draft'}.pdf`);
}
