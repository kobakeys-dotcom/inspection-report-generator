import { RfiFormData, PROJECT_INFO } from '@/types/rfi';
import hdcLogo from '@/assets/hdc-logo.png';
import bltLogo from '@/assets/blt-logo.png';

interface RfiPage1Props {
  data: RfiFormData;
  onChange: (data: Partial<RfiFormData>) => void;
}

const inputStyle = "w-full bg-[#FFFDE7] border-0 border-b border-black/30 px-1 py-0.5 text-[11px] focus:outline-none focus:bg-[#FFF9C4]";
const redInputStyle = "w-full bg-[#FFEBEE] border-0 border-b border-black/30 px-1 py-0.5 text-[11px] focus:outline-none focus:bg-[#FFCDD2]";
const cellStyle = "border border-black/40 px-2 py-1 text-[11px]";
const labelCell = "border border-black/40 px-2 py-1 text-[11px] font-semibold bg-white";
const greenHeader = "bg-[#4CAF50] text-white text-[11px] font-bold px-2 py-1 border border-black/40";

const RfiPage1 = ({ data, onChange }: RfiPage1Props) => {
  return (
    <div className="bg-white text-black" style={{ fontFamily: "'Segoe UI', Calibri, Arial, sans-serif", fontSize: '11px', lineHeight: '1.4' }}>
      {/* Top header with logos */}
      <div className="flex justify-between items-start mb-0">
        <div>
          <img src={hdcLogo} alt="HDC" className="h-12 mb-1" />
          <div className="text-[10px]">PMD-2021-FRM-108 _ V 1.2</div>
        </div>
        <div className="text-right text-[11px] font-semibold">
          INSPECTION NO: IR-{data.inspection_no ?? '____'}
        </div>
      </div>

      {/* Title row */}
      <div className="flex justify-between items-start mt-2 mb-1">
        <div>
          <h1 className="text-[18px] font-black tracking-tight leading-tight">REQUEST FOR INSPECTION</h1>
          <div className="text-[10px] mt-0.5">Project Management Section</div>
          <div className="text-[10px] tracking-wide">PROJECT MANAGEMENT & DEVELOPMENT</div>
        </div>
        <div className="text-right text-[9px] leading-relaxed">
          <div>Housing Development Corporation Limited</div>
          <div>HDC Building, Hulhumalé, Republic of Maldives</div>
          <div>Hotline 1516 &nbsp; T +960 335 3535</div>
          <div>E hello@hdc.mv &nbsp; W www.hdc.mv</div>
        </div>
      </div>

      {/* Green divider line */}
      <div className="h-[3px] bg-[#4CAF50] mb-3 mt-1" />

      {/* Project Details */}
      <table className="w-full border-collapse mb-2" style={{ maxWidth: '65%' }}>
        <tbody>
          <tr><td colSpan={2} className={greenHeader}>Project Details</td></tr>
          <tr>
            <td className={labelCell} style={{ width: '120px' }}>Project</td>
            <td className={cellStyle}>{PROJECT_INFO.project}</td>
          </tr>
          <tr>
            <td className={labelCell}>Contractor</td>
            <td className={cellStyle}>{PROJECT_INFO.contractor}</td>
          </tr>
          <tr>
            <td className={labelCell}>Contract No</td>
            <td className={cellStyle}>{PROJECT_INFO.contract_no}</td>
          </tr>
          <tr>
            <td className={labelCell}>Client</td>
            <td className={cellStyle}>{PROJECT_INFO.client}</td>
          </tr>
        </tbody>
      </table>

      {/* BLT Brilliant logo positioned to the right of project details */}
      <div className="flex justify-between items-start -mt-[120px] mb-2">
        <div style={{ width: '65%' }} />
        <img src={bltLogo} alt="BLT Brilliant" className="h-14" />
      </div>

      {/* Inspection Details */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <tr><td colSpan={4} className={greenHeader}>Inspection Details</td></tr>
          <tr>
            <td className={labelCell} style={{ width: '100px' }}>Ref. Drawing</td>
            <td className={cellStyle} style={{ width: '40%' }}>
              <input className={inputStyle} value={data.ref_drawing} onChange={(e) => onChange({ ref_drawing: e.target.value })} />
            </td>
            <td className={labelCell} style={{ width: '50px' }}>Date</td>
            <td className={cellStyle}>
              <input type="date" className={inputStyle} value={data.inspection_date} onChange={(e) => onChange({ inspection_date: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td className={labelCell}>Work Site</td>
            <td className={cellStyle}>
              <input className={inputStyle} value={data.work_site} onChange={(e) => onChange({ work_site: e.target.value })} />
            </td>
            <td className={labelCell}>Time</td>
            <td className={cellStyle}>
              <input type="time" className={inputStyle} value={data.inspection_time} onChange={(e) => onChange({ inspection_time: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td className={labelCell}>Location</td>
            <td className={cellStyle} colSpan={3}>
              <input className={inputStyle} value={data.location} onChange={(e) => onChange({ location: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Received by [Client] */}
      <div className="border border-black/40 mb-2 p-2">
        <div className="text-[11px] font-semibold mb-2">Received by [Client]</div>
        <div className="flex">
          <div style={{ width: '50%' }} />
          <div style={{ width: '50%' }} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Name:</span>
              <input className={inputStyle} value={data.received_by_name} onChange={(e) => onChange({ received_by_name: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Designation:</span>
              <input className={inputStyle} value={data.received_by_designation} onChange={(e) => onChange({ received_by_designation: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Date:</span>
              <input type="date" className={inputStyle} value={data.received_by_date} onChange={(e) => onChange({ received_by_date: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Arrange Inspection for */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <tr><td colSpan={2} className={greenHeader}>Arrange Inspection for:</td></tr>
          {[1, 2, 3, 4, 5].map((num) => {
            const key = `inspection_item_${num}` as keyof RfiFormData;
            return (
              <tr key={num}>
                <td className={cellStyle} style={{ width: '24px', textAlign: 'center' }}>{num}</td>
                <td className={cellStyle}>
                  <input className={inputStyle} value={data[key] as string} onChange={(e) => onChange({ [key]: e.target.value })} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Weather condition */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <tr><td className={greenHeader}>Weather condition:</td></tr>
          <tr><td className={cellStyle}>
            <input className={inputStyle} value={data.weather_condition} onChange={(e) => onChange({ weather_condition: e.target.value })} />
          </td></tr>
        </tbody>
      </table>

      {/* Pre-Inspection checked by Contractor */}
      <div className="border border-black/40 mb-2 p-2">
        <div className="text-[11px] font-semibold mb-2">Pre-Inspection checked by Contractor</div>
        <div className="flex">
          <div style={{ width: '50%' }} />
          <div style={{ width: '50%' }} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Name:</span>
              <input className={inputStyle} value={data.pre_inspection_name} onChange={(e) => onChange({ pre_inspection_name: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Designation:</span>
              <input className={inputStyle} value={data.pre_inspection_designation} onChange={(e) => onChange({ pre_inspection_designation: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Date:</span>
              <input type="date" className={inputStyle} value={data.pre_inspection_date} onChange={(e) => onChange({ pre_inspection_date: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Comments (URBANCO USE ONLY) */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <tr><td colSpan={2} className="bg-[#FFCDD2] text-black text-[11px] font-bold px-2 py-1 border border-black/40 text-center">
            Comments (URBANCO USE ONLY):
          </td></tr>
          <tr>
            <td className={cellStyle} style={{ width: '180px', verticalAlign: 'top' }}>
              <span className="text-[10px]">Relevant Sub-clause/Term</span>
            </td>
            <td className={cellStyle}>
              <textarea className={redInputStyle + " min-h-[60px]"} value={data.comments} onChange={(e) => onChange({ comments: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Client Representative */}
      <div className="border border-black/40 mb-2 p-2">
        <div className="text-[11px] font-semibold mb-2">Client Representative</div>
        <div className="flex">
          <div style={{ width: '50%' }} className="flex items-center">
            <span className="text-[11px] text-gray-400 italic">Signature</span>
          </div>
          <div style={{ width: '50%' }} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Name:</span>
              <input className={inputStyle} value={data.client_rep_name} onChange={(e) => onChange({ client_rep_name: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Designation:</span>
              <input className={inputStyle} value={data.client_rep_designation} onChange={(e) => onChange({ client_rep_designation: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Date:</span>
              <input type="date" className={inputStyle} value={data.client_rep_date} onChange={(e) => onChange({ client_rep_date: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Contractor Representative */}
      <div className="border border-black/40 mb-2 p-2">
        <div className="text-[11px] font-semibold mb-2">Contractor Representative</div>
        <div className="flex">
          <div style={{ width: '50%' }} />
          <div style={{ width: '50%' }} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Name:</span>
              <input className={inputStyle} value={data.contractor_rep_name} onChange={(e) => onChange({ contractor_rep_name: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Designation:</span>
              <input className={inputStyle} value={data.contractor_rep_designation} onChange={(e) => onChange({ contractor_rep_designation: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold w-24">Date:</span>
              <input type="date" className={inputStyle} value={data.contractor_rep_date} onChange={(e) => onChange({ contractor_rep_date: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Page footer */}
      <div className="text-right text-[9px] text-gray-500 mt-4">Page 1 of 2</div>
    </div>
  );
};

export default RfiPage1;
