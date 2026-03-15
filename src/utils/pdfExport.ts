import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RfiFormData, PROJECT_INFO } from '@/types/rfi';

export function generateRfiPdf(data: RfiFormData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 12;
  const contentW = pageW - margin * 2;
  let y = margin;

  const drawLine = (y1: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(margin, y1, pageW - margin, y1);
  };

  const drawBox = (x: number, y: number, w: number, h: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h);
  };

  // ====== PAGE 1 ======
  // Header bar
  drawBox(margin, y, contentW, 8);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.form_number, margin + 2, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(`INSPECTION NO: IR-${data.inspection_no ?? '____'}`, pageW - margin - 2, y + 5, { align: 'right' });
  y += 8;

  // Title + HDC info
  drawBox(margin, y, contentW, 18);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('REQUEST FOR INSPECTION', margin + 3, y + 7);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Project Management Section', margin + 3, y + 11);
  doc.text('PROJECT MANAGEMENT & DEVELOPMENT', margin + 3, y + 15);

  // HDC info right
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('Housing Development Corporation Limited', pageW - margin - 3, y + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('HDC Building, Hulhumalé, Republic of Maldives', pageW - margin - 3, y + 8, { align: 'right' });
  doc.text('Hotline 1516 T +960 335 3535', pageW - margin - 3, y + 11, { align: 'right' });
  doc.text('E hello@hdc.mv W www.hdc.mv', pageW - margin - 3, y + 14, { align: 'right' });
  y += 18;

  // Project Details
  drawBox(margin, y, contentW, 28);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Details', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const projY = y + 9;
  const labelX = margin + 3;
  const valX = margin + 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Project', labelX, projY);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.project, valX, projY);
  doc.setFont('helvetica', 'bold');
  doc.text('Contractor', labelX, projY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.contractor, valX, projY + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Contract No', labelX, projY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.contract_no, valX, projY + 10);
  doc.setFont('helvetica', 'bold');
  doc.text('Client', labelX, projY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.client, valX, projY + 15);
  y += 28;

  // Inspection Details
  drawBox(margin, y, contentW, 22);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Inspection Details', margin + 3, y + 5);
  doc.setFontSize(7);
  const detY = y + 9;
  doc.setFont('helvetica', 'bold');
  doc.text('Ref. Drawing', labelX, detY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.ref_drawing || '', valX, detY);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', pageW / 2 + 10, detY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.inspection_date || '', pageW / 2 + 25, detY);

  doc.setFont('helvetica', 'bold');
  doc.text('Work Site', labelX, detY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.work_site || '', valX, detY + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Time', pageW / 2 + 10, detY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.inspection_time || '', pageW / 2 + 25, detY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Location', labelX, detY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.location || '', valX, detY + 10);
  y += 22;

  // Received by Client
  drawBox(margin, y, contentW, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Received by [Client]', margin + 3, y + 5);
  doc.setFontSize(7);
  const rcvX = pageW / 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', rcvX, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.received_by_name || '', rcvX + 22, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.received_by_designation || '', rcvX + 22, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(data.received_by_date || '', rcvX + 22, y + 17);
  y += 18;

  // Arrange Inspection for
  const items = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5].filter(Boolean);
  const insH = 6 + Math.max(items.length, 1) * 5 + 2;
  drawBox(margin, y, contentW, insH);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Arrange Inspection for:', margin + 3, y + 5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5].forEach((item, i) => {
    if (item) doc.text(`${i + 1}. ${item}`, margin + 5, y + 10 + i * 5);
  });
  y += insH;

  // Weather
  drawBox(margin, y, contentW, 8);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Weather condition:', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.weather_condition || '', margin + 38, y + 5);
  y += 8;

  // Pre-Inspection
  drawBox(margin, y, contentW, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Pre-Inspection checked by Contractor', margin + 3, y + 5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', rcvX, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.pre_inspection_name || '', rcvX + 22, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.pre_inspection_designation || '', rcvX + 22, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(data.pre_inspection_date || '', rcvX + 22, y + 17);
  y += 18;

  // Comments
  drawBox(margin, y, contentW, 22);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 0, 0);
  doc.text('Comments (URBANCO USE ONLY):', margin + 3, y + 5);
  doc.setTextColor(0);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Relevant Sub-clause/Term', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.relevant_subclause || '', margin + 3, y + 14, { maxWidth: contentW - 6 });
  doc.text(data.comments || '', margin + 3, y + 18, { maxWidth: contentW - 6 });
  y += 22;

  // Client Rep
  drawBox(margin, y, contentW, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Representative', margin + 3, y + 5);
  doc.setFontSize(7);
  doc.text('Signature', margin + 3, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', rcvX, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.client_rep_name || '', rcvX + 22, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.client_rep_designation || '', rcvX + 22, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(data.client_rep_date || '', rcvX + 22, y + 17);
  y += 18;

  // Contractor Rep
  drawBox(margin, y, contentW, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Contractor Representative', margin + 3, y + 5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', rcvX, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractor_rep_name || '', rcvX + 22, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rcvX, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractor_rep_designation || '', rcvX + 22, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rcvX, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractor_rep_date || '', rcvX + 22, y + 17);

  // ====== PAGE 2 ======
  doc.addPage();
  y = margin;

  // Title
  drawBox(margin, y, contentW, 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CHECKLIST FOR CLADDING INSTALLATION COMPLETION', pageW / 2, y + 5.5, { align: 'center' });
  y += 8;

  // Project info block
  drawBox(margin, y, contentW, 28);
  doc.setFontSize(7);
  const p2Y = y + 4;
  const p2ValX = margin + 30;
  const p2RightLblX = pageW / 2 + 20;
  const p2RightValX = pageW / 2 + 45;

  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT:', labelX, p2Y);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.project.toUpperCase(), p2ValX, p2Y);

  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT:', labelX, p2Y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.client.toUpperCase(), p2ValX, p2Y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('CONTRACTOR:', labelX, p2Y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.contractor.toUpperCase(), p2ValX, p2Y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('CONTRACT NO:', labelX, p2Y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(PROJECT_INFO.contract_no, p2ValX, p2Y + 15);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Inspection #:', p2RightLblX, p2Y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`RFI-${data.inspection_no ?? ''}`, p2RightValX, p2Y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', p2RightLblX, p2Y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(data.inspection_date || '', p2RightValX, p2Y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Time:', p2RightLblX, p2Y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(data.inspection_time || '', p2RightValX, p2Y + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Location:', p2RightLblX, p2Y + 25 - 1);
  doc.setFont('helvetica', 'normal');
  doc.text(data.location || '', p2RightValX, p2Y + 25 - 1);
  y += 28;

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
    head: [['#', 'WORKS INSPECTED', '✓/✗/NA', 'COMMENTS']],
    body: data.checklist_items.map((item) => [
      String(item.item_order),
      item.description,
      resultSymbol(item.result),
      item.comments || '',
    ]),
    styles: { fontSize: 6.5, cellPadding: 2 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 40 },
    },
    theme: 'grid',
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  // Comments on completed works
  drawBox(margin, y, contentW, 30);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Comments on completed works:', margin + 3, y + 5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(data.completed_works_comments || '', contentW - 6);
  doc.text(lines, margin + 3, y + 10);
  y += 30;

  // Representatives
  drawBox(margin, y, contentW / 2, 18);
  drawBox(margin + contentW / 2, y, contentW / 2, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Contractor Representative', margin + 3, y + 5);
  doc.text('Client Representative', margin + contentW / 2 + 3, y + 5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.page2_contractor_name || '', margin + 22, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', margin + 3, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.page2_contractor_designation || '', margin + 22, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature:', margin + 3, y + 18 - 1);

  const rX = margin + contentW / 2 + 3;
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', rX, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.page2_client_name || '', rX + 19, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation:', rX, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.page2_client_designation || '', rX + 19, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature:', rX, y + 18 - 1);

  doc.save(`RFI-IR-${data.inspection_no ?? 'draft'}.pdf`);
}
