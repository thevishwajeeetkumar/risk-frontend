// src/components/CRO/HistoryTable.jsx
import React, { useMemo } from "react";

export default function HistoryTable({ historyByDate, onPick }) {
  const rows = useMemo(() => {
    const out = [];
    Object.entries(historyByDate || {}).forEach(([day, items]) => {
      items.forEach((it, i) => out.push({ day, ...it, _k: `${day}-${i}` }));
    });
    return out;
  }, [historyByDate]);

  if (!rows.length) {
    return <div className="bg-white rounded-xl shadow p-6 text-gray-500">No history yet.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">ECL History</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Segment Type</th>
            <th className="py-2 pr-4">Segment</th>
            <th className="py-2 pr-4">Loans</th>
            <th className="py-2 pr-4">PD</th>
            <th className="py-2 pr-4">LGD</th>
            <th className="py-2 pr-4">EAD</th>
            <th className="py-2">ECL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._k} className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onPick?.(r.day, r)}>
              <td className="py-2 pr-4">{r.day}</td>
              <td className="py-2 pr-4">{r.segment_type}</td>
              <td className="py-2 pr-4">{r.segment}</td>
              <td className="py-2 pr-4">{r.total_loans}</td>
              <td className="py-2 pr-4">{(r.pd ?? 0).toFixed(2)}</td>
              <td className="py-2 pr-4">{(r.lgd ?? 0).toFixed(2)}</td>
              <td className="py-2 pr-4">{Number(r.ead ?? 0).toLocaleString()}</td>
              <td className="py-2">{Number(r.ecl ?? 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">Tip: click a row to open details.</p>
    </div>
  );
}
