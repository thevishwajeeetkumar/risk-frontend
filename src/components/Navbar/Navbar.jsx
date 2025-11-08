import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded transition-colors ${
    isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink
          to={token ? '/dashboard' : '/login'}
          className="text-lg font-semibold tracking-wide hover:text-white/90"
        >
          ECL Analysis
        </NavLink>

        <div className="flex items-center gap-2 text-sm">
          {!token && (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}

          {token && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              {user?.role === 'CRO' && (
                <NavLink to="/cro" className={linkClass}>
                  CRO Dashboard
                </NavLink>
              )}
              {user?.username && <span className="px-3 text-white/80">Hi, {user.username}</span>}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
