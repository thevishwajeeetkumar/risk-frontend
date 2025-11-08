// src/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import UploadForm from "../components/Dashboard/UploadForm.jsx";
import QueryPrompt from "../components/Dashboard/QueryPrompt.jsx";
import ResponseCard from "../components/Dashboard/ResponseCard.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

/**
 * Normalize /api/segments payloads:
 * - when segment_type is omitted: { segments_by_type: { type: [..] } }
 * - when segment_type is provided: { segments: [..] }
 */
function normalizeSegments(payload) {
  if (!payload) return [];
  if (Array.isArray(payload.segments)) return payload.segments;

  const byType = payload.segments_by_type || {};
  const out = [];
  Object.entries(byType).forEach(([segment_type, arr]) => {
    (arr || []).forEach((it) =>
      out.push({
        segment_type,
        segment: it.segment,
        total_loans: it.total_loans,
        pd: it.pd,
        lgd: it.lgd,
        ead: it.ead,
        ecl: it.ecl,
      })
    );
  });
  return out;
}

export default function DashboardPage() {
  const { api } = useAuth();
  const [fileId, setFileId] = useState("");
  const [answer, setAnswer] = useState(null);
  const [segments, setSegments] = useState([]);
  const [loadingSegs, setLoadingSegs] = useState(false);

  // fetch segments (grouped) on first mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingSegs(true);
      try {
        // omit segment_type to get grouped view
        const { data } = await api.get("/api/segments", {
          params: { skip: 0, limit: 100 },
        });
        if (!cancelled) setSegments(normalizeSegments(data));
      } catch (e) {
        if (!cancelled) toast.error(e.message);
      } finally {
        if (!cancelled) setLoadingSegs(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [api]);

  // after successful upload, refresh segments again (so the page reflects new calc)
  const handleUploaded = (d) => {
    setFileId(d.file_id);
    // refresh segments with latest data
    (async () => {
      try {
        const { data } = await api.get("/api/segments", {
          params: { skip: 0, limit: 100 },
        });
        setSegments(normalizeSegments(data));
      } catch (e) {
        toast.error(e.message);
      }
    })();
  };

  const hasSegments = useMemo(() => segments && segments.length > 0, [segments]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 max-w-6xl mx-auto">
      {/* Upload */}
      <UploadForm onUploaded={handleUploaded} />

      {/* Query */}
      <QueryPrompt fileId={fileId} onAnswered={setAnswer} />

      {/* Answer */}
      <ResponseCard data={answer} />

      {/* Segments (RBAC-filtered server-side) */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Segments</h3>
          <button
            onClick={async () => {
              setLoadingSegs(true);
              try {
                const { data } = await api.get("/api/segments", {
                  params: { skip: 0, limit: 100 },
                });
                setSegments(normalizeSegments(data));
              } catch (e) {
                toast.error(e.message);
              } finally {
                setLoadingSegs(false);
              }
            }}
            className="text-sm bg-blue-600 text-white rounded px-3 py-1.5 hover:bg-blue-700 disabled:opacity-60"
            disabled={loadingSegs}
          >
            {loadingSegs ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {!loadingSegs && !hasSegments && (
          <div className="text-sm text-gray-500">
            No segments available yet. Upload a file to generate ECL segments or check your permissions.
          </div>
        )}

        {loadingSegs && (
          <div className="text-sm text-gray-500">Loading segments…</div>
        )}

        {hasSegments && !loadingSegs && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map((s, idx) => (
              <div key={`${s.segment_type}-${s.segment}-${idx}`} className="border rounded-lg p-4 text-sm hover:shadow-sm">
                <div className="text-gray-500 mb-1">{s.segment_type}</div>
                <div className="font-medium mb-2 break-words">{s.segment}</div>
                <div className="flex flex-wrap gap-2">
                  <Metric label="Loans" value={s.total_loans} />
                  <Metric label="PD" value={(s.pd ?? 0).toFixed(2)} />
                  <Metric label="LGD" value={(s.lgd ?? 0).toFixed(2)} />
                  <Metric label="EAD" value={Number(s.ead ?? 0).toLocaleString()} />
                  <Metric label="ECL" value={Number(s.ecl ?? 0).toLocaleString()} strong />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, strong = false }) {
  return (
    <div className="px-2 py-1 rounded bg-gray-50 border">
      <span className="text-gray-500">{label}: </span>
      <span className={strong ? "font-semibold" : ""}>{String(value)}</span>
    </div>
  );
}
