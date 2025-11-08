import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ username, password }) => {
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.detail || 'Invalid login credentials';
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              autoComplete="username"
              {...register('username', { required: 'Username is required' })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in…' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
