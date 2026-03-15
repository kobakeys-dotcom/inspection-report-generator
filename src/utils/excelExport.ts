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
 * Cell map derived from the original RFI-Cladding.xlsx template structure.
 * The template is a single sheet with ~120 rows and 26 columns (A-Z).
 * Page 1 occupies rows 1-67, Page 2 occupies rows 68-115+.
 *
 * Row numbering is based on parsing the original Excel content.
 * Column letters: A=1, B=2, ..., E=5, P=16, Q=17, S=19, T=20, U=21, W=23, Y=25, Z=26
 */

export async function generateRfiExcel(data: RfiFormData) {
  const workbook = new ExcelJS.Workbook();

  // Load the original template
  const response = await fetch('/RFI-Cladding.xlsx');
  const buffer = await response.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const ws = workbook.worksheets[0];
  if (!ws) throw new Error('Worksheet not found');

  // Helper to safely set cell value while preserving formatting
  const setCell = (row: number, col: number, value: string | number) => {
    const cell = ws.getRow(row).getCell(col);
    cell.value = value;
  };

  // Helper to find a cell containing specific text and return its position
  const findCell = (searchText: string): { row: number; col: number } | null => {
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= 26; c++) {
        const cell = row.getCell(c);
        const v = cell.value?.toString() || '';
        if (v.includes(searchText)) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  };

  // ====== PAGE 1 DATA ======

  // Inspection Number - find the cell containing "INSPECTION NO: IR-"
  const inspNoCell = findCell('INSPECTION NO:');
  if (inspNoCell) {
    setCell(inspNoCell.row, inspNoCell.col, `INSPECTION NO: IR-${data.inspection_no ?? '____'}`);
  }

  // Ref Drawing - find "Ref. Drawing" label, value is 4 cols right
  const refDrawCell = findCell('Ref. Drawing');
  if (refDrawCell) {
    // Value cell is typically 4 columns to the right of label
    setCell(refDrawCell.row, refDrawCell.col + 4, data.ref_drawing || '');
  }

  // Inspection Date - find "Date" in the inspection details area (same row as Ref Drawing)
  if (refDrawCell) {
    // Date label and value are on the same row, in the right half
    const dateCell = findCellInRow(ws, refDrawCell.row, 'Date');
    if (dateCell) {
      // Value is 4 cols right of "Date" label
      setCell(refDrawCell.row, dateCell + 4, formatDateDMY(data.inspection_date));
    }
  }

  // Work Site - find "Work Site" label
  const workSiteCell = findCell('Work Site');
  if (workSiteCell) {
    setCell(workSiteCell.row, workSiteCell.col + 4, data.work_site || '');
    // Time is on the same row
    const timeCell = findCellInRow(ws, workSiteCell.row, 'Time');
    if (timeCell) {
      setCell(workSiteCell.row, timeCell + 4, data.inspection_time || '');
    }
  }

  // Location - find "Location" label
  const locationCell = findCell('Location');
  if (locationCell && locationCell.row < 20) {
    setCell(locationCell.row, locationCell.col + 4, data.location || '');
  }

  // Received by [Client] - Name, Designation, Date
  const receivedCell = findCell('Received by');
  if (receivedCell) {
    // Name is ~1 row below, in column P area
    const nameRow = receivedCell.row + 1;
    const nameCol = findCellInRow(ws, nameRow, 'Name');
    if (nameCol) {
      setCell(nameRow, nameCol, data.received_by_name ? `Name: ${data.received_by_name}` : 'Name:');
    }
    // Designation is ~2 rows below name
    const desigRow = nameRow + 2;
    const desigCol = findCellInRow(ws, desigRow, 'Designation');
    if (desigCol) {
      setCell(desigRow, desigCol, data.received_by_designation ? `Designation: ${data.received_by_designation}` : 'Designation:');
    }
    // Date is ~2 rows below designation
    const dateRow = desigRow + 2;
    const dateCol = findCellInRow(ws, dateRow, 'Date');
    if (dateCol) {
      setCell(dateRow, dateCol, data.received_by_date ? `Date: ${formatDateDMY(data.received_by_date)}` : 'Date:');
    }
  }

  // Inspection Items 1-5 - find "Arrange Inspection for:"
  const arrangeCell = findCell('Arrange Inspection for');
  if (arrangeCell) {
    const items = [data.inspection_item_1, data.inspection_item_2, data.inspection_item_3, data.inspection_item_4, data.inspection_item_5];
    items.forEach((item, i) => {
      setCell(arrangeCell.row + 1 + i, 2, item || ''); // Column B
    });
  }

  // Weather condition - find row after "Weather condition:"
  const weatherCell = findCell('Weather condition');
  if (weatherCell) {
    setCell(weatherCell.row + 1, 1, data.weather_condition || '');
  }

  // Pre-Inspection - Name, Designation, Date
  const preInspCell = findCell('Pre-Inspection checked');
  if (preInspCell) {
    const nameRow = preInspCell.row + 1;
    const nameCol = findCellInRow(ws, nameRow, 'Name');
    if (nameCol) {
      setCell(nameRow, nameCol, data.pre_inspection_name ? `Name: ${data.pre_inspection_name}` : 'Name:');
    }
    const desigRow = nameRow + 2;
    const desigCol = findCellInRow(ws, desigRow, 'Designation');
    if (desigCol) {
      setCell(desigRow, desigCol, data.pre_inspection_designation ? `Designation: ${data.pre_inspection_designation}` : 'Designation:');
    }
    const dateRow = desigRow + 2;
    const dateCol = findCellInRow(ws, dateRow, 'Date');
    if (dateCol) {
      setCell(dateRow, dateCol, data.pre_inspection_date ? `Date: ${formatDateDMY(data.pre_inspection_date)}` : 'Date:');
    }
  }

  // Comments
  const commentsCell = findCell('Relevant Sub-clause');
  if (commentsCell) {
    setCell(commentsCell.row + 1, 1, data.comments || '');
  }

  // Client Representative - find label, then fill Name/Designation/Date
  const clientRepCell = findCell('Client Representative');
  if (clientRepCell && clientRepCell.row < 60) {
    // Name row is 1 below, in column P area
    const nameRow = clientRepCell.row + 1;
    const nameCol = findCellInRow(ws, nameRow, 'Name');
    if (nameCol) {
      setCell(nameRow, nameCol, data.client_rep_name ? `Name: ${data.client_rep_name}` : 'Name:');
    }
    const desigRow = nameRow + 2;
    const desigCol = findCellInRow(ws, desigRow, 'Designation');
    if (desigCol) {
      setCell(desigRow, desigCol, data.client_rep_designation ? `Designation: ${data.client_rep_designation}` : 'Designation:');
    }
    const dateRow = desigRow + 2;
    const dateCol = findCellInRow(ws, dateRow, 'Date');
    if (dateCol) {
      setCell(dateRow, dateCol, data.client_rep_date ? `Date: ${formatDateDMY(data.client_rep_date)}` : 'Date:');
    }
  }

  // Contractor Representative (page 1) - find label after client rep
  const contractorRepCell = findCellAfterRow('Contractor Representative', ws, 55);
  if (contractorRepCell && contractorRepCell.row < 70) {
    const nameRow = contractorRepCell.row + 1;
    const nameCol = findCellInRow(ws, nameRow, 'Name');
    if (nameCol) {
      setCell(nameRow, nameCol, data.contractor_rep_name ? `Name: ${data.contractor_rep_name}` : 'Name:');
    }
    const desigRow = nameRow + 2;
    const desigCol = findCellInRow(ws, desigRow, 'Designation');
    if (desigCol) {
      setCell(desigRow, desigCol, data.contractor_rep_designation ? `Designation: ${data.contractor_rep_designation}` : 'Designation:');
    }
    const dateRow = desigRow + 2;
    const dateCol = findCellInRow(ws, dateRow, 'Date');
    if (dateCol) {
      setCell(dateRow, dateCol, data.contractor_rep_date ? `Date: ${formatDateDMY(data.contractor_rep_date)}` : 'Date:');
    }
  }

  // ====== PAGE 2 DATA ======

  // Inspection # value on page 2
  const inspHashCell = findCell('Inspection #');
  if (inspHashCell) {
    // Value is 4 cols right
    setCell(inspHashCell.row, inspHashCell.col + 4, `RFI-${data.inspection_no ?? ''}`);
  }

  // Page 2 Date (find "Date:" after row 68)
  const p2DateCell = findCellAfterRow('Date:', ws, 68);
  if (p2DateCell && p2DateCell.row < 80) {
    setCell(p2DateCell.row, p2DateCell.col + 4, formatDateLong(data.inspection_date));
  }

  // Page 2 Time
  const p2TimeCell = findCellAfterRow('Time:', ws, 68);
  if (p2TimeCell && p2TimeCell.row < 80) {
    setCell(p2TimeCell.row, p2TimeCell.col + 4, data.inspection_time || '');
  }

  // Page 2 Location
  const p2LocCell = findCellAfterRow('Location:', ws, 68);
  if (p2LocCell && p2LocCell.row < 80) {
    setCell(p2LocCell.row, p2LocCell.col + 4, data.location || '');
  }

  // Checklist items - find "WORKS INSPECTED" header row, items start 1 row below
  const worksCell = findCell('WORKS INSPECTED');
  if (worksCell) {
    // Find the result column (contains tick/cross/NA header)
    const resultCol = findCellInRow(ws, worksCell.row, '/NA') || findCellInRow(ws, worksCell.row, 'NA');
    // Find comments column
    const commCol = findCellInRow(ws, worksCell.row, 'COMMENTS');

    // Items are in rows below the header, every other row (with blank rows between)
    let itemIdx = 0;
    for (let r = worksCell.row + 1; r < worksCell.row + 30 && itemIdx < data.checklist_items.length; r++) {
      const cellVal = ws.getRow(r).getCell(2).value?.toString() || '';
      // Check if this row has checklist content (non-empty cell in column B)
      if (cellVal.trim().length > 0) {
        const item = data.checklist_items[itemIdx];
        if (item) {
          // Write result
          if (resultCol) {
            const sym = item.result === 'pass' ? '✓' : item.result === 'fail' ? '✗' : item.result === 'na' ? 'N/A' : '';
            setCell(r, resultCol, sym);
          }
          // Write comments
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

  // Page 2 Representatives
  // Find "Contractor Representative" after row 100
  const p2ContRepCell = findCellAfterRow('Contractor Representative', ws, 100);
  if (p2ContRepCell) {
    // Contractor name/designation are in the row below, columns around E
    const nameRow = p2ContRepCell.row + 1;
    // Find "Name:" in that row for contractor side (column A area)
    const cNameCol = findCellInRow(ws, nameRow, 'Name');
    if (cNameCol && cNameCol < 10) {
      setCell(nameRow, cNameCol + 4, data.page2_contractor_name || '');
    }
    const desigRow = nameRow + 1;
    const cDesigCol = findCellInRow(ws, desigRow, 'Designation');
    if (cDesigCol && cDesigCol < 10) {
      setCell(desigRow, cDesigCol + 4, data.page2_contractor_designation || '');
    }

    // Client side - find "Name:" in the right half of the row
    const clNameCol = findCellInRowAfterCol(ws, nameRow, 'Name', 10);
    if (clNameCol) {
      setCell(nameRow, clNameCol + 4, data.page2_client_name || '');
    }
    const clDesigCol = findCellInRowAfterCol(ws, desigRow, 'Designation', 10);
    if (clDesigCol) {
      setCell(desigRow, clDesigCol + 4, data.page2_client_designation || '');
    }
  }

  // Generate and download
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

// Helper: find a cell containing text in a specific row, return column number
function findCellInRow(ws: ExcelJS.Worksheet, row: number, text: string): number | null {
  const r = ws.getRow(row);
  for (let c = 1; c <= 26; c++) {
    const v = r.getCell(c).value?.toString() || '';
    if (v.includes(text)) return c;
  }
  return null;
}

// Helper: find a cell containing text in a row, but only after a specific column
function findCellInRowAfterCol(ws: ExcelJS.Worksheet, row: number, text: string, afterCol: number): number | null {
  const r = ws.getRow(row);
  for (let c = afterCol; c <= 26; c++) {
    const v = r.getCell(c).value?.toString() || '';
    if (v.includes(text)) return c;
  }
  return null;
}

// Helper: find first cell containing text after a specific row
function findCellAfterRow(text: string, ws: ExcelJS.Worksheet, afterRow: number): { row: number; col: number } | null {
  for (let r = afterRow; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= 26; c++) {
      const v = row.getCell(c).value?.toString() || '';
      if (v.includes(text)) return { row: r, col: c };
    }
  }
  return null;
}
