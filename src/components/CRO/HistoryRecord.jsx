// src/components/CRO/HistoryRecord.jsx
import React from "react";

export default function HistoryRecord({ date, record, onClose }) {
  if (!record) return null;
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Record Details — {date}</h3>
        <button onClick={onClose} className="text-sm text-blue-600 hover:underline">Close</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3 text-sm mt-4">
        <Field k="Segment Type" v={record.segment_type} />
        <Field k="Segment" v={record.segment} />
        <Field k="Loans" v={record.total_loans} />
        <Field k="PD" v={(record.pd ?? 0).toFixed(2)} />
        <Field k="LGD" v={(record.lgd ?? 0).toFixed(2)} />
        <Field k="EAD" v={Number(record.ead ?? 0).toLocaleString()} />
        <Field k="ECL" v={Number(record.ecl ?? 0).toLocaleString()} />
      </div>
    </div>
  );
}

function Field({ k, v }) {
  return (
    <div className="p-3 border rounded">
      <div className="text-gray-500">{k}</div>
      <div className="font-medium">{String(v)}</div>
    </div>
  );
}
