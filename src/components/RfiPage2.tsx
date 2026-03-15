import { RfiFormData, ChecklistItem, PROJECT_INFO } from '@/types/rfi';
import hdcLogo from '@/assets/hdc-logo.png';

interface RfiPage2Props {
  data: RfiFormData;
  onChange: (data: Partial<RfiFormData>) => void;
}

const inputStyle = "w-full bg-[#FFFDE7] border-0 border-b border-black/30 px-1 py-0.5 text-[11px] focus:outline-none focus:bg-[#FFF9C4]";
const cellStyle = "border border-black/40 px-2 py-1.5 text-[11px]";

const RfiPage2 = ({ data, onChange }: RfiPage2Props) => {
  const updateChecklistItem = (index: number, updates: Partial<ChecklistItem>) => {
    const items = [...data.checklist_items];
    items[index] = { ...items[index], ...updates };
    onChange({ checklist_items: items });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white text-black" style={{ fontFamily: "'Segoe UI', Calibri, Arial, sans-serif", fontSize: '11px', lineHeight: '1.4' }}>
      
      {/* Title */}
      <div className="text-center font-bold text-[13px] underline mb-3">
        CHECKLIST FOR CLADDING INSTALLATION COMPLETION
      </div>

      {/* Header with project info + HDC logo */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {/* Project info left */}
          <table className="border-collapse text-[11px]">
            <tbody>
              <tr>
                <td className="pr-1 font-bold italic text-right" style={{ width: '100px' }}>PROJECT:</td>
                <td className="font-bold px-1">{PROJECT_INFO.project.toUpperCase()}</td>
              </tr>
              <tr>
                <td className="pr-1 font-bold italic text-right">CLIENT:</td>
                <td className="font-bold px-1">{PROJECT_INFO.client.toUpperCase()}</td>
              </tr>
              <tr>
                <td className="pr-1 font-bold italic text-right">CONTRACTOR:</td>
                <td className="font-bold px-1">{PROJECT_INFO.contractor.toUpperCase()}</td>
              </tr>
              <tr>
                <td className="pr-1 font-bold italic text-right">CONTRACT NO</td>
                <td className="font-bold px-1">{PROJECT_INFO.contract_no}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* HDC logo */}
        <img src={hdcLogo} alt="HDC" className="h-14 ml-4" />
      </div>

      {/* Inspection info right-aligned table */}
      <div className="flex justify-end mb-3">
        <table className="border-collapse">
          <tbody>
            <tr>
              <td className="border border-black/40 px-3 py-1 text-[11px] font-bold text-right">Inspection #:</td>
              <td className="border border-black/40 px-3 py-1 text-[11px] text-center" style={{ minWidth: '120px' }}>
                RFI-{data.inspection_no ?? '____'}
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-3 py-1 text-[11px] font-bold text-right">Date:</td>
              <td className="border border-black/40 px-3 py-1 text-[11px] text-center">
                {formatDate(data.inspection_date)}
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-3 py-1 text-[11px] font-bold text-right">Time:</td>
              <td className="border border-black/40 px-3 py-1 text-[11px] text-center">{data.inspection_time || ''}</td>
            </tr>
            <tr>
              <td className="border border-black/40 px-3 py-1 text-[11px] font-bold text-right">Location:</td>
              <td className="border border-black/40 px-3 py-1 text-[11px] text-center">{data.location || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Checklist Table */}
      <table className="w-full border-collapse mb-3">
        <thead>
          <tr>
            <th className="border border-black/40 px-2 py-1.5 text-[11px] font-bold text-center bg-white" style={{ width: '55%' }}>
              WORKS INSPECTED
            </th>
            <th className="border border-black/40 px-2 py-1.5 text-[11px] font-bold text-center bg-white" style={{ width: '12%' }}>
              ✓/✗/NA
            </th>
            <th className="border border-black/40 px-2 py-1.5 text-[11px] font-bold text-center bg-white">
              COMMENTS
            </th>
          </tr>
        </thead>
        <tbody>
          {data.checklist_items.map((item, index) => (
            <tr key={index}>
              <td className={cellStyle}>{item.description}</td>
              <td className={cellStyle + " text-center"}>
                <select
                  className="bg-[#FFFDE7] border border-black/20 rounded px-1 py-0.5 text-[11px] focus:outline-none w-full text-center"
                  value={item.result}
                  onChange={(e) => updateChecklistItem(index, { result: e.target.value as ChecklistItem['result'] })}
                >
                  <option value="">—</option>
                  <option value="pass">✓</option>
                  <option value="fail">✗</option>
                  <option value="na">N/A</option>
                </select>
              </td>
              <td className={cellStyle}>
                <input
                  className={inputStyle}
                  value={item.comments}
                  onChange={(e) => updateChecklistItem(index, { comments: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Comments on completed works */}
      <table className="w-full border-collapse mb-4">
        <tbody>
          <tr>
            <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold bg-white" colSpan={2}>
              Comments on completed works:
            </td>
          </tr>
          {[...Array(10)].map((_, i) => (
            <tr key={i}>
              <td className="border border-black/40 px-2 py-1" colSpan={2}>
                {i === 0 ? (
                  <textarea
                    className={inputStyle + " min-h-[16px] resize-none"}
                    value={data.completed_works_comments}
                    onChange={(e) => onChange({ completed_works_comments: e.target.value })}
                    rows={1}
                  />
                ) : (
                  <div className="h-[16px]" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Representatives - side by side */}
      <div className="flex gap-0">
        {/* Contractor Representative */}
        <table className="border-collapse flex-1">
          <tbody>
            <tr>
              <td colSpan={2} className="border border-black/40 px-2 py-1 text-[11px] font-bold text-center bg-white">
                Contractor Representative
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold text-right" style={{ width: '100px' }}>Name:</td>
              <td className="border border-black/40 px-2 py-1 text-[11px]">
                <input className={inputStyle} value={data.page2_contractor_name} onChange={(e) => onChange({ page2_contractor_name: e.target.value })} />
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold text-right">Designation:</td>
              <td className="border border-black/40 px-2 py-1 text-[11px]">
                <input className={inputStyle} value={data.page2_contractor_designation} onChange={(e) => onChange({ page2_contractor_designation: e.target.value })} />
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold text-right">Signature:</td>
              <td className="border border-black/40 px-2 py-1 text-[11px] h-8"></td>
            </tr>
          </tbody>
        </table>

        {/* Client Representative */}
        <table className="border-collapse flex-1">
          <tbody>
            <tr>
              <td colSpan={2} className="border border-black/40 px-2 py-1 text-[11px] font-bold text-center bg-white">
                Client Representative
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold text-right" style={{ width: '100px' }}>Name:</td>
              <td className="border border-black/40 px-2 py-1 text-[11px]">
                <input className={inputStyle} value={data.page2_client_name} onChange={(e) => onChange({ page2_client_name: e.target.value })} />
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold text-right">Designation:</td>
              <td className="border border-black/40 px-2 py-1 text-[11px]">
                <input className={inputStyle} value={data.page2_client_designation} onChange={(e) => onChange({ page2_client_designation: e.target.value })} />
              </td>
            </tr>
            <tr>
              <td className="border border-black/40 px-2 py-1 text-[11px] font-semibold text-right">Signature:</td>
              <td className="border border-black/40 px-2 py-1 text-[11px] h-8"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Page footer */}
      <div className="text-right text-[9px] text-gray-500 mt-6">Page 2 of 2</div>
    </div>
  );
};

export default RfiPage2;
