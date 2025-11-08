// src/components/Dashboard/UploadForm.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function UploadForm({ onUploaded }) {
  const { api } = useAuth();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState(null);

  const onUpload = async () => {
    if (!file) return toast.warn("Choose a CSV/XLS/XLSX file");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file); // <-- must be 'file'
      const { data } = await api.post("/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      sessionStorage.setItem("last_file_id", data.file_id);
      setSummary(data);
      onUploaded?.(data);
      toast.success(`Uploaded ${data.loan_count} loans`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-3">Upload Loan File</h3>
      <div className="flex gap-3">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={onUpload} disabled={busy}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>

      {summary && (
        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 border rounded">
            <div className="text-gray-500">File ID</div>
            <div className="font-mono">{summary.file_id}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-gray-500">Loans</div>
            <div className="font-semibold">{summary.loan_count}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-gray-500">Total ECL</div>
            <div className="font-semibold">{summary.statistics?.total_ecl?.toLocaleString?.()}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-gray-500">Segments</div>
            <div className="line-clamp-2">{(summary.segments || []).join(", ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
