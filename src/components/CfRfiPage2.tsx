import { CladdingFrameRfiFormData, CladdingFrameChecklistItem, CF_PROJECT_INFO } from '@/types/claddingFrameRfi';
import hdcLogo from '@/assets/hdc-logo.png';

interface CfRfiPage2Props {
  data: CladdingFrameRfiFormData;
  onChange: (data: Partial<CladdingFrameRfiFormData>) => void;
}

const inp = "w-full bg-[#FFFDE7] border-0 border-b border-[#999] px-1 py-0 text-[10px] leading-[16px] focus:outline-none focus:bg-[#FFF9C4]";
const td = "border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] leading-[14px]";

const CfRfiPage2 = ({ data, onChange }: CfRfiPage2Props) => {
  const updateChecklistItem = (index: number, updates: Partial<CladdingFrameChecklistItem>) => {
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
    <div className="bg-white text-black" style={{ fontFamily: "Calibri, 'Segoe UI', Arial, sans-serif", fontSize: '10px', lineHeight: '1.3' }}>
      <div className="p-[20px]">
        {/* Title + HDC logo */}
        <div className="flex justify-between items-start mb-[8px]">
          <div className="flex-1">
            <div className="text-[12px] font-bold underline text-center pr-[80px]">
              CHECKLIST FOR CLADDING FRAME INSTALLATION
            </div>
          </div>
          <img src={hdcLogo} alt="HDC" className="h-[36px]" />
        </div>

        {/* Project info + inspection table */}
        <div className="flex justify-between items-start mb-[10px]">
          <div>
            <table className="border-collapse text-[10px]">
              <tbody>
                <tr>
                  <td className="pr-[4px] font-bold italic text-right py-[1px]" style={{ width: '90px' }}>PROJECT:</td>
                  <td className="font-bold py-[1px]">{CF_PROJECT_INFO.project.toUpperCase()}</td>
                </tr>
                <tr>
                  <td className="pr-[4px] font-bold italic text-right py-[1px]">CLIENT:</td>
                  <td className="font-bold py-[1px]">{CF_PROJECT_INFO.client.toUpperCase()}</td>
                </tr>
                <tr>
                  <td className="pr-[4px] font-bold italic text-right py-[1px]">CONTRACTOR:</td>
                  <td className="font-bold py-[1px]">{CF_PROJECT_INFO.contractor.toUpperCase()}</td>
                </tr>
                <tr>
                  <td className="pr-[4px] font-bold italic text-right py-[1px]">CONTRACT NO</td>
                  <td className="font-bold py-[1px]">{CF_PROJECT_INFO.contract_no}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <table className="border-collapse">
            <tbody>
              {[
                ['Inspection #:', `RFI-${data.inspection_no ?? '____'}`],
                ['Date:', formatDate(data.inspection_date)],
                ['Time:', data.inspection_time || ''],
                ['Location:', data.location || ''],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td className="border-[0.5px] border-[#888] px-[6px] py-[2px] text-[10px] font-bold text-right" style={{ width: '75px' }}>{label}</td>
                  <td className="border-[0.5px] border-[#888] px-[6px] py-[2px] text-[10px] text-center" style={{ minWidth: '100px' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Checklist Table */}
        <table className="w-full border-collapse mb-[10px]">
          <thead>
            <tr>
              <th className="border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] font-bold text-center" style={{ width: '55%' }}>WORKS INSPECTED</th>
              <th className="border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] font-bold text-center" style={{ width: '10%' }}>✓/✗/NA</th>
              <th className="border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] font-bold text-center">COMMENTS</th>
            </tr>
          </thead>
          <tbody>
            {data.checklist_items.map((item, index) => (
              <tr key={index}>
                <td className={td}>{item.description}</td>
                <td className={td + " text-center"}>
                  <select
                    className="bg-[#FFFDE7] border-[0.5px] border-[#aaa] px-[2px] py-0 text-[10px] focus:outline-none w-full text-center"
                    value={item.result}
                    onChange={(e) => updateChecklistItem(index, { result: e.target.value as CladdingFrameChecklistItem['result'] })}
                  >
                    <option value="">—</option>
                    <option value="pass">✓</option>
                    <option value="fail">✗</option>
                    <option value="na">N/A</option>
                  </select>
                </td>
                <td className={td}>
                  <input className={inp} value={item.comments} onChange={(e) => updateChecklistItem(index, { comments: e.target.value })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Comments on completed works */}
        <table className="w-full border-collapse mb-[10px]">
          <tbody>
            <tr>
              <td className="border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] font-semibold">
                Comments on completed works:
              </td>
            </tr>
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td className="border-[0.5px] border-[#888] px-[6px]" style={{ height: '16px' }}>
                  {i === 0 ? (
                    <textarea
                      className="w-full bg-transparent border-0 px-0 py-0 text-[10px] leading-[14px] focus:outline-none resize-none"
                      value={data.completed_works_comments}
                      onChange={(e) => onChange({ completed_works_comments: e.target.value })}
                      rows={1}
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Representatives */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] font-bold text-center" style={{ width: '50%' }}>Contractor Representative</td>
              <td className="border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] font-bold text-center">Client Representative</td>
            </tr>
            {['Name:', 'Designation:', 'Signature:'].map((label, i) => {
              const cFields = ['page2_contractor_name', 'page2_contractor_designation', ''] as const;
              const clFields = ['page2_client_name', 'page2_client_designation', ''] as const;
              return (
                <tr key={label}>
                  <td className="border-[0.5px] border-[#888] px-[6px] py-[2px] text-[10px]">
                    <div className="flex items-center gap-[4px]">
                      <span className="font-semibold w-[70px]">{label}</span>
                      {i < 2 ? (
                        <input
                          className="flex-1 bg-transparent border-0 border-b border-[#999] px-0 py-0 text-[10px] leading-[16px] focus:outline-none"
                          value={data[cFields[i] as keyof CladdingFrameRfiFormData] as string || ''}
                          onChange={(e) => onChange({ [cFields[i]]: e.target.value })}
                        />
                      ) : <div className="flex-1 h-[20px]" />}
                    </div>
                  </td>
                  <td className="border-[0.5px] border-[#888] px-[6px] py-[2px] text-[10px]">
                    <div className="flex items-center gap-[4px]">
                      <span className="font-semibold w-[70px]">{label}</span>
                      {i < 2 ? (
                        <input
                          className="flex-1 bg-transparent border-0 border-b border-[#999] px-0 py-0 text-[10px] leading-[16px] focus:outline-none"
                          value={data[clFields[i] as keyof CladdingFrameRfiFormData] as string || ''}
                          onChange={(e) => onChange({ [clFields[i]]: e.target.value })}
                        />
                      ) : <div className="flex-1 h-[20px]" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right text-[8px] text-[#999] px-[20px] pb-[8px]">Page 2 of 2</div>
    </div>
  );
};

export default CfRfiPage2;
