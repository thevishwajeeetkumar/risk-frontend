// src/components/Dashboard/QueryPrompt.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function QueryPrompt({ fileId, onAnswered }) {
  const { api } = useAuth();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!query.trim()) return toast.warn("Type your question");
    setBusy(true);
    try {
      const body = { query, top_k: 5 };
      if (fileId) body.file_id = fileId;
      const { data } = await api.post("/api/query", body, {
        headers: { "Content-Type": "application/json" },
      });
      onAnswered?.(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-3">Ask a question</h3>
      <div className="flex gap-3">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Which segments have the highest ECL?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={submit} disabled={busy}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {busy ? "Thinking…" : "Submit"}
        </button>
      </div>
      {fileId && (
        <p className="mt-2 text-xs text-gray-500">Targeting file: <span className="font-mono">{fileId}</span></p>
      )}
    </div>
  );
}
