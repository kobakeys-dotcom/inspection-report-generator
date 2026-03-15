import { RfiFormData, PROJECT_INFO } from '@/types/rfi';
import hdcLogo from '@/assets/hdc-logo.png';
import bltLogo from '@/assets/blt-logo.png';

interface RfiPage1Props {
  data: RfiFormData;
  onChange: (data: Partial<RfiFormData>) => void;
}

const inp = "w-full bg-[#FFFDE7] border-0 border-b border-[#999] px-1 py-0 text-[10px] leading-[16px] focus:outline-none focus:bg-[#FFF9C4]";
const redInp = "w-full bg-[#FFF0E0] border-0 border-b border-[#999] px-1 py-0 text-[10px] leading-[16px] focus:outline-none focus:bg-[#FFE0B2]";
const td = "border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] leading-[14px]";
const tdLabel = "border-[0.5px] border-[#888] px-[6px] py-[3px] text-[10px] leading-[14px] font-semibold";
const greenBar = "bg-[#4CAF50] text-white text-[10px] font-semibold px-[6px] py-[3px] border-[0.5px] border-[#888]";
const sectionBorder = "border-[0.5px] border-[#888]";

const RfiPage1 = ({ data, onChange }: RfiPage1Props) => {
  return (
    <div className="bg-white text-black border-[0.5px] border-[#888]" style={{ fontFamily: "Calibri, 'Segoe UI', Arial, sans-serif", fontSize: '10px', lineHeight: '1.3' }}>
      <div className="p-[20px]">
        {/* Header: HDC logo + form number left, Inspection NO right */}
        <div className="flex justify-between items-start">
          <div>
            <img src={hdcLogo} alt="HDC" className="h-[36px] mb-[2px]" />
            <div className="text-[8px] mt-[1px]">PMD-2021-FRM-108 _ V 1.2</div>
          </div>
          <div className="text-right text-[10px]">
            INSPECTION NO: IR-{data.inspection_no ?? '____'}
          </div>
        </div>

        {/* Title + HDC address */}
        <div className="flex justify-between items-start mt-[6px]">
          <div>
            <h1 className="text-[16px] font-black leading-tight">REQUEST FOR INSPECTION</h1>
            <div className="text-[9px] mt-[2px]">Project Management Section</div>
            <div className="text-[8px] tracking-[0.5px] mt-[1px]">PROJECT MANAGEMENT & DEVELOPMENT</div>
          </div>
          <div className="text-right text-[8px] leading-[12px]">
            <div>Housing Development Corporation Limited</div>
            <div>HDC Building, Hulhumalé, Republic of Maldives</div>
            <div>Hotline 1516 &nbsp; T +960 335 3535</div>
            <div>E hello@hdc.mv &nbsp; W www.hdc.mv</div>
          </div>
        </div>

        {/* Green thick line */}
        <div className="h-[2.5px] bg-[#4CAF50] mt-[8px] mb-[10px]" />

        {/* Project Details + BLT logo side by side */}
        <div className="flex items-start mb-[6px]">
          <table className="border-collapse" style={{ width: '58%' }}>
            <tbody>
              <tr>
                <td colSpan={2} className={greenBar}>
                  Project Details
                </td>
              </tr>
              <tr>
                <td className={tdLabel} style={{ width: '100px' }}>Project</td>
                <td className={td}>{PROJECT_INFO.project}</td>
              </tr>
              <tr>
                <td className={tdLabel}>Contractor</td>
                <td className={td}>{PROJECT_INFO.contractor}</td>
              </tr>
              <tr>
                <td className={tdLabel}>Contract No</td>
                <td className={td}>{PROJECT_INFO.contract_no}</td>
              </tr>
              <tr>
                <td className={tdLabel}>Client</td>
                <td className={td}>{PROJECT_INFO.client}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center justify-center flex-1 self-stretch">
            <img src={bltLogo} alt="BLT Brilliant" style={{ height: '48px' }} />
          </div>
        </div>

        {/* Inspection Details */}
        <table className="w-full border-collapse mb-[6px]">
          <tbody>
            <tr><td colSpan={4} className={greenBar}>Inspection Details</td></tr>
            <tr>
              <td className={tdLabel} style={{ width: '90px' }}>Ref. Drawing</td>
              <td className={td}><input className={inp} value={data.ref_drawing} onChange={(e) => onChange({ ref_drawing: e.target.value })} /></td>
              <td className={tdLabel} style={{ width: '40px' }}>Date</td>
              <td className={td} style={{ width: '100px' }}><input type="date" className={inp} value={data.inspection_date} onChange={(e) => onChange({ inspection_date: e.target.value })} /></td>
            </tr>
            <tr>
              <td className={tdLabel}>Work Site</td>
              <td className={td}><input className={inp} value={data.work_site} onChange={(e) => onChange({ work_site: e.target.value })} /></td>
              <td className={tdLabel}>Time</td>
              <td className={td}><input type="time" className={inp} value={data.inspection_time} onChange={(e) => onChange({ inspection_time: e.target.value })} /></td>
            </tr>
            <tr>
              <td className={tdLabel}>Location</td>
              <td className={td} colSpan={3}><input className={inp} value={data.location} onChange={(e) => onChange({ location: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>

        {/* Received by [Client] */}
        <div className={`${sectionBorder} mb-[6px] p-[8px]`}>
          <div className="text-[10px] font-semibold mb-[6px]">Received by [Client]</div>
          <div className="flex">
            <div style={{ width: '50%' }} />
            <div style={{ width: '50%' }} className="space-y-[6px]">
              {(['received_by_name', 'received_by_designation', 'received_by_date'] as const).map((field, i) => (
                <div key={field} className="flex items-center gap-[4px]">
                  <span className="text-[10px] font-semibold w-[70px]">{['Name:', 'Designation:', 'Date:'][i]}</span>
                  <div className="flex-1 border-b border-[#333]">
                    <input
                      type={field === 'received_by_date' ? 'date' : 'text'}
                      className="w-full bg-transparent border-0 px-0 py-0 text-[10px] leading-[16px] focus:outline-none"
                      value={data[field]}
                      onChange={(e) => onChange({ [field]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrange Inspection for */}
        <table className="w-full border-collapse mb-[6px]">
          <tbody>
            <tr><td colSpan={2} className={greenBar}>Arrange Inspection for:</td></tr>
            {[1, 2, 3, 4, 5].map((num) => {
              const key = `inspection_item_${num}` as keyof RfiFormData;
              return (
                <tr key={num}>
                  <td className={td} style={{ width: '20px', textAlign: 'center' }}>{num}</td>
                  <td className={td}><input className={inp} value={data[key] as string} onChange={(e) => onChange({ [key]: e.target.value })} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Weather condition */}
        <table className="w-full border-collapse mb-[6px]">
          <tbody>
            <tr><td className={greenBar}>Weather condition:</td></tr>
            <tr><td className={td} style={{ height: '28px' }}><input className={inp} value={data.weather_condition} onChange={(e) => onChange({ weather_condition: e.target.value })} /></td></tr>
          </tbody>
        </table>

        {/* Pre-Inspection checked by Contractor */}
        <div className={`${sectionBorder} mb-[6px] p-[8px]`}>
          <div className="text-[10px] font-semibold mb-[6px]">Pre-Inspection checked by Contractor</div>
          <div className="flex">
            <div style={{ width: '50%' }} />
            <div style={{ width: '50%' }} className="space-y-[6px]">
              {(['pre_inspection_name', 'pre_inspection_designation', 'pre_inspection_date'] as const).map((field, i) => (
                <div key={field} className="flex items-center gap-[4px]">
                  <span className="text-[10px] font-semibold w-[70px]">{['Name:', 'Designation:', 'Date:'][i]}</span>
                  <div className="flex-1 border-b border-[#333]">
                    <input
                      type={field === 'pre_inspection_date' ? 'date' : 'text'}
                      className="w-full bg-transparent border-0 px-0 py-0 text-[10px] leading-[16px] focus:outline-none"
                      value={data[field]}
                      onChange={(e) => onChange({ [field]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments (URBANCO USE ONLY) */}
        <table className="w-full border-collapse mb-[6px]">
          <tbody>
            <tr><td colSpan={2} className="bg-[#F5C242] text-black text-[10px] font-semibold px-[6px] py-[3px] border-[0.5px] border-[#888] text-center">
              Comments (URBANCO USE ONLY):
            </td></tr>
            <tr>
              <td className={td} style={{ width: '140px', verticalAlign: 'top' }}>
                <span className="text-[9px]">Relevant Sub-clause/Term</span>
              </td>
              <td className={td} rowSpan={2}>
                <textarea className={redInp + " min-h-[50px]"} value={data.comments} onChange={(e) => onChange({ comments: e.target.value })} rows={3} />
              </td>
            </tr>
            <tr><td className={td}>&nbsp;</td></tr>
          </tbody>
        </table>

        {/* Client Representative */}
        <div className={`${sectionBorder} mb-[6px] p-[8px]`}>
          <div className="text-[10px] font-semibold mb-[6px]">Client Representative</div>
          <div className="flex">
            <div style={{ width: '50%' }} className="flex flex-col justify-center items-center">
              <div className="border-r border-[#888] h-full w-full flex items-center justify-center">
                <span className="text-[10px] text-[#bbb] italic">Signature</span>
              </div>
            </div>
            <div style={{ width: '50%' }} className="pl-[8px] space-y-[6px]">
              {(['client_rep_name', 'client_rep_designation', 'client_rep_date'] as const).map((field, i) => (
                <div key={field} className="flex items-center gap-[4px]">
                  <span className="text-[10px] font-semibold w-[70px]">{['Name:', 'Designation:', 'Date:'][i]}</span>
                  <div className="flex-1 border-b border-[#333]">
                    <input
                      type={field === 'client_rep_date' ? 'date' : 'text'}
                      className="w-full bg-transparent border-0 px-0 py-0 text-[10px] leading-[16px] focus:outline-none"
                      value={data[field]}
                      onChange={(e) => onChange({ [field]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contractor Representative */}
        <div className={`${sectionBorder} p-[8px]`}>
          <div className="text-[10px] font-semibold mb-[6px]">Contractor Representative</div>
          <div className="flex">
            <div style={{ width: '50%' }} />
            <div style={{ width: '50%' }} className="space-y-[6px]">
              {(['contractor_rep_name', 'contractor_rep_designation', 'contractor_rep_date'] as const).map((field, i) => (
                <div key={field} className="flex items-center gap-[4px]">
                  <span className="text-[10px] font-semibold w-[70px]">{['Name:', 'Designation:', 'Date:'][i]}</span>
                  <div className="flex-1 border-b border-[#333]">
                    <input
                      type={field === 'contractor_rep_date' ? 'date' : 'text'}
                      className="w-full bg-transparent border-0 px-0 py-0 text-[10px] leading-[16px] focus:outline-none"
                      value={data[field]}
                      onChange={(e) => onChange({ [field]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page footer */}
      <div className="text-right text-[8px] text-[#999] px-[20px] pb-[8px]">Page 1 of 2</div>
    </div>
  );
};

export default RfiPage1;
