import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RfiFormData } from '@/types/rfi';
import { rfiApi } from '@/services/rfiApi';
import { generateRfiPdf } from '@/utils/pdfExport';
import { Plus, Search, FileDown, Pencil, Trash2, ClipboardList } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [rfis, setRfis] = useState<RfiFormData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRfis = async () => {
    try {
      const data = await rfiApi.getAll(search);
      setRfis(data);
    } catch {
      // API not connected - show empty state
      setRfis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfis();
  }, [search]);

  const handleDelete = async (id: number, inspectionNo: number) => {
    if (!confirm(`Delete RFI IR-${inspectionNo}?`)) return;
    try {
      await rfiApi.delete(id);
      toast.success('RFI deleted');
      fetchRfis();
    } catch {
      toast.error('Failed to delete RFI');
    }
  };

  const handleExportPdf = async (id: number) => {
    try {
      const rfi = await rfiApi.getById(id);
      generateRfiPdf(rfi);
      toast.success('PDF exported');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'submitted': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-8 w-8" />
            <h1 className="text-2xl font-bold">RFI Generator</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Request for Inspection — Cladding Installation
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by IR number, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => navigate('/rfi/new')}>
            <Plus className="h-4 w-4 mr-1" />
            Create New RFI
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : rfis.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-1">No RFIs yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {search ? 'No results found. Try a different search.' : 'Create your first Request for Inspection to get started.'}
            </p>
            {!search && (
              <Button onClick={() => navigate('/rfi/new')}>
                <Plus className="h-4 w-4 mr-1" />
                Create New RFI
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Inspection No</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Work Site</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rfis.map((rfi) => (
                  <tr key={rfi.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-semibold text-primary">IR-{rfi.inspection_no}</td>
                    <td className="p-3">{rfi.inspection_date || '—'}</td>
                    <td className="p-3">{rfi.location || '—'}</td>
                    <td className="p-3">{rfi.work_site || '—'}</td>
                    <td className="p-3">
                      <Badge variant={statusColor(rfi.status) as any}>{rfi.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/rfi/edit/${rfi.id}`)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleExportPdf(rfi.id!)}
                          title="Export PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(rfi.id!, rfi.inspection_no!)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
