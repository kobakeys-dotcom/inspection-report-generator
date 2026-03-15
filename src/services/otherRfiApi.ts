import { OtherRfiFormData } from '@/types/otherRfi';

const API_BASE = '/api';

export const otherRfiApi = {
  async getAll(search?: string): Promise<OtherRfiFormData[]> {
    const url = search ? `${API_BASE}/other-rfis?search=${encodeURIComponent(search)}` : `${API_BASE}/other-rfis`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch Other RFIs');
    return res.json();
  },

  async getById(id: number): Promise<OtherRfiFormData> {
    const res = await fetch(`${API_BASE}/other-rfis/${id}`);
    if (!res.ok) throw new Error('Failed to fetch Other RFI');
    return res.json();
  },

  async create(data: OtherRfiFormData): Promise<{ id: number; inspection_no: number }> {
    const res = await fetch(`${API_BASE}/other-rfis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create Other RFI');
    return res.json();
  },

  async update(id: number, data: OtherRfiFormData): Promise<void> {
    const res = await fetch(`${API_BASE}/other-rfis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update Other RFI');
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/other-rfis/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete Other RFI');
  },
};
