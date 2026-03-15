export interface RfiFormData {
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
  checklist_items: ChecklistItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistItem {
  id?: number;
  rfi_id?: number;
  item_order: number;
  description: string;
  result: 'pass' | 'fail' | 'na' | '';
  comments: string;
}

export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  { item_order: 1, description: 'Cladding panels installed as per approved shop drawings and specifications', result: '', comments: '' },
  { item_order: 2, description: 'Cladding type, color, pattern, and material match approved samples', result: '', comments: '' },
  { item_order: 3, description: 'Panels are level, plumb, and evenly spaced', result: '', comments: '' },
  { item_order: 4, description: 'Joints are uniform, consistent, and properly aligned', result: '', comments: '' },
  { item_order: 5, description: 'All protective films removed from panels & Panels cleaned and free from dust, adhesive marks, and scratches', result: '', comments: '' },
  { item_order: 6, description: 'Edge finishes and corner details are neat and professionally executed', result: '', comments: '' },
  { item_order: 7, description: 'Cladding is securely fixed to the frame & All fasteners (screws, rivets, anchors) are of correct type and properly installed', result: '', comments: '' },
  { item_order: 8, description: 'Joints and gaps sealed using approved sealant materials & No visible gaps that can cause water ingress', result: '', comments: '' },
  { item_order: 9, description: 'All edge trims, corner profiles, and expansion joints properly installed', result: '', comments: '' },
  { item_order: 10, description: 'Sealant application is clean and continuous', result: '', comments: '' },
];

export const EMPTY_RFI: RfiFormData = {
  ref_drawing: '',
  work_site: '',
  location: '',
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
  checklist_items: DEFAULT_CHECKLIST_ITEMS,
};

// Fixed project details
export const PROJECT_INFO = {
  project: 'Installation Of Additional Elevators In Hiyaa Towers',
  contractor: 'Shenyang Yuanda Intellectual Industry Group Co.Ltd',
  contract_no: 'HDC (161)-PMD/CNTR/2024/1',
  client: 'Housing Development Corporation',
  form_number: 'PMD-2021-FRM-108 _ V 1.2',
};
