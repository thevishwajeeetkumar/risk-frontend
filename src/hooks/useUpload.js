import { useState } from 'react';
import { useAuth } from './useAuth.jsx';

export default function useUpload() {
  const { api } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setStatus('uploading');
    setError('');
    setResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const { data } = await api.post('/api/upload', form);
      setResult(data);
      setStatus('success');
      return data;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Upload failed');
      setStatus('error');
      throw e;
    }
  };

  return { status, result, error, upload };
}
