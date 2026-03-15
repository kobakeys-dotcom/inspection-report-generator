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
  const lw = 0.15; // line weight (thin)
  const green: [number, number, number] = [76, 175, 80];
  const amber: [number, number, number] = [245, 194, 66];
  const rh = 4.5; // row height
  const fs = 7.5; // font size
  const rcvX = pageW / 2; // right column X
  const labelW = 22; // label column width

  doc.setLineWidth(lw);
  doc.setDrawColor(120);

  let hdcB64: string | null = null;
  let bltB64: string | null = null;
  try { const m = await import('@/assets/hdc-logo.png'); hdcB64 = await loadImageAsBase64(m.default); } catch {}
  try { const m = await import('@/assets/blt-logo.png'); bltB64 = await loadImageAsBase64(m.default); } catch {}

  const box = (x: number, y: number, w: number, h: number) => { doc.setLineWidth(lw); doc.setDrawColor(120); doc.rect(x, y, w, h); };
  const fillBox = (x: number, y: number, w: number, h: number, c: [number, number, number]) => { doc.setFillColor(c[0], c[1], c[2]); doc.rect(x, y, w, h, 'F'); box(x, y, w, h); };
  const label = (text: string, x: number, y: number) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(fs); doc.text(text, x, y); };
  const val = (text: string, x: number, y: number) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(fs); doc.text(text, x, y); };
  const underline = (x1: number, y1: number, x2: number) => { doc.setLineWidth(0.2); doc.setDrawColor(60); doc.line(x1, y1, x2, y1); doc.setDrawColor(120); };

  // ====== PAGE 1 ======

  // HDC Logo
  if (hdcB64) doc.addImage(hdcB64, 'PNG', m, y, 28, 10);
  // Inspection NO
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text(`INSPECTION NO: IR-${data.inspection_no ?? '____'}`, pageW - m, y + 4, { align: 'right' });
  y += 12;

  // Form number
  doc.setFontSize(6.5); doc.text('PMD-2021-FRM-108 _ V 1.2', m, y); y += 4;

  // Title
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text('REQUEST FOR INSPECTION', m, y);

  // HDC address right
  doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
  const rx = pageW - m;
  doc.text('Housing Development Corporation Limited', rx, y - 4, { align: 'right' });
  doc.text('HDC Building, Hulhumalé, Republic of Maldives', rx, y - 1, { align: 'right' });
  doc.text('Hotline 1516   T +960 335 3535', rx, y + 2, { align: 'right' });
  doc.text('E hello@hdc.mv  W www.hdc.mv', rx, y + 5, { align: 'right' });

  y += 3;
  doc.setFontSize(7); doc.text('Project Management Section', m, y); y += 3;
  doc.setFontSize(6.5); doc.text('PROJECT MANAGEMENT & DEVELOPMENT', m, y); y += 2;

  // Green line
  doc.setDrawColor(green[0], green[1], green[2]); doc.setLineWidth(1.2);
  doc.line(m, y, pageW - m, y); doc.setDrawColor(120); doc.setLineWidth(lw);
  y += 4;

  // Project Details (60% width)
  const projW = cW * 0.6;
  fillBox(m, y, projW, rh, green);
  doc.setFontSize(fs); doc.setFont('helvetica', 'bold'); doc.setTextColor(255);
  doc.text('Project Details', m + 2, y + 3.2); doc.setTextColor(0); y += rh;

  const projRows = [['Project', PROJECT_INFO.project], ['Contractor', PROJECT_INFO.contractor], ['Contract No', PROJECT_INFO.contract_no], ['Client', PROJECT_INFO.client]];
  projRows.forEach(([l, v]) => {
    box(m, y, labelW, rh); box(m + labelW, y, projW - labelW, rh);
    label(l, m + 1.5, y + 3.2); val(v, m + labelW + 1.5, y + 3.2); y += rh;
  });

  // BLT logo
  if (bltB64) doc.addImage(bltB64, 'PNG', m + projW + 10, y - rh * 3.5, 38, 13);
  y += 3;

  // Inspection Details
  fillBox(m, y, cW, rh, green);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(255); doc.setFontSize(fs);
  doc.text('Inspection Details', m + 2, y + 3.2); doc.setTextColor(0); y += rh;

  const midX = m + cW * 0.5;
  // Row 1
  box(m, y, labelW, rh); box(m + labelW, y, midX - m - labelW, rh);
  box(midX, y, 12, rh); box(midX + 12, y, m + cW - midX - 12, rh);
  label('Ref. Drawing', m + 1.5, y + 3.2); val(data.ref_drawing || '', m + labelW + 1.5, y + 3.2);
  label('Date', midX + 1.5, y + 3.2); val(data.inspection_date || '', midX + 13.5, y + 3.2); y += rh;

  // Row 2
  box(m, y, labelW, rh); box(m + labelW, y, midX - m - labelW, rh);
  box(midX, y, 12, rh); box(midX + 12, y, m + cW - midX - 12, rh);
  label('Work Site', m + 1.5, y + 3.2); val(data.work_site || '', m + labelW + 1.5, y + 3.2);
  label('Time', midX + 1.5, y + 3.2); val(data.inspection_time || '', midX + 13.5, y + 3.2); y += rh;

  // Row 3
  box(m, y, labelW, rh); box(m + labelW, y, cW - labelW, rh);
  label('Location', m + 1.5, y + 3.2); val(data.location || '', m + labelW + 1.5, y + 3.2); y += rh + 1;

  // Received by [Client]
  const rcvH = 22;
  box(m, y, cW, rcvH);
  label('Received by [Client]', m + 2, y + 4);
  const ndy = y + 8;
  label('Name:', rcvX, ndy); underline(rcvX + 18, ndy + 0.5, rx - 2);
  val(data.received_by_name || '', rcvX + 18, ndy);
  label('Designation:', rcvX, ndy + 6); underline(rcvX + 18, ndy + 6.5, rx - 2);
  val(data.received_by_designation || '', rcvX + 18, ndy + 6);
  label('Date:', rcvX, ndy + 12); underline(rcvX + 18, ndy + 12.5, rx - 2);
  val(data.received_by_date || '', rcvX + 18, ndy + 12);
  y += rcvH + 2;

  // Arrange Inspection for
  fillBox(m, y, cW, rh, green);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(255);
  doc.text('Arrange Inspection for:', m + 2, y + 3.2); doc.setTextColor(0); y += rh;

  const items = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5];
  items.forEach((item, i) => {
    box(m, y, 6, rh); box(m + 6, y, cW - 6, rh);
    val(String(i + 1), m + 2, y + 3.2); val(item || '', m + 7.5, y + 3.2); y += rh;
  });

  // Weather condition
  fillBox(m, y, cW, rh, green);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(255);
  doc.text('Weather condition:', m + 2, y + 3.2); doc.setTextColor(0); y += rh;
  box(m, y, cW, 8); val(data.weather_condition || '', m + 2, y + 4); y += 10;

  // Pre-Inspection
  const preH = 22;
  box(m, y, cW, preH);
  label('Pre-Inspection checked by Contractor', m + 2, y + 4);
  const py = y + 8;
  label('Name:', rcvX, py); val(data.pre_inspection_name || '', rcvX + 18, py); underline(rcvX + 18, py + 0.5, rx - 2);
  label('Designation:', rcvX, py + 6); val(data.pre_inspection_designation || '', rcvX + 18, py + 6); underline(rcvX + 18, py + 6.5, rx - 2);
  label('Date:', rcvX, py + 12); val(data.pre_inspection_date || '', rcvX + 18, py + 12); underline(rcvX + 18, py + 12.5, rx - 2);
  y += preH + 1;

  // Comments (URBANCO)
  fillBox(m, y, cW, rh, amber);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(fs); doc.setTextColor(0);
  doc.text('Comments (URBANCO USE ONLY):', pageW / 2, y + 3.2, { align: 'center' }); y += rh;
  box(m, y, 38, rh); box(m + 38, y, cW - 38, rh);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
  doc.text('Relevant Sub-clause/Term', m + 1.5, y + 3); y += rh;
  box(m, y, cW, 14);
  doc.setFontSize(fs); val(data.comments || '', m + 2, y + 4);
  y += 16;

  // Client Representative
  const repH = 22;
  box(m, y, cW, repH);
  label('Client Representative', m + 2, y + 4);
  // vertical divider
  doc.line(rcvX - 2, y, rcvX - 2, y + repH);
  doc.setFont('helvetica', 'italic'); doc.setTextColor(180); doc.setFontSize(8);
  doc.text('Signature', m + 18, y + 13); doc.setTextColor(0);
  const cy = y + 8;
  label('Name:', rcvX, cy); val(data.client_rep_name || '', rcvX + 18, cy); underline(rcvX + 18, cy + 0.5, rx - 2);
  label('Designation:', rcvX, cy + 6); val(data.client_rep_designation || '', rcvX + 18, cy + 6); underline(rcvX + 18, cy + 6.5, rx - 2);
  label('Date:', rcvX, cy + 12); val(data.client_rep_date || '', rcvX + 18, cy + 12); underline(rcvX + 18, cy + 12.5, rx - 2);
  y += repH + 1;

  // Contractor Representative
  box(m, y, cW, 18);
  label('Contractor Representative', m + 2, y + 4);
  const cty = y + 7;
  label('Name:', rcvX, cty); val(data.contractor_rep_name || '', rcvX + 18, cty); underline(rcvX + 18, cty + 0.5, rx - 2);
  label('Designation:', rcvX, cty + 6); val(data.contractor_rep_designation || '', rcvX + 18, cty + 6); underline(rcvX + 18, cty + 6.5, rx - 2);
  label('Date:', rcvX, cty + 12); val(data.contractor_rep_date || '', rcvX + 18, cty + 12); underline(rcvX + 18, cty + 12.5, rx - 2);

  // Page 1 footer
  doc.setFontSize(6); doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 2', pageW - m, pageH - 8, { align: 'right' });

  // ====== PAGE 2 ======
  doc.addPage(); y = m;

  // Title
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  const title = 'CHECKLIST FOR CLADDING INSTALLATION COMPLETION';
  doc.text(title, pageW / 2, y + 4, { align: 'center' });
  const tw = doc.getTextWidth(title);
  doc.setLineWidth(0.3); doc.setDrawColor(0);
  doc.line((pageW - tw) / 2, y + 5, (pageW + tw) / 2, y + 5);
  doc.setDrawColor(120); doc.setLineWidth(lw);

  // HDC logo
  if (hdcB64) doc.addImage(hdcB64, 'PNG', pageW - m - 28, y - 2, 28, 10);
  y += 10;

  // Project info
  doc.setFontSize(fs);
  const piX = m + 8; const piVX = m + 32;
  const piRows = [
    ['PROJECT:', PROJECT_INFO.project.toUpperCase()],
    ['CLIENT:', PROJECT_INFO.client.toUpperCase()],
    ['CONTRACTOR:', PROJECT_INFO.contractor.toUpperCase()],
    ['CONTRACT NO', PROJECT_INFO.contract_no],
  ];
  piRows.forEach(([l, v], i) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(fs);
    doc.text(l, piX, y + i * 4, { align: 'left' });
    doc.text(v, piVX, y + i * 4);
  });

  // Inspection table
  const tblX = pageW - m - 50;
  const inspRows = [
    ['Inspection #:', `RFI-${data.inspection_no ?? ''}`],
    ['Date:', formatDatePdf(data.inspection_date)],
    ['Time:', data.inspection_time || ''],
    ['Location:', data.location || ''],
  ];
  inspRows.forEach(([l, v], i) => {
    box(tblX, y - 3 + i * rh, 20, rh); box(tblX + 20, y - 3 + i * rh, 30, rh);
    label(l, tblX + 1, y - 3 + i * rh + 3.2);
    val(v, tblX + 21, y - 3 + i * rh + 3.2);
  });

  y += 18;

  // Checklist table
  const sym = (r: string) => r === 'pass' ? '✓' : r === 'fail' ? '✗' : r === 'na' ? 'N/A' : '';

  autoTable(doc, {
    startY: y,
    margin: { left: m, right: m },
    head: [['WORKS INSPECTED', '✓/✗/NA', 'COMMENTS']],
    body: data.checklist_items.map((item) => [item.description, sym(item.result), item.comments || '']),
    styles: { fontSize: 6.5, cellPadding: 1.5, lineColor: [120, 120, 120], lineWidth: lw, textColor: [0, 0, 0] },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [120, 120, 120], lineWidth: 0.2 },
    columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 16, halign: 'center' }, 2: { cellWidth: 42 } },
    theme: 'grid',
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  // Comments on completed works
  box(m, y, cW, rh);
  label('Comments on completed works:', m + 2, y + 3.2); y += rh;
  for (let i = 0; i < 10; i++) {
    box(m, y, cW, 3.5);
    if (i === 0 && data.completed_works_comments) {
      doc.setFontSize(6.5); val(data.completed_works_comments, m + 2, y + 2.5);
    }
    y += 3.5;
  }
  y += 4;

  // Representatives
  const halfW = cW / 2;
  box(m, y, halfW, rh); box(m + halfW, y, halfW, rh);
  label('Contractor Representative', m + halfW / 2, y + 3.2); doc.text('Contractor Representative', m + halfW / 2, y + 3.2, { align: 'center' });
  label('Client Representative', m + halfW + halfW / 2, y + 3.2); doc.text('Client Representative', m + halfW + halfW / 2, y + 3.2, { align: 'center' });
  y += rh;

  const repLabels = ['Name:', 'Designation:', 'Signature:'];
  const cVals = [data.page2_contractor_name, data.page2_contractor_designation, ''];
  const clVals = [data.page2_client_name, data.page2_client_designation, ''];

  repLabels.forEach((rl, i) => {
    const rH = i === 2 ? 6 : rh;
    box(m, y, halfW, rH); box(m + halfW, y, halfW, rH);
    label(rl, m + 2, y + 3.2); val(cVals[i] || '', m + 22, y + 3.2);
    label(rl, m + halfW + 2, y + 3.2); val(clVals[i] || '', m + halfW + 22, y + 3.2);
    y += rH;
  });

  // Page 2 footer
  doc.setFontSize(6); doc.setFont('helvetica', 'normal');
  doc.text('Page 2 of 2', pageW - m, pageH - 8, { align: 'right' });

  doc.save(`RFI-IR-${data.inspection_no ?? 'draft'}.pdf`);
}
