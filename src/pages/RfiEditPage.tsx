import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RfiFormData, EMPTY_RFI } from '@/types/rfi';
import { rfiApi } from '@/services/rfiApi';
import RfiFormPage from './RfiFormPage';

const RfiEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RfiFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const rfi = await rfiApi.getById(Number(id));
        // Map checklist item_comments to comments for the form
        if (rfi.checklist_items) {
          rfi.checklist_items = rfi.checklist_items.map((item: any) => ({
            ...item,
            comments: item.item_comments || item.comments || '',
          }));
        }
        setData(rfi);
      } catch {
        setData(EMPTY_RFI);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading RFI...</p>
      </div>
    );
  }

  return <RfiFormPage mode="edit" initialData={data!} />;
};

export default RfiEditPage;
