
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Save, User as UserIcon, Mail, Phone, Lock, Camera, BookPlus } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [course] = useState(user.course || 'AI Specialization');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, fullName, email, phone };
    onUpdate(updatedUser);
    
    // Also update in global user DB
    const db = localStorage.getItem('ngoda_users_db');
    if (db) {
      const users: User[] = JSON.parse(db);
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], fullName, email, phone };
        localStorage.setItem('ngoda_users_db', JSON.stringify(users));
      }
    }
    
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-top-4 duration-500">
      <h1 className="text-3xl font-extrabold mb-8">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.fullName.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              <Camera size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="pt-16 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold flex items-center text-gray-600 dark:text-gray-400">
                <UserIcon size={14} className="mr-2" />
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold flex items-center text-gray-600 dark:text-gray-400">
                <Mail size={14} className="mr-2" />
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold flex items-center text-gray-600 dark:text-gray-400">
                <Phone size={14} className="mr-2" />
                Phone Number
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold flex items-center text-gray-600 dark:text-gray-400">
                <BookPlus size={14} className="mr-2" />
                Course Selection
              </label>
              <input 
                type="text" 
                value={course}
                disabled
                className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center space-x-2"
            >
              <Save size={18} />
              <span>Update Profile</span>
            </button>
            <button 
              type="button"
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center space-x-2"
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-2xl">
        <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Account Danger Zone</h4>
        <p className="text-sm text-red-500 mb-4">Once you delete your account, all your progress and certificates will be permanently removed.</p>
        <button className="text-sm font-bold text-red-700 dark:text-red-400 hover:underline">
          Delete my NGODA account
        </button>
      </div>
    </div>
  );
};

export default Profile;
