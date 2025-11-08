// src/components/Dashboard/ResponseCard.jsx
import React from "react";

export default function ResponseCard({ data }) {
  if (!data) return null;
  const badge = (v) =>
    v === "HIGH" ? "bg-red-100 text-red-700"
    : v === "MEDIUM" ? "bg-yellow-100 text-yellow-700"
    : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Assistant Answer</h3>
        {data.verdict && (
          <span className={`text-xs px-2 py-1 rounded ${badge(data.verdict)}`}>
            {data.verdict}
          </span>
        )}
      </div>
      <p className="mt-3 leading-relaxed">{data.rag_answer}</p>
      {!!data.recommendations?.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.recommendations.map((r, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {r.segment_type}:{r.segment} — {r.action}
            </span>
          ))}
        </div>
      )}
      {data.summary && <div className="mt-2 text-sm text-gray-600">{data.summary}</div>}
    </div>
  );
}
