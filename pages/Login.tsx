
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin login shortcut
    if (email === 'admin@ngoda.ai' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-0',
        fullName: 'System Administrator',
        email: 'admin@ngoda.ai',
        phone: '0000',
        role: UserRole.ADMIN,
        progress: [],
        createdAt: new Date().toISOString()
      };
      onLogin(adminUser);
      navigate('/admin');
      return;
    }

    const savedUsersStr = localStorage.getItem('ngoda_users_db');
    if (!savedUsersStr) {
      setError('Invalid credentials');
      return;
    }

    const users: User[] = JSON.parse(savedUsersStr);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin(user);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-10">
            <div className="flex items-center justify-center mb-6 space-x-2">
              <Sparkles className="text-blue-600" size={32} />
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">NGODA AI</h1>
            </div>
            
            <h2 className="text-center text-gray-500 font-medium mb-8">Login to your student account</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-left-2">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <label className="text-xs font-bold uppercase text-gray-400 absolute -top-2 left-3 bg-white px-1">Email</label>
                <div className="flex items-center border-2 border-gray-100 rounded-2xl focus-within:border-blue-500 transition px-4 py-4">
                  <Mail className="text-gray-400 mr-3" size={20} />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 outline-none text-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold uppercase text-gray-400 absolute -top-2 left-3 bg-white px-1">Password</label>
                <div className="flex items-center border-2 border-gray-100 rounded-2xl focus-within:border-blue-500 transition px-4 py-4">
                  <Lock className="text-gray-400 mr-3" size={20} />
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="flex-1 outline-none text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">Forgot password?</button>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <LogIn size={20} />
                <span>Login Now</span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500">Don't have an account?</p>
              <Link to="/register" className="text-blue-600 font-bold hover:underline">Register as a New Student</Link>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">© 2024 NGODA AI LEARNING SCHOOL. All Rights Reserved.</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>Demo Admin: admin@ngoda.ai / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
