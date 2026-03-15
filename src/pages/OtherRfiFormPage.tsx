import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { OtherRfiFormData, EMPTY_OTHER_RFI } from '@/types/otherRfi';
import { otherRfiApi } from '@/services/otherRfiApi';
import { generateOtherRfiExcel } from '@/utils/otherExcelExport';
import OtherRfiPage1 from '@/components/OtherRfiPage1';
import { ArrowLeft, Save, FileDown } from 'lucide-react';

interface Props {
  mode?: 'create' | 'edit';
  initialData?: OtherRfiFormData;
}

const OtherRfiFormPage = ({ mode = 'create', initialData }: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OtherRfiFormData>(initialData || EMPTY_OTHER_RFI);
  const [saving, setSaving] = useState(false);

  const handleChange = (updates: Partial<OtherRfiFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === 'edit' && formData.id) {
        await otherRfiApi.update(formData.id, formData);
        toast.success('Other RFI updated successfully');
      } else {
        const result = await otherRfiApi.create(formData);
        setFormData((prev) => ({ ...prev, id: result.id, inspection_no: result.inspection_no }));
        toast.success(`Other RFI IR-${result.inspection_no} created successfully`);
      }
      navigate('/other-rfi');
    } catch {
      toast.error('Failed to save RFI. Check API connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await generateOtherRfiExcel(formData);
      toast.success('Excel exported successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export Excel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-[850px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/other-rfi')} className="text-[12px]">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />Back
            </Button>
            <span className="text-[13px] font-bold text-black">
              {mode === 'edit' ? `Edit Other RFI IR-${formData.inspection_no}` : 'New Other RFI'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-[11px] h-7 border-gray-400">
              <FileDown className="h-3.5 w-3.5 mr-1" />Export Excel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="text-[11px] h-7 bg-[#4CAF50] hover:bg-[#43A047] text-white">
              <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-[850px] mx-auto my-4">
        <div className="bg-white shadow-md border border-gray-300 px-10 py-8">
          <OtherRfiPage1 data={formData} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default OtherRfiFormPage;
