import { useState } from 'react';
import { useAuth } from './useAuth.jsx';

export default function useQueryApi() {
  const { api } = useAuth();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  const ask = async ({ query, file_id, top_k = 5 }) => {
    setLoading(true);
    setError('');
    setAnswer(null);
    try {
      const { data } = await api.post('/api/query', { query, file_id, top_k });
      setAnswer(data);
      return data;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Query failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { loading, answer, error, ask };
}
