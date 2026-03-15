import { RfiFormData } from '@/types/rfi';

// Change this to your PHP API URL when deploying
const API_BASE = '/api';

export const rfiApi = {
  async getAll(search?: string): Promise<RfiFormData[]> {
    const url = search ? `${API_BASE}/rfis?search=${encodeURIComponent(search)}` : `${API_BASE}/rfis`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch RFIs');
    return res.json();
  },

  async getById(id: number): Promise<RfiFormData> {
    const res = await fetch(`${API_BASE}/rfis/${id}`);
    if (!res.ok) throw new Error('Failed to fetch RFI');
    return res.json();
  },

  async create(data: RfiFormData): Promise<{ id: number; inspection_no: number }> {
    const res = await fetch(`${API_BASE}/rfis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create RFI');
    return res.json();
  },

  async update(id: number, data: RfiFormData): Promise<void> {
    const res = await fetch(`${API_BASE}/rfis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update RFI');
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/rfis/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete RFI');
  },
};
