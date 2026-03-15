import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CladdingFrameRfiFormData, EMPTY_CF_RFI } from '@/types/claddingFrameRfi';
import { cfRfiApi } from '@/services/cfRfiApi';
import CfRfiFormPage from './CfRfiFormPage';

const CfRfiEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CladdingFrameRfiFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const rfi = await cfRfiApi.getById(Number(id));
        if (rfi.checklist_items) {
          rfi.checklist_items = rfi.checklist_items.map((item: any) => ({
            ...item,
            comments: item.item_comments || item.comments || '',
          }));
        }
        setData(rfi);
      } catch {
        setData(EMPTY_CF_RFI);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading RFI...</p></div>;
  }

  return <CfRfiFormPage mode="edit" initialData={data!} />;
};

export default CfRfiEditPage;
