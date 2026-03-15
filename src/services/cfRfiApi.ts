import { CladdingFrameRfiFormData } from '@/types/claddingFrameRfi';

const API_BASE = '/api';

export const cfRfiApi = {
  async getAll(search?: string): Promise<CladdingFrameRfiFormData[]> {
    const url = search ? `${API_BASE}/cf-rfis?search=${encodeURIComponent(search)}` : `${API_BASE}/cf-rfis`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch CF RFIs');
    return res.json();
  },

  async getById(id: number): Promise<CladdingFrameRfiFormData> {
    const res = await fetch(`${API_BASE}/cf-rfis/${id}`);
    if (!res.ok) throw new Error('Failed to fetch CF RFI');
    return res.json();
  },

  async create(data: CladdingFrameRfiFormData): Promise<{ id: number; inspection_no: number }> {
    const res = await fetch(`${API_BASE}/cf-rfis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create CF RFI');
    return res.json();
  },

  async update(id: number, data: CladdingFrameRfiFormData): Promise<void> {
    const res = await fetch(`${API_BASE}/cf-rfis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update CF RFI');
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/cf-rfis/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete CF RFI');
  },
};
