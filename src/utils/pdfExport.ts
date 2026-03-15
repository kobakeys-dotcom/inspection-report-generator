import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RfiFormData, PROJECT_INFO } from '@/types/rfi';

// Helper to load image as base64
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

export async function generateRfiPdf(data: RfiFormData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Load logos
  let hdcLogoBase64: string | null = null;
  let bltLogoBase64: string | null = null;
  try {
    const hdcModule = await import('@/assets/hdc-logo.png');
    hdcLogoBase64 = await loadImageAsBase64(hdcModule.default);
  } catch {}
  try {
    const bltModule = await import('@/assets/blt-logo.png');
    bltLogoBase64 = await loadImageAsBase64(bltModule.default);
  } catch {}

  const green = [76, 175, 80] as const;
  const drawBox = (x: number, y: number, w: number, h: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h);
  };

  // ====== PAGE 1 ======
  
  // HDC Logo top-left
  if (hdcLogoBase64) {
    doc.addImage(hdcLogoBase64, 'PNG', margin, y, 30, 12);
  }

  // Inspection NO top-right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`INSPECTION NO: IR-${data.inspection_no ?? '____'}`, pageW - margin, y + 5, { align: 'right' });

  y += 14;

  // Form number
  doc.setFontSize(7);
  doc.text('PMD-2021-FRM-108 _ V 1.2', margin, y);
  y += 5;

  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REQUEST FOR INSPECTION', margin, y);

  // HDC info right
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const rightX = pageW - margin;
  doc.text('Housing Development Corporation Limited', rightX, y - 3, { align: 'right' });
  doc.text('HDC Building, Hulhumalé, Republic of Maldives', rightX, y, { align: 'right' });
  doc.text('Hotline 1516   T +960 335 3535', rightX, y + 3, { align: 'right' });
  doc.text('E hello@hdc.mv  W www.hdc.mv', rightX, y + 6, { align: 'right' });

  y += 4;
  doc.setFontSize(8);
  doc.text('Project Management Section', margin, y);
  y += 3.5;
  doc.text('PROJECT MANAGEMENT & DEVELOPMENT', margin, y);
  y += 3;

  // Green line
  doc.setDrawColor(green[0], green[1], green[2]);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageW - margin, y);
  doc.setDrawColor(0);
  y += 4;

  // Project Details
  const projStartY = y;
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(margin, y, contentW * 0.65, 5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255);
  doc.text('Project Details', margin + 2, y + 3.5);
  doc.setTextColor(0);
  y += 5;

  const projData = [
    ['Project', PROJECT_INFO.project],
    ['Contractor', PROJECT_INFO.contractor],
    ['Contract No', PROJECT_INFO.contract_no],
    ['Client', PROJECT_INFO.client],
  ];

  doc.setFontSize(8);
  projData.forEach(([label, val]) => {
    drawBox(margin, y, 25, 5);
    drawBox(margin + 25, y, contentW * 0.65 - 25, 5);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 1, y + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.text(val, margin + 26, y + 3.5);
    y += 5;
  });

  // BLT logo to the right of project details
  if (bltLogoBase64) {
    doc.addImage(bltLogoBase64, 'PNG', margin + contentW * 0.7, projStartY + 4, 35, 14);
  }

  y += 2;

  // Inspection Details
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(margin, y, contentW, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255);
  doc.text('Inspection Details', margin + 2, y + 3.5);
  doc.setTextColor(0);
  y += 5;

  // Row 1: Ref Drawing + Date
  drawBox(margin, y, 25, 5);
  drawBox(margin + 25, y, contentW * 0.45 - 25, 5);
  drawBox(margin + contentW * 0.45, y, 15, 5);
  drawBox(margin + contentW * 0.45 + 15, y, contentW * 0.55 - 15, 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Ref. Drawing', margin + 1, y + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.ref_drawing || '', margin + 26, y + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', margin + contentW * 0.45 + 1, y + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.inspection_date || '', margin + contentW * 0.45 + 16, y + 3.5);
  y += 5;

  // Row 2: Work Site + Time
  drawBox(margin, y, 25, 5);
  drawBox(margin + 25, y, contentW * 0.45 - 25, 5);
  drawBox(margin + contentW * 0.45, y, 15, 5);
  drawBox(margin + contentW * 0.45 + 15, y, contentW * 0.55 - 15, 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Work Site', margin + 1, y + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.work_site || '', margin + 26, y + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Time', margin + contentW * 0.45 + 1, y + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.inspection_time || '', margin + contentW * 0.45 + 16, y + 3.5);
  y += 5;

  // Row 3: Location
  drawBox(margin, y, 25, 5);
  drawBox(margin + 25, y, contentW - 25, 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Location', margin + 1, y + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.location || '', margin + 26, y + 3.5);
  y += 7;

  // Received by [Client]
  drawBox(margin, y, contentW, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Received by [Client]', margin + 2, y + 4);
  const rcvX = pageW / 2;
  doc.text('Name:', rcvX, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.received_by_name || '', rcvX + 22, y + 8);
  doc.line(rcvX + 22, y + 9, pageW - margin - 3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.received_by_designation || '', rcvX + 22, y + 13);
  doc.line(rcvX + 22, y + 14, pageW - margin - 3, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(data.received_by_date || '', rcvX + 22, y + 18);
  doc.line(rcvX + 22, y + 19, pageW - margin - 3, y + 19);
  y += 22;

  // Arrange Inspection for
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(margin, y, contentW, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255);
  doc.text('Arrange Inspection for:', margin + 2, y + 3.5);
  doc.setTextColor(0);
  y += 5;

  const inspItems = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5];
  inspItems.forEach((item, i) => {
    drawBox(margin, y, 6, 5);
    drawBox(margin + 6, y, contentW - 6, 5);
    doc.setFont('helvetica', 'normal');
    doc.text(String(i + 1), margin + 2, y + 3.5);
    doc.text(item || '', margin + 8, y + 3.5);
    y += 5;
  });

  // Weather condition
  doc.setFillColor(green[0], green[1], green[2]);
  doc.rect(margin, y, contentW, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255);
  doc.text('Weather condition:', margin + 2, y + 3.5);
  doc.setTextColor(0);
  y += 5;
  drawBox(margin, y, contentW, 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.weather_condition || '', margin + 2, y + 4);
  y += 10;

  // Pre-Inspection checked by Contractor
  drawBox(margin, y, contentW, 20);
  doc.setFont('helvetica', 'bold');
  doc.text('Pre-Inspection checked by Contractor', margin + 2, y + 4);
  doc.text('Name:', rcvX, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.pre_inspection_name || '', rcvX + 22, y + 8);
  doc.line(rcvX + 22, y + 9, pageW - margin - 3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.pre_inspection_designation || '', rcvX + 22, y + 13);
  doc.line(rcvX + 22, y + 14, pageW - margin - 3, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(data.pre_inspection_date || '', rcvX + 22, y + 18);
  doc.line(rcvX + 22, y + 19, pageW - margin - 3, y + 19);
  y += 22;

  // Comments (URBANCO USE ONLY)
  doc.setFillColor(255, 205, 210);
  doc.rect(margin, y, contentW, 5, 'F');
  drawBox(margin, y, contentW, 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Comments (URBANCO USE ONLY):', pageW / 2, y + 3.5, { align: 'center' });
  y += 5;
  drawBox(margin, y, 40, 5);
  drawBox(margin + 40, y, contentW - 40, 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Relevant Sub-clause/Term', margin + 1, y + 3.5);
  y += 5;
  drawBox(margin, y, contentW, 15);
  doc.text(data.comments || '', margin + 2, y + 4, { maxWidth: contentW - 4 });
  y += 17;

  // Client Representative
  drawBox(margin, y, contentW, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Client Representative', margin + 2, y + 4);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(180);
  doc.text('Signature', margin + 20, y + 12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', rcvX, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.client_rep_name || '', rcvX + 22, y + 8);
  doc.line(rcvX + 22, y + 9, pageW - margin - 3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.client_rep_designation || '', rcvX + 22, y + 13);
  doc.line(rcvX + 22, y + 14, pageW - margin - 3, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(data.client_rep_date || '', rcvX + 22, y + 18);
  doc.line(rcvX + 22, y + 19, pageW - margin - 3, y + 19);
  y += 22;

  // Contractor Representative
  drawBox(margin, y, contentW, 18);
  doc.setFont('helvetica', 'bold');
  doc.text('Contractor Representative', margin + 2, y + 4);
  doc.text('Name:', rcvX, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractor_rep_name || '', rcvX + 22, y + 8);
  doc.line(rcvX + 22, y + 9, pageW - margin - 3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractor_rep_designation || '', rcvX + 22, y + 13);
  doc.line(rcvX + 22, y + 14, pageW - margin - 3, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractor_rep_date || '', rcvX + 22, y + 17);

  // Page 1 footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 2', pageW - margin, pageH - 10, { align: 'right' });

  // ====== PAGE 2 ======
  doc.addPage();
  y = margin;

  // Title
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CHECKLIST FOR CLADDING INSTALLATION COMPLETION', pageW / 2, y + 4, { align: 'center' });
  doc.setLineWidth(0.3);
  const titleW = doc.getTextWidth('CHECKLIST FOR CLADDING INSTALLATION COMPLETION');
  doc.line((pageW - titleW) / 2, y + 5, (pageW + titleW) / 2, y + 5);

  // HDC logo top right
  if (hdcLogoBase64) {
    doc.addImage(hdcLogoBase64, 'PNG', pageW - margin - 30, y - 2, 30, 12);
  }
  y += 10;

  // Project info
  doc.setFontSize(8);
  const p2LblX = margin + 5;
  const p2ValX = margin + 30;
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT:', p2LblX, y);
  doc.text(PROJECT_INFO.project.toUpperCase(), p2ValX, y);
  y += 4;
  doc.text('CLIENT:', p2LblX, y);
  doc.text(PROJECT_INFO.client.toUpperCase(), p2ValX, y);
  y += 4;
  doc.text('CONTRACTOR:', p2LblX, y);
  doc.text(PROJECT_INFO.contractor.toUpperCase(), p2ValX, y);

  // Inspection # table on right
  const tblX = pageW - margin - 55;
  doc.setFont('helvetica', 'bold');
  drawBox(tblX, y - 7, 25, 5);
  drawBox(tblX + 25, y - 7, 30, 5);
  doc.text('Inspection #:', tblX + 1, y - 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`RFI-${data.inspection_no ?? ''}`, tblX + 26, y - 4);

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRACT NO', p2LblX, y);
  doc.text(PROJECT_INFO.contract_no, p2ValX, y);

  // Date/Time/Location table
  const dtRows = [
    ['Date:', formatDatePdf(data.inspection_date)],
    ['Time:', data.inspection_time || ''],
    ['Location:', data.location || ''],
  ];
  let dtY = y - 8 + 5;
  dtRows.forEach(([label, val]) => {
    drawBox(tblX, dtY, 25, 5);
    drawBox(tblX + 25, dtY, 30, 5);
    doc.setFont('helvetica', 'bold');
    doc.text(label, tblX + 1, dtY + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.text(val, tblX + 26, dtY + 3.5);
    dtY += 5;
  });

  y += 8;

  // Checklist table
  const resultSymbol = (r: string) => {
    if (r === 'pass') return '✓';
    if (r === 'fail') return '✗';
    if (r === 'na') return 'N/A';
    return '';
  };

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['WORKS INSPECTED', '✓/✗/NA', 'COMMENTS']],
    body: data.checklist_items.map((item) => [
      item.description,
      resultSymbol(item.result),
      item.comments || '',
    ]),
    styles: { fontSize: 7, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 45 },
    },
    theme: 'grid',
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  // Comments on completed works
  drawBox(margin, y, contentW, 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Comments on completed works:', margin + 2, y + 3.5);
  y += 5;

  // Empty lined rows
  for (let i = 0; i < 10; i++) {
    drawBox(margin, y, contentW, 4);
    if (i === 0 && data.completed_works_comments) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(data.completed_works_comments, margin + 2, y + 3);
    }
    y += 4;
  }
  y += 4;

  // Representatives side by side
  const halfW = contentW / 2;

  // Contractor Rep
  drawBox(margin, y, halfW, 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Contractor Representative', margin + halfW / 2, y + 3.5, { align: 'center' });

  // Client Rep
  drawBox(margin + halfW, y, halfW, 5);
  doc.text('Client Representative', margin + halfW + halfW / 2, y + 3.5, { align: 'center' });
  y += 5;

  // Name rows
  const repRows = [
    ['Name:', data.page2_contractor_name, 'Name:', data.page2_client_name],
    ['Designation:', data.page2_contractor_designation, 'Designation:', data.page2_client_designation],
    ['Signature:', '', 'Signature:', ''],
  ];

  repRows.forEach(([lbl1, val1, lbl2, val2]) => {
    drawBox(margin, y, 25, 5);
    drawBox(margin + 25, y, halfW - 25, 5);
    drawBox(margin + halfW, y, 25, 5);
    drawBox(margin + halfW + 25, y, halfW - 25, 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(lbl1, margin + 1, y + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.text(val1 || '', margin + 26, y + 3.5);

    doc.setFont('helvetica', 'bold');
    doc.text(lbl2, margin + halfW + 1, y + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.text(val2 || '', margin + halfW + 26, y + 3.5);
    y += 5;
  });

  // Page 2 footer
  doc.setFontSize(7);
  doc.text('Page 2 of 2', pageW - margin, pageH - 10, { align: 'right' });

  doc.save(`RFI-IR-${data.inspection_no ?? 'draft'}.pdf`);
}

function formatDatePdf(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}
