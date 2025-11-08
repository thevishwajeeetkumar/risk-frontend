import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth.jsx';
import { toast } from 'react-toastify';

export default function Register() {
  const { register: doRegister } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { username: '', email: '', password: '', role: 'Analyst' }
  });

  const onSubmit = async (vals) => {
    try {
      await doRegister(vals);
      toast.success('Account created. You can log in now.');
      reset();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-sm text-gray-700">Username</label>
          <input className="w-full mt-1 rounded border px-3 py-2"
                 {...register('username', { required: 'Username is required' })}/>
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input className="w-full mt-1 rounded border px-3 py-2" type="email"
                 {...register('email', { required: 'Email is required' })}/>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-700">Password</label>
          <input className="w-full mt-1 rounded border px-3 py-2" type="password"
                 {...register('password', {
                   required: 'Password is required',
                   minLength: { value: 8, message: 'Min 8 characters' }
                 })}/>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-700">Role</label>
          <select className="w-full mt-1 rounded border px-3 py-2"
                  {...register('role', { required: true })}>
            <option value="Analyst">Analyst</option>
            <option value="CRO">CRO</option>
          </select>
        </div>
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
