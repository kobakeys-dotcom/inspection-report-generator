export interface CladdingFrameRfiFormData {
  id?: number;
  inspection_no?: number;
  ref_drawing: string;
  work_site: string;
  location: string;
  inspection_date: string;
  inspection_time: string;
  weather_condition: string;
  inspection_item_1: string;
  inspection_item_2: string;
  inspection_item_3: string;
  inspection_item_4: string;
  inspection_item_5: string;
  pre_inspection_name: string;
  pre_inspection_designation: string;
  pre_inspection_date: string;
  received_by_name: string;
  received_by_designation: string;
  received_by_date: string;
  comments: string;
  relevant_subclause: string;
  client_rep_name: string;
  client_rep_designation: string;
  client_rep_date: string;
  contractor_rep_name: string;
  contractor_rep_designation: string;
  contractor_rep_date: string;
  completed_works_comments: string;
  page2_contractor_name: string;
  page2_contractor_designation: string;
  page2_client_name: string;
  page2_client_designation: string;
  status: 'draft' | 'submitted' | 'completed';
  checklist_items: CladdingFrameChecklistItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CladdingFrameChecklistItem {
  id?: number;
  rfi_id?: number;
  item_order: number;
  description: string;
  result: 'pass' | 'fail' | 'na' | '';
  comments: string;
}

export const CF_DEFAULT_CHECKLIST_ITEMS: CladdingFrameChecklistItem[] = [
  { item_order: 1, description: 'All cladding frames installed as per approved drawings and specifications', result: '', comments: '' },
  { item_order: 2, description: 'Frames are vertically and horizontally aligned', result: '', comments: '' },
  { item_order: 3, description: 'No deformation or movement in the frame after installation', result: '', comments: '' },
  { item_order: 4, description: 'Box bars are free from rust, corrosion, and any surface damage', result: '', comments: '' },
  { item_order: 5, description: 'No sharp edges or protrusions that pose a safety risk', result: '', comments: '' },
  { item_order: 6, description: 'All weld joints cleaned properly after welding (e.g., removal of slag, spatter, oil, or dust)', result: '', comments: '' },
  { item_order: 7, description: 'Anti-corrosive coating applied evenly and covers the entire weld area', result: '', comments: '' },
  { item_order: 8, description: 'No flaking, peeling, or damage to the applied anti-corrosion coating', result: '', comments: '' },
];

export const EMPTY_CF_RFI: CladdingFrameRfiFormData = {
  ref_drawing: 'HDC(161)-MNS/DEV/2024/12',
  work_site: 'Hiyaa Towers',
  location: 'H14',
  inspection_date: '',
  inspection_time: '',
  weather_condition: '',
  inspection_item_1: '',
  inspection_item_2: '',
  inspection_item_3: '',
  inspection_item_4: '',
  inspection_item_5: '',
  pre_inspection_name: '',
  pre_inspection_designation: '',
  pre_inspection_date: '',
  received_by_name: '',
  received_by_designation: '',
  received_by_date: '',
  comments: '',
  relevant_subclause: '',
  client_rep_name: '',
  client_rep_designation: '',
  client_rep_date: '',
  contractor_rep_name: '',
  contractor_rep_designation: '',
  contractor_rep_date: '',
  completed_works_comments: '',
  page2_contractor_name: '',
  page2_contractor_designation: '',
  page2_client_name: '',
  page2_client_designation: '',
  status: 'draft',
  checklist_items: CF_DEFAULT_CHECKLIST_ITEMS,
};

export const CF_PROJECT_INFO = {
  project: 'Installation Of Additional Elevators In Hiyaa Towers',
  contractor: 'Shenyang Yuanda Intellectual Industry Group Co.Ltd',
  contract_no: 'HDC (161)-PMD/CNTR/2024/1',
  client: 'Housing Development Corporation',
  form_number: 'PMD-2021-FRM-108 _ V 1.2',
};
