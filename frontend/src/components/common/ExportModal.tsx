import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Printer, X, Check } from 'lucide-react';

interface ExportModalProps {
  title: string;
  data: any[];
  filenamePrefix: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  title,
  data,
  filenamePrefix,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const val = row[fieldName];
            const escaped = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
            return `"${escaped.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded('CSV');
    setTimeout(() => setDownloaded(null), 3000);
  };

  const handlePrintReport = () => {
    window.print();
    setDownloaded('PRINT');
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Export Report & Data</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Select format for exporting <strong>{title}</strong> ({data.length} total records).
          </p>

          <div className="space-y-3">
            <button
              onClick={handleExportCSV}
              className="w-full p-4 border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Export as CSV / Excel</p>
                  <p className="text-[10px] text-slate-500">Raw tabular format for spreadsheet analysis</p>
                </div>
              </div>
              {downloaded === 'CSV' ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              )}
            </button>

            <button
              onClick={handlePrintReport}
              className="w-full p-4 border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-900 rounded-lg group-hover:scale-105 transition-transform">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Print Official Report / PDF</p>
                  <p className="text-[10px] text-slate-500">Includes Adama City Administration Seal</p>
                </div>
              </div>
              {downloaded === 'PRINT' ? (
                <Check className="w-5 h-5 text-amber-600" />
              ) : (
                <Printer className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              )}
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
