import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OtherRfiFormData, EMPTY_OTHER_RFI } from '@/types/otherRfi';
import { otherRfiApi } from '@/services/otherRfiApi';
import OtherRfiFormPage from './OtherRfiFormPage';

const OtherRfiEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OtherRfiFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const rfi = await otherRfiApi.getById(Number(id));
        setData(rfi);
      } catch {
        setData(EMPTY_OTHER_RFI);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading RFI...</p></div>;
  }

  return <OtherRfiFormPage mode="edit" initialData={data!} />;
};

export default OtherRfiEditPage;
