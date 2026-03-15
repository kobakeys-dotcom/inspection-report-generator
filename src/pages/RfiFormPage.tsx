import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RfiFormData, EMPTY_RFI } from '@/types/rfi';
import { rfiApi } from '@/services/rfiApi';
import { generateRfiPdf } from '@/utils/pdfExport';
import RfiPage1 from '@/components/RfiPage1';
import RfiPage2 from '@/components/RfiPage2';
import { ArrowLeft, ArrowRight, Save, FileDown } from 'lucide-react';

interface RfiFormPageProps {
  mode?: 'create' | 'edit';
  initialData?: RfiFormData;
}

const RfiFormPage = ({ mode = 'create', initialData }: RfiFormPageProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RfiFormData>(initialData || EMPTY_RFI);
  const [saving, setSaving] = useState(false);

  const handleChange = (updates: Partial<RfiFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === 'edit' && formData.id) {
        await rfiApi.update(formData.id, formData);
        toast.success('RFI updated successfully');
      } else {
        const result = await rfiApi.create(formData);
        setFormData((prev) => ({ ...prev, id: result.id, inspection_no: result.inspection_no }));
        toast.success(`RFI IR-${result.inspection_no} created successfully`);
      }
      navigate('/');
    } catch (error) {
      toast.error('Failed to save RFI');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = () => {
    try {
      generateRfiPdf(formData);
      toast.success('PDF exported successfully');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-lg font-bold text-primary">
              {mode === 'edit' ? `Edit RFI IR-${formData.inspection_no}` : 'New RFI'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Step indicator */}
            <div className="flex items-center gap-1 mr-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setStep(1)}
              >
                Page 1 - Request
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setStep(2)}
              >
                Page 2 - Checklist
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={handleExportPdf}>
              <FileDown className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {step === 1 ? (
          <RfiPage1 data={formData} onChange={handleChange} />
        ) : (
          <RfiPage2 data={formData} onChange={handleChange} />
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous: Request
          </Button>
          <Button
            onClick={() => setStep(2)}
            disabled={step === 2}
          >
            Next: Checklist
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RfiFormPage;
