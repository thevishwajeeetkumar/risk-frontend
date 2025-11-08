// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const { login } = useAuth(); // from hooks/useAuth.js
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: { username: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async ({ username, password }) => {
    setLoading(true);
    try {
      const profile = await login(username, password);
      toast.success('Logged in successfully');
      if (profile?.role === 'CRO') history.push('/cro');
      else history.push('/dashboard');
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        'Invalid credentials. Please check your username/password.';
      toast.error(msg);
      setError('username', { type: 'manual', message: '' });
      setError('password', { type: 'manual', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Sign in</h1>
          <p className="text-sm text-gray-500 mt-1">Access your ECL & RAG workspace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="jane.doe"
              autoComplete="username"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500">Don’t have an account?</span>
          <Link to="/register" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </div>
      </div>

      {/* Prefer a single ToastContainer at app root; included here if you don't have one */}
      <ToastContainer position="top-right" />
    </div>
  );
}
