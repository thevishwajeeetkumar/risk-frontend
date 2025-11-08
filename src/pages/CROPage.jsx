import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.jsx';
import HistoryTable from '../components/CRO/HistoryTable.jsx';
import HistoryRecord from '../components/CRO/HistoryRecord.jsx';

export default function CROPage() {
  const { api, isCRO } = useAuth();
  const [history, setHistory] = useState({});
  const [picked, setPicked] = useState({ date: '', record: null });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const { data } = await api.get('/api/ecl/history');
        if (!cancelled) {
          setHistory(data.history || {});
        }
      } catch (error) {
        if (!cancelled) {
          const message = error?.response?.data?.detail || 'Failed to load ECL history';
          toast.error(message);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [api]);

  if (!isCRO) {
    return <div className="max-w-3xl mx-auto p-6">You do not have permission to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 max-w-6xl mx-auto">
      <HistoryTable historyByDate={history} onPick={(date, record) => setPicked({ date, record })} />
      <HistoryRecord
        date={picked.date}
        record={picked.record}
        onClose={() => setPicked({ date: '', record: null })}
      />
    </div>
  );
}
