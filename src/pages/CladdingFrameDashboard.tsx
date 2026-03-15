import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';

const CladdingFrameDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Cladding Frame RFI</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Request for Inspection — Cladding Frame Installation
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-end mb-6">
          <Button onClick={() => navigate('/cladding-frame/new')}>
            <Plus className="h-4 w-4 mr-1" />
            Create New Cladding Frame RFI
          </Button>
        </div>

        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-1">No Cladding Frame RFIs yet</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first Cladding Frame RFI to get started.
          </p>
          <Button onClick={() => navigate('/cladding-frame/new')}>
            <Plus className="h-4 w-4 mr-1" />
            Create New Cladding Frame RFI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CladdingFrameDashboard;
