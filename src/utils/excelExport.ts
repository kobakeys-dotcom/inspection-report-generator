import ExcelJS from 'exceljs';
import { RfiFormData } from '@/types/rfi';

function formatDateDMY(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatDateLong(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * Loads the original RFI-Cladding.xlsx template, fills in form data
 * into the correct cells, and triggers a download.
 * 
 * Cell positions are determined by scanning for known label text,
 * so the export adapts if the template layout shifts slightly.
 */
export async function generateRfiExcel(data: RfiFormData) {
  const workbook = new ExcelJS.Workbook();

  const response = await fetch('/RFI-Cladding.xlsx');
  const buffer = await response.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const ws = workbook.worksheets[0];
  if (!ws) throw new Error('Worksheet not found');

  // ── Helpers ──────────────────────────────────────────────

  /** Set cell value preserving existing style */
  const setCell = (row: number, col: number, value: string | number) => {
    ws.getRow(row).getCell(col).value = value;
  };

  /** Find first cell whose text includes `searchText` (full sheet scan) */
  const findCell = (searchText: string): { row: number; col: number } | null => {
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= 26; c++) {
        const v = row.getCell(c).value?.toString() || '';
        if (v.includes(searchText)) return { row: r, col: c };
      }
    }
    return null;
  };

  /** Find first cell containing `text` in a given row, return col or null */
  const findColInRow = (row: number, text: string): number | null => {
    const r = ws.getRow(row);
    for (let c = 1; c <= 26; c++) {
      const v = r.getCell(c).value?.toString() || '';
      if (v.includes(text)) return c;
    }
    return null;
  };

  /** Find cell containing text, but only starting from `afterRow` */
  const findCellAfter = (text: string, afterRow: number): { row: number; col: number } | null => {
    for (let r = afterRow; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= 26; c++) {
        const v = row.getCell(c).value?.toString() || '';
        if (v.includes(text)) return { row: r, col: c };
      }
    }
    return null;
  };

  /** Find col containing text in a row, starting from afterCol */
  const findColInRowAfter = (row: number, text: string, afterCol: number): number | null => {
    const r = ws.getRow(row);
    for (let c = afterCol; c <= 26; c++) {
      const v = r.getCell(c).value?.toString() || '';
      if (v.includes(text)) return c;
    }
    return null;
  };

  /**
   * For label cells like "Name:", "Designation:", "Date:" that contain both
   * label and value in one cell, we overwrite the whole cell with "Label: value"
   */
  const setLabelValue = (row: number, col: number, label: string, value: string) => {
    setCell(row, col, value ? `${label}: ${value}` : `${label}:`);
  };

  // ── Helper to read a value cell (first non-empty cell after label col) ──
  const readValueCell = (row: number, labelCol: number): { col: number; value: string } => {
    for (let c = labelCol + 1; c <= labelCol + 6; c++) {
      const v = ws.getRow(row).getCell(c).value?.toString() || '';
      if (v.length > 0) return { col: c, value: v };
    }
    return { col: labelCol + 4, value: '' };
  };

  // ── PAGE 1 ───────────────────────────────────────────────

  // Inspection No (top-right header)
  const inspNoCell = findCell('INSPECTION NO:');
  if (inspNoCell) {
    setCell(inspNoCell.row, inspNoCell.col, `INSPECTION NO: IR-${data.inspection_no ?? '____'}`);
  }

  // Ref Drawing & Date row — Ref Drawing value preserved from template
  const refDrawCell = findCell('Ref. Drawing');
  if (refDrawCell) {
    // Re-write original Ref Drawing value to prevent ExcelJS merge corruption
    const origRefDraw = readValueCell(refDrawCell.row, refDrawCell.col);
    setCell(refDrawCell.row, origRefDraw.col, origRefDraw.value);

    // Date on same row
    const dateCol = findColInRow(refDrawCell.row, 'Date');
    if (dateCol) {
      const origDate = readValueCell(refDrawCell.row, dateCol);
      setCell(refDrawCell.row, origDate.col, data.inspection_date ? formatDateDMY(data.inspection_date) : origDate.value);
    }
  }

  // Work Site & Time row — Work Site value preserved from template
  const workSiteCell = findCell('Work Site');
  if (workSiteCell) {
    // Re-write original Work Site value
    const origWorkSite = readValueCell(workSiteCell.row, workSiteCell.col);
    setCell(workSiteCell.row, origWorkSite.col, origWorkSite.value);

    const timeCol = findColInRow(workSiteCell.row, 'Time');
    if (timeCol) {
      const origTime = readValueCell(workSiteCell.row, timeCol);
      setCell(workSiteCell.row, origTime.col, data.inspection_time || origTime.value);
    }
  }

  // Location row — preserved from template, overwritten only if form has value
  const locationCell = findCell('Location');
  if (locationCell && locationCell.row < 30) {
    const origLoc = readValueCell(locationCell.row, locationCell.col);
    setCell(locationCell.row, origLoc.col, data.location || origLoc.value);
  }

  // Received by [Client] — Name/Designation/Date are label:value cells
  const receivedCell = findCell('Received by');
  if (receivedCell) {
    fillSignatureBlock(ws, receivedCell.row, data.received_by_name, data.received_by_designation, data.received_by_date ? formatDateDMY(data.received_by_date) : '', findCellAfter, setLabelValue);
  }

  // Inspection items 1-5
  const arrangeCell = findCell('Arrange Inspection for');
  if (arrangeCell) {
    const items = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5];
    // Items are in rows below, column B (col 2), numbered 1-5
    let itemIdx = 0;
    for (let r = arrangeCell.row + 1; r < arrangeCell.row + 10 && itemIdx < 5; r++) {
      const numVal = ws.getRow(r).getCell(1).value?.toString()?.trim() || '';
      if (/^[1-5]$/.test(numVal)) {
        setCell(r, 2, items[itemIdx] || '');
        itemIdx++;
      }
    }
  }

  // Weather condition
  const weatherCell = findCell('Weather condition');
  if (weatherCell) {
    setCell(weatherCell.row + 1, 1, data.weather_condition || '');
  }

  // Pre-Inspection checked by Contractor
  const preInspCell = findCell('Pre-Inspection checked');
  if (preInspCell) {
    fillSignatureBlock(ws, preInspCell.row, data.pre_inspection_name, data.pre_inspection_designation, data.pre_inspection_date ? formatDateDMY(data.pre_inspection_date) : '', findCellAfter, setLabelValue);
  }

  // Comments / Relevant Sub-clause
  const subclauseCell = findCell('Relevant Sub-clause');
  if (subclauseCell) {
    setCell(subclauseCell.row + 1, 1, data.comments || '');
  }

  // Client Representative (page 1, before row 65)
  const clientRepCell = findCell('Client Representative');
  if (clientRepCell && clientRepCell.row < 65) {
    fillSignatureBlock(ws, clientRepCell.row, data.client_rep_name, data.client_rep_designation, data.client_rep_date ? formatDateDMY(data.client_rep_date) : '', findCellAfter, setLabelValue);
  }

  // Contractor Representative (page 1, after Client Rep)
  const contractorRepCell = findCellAfter('Contractor Representative', (clientRepCell?.row ?? 60) + 1);
  if (contractorRepCell && contractorRepCell.row < 75) {
    fillSignatureBlock(ws, contractorRepCell.row, data.contractor_rep_name, data.contractor_rep_designation, data.contractor_rep_date ? formatDateDMY(data.contractor_rep_date) : '', findCellAfter, setLabelValue);
  }

  // ── PAGE 2 ───────────────────────────────────────────────

  // Inspection # on page 2
  const inspHashCell = findCell('Inspection #');
  if (inspHashCell) {
    // Find the value cell to the right
    for (let c = inspHashCell.col + 1; c <= inspHashCell.col + 6; c++) {
      const v = ws.getRow(inspHashCell.row).getCell(c).value?.toString() || '';
      if (v.includes('RFI') || c === inspHashCell.col + 4) {
        setCell(inspHashCell.row, c, `RFI-${data.inspection_no ?? ''}`);
        break;
      }
    }
  }

  // Page 2 Date
  const checklistHeader = findCell('CHECKLIST FOR');
  const p2StartRow = checklistHeader ? checklistHeader.row : 70;

  const p2DateCell = findCellAfter('Date:', p2StartRow);
  if (p2DateCell && p2DateCell.row < p2StartRow + 15) {
    for (let c = p2DateCell.col + 1; c <= p2DateCell.col + 6; c++) {
      const v = ws.getRow(p2DateCell.row).getCell(c).value?.toString() || '';
      if (v.length > 0 || c === p2DateCell.col + 4) {
        setCell(p2DateCell.row, c, formatDateLong(data.inspection_date));
        break;
      }
    }
  }

  // Page 2 Time
  const p2TimeCell = findCellAfter('Time:', p2StartRow);
  if (p2TimeCell && p2TimeCell.row < p2StartRow + 15) {
    for (let c = p2TimeCell.col + 1; c <= p2TimeCell.col + 6; c++) {
      const v = ws.getRow(p2TimeCell.row).getCell(c).value?.toString() || '';
      if (v.length > 0 || c === p2TimeCell.col + 4) {
        setCell(p2TimeCell.row, c, data.inspection_time || '');
        break;
      }
    }
  }

  // Page 2 Location
  const p2LocCell = findCellAfter('Location:', p2StartRow);
  if (p2LocCell && p2LocCell.row < p2StartRow + 15) {
    for (let c = p2LocCell.col + 1; c <= p2LocCell.col + 6; c++) {
      const v = ws.getRow(p2LocCell.row).getCell(c).value?.toString() || '';
      if (v.length > 0 || c === p2LocCell.col + 4) {
        setCell(p2LocCell.row, c, data.location || '');
        break;
      }
    }
  }

  // Checklist items
  const worksCell = findCell('WORKS INSPECTED');
  if (worksCell) {
    // Find the result column header (ü/û/NA or similar)
    let resultCol: number | null = null;
    let commCol: number | null = null;
    
    // Scan header row for result and comments columns
    for (let c = 1; c <= 26; c++) {
      const v = ws.getRow(worksCell.row).getCell(c).value?.toString() || '';
      if (v.includes('NA') || v.includes('û') || v.includes('ü')) resultCol = c;
      if (v.toUpperCase().includes('COMMENT')) commCol = c;
    }

    // Iterate through rows below header, matching checklist items
    let itemIdx = 0;
    for (let r = worksCell.row + 1; r < worksCell.row + 40 && itemIdx < data.checklist_items.length; r++) {
      // Check if col B has checklist description text
      const cellVal = ws.getRow(r).getCell(2).value?.toString()?.trim() || '';
      if (cellVal.length > 5) {
        const item = data.checklist_items[itemIdx];
        if (item) {
          if (resultCol) {
            const sym = item.result === 'pass' ? 'ü' : item.result === 'fail' ? 'û' : item.result === 'na' ? 'N/A' : '';
            setCell(r, resultCol, sym);
          }
          if (commCol) {
            setCell(r, commCol, item.comments || '');
          }
        }
        itemIdx++;
      }
    }
  }

  // Comments on completed works
  const compWorksCell = findCell('Comments on completed works');
  if (compWorksCell) {
    setCell(compWorksCell.row + 1, 1, data.completed_works_comments || '');
  }

  // Page 2 Representatives (bottom of sheet)
  // Find "Contractor Representative" after the checklist area
  const p2ContRepCell = findCellAfter('Contractor Representative', (compWorksCell?.row ?? 100) + 1);
  if (p2ContRepCell) {
    // Contractor side: Name/Designation in left columns
    const nameRow = p2ContRepCell.row + 1;
    const cNameCol = findColInRow(nameRow, 'Name');
    if (cNameCol && cNameCol < 10) {
      // Value is in merged cells to the right
      for (let c = cNameCol + 1; c <= cNameCol + 6; c++) {
        const v = ws.getRow(nameRow).getCell(c).value?.toString() || '';
        if (v.length > 0 || c === cNameCol + 4) {
          setCell(nameRow, c, data.page2_contractor_name || '');
          break;
        }
      }
    }
    const desigRow = nameRow + 1;
    const cDesigCol = findColInRow(desigRow, 'Designation');
    if (cDesigCol && cDesigCol < 10) {
      for (let c = cDesigCol + 1; c <= cDesigCol + 6; c++) {
        const v = ws.getRow(desigRow).getCell(c).value?.toString() || '';
        if (v.length > 0 || c === cDesigCol + 4) {
          setCell(desigRow, c, data.page2_contractor_designation || '');
          break;
        }
      }
    }

    // Client side: Name/Designation in right columns
    const clNameCol = findColInRowAfter(nameRow, 'Name', 10);
    if (clNameCol) {
      for (let c = clNameCol + 1; c <= clNameCol + 6; c++) {
        const v = ws.getRow(nameRow).getCell(c).value?.toString() || '';
        if (v.length > 0 || c === clNameCol + 4) {
          setCell(nameRow, c, data.page2_client_name || '');
          break;
        }
      }
    }
    const clDesigCol = findColInRowAfter(desigRow, 'Designation', 10);
    if (clDesigCol) {
      for (let c = clDesigCol + 1; c <= clDesigCol + 6; c++) {
        const v = ws.getRow(desigRow).getCell(c).value?.toString() || '';
        if (v.length > 0 || c === clDesigCol + 4) {
          setCell(desigRow, c, data.page2_client_designation || '');
          break;
        }
      }
    }
  }

  // ── Download ─────────────────────────────────────────────
  const outBuffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([outBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RFI-IR-${data.inspection_no ?? 'draft'}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Fill a signature block (Name/Designation/Date) that appears
 * as "Name: value" style cells below a section header.
 */
function fillSignatureBlock(
  ws: ExcelJS.Worksheet,
  headerRow: number,
  name: string,
  designation: string,
  date: string,
  findCellAfter: (text: string, afterRow: number) => { row: number; col: number } | null,
  setLabelValue: (row: number, col: number, label: string, value: string) => void,
) {
  // Search for Name:/Designation:/Date: within 10 rows of the header
  const nameCell = findCellAfter('Name', headerRow + 1);
  if (nameCell && nameCell.row <= headerRow + 10) {
    setLabelValue(nameCell.row, nameCell.col, 'Name', name);
  }
  const desigCell = findCellAfter('Designation', (nameCell?.row ?? headerRow) + 1);
  if (desigCell && desigCell.row <= headerRow + 10) {
    setLabelValue(desigCell.row, desigCell.col, 'Designation', designation);
  }
  const dateCell = findCellAfter('Date', (desigCell?.row ?? headerRow) + 1);
  if (dateCell && dateCell.row <= headerRow + 10) {
    setLabelValue(dateCell.row, dateCell.col, 'Date', date);
  }
}
