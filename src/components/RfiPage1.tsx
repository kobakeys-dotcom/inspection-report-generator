import { RfiFormData, PROJECT_INFO } from '@/types/rfi';
import { format } from 'date-fns';

interface RfiPage1Props {
  data: RfiFormData;
  onChange: (data: Partial<RfiFormData>) => void;
}

const RfiPage1 = ({ data, onChange }: RfiPage1Props) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border border-foreground/30 rounded">
        <div className="flex justify-between items-start border-b border-foreground/30 p-3">
          <span className="text-xs text-muted-foreground">{PROJECT_INFO.form_number}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">INSPECTION NO: IR-</span>
            <span className="text-sm font-bold text-accent">{data.inspection_no ?? 'Auto'}</span>
          </div>
        </div>

        <div className="flex border-b border-foreground/30">
          <div className="flex-1 p-3">
            <h1 className="text-lg font-bold text-primary">REQUEST FOR INSPECTION</h1>
            <p className="text-xs text-muted-foreground mt-1">Project Management Section</p>
            <p className="text-xs text-muted-foreground">PROJECT MANAGEMENT & DEVELOPMENT</p>
          </div>
          <div className="w-64 p-3 text-right text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold">Housing Development Corporation Limited</p>
            <p>HDC Building, Hulhumalé, Republic of Maldives</p>
            <p>Hotline 1516 T +960 335 3535</p>
            <p>E hello@hdc.mv W www.hdc.mv</p>
          </div>
        </div>

        {/* Project Details - Fixed */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Project Details</h2>
          <div className="grid grid-cols-[120px_1fr] gap-y-1 text-sm">
            <span className="font-medium">Project</span>
            <span>{PROJECT_INFO.project}</span>
            <span className="font-medium">Contractor</span>
            <span>{PROJECT_INFO.contractor}</span>
            <span className="font-medium">Contract No</span>
            <span>{PROJECT_INFO.contract_no}</span>
            <span className="font-medium">Client</span>
            <span>{PROJECT_INFO.client}</span>
          </div>
        </div>

        {/* Inspection Details - Editable */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Inspection Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-28 shrink-0">Ref. Drawing</label>
                <input
                  className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={data.ref_drawing}
                  onChange={(e) => onChange({ ref_drawing: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-28 shrink-0">Work Site</label>
                <input
                  className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={data.work_site}
                  onChange={(e) => onChange({ work_site: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-28 shrink-0">Location</label>
                <input
                  className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={data.location}
                  onChange={(e) => onChange({ location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-20 shrink-0">Date</label>
                <input
                  type="date"
                  className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={data.inspection_date}
                  onChange={(e) => onChange({ inspection_date: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-20 shrink-0">Time</label>
                <input
                  type="time"
                  className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={data.inspection_time}
                  onChange={(e) => onChange({ inspection_time: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Received by Client */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Received by [Client]</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Name</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.received_by_name}
                onChange={(e) => onChange({ received_by_name: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Designation</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.received_by_designation}
                onChange={(e) => onChange({ received_by_designation: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-16 shrink-0">Date</label>
              <input
                type="date"
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.received_by_date}
                onChange={(e) => onChange({ received_by_date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Arrange Inspection for */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Arrange Inspection for:</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((num) => {
              const key = `inspection_item_${num}` as keyof RfiFormData;
              return (
                <div key={num} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-6">{num}</span>
                  <input
                    className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                    value={data[key] as string}
                    onChange={(e) => onChange({ [key]: e.target.value })}
                    placeholder={`Inspection item ${num}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather */}
        <div className="border-b border-foreground/30 p-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-primary w-40 shrink-0">Weather condition:</label>
            <input
              className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
              value={data.weather_condition}
              onChange={(e) => onChange({ weather_condition: e.target.value })}
            />
          </div>
        </div>

        {/* Pre-Inspection checked by Contractor */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Pre-Inspection checked by Contractor</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Name</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.pre_inspection_name}
                onChange={(e) => onChange({ pre_inspection_name: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Designation</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.pre_inspection_designation}
                onChange={(e) => onChange({ pre_inspection_designation: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-16 shrink-0">Date</label>
              <input
                type="date"
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.pre_inspection_date}
                onChange={(e) => onChange({ pre_inspection_date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Comments (URBANCO USE ONLY) */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-accent">Comments (URBANCO USE ONLY):</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <label className="text-sm font-medium w-40 shrink-0">Relevant Sub-clause/Term</label>
              <textarea
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-accent/10 focus:outline-none focus:ring-1 focus:ring-ring min-h-[40px]"
                value={data.relevant_subclause}
                onChange={(e) => onChange({ relevant_subclause: e.target.value })}
                rows={2}
              />
            </div>
            <textarea
              className="w-full border border-input rounded px-2 py-1 text-sm bg-accent/10 focus:outline-none focus:ring-1 focus:ring-ring"
              value={data.comments}
              onChange={(e) => onChange({ comments: e.target.value })}
              placeholder="Comments..."
              rows={3}
            />
          </div>
        </div>

        {/* Client Representative */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Client Representative</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Name</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.client_rep_name}
                onChange={(e) => onChange({ client_rep_name: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Designation</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.client_rep_designation}
                onChange={(e) => onChange({ client_rep_designation: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-16 shrink-0">Date</label>
              <input
                type="date"
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.client_rep_date}
                onChange={(e) => onChange({ client_rep_date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Contractor Representative */}
        <div className="p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Contractor Representative</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Name</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.contractor_rep_name}
                onChange={(e) => onChange({ contractor_rep_name: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-24 shrink-0">Designation</label>
              <input
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.contractor_rep_designation}
                onChange={(e) => onChange({ contractor_rep_designation: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-16 shrink-0">Date</label>
              <input
                type="date"
                className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                value={data.contractor_rep_date}
                onChange={(e) => onChange({ contractor_rep_date: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfiPage1;
