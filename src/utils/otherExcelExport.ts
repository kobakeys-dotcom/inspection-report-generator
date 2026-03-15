import ExcelJS from 'exceljs';
import { OtherRfiFormData } from '@/types/otherRfi';

function formatDateDMY(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export async function generateOtherRfiExcel(data: OtherRfiFormData) {
  const workbook = new ExcelJS.Workbook();
  const response = await fetch('/RFI-Other.xlsx');
  const buffer = await response.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const ws = workbook.worksheets[0];
  if (!ws) throw new Error('Worksheet not found');

  const setCell = (row: number, col: number, value: string | number) => {
    ws.getRow(row).getCell(col).value = value;
  };

  const findCell = (text: string): { row: number; col: number } | null => {
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= 26; c++) {
        if ((row.getCell(c).value?.toString() || '').includes(text)) return { row: r, col: c };
      }
    }
    return null;
  };

  const findColInRow = (row: number, text: string): number | null => {
    const r = ws.getRow(row);
    for (let c = 1; c <= 26; c++) {
      if ((r.getCell(c).value?.toString() || '').includes(text)) return c;
    }
    return null;
  };

  const findCellAfter = (text: string, afterRow: number): { row: number; col: number } | null => {
    for (let r = afterRow; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= 26; c++) {
        if ((row.getCell(c).value?.toString() || '').includes(text)) return { row: r, col: c };
      }
    }
    return null;
  };

  const setLabelValue = (row: number, col: number, label: string, value: string) => {
    setCell(row, col, value ? `${label}: ${value}` : `${label}:`);
  };

  const readValueCell = (row: number, labelCol: number): { col: number; value: string } => {
    for (let c = labelCol + 1; c <= labelCol + 6; c++) {
      const v = ws.getRow(row).getCell(c).value?.toString() || '';
      if (v.length > 0) return { col: c, value: v };
    }
    return { col: labelCol + 4, value: '' };
  };

  const preserveRow = (row: number) => {
    const r = ws.getRow(row);
    for (let c = 1; c <= 26; c++) {
      const v = r.getCell(c).value;
      if (v !== null && v !== undefined) r.getCell(c).value = v;
    }
  };

  const fillSigBlock = (headerRow: number, name: string, designation: string, date: string) => {
    const nameCell = findCellAfter('Name', headerRow + 1);
    if (nameCell && nameCell.row <= headerRow + 10) setLabelValue(nameCell.row, nameCell.col, 'Name', name);
    const desigCell = findCellAfter('Designation', (nameCell?.row ?? headerRow) + 1);
    if (desigCell && desigCell.row <= headerRow + 10) setLabelValue(desigCell.row, desigCell.col, 'Designation', designation);
    const dateCell = findCellAfter('Date', (desigCell?.row ?? headerRow) + 1);
    if (dateCell && dateCell.row <= headerRow + 10) setLabelValue(dateCell.row, dateCell.col, 'Date', date);
  };

  // Inspection No
  const inspNoCell = findCell('INSPECTION NO:');
  if (inspNoCell) setCell(inspNoCell.row, inspNoCell.col, `INSPECTION NO: IR-${data.inspection_no ?? '____'}`);

  // Locked rows
  const refDrawCell = findCell('Ref. Drawing');
  if (refDrawCell) {
    preserveRow(refDrawCell.row);
    const dateCol = findColInRow(refDrawCell.row, 'Date');
    if (dateCol && data.inspection_date) {
      const origDate = readValueCell(refDrawCell.row, dateCol);
      setCell(refDrawCell.row, origDate.col, formatDateDMY(data.inspection_date));
    }
  }

  const workSiteCell = findCell('Work Site');
  if (workSiteCell) {
    preserveRow(workSiteCell.row);
    const timeCol = findColInRow(workSiteCell.row, 'Time');
    if (timeCol && data.inspection_time) {
      const origTime = readValueCell(workSiteCell.row, timeCol);
      setCell(workSiteCell.row, origTime.col, data.inspection_time);
    }
  }

  const locationCell = findCell('Location');
  if (locationCell && locationCell.row < 30) preserveRow(locationCell.row);

  const projectCell = findCell('Project Details');
  if (projectCell) {
    for (let r = projectCell.row; r <= projectCell.row + 5; r++) preserveRow(r);
  }

  // Received by
  const receivedCell = findCell('Received by');
  if (receivedCell) fillSigBlock(receivedCell.row, data.received_by_name, data.received_by_designation, data.received_by_date ? formatDateDMY(data.received_by_date) : '');

  // Inspection items
  const arrangeCell = findCell('Arrange Inspection for');
  if (arrangeCell) {
    const items = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5];
    let idx = 0;
    for (let r = arrangeCell.row + 1; r < arrangeCell.row + 10 && idx < 5; r++) {
      const numVal = ws.getRow(r).getCell(1).value?.toString()?.trim() || '';
      if (/^[1-5]$/.test(numVal)) { setCell(r, 2, items[idx] || ''); idx++; }
    }
  }

  // Weather
  const weatherCell = findCell('Weather condition');
  if (weatherCell) setCell(weatherCell.row + 1, 1, data.weather_condition || '');

  // Pre-Inspection
  const preInspCell = findCell('Pre-Inspection checked');
  if (preInspCell) fillSigBlock(preInspCell.row, data.pre_inspection_name, data.pre_inspection_designation, data.pre_inspection_date ? formatDateDMY(data.pre_inspection_date) : '');

  // Comments
  const subclauseCell = findCell('Relevant Sub-clause');
  if (subclauseCell) setCell(subclauseCell.row + 1, 1, data.comments || '');

  // Client Rep
  const clientRepCell = findCell('Client Representative');
  if (clientRepCell) fillSigBlock(clientRepCell.row, data.client_rep_name, data.client_rep_designation, data.client_rep_date ? formatDateDMY(data.client_rep_date) : '');

  // Contractor Rep
  const contractorRepCell = findCellAfter('Contractor Representative', (clientRepCell?.row ?? 60) + 1);
  if (contractorRepCell) fillSigBlock(contractorRepCell.row, data.contractor_rep_name, data.contractor_rep_designation, data.contractor_rep_date ? formatDateDMY(data.contractor_rep_date) : '');

  // Download
  const outBuffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([outBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RFI-Other-IR-${data.inspection_no ?? 'draft'}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
