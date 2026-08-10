import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X, Eye, FileCheck } from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  url: string;
  sizeKb: number;
  uploadedAt: string;
}

interface DocumentUploaderProps {
  label: string;
  description?: string;
  docType: 'KEBELE_ID' | 'INCOME_LETTER' | 'MEDICAL_DOC' | 'PROOF_PHOTO' | 'BANK_SLIP' | string;
  uploadedDocs: UploadedDoc[];
  onUploadSuccess: (newDoc: UploadedDoc) => void;
  onRemoveDoc?: (docId: string) => void;
  required?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  description,
  docType,
  uploadedDocs,
  onUploadSuccess,
  onRemoveDoc,
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);

  const filterDocs = uploadedDocs.filter((d) => d.type === docType);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    setTimeout(() => {
      const mockDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: docType,
        url: URL.createObjectURL(file),
        sizeKb: Math.round(file.size / 1024) || 350,
        uploadedAt: new Date().toISOString(),
      };
      onUploadSuccess(mockDoc);
      setIsUploading(false);
    }, 800);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="block text-xs font-bold text-slate-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] text-slate-500">PDF, JPG, PNG (Max 5MB)</span>
      </div>

      {description && <p className="text-[11px] text-slate-500">{description}</p>}

      {/* Already Uploaded Files List */}
      {filterDocs.length > 0 && (
        <div className="space-y-2">
          {filterDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-slate-800 truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{doc.sizeKb} KB • Uploaded</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className="p-1 hover:bg-emerald-100 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preview</span>
                </button>
                {onRemoveDoc && (
                  <button
                    type="button"
                    onClick={() => onRemoveDoc(doc.id)}
                    className="p-1 hover:bg-rose-100 rounded text-rose-600"
                    title="Delete document"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone Button */}
      {filterDocs.length === 0 && (
        <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/20 rounded-xl cursor-pointer transition-all">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleSimulateUpload}
            className="sr-only"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex items-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-amber-700">Validating & Encrypting File...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
              <p className="text-xs font-bold text-slate-700">Click to Upload or Drag File Here</p>
              <p className="text-[10px] text-slate-500">Government Encrypted Document Vault</p>
            </div>
          )}
        </label>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">{previewDoc.name}</h3>
                  <p className="text-[10px] text-slate-300">Document Type: {previewDoc.type}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex items-center justify-center">
              <img
                src={previewDoc.url}
                alt="Document Preview"
                className="max-h-96 rounded-lg border border-slate-300 shadow-md object-contain"
                onError={(e) => {
                  // Fallback preview
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-center p-8 bg-white rounded-xl border border-slate-200 max-w-md">
                <FileCheck className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Official Document Verified</h4>
                <p className="text-xs text-slate-600 mt-1">
                  File checksum matched. Stored securely on Adama Municipal Encrypted Vault.
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-3">
                  SHA256: 8f9b201a09e3921...
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
