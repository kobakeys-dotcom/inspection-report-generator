import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RfiFormData, EMPTY_RFI } from '@/types/rfi';
import { rfiApi } from '@/services/rfiApi';
import { generateRfiExcel } from '@/utils/excelExport';
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
    } catch {
      toast.error('Failed to save RFI. Check API connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await generateRfiExcel(formData);
      toast.success('Excel exported successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export Excel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-[850px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-[12px]">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back
            </Button>
            <span className="text-[13px] font-bold text-black">
              {mode === 'edit' ? `Edit RFI IR-${formData.inspection_no}` : 'New RFI'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-3">
              <span
                className={`px-3 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors border ${
                  step === 1 ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setStep(1)}
              >
                Page 1 - Request
              </span>
              <span
                className={`px-3 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors border ${
                  step === 2 ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setStep(2)}
              >
                Page 2 - Checklist
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              className="text-[11px] h-7 border-gray-400"
            >
              <FileDown className="h-3.5 w-3.5 mr-1" />
              Export PDF
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="text-[11px] h-7 bg-[#4CAF50] hover:bg-[#43A047] text-white"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content - A4 paper style */}
      <div className="max-w-[850px] mx-auto my-4">
        <div className="bg-white shadow-md border border-gray-300 px-10 py-8">
          {step === 1 ? (
            <RfiPage1 data={formData} onChange={handleChange} />
          ) : (
            <RfiPage2 data={formData} onChange={handleChange} />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep(1)}
            disabled={step === 1}
            className="text-[11px] h-7"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Previous: Request
          </Button>
          <Button
            size="sm"
            onClick={() => setStep(2)}
            disabled={step === 2}
            className="text-[11px] h-7 bg-[#4CAF50] hover:bg-[#43A047] text-white"
          >
            Next: Checklist
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RfiFormPage;
