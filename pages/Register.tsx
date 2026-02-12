
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Lock, Phone, BookCheck, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: 'AI Basics Course',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const savedUsersStr = localStorage.getItem('ngoda_users_db');
    const users: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    if (users.find(u => u.email === formData.email)) {
      setError('Email is already registered');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      password: formData.password,
      role: UserRole.STUDENT,
      progress: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('ngoda_users_db', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-blue-600 p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          <div className="p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">Join the Future</h1>
              <p className="text-gray-500 mt-2">Start your AI learning journey at NGODA</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition px-4 py-3">
                    <UserIcon className="text-gray-400 mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="flex-1 bg-transparent outline-none text-sm"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition px-4 py-3">
                    <Mail className="text-gray-400 mr-2" size={18} />
                    <input 
                      type="email" 
                      placeholder="jane@example.com" 
                      className="flex-1 bg-transparent outline-none text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition px-4 py-3">
                    <Phone className="text-gray-400 mr-2" size={18} />
                    <input 
                      type="tel" 
                      placeholder="+255..." 
                      className="flex-1 bg-transparent outline-none text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Course Selection</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition px-4 py-3">
                    <BookCheck className="text-gray-400 mr-2" size={18} />
                    <select 
                      className="flex-1 bg-transparent outline-none text-sm appearance-none"
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                    >
                      <option value="AI Basics Course">AI Basics Course</option>
                      <option value="Machine Learning Spec">Machine Learning Spec</option>
                      <option value="Prompt Engineering">Prompt Engineering</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition px-4 py-3">
                  <Lock className="text-gray-400 mr-2" size={18} />
                  <input 
                    type="password" 
                    placeholder="Min. 6 characters" 
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm Password</label>
                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition px-4 py-3">
                  <Lock className="text-gray-400 mr-2" size={18} />
                  <input 
                    type="password" 
                    placeholder="Repeat password" 
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Register as Student</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-500">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
