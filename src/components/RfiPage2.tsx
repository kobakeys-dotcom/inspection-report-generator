import { RfiFormData, ChecklistItem, PROJECT_INFO } from '@/types/rfi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RfiPage2Props {
  data: RfiFormData;
  onChange: (data: Partial<RfiFormData>) => void;
}

const RfiPage2 = ({ data, onChange }: RfiPage2Props) => {
  const updateChecklistItem = (index: number, updates: Partial<ChecklistItem>) => {
    const items = [...data.checklist_items];
    items[index] = { ...items[index], ...updates };
    onChange({ checklist_items: items });
  };

  return (
    <div className="space-y-4">
      <div className="border border-foreground/30 rounded">
        {/* Header */}
        <div className="border-b border-foreground/30 p-3">
          <h1 className="text-lg font-bold text-primary text-center">
            CHECKLIST FOR CLADDING INSTALLATION COMPLETION
          </h1>
        </div>

        {/* Project info (auto-filled from page 1) */}
        <div className="border-b border-foreground/30 p-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            <div className="flex gap-2">
              <span className="font-bold w-28">PROJECT:</span>
              <span>{PROJECT_INFO.project.toUpperCase()}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">Inspection #:</span>
              <span className="text-accent font-semibold">RFI-{data.inspection_no ?? 'Auto'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">CLIENT:</span>
              <span>{PROJECT_INFO.client.toUpperCase()}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">Date:</span>
              <span>{data.inspection_date || '—'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">CONTRACTOR:</span>
              <span>{PROJECT_INFO.contractor.toUpperCase()}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">Time:</span>
              <span>{data.inspection_time || '—'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">CONTRACT NO:</span>
              <span>{PROJECT_INFO.contract_no}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold w-28">Location:</span>
              <span>{data.location || '—'}</span>
            </div>
          </div>
        </div>

        {/* Checklist Table */}
        <div className="border-b border-foreground/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="border-b border-r border-foreground/30 p-2 text-left w-12">#</th>
                <th className="border-b border-r border-foreground/30 p-2 text-left">WORKS INSPECTED</th>
                <th className="border-b border-r border-foreground/30 p-2 text-center w-28">✓/✗/NA</th>
                <th className="border-b border-foreground/30 p-2 text-left w-48">COMMENTS</th>
              </tr>
            </thead>
            <tbody>
              {data.checklist_items.map((item, index) => (
                <tr key={index} className="border-b border-foreground/20 last:border-b-0">
                  <td className="border-r border-foreground/20 p-2 text-center font-medium">
                    {item.item_order}
                  </td>
                  <td className="border-r border-foreground/20 p-2">{item.description}</td>
                  <td className="border-r border-foreground/20 p-1 text-center">
                    <Select
                      value={item.result || undefined}
                      onValueChange={(val) =>
                        updateChecklistItem(index, { result: val as ChecklistItem['result'] })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-secondary/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">✓ Pass</SelectItem>
                        <SelectItem value="fail">✗ Fail</SelectItem>
                        <SelectItem value="na">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-1">
                    <input
                      className="w-full border border-input rounded px-2 py-1 text-xs bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                      value={item.comments}
                      onChange={(e) => updateChecklistItem(index, { comments: e.target.value })}
                      placeholder="Comments..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comments on completed works */}
        <div className="border-b border-foreground/30 p-3">
          <h2 className="text-sm font-bold mb-2 text-primary">Comments on completed works:</h2>
          <textarea
            className="w-full border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
            value={data.completed_works_comments}
            onChange={(e) => onChange({ completed_works_comments: e.target.value })}
            rows={4}
            placeholder="Enter comments on completed works..."
          />
        </div>

        {/* Page 2 Representatives */}
        <div className="p-3">
          <div className="grid grid-cols-2 gap-6">
            {/* Contractor Representative */}
            <div>
              <h2 className="text-sm font-bold mb-2 text-primary">Contractor Representative</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-24 shrink-0">Name</label>
                  <input
                    className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                    value={data.page2_contractor_name}
                    onChange={(e) => onChange({ page2_contractor_name: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-24 shrink-0">Designation</label>
                  <input
                    className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                    value={data.page2_contractor_designation}
                    onChange={(e) => onChange({ page2_contractor_designation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Client Representative */}
            <div>
              <h2 className="text-sm font-bold mb-2 text-primary">Client Representative</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-24 shrink-0">Name</label>
                  <input
                    className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                    value={data.page2_client_name}
                    onChange={(e) => onChange({ page2_client_name: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium w-24 shrink-0">Designation</label>
                  <input
                    className="flex-1 border border-input rounded px-2 py-1 text-sm bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-ring"
                    value={data.page2_client_designation}
                    onChange={(e) => onChange({ page2_client_designation: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfiPage2;
