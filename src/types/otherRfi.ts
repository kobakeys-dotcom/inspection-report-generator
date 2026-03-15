export interface OtherRfiFormData {
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
  status: 'draft' | 'submitted' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export const EMPTY_OTHER_RFI: OtherRfiFormData = {
  ref_drawing: 'HDC(161)-MNS/DEV/2024/12',
  work_site: 'Hiyaa Towers',
  location: 'H11',
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
  status: 'draft',
};

export const OTHER_PROJECT_INFO = {
  project: 'Installation Of Additional Elevators In Hiyaa Towers',
  contractor: 'Shenyang Yuanda Intellectual Industry Group Co.Ltd',
  contract_no: 'HDC (161)-PMD/CNTR/2024/1',
  client: 'Housing Development Corporation',
  form_number: 'PMD-2021-FRM-108 _ V 1.2',
};
