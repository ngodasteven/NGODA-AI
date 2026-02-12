
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  MessageSquare, 
  ShieldCheck, 
  Moon, 
  Sun,
  Menu,
  X,
  Bell
} from 'lucide-react';

import { User, UserRole, Lesson, Module, Announcement } from './types';
import { INITIAL_MODULES } from './constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LessonDetail from './pages/LessonDetail';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';

// Fixed ProtectedRoute: Moved outside App to resolve "children" property missing error in element prop
interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
  currentUser: User | null;
}

const ProtectedRoute = ({ children, role, currentUser }: ProtectedRouteProps) => {
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentUser.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem('ngoda_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load Modules
    const savedModules = localStorage.getItem('ngoda_modules');
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    } else {
      setModules(INITIAL_MODULES);
      localStorage.setItem('ngoda_modules', JSON.stringify(INITIAL_MODULES));
    }

    // Load Announcements
    const savedAnnouncements = localStorage.getItem('ngoda_announcements');
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    }

    // Load Dark Mode
    const savedDark = localStorage.getItem('ngoda_dark_mode') === 'true';
    setDarkMode(savedDark);
    if (savedDark) document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ngoda_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ngoda_user');
  };

  const updateProgress = (lessonId: string) => {
    if (!currentUser) return;
    const updatedProgress = [...new Set([...currentUser.progress, lessonId])];
    const updatedUser = { ...currentUser, progress: updatedProgress };
    setCurrentUser(updatedUser);
    localStorage.setItem('ngoda_user', JSON.stringify(updatedUser));
    
    // Update in "db" (localStorage users)
    const allUsersStr = localStorage.getItem('ngoda_users_db');
    if (allUsersStr) {
      const allUsers: User[] = JSON.parse(allUsersStr);
      const userIdx = allUsers.findIndex(u => u.id === currentUser.id);
      if (userIdx !== -1) {
        allUsers[userIdx].progress = updatedProgress;
        localStorage.setItem('ngoda_users_db', JSON.stringify(allUsers));
      }
    }
  };

  const updateModules = (newModules: Module[]) => {
    setModules(newModules);
    localStorage.setItem('ngoda_modules', JSON.stringify(newModules));
  };

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('ngoda_dark_mode', String(newDark));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {currentUser && (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className={`
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0
            `}>
              <div className="flex flex-col h-full">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-white rounded-lg">
                      <BookOpen size={20} className="text-blue-700" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">NGODA AI</h1>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                  <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
                  <SidebarLink to="/assistant" icon={<MessageSquare size={20} />} label="AI Assistant" onClick={() => setSidebarOpen(false)} />
                  <SidebarLink to="/profile" icon={<UserIcon size={20} />} label="Profile" onClick={() => setSidebarOpen(false)} />
                  {currentUser.role === UserRole.ADMIN && (
                    <SidebarLink to="/admin" icon={<ShieldCheck size={20} />} label="Admin Panel" onClick={() => setSidebarOpen(false)} />
                  )}
                </nav>

                <div className="p-4 border-t border-blue-600 space-y-2">
                  <button onClick={toggleDarkMode} className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-600 transition">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-red-500 transition text-red-100">
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
              {/* Header */}
              <header className={`h-16 flex items-center justify-between px-6 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center">
                  <button onClick={() => setSidebarOpen(true)} className="mr-4 md:hidden">
                    <Menu size={24} />
                  </button>
                  <h2 className="text-lg font-semibold truncate max-w-[150px] sm:max-w-none">NGODA AI LEARNING SCHOOL</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-medium text-sm">{currentUser.fullName}</span>
                  </div>
                </div>
              </header>

              {/* View Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <Routes>
                  <Route path="/dashboard" element={<ProtectedRoute currentUser={currentUser}><Dashboard user={currentUser} modules={modules} announcements={announcements} /></ProtectedRoute>} />
                  <Route path="/lesson/:id" element={<ProtectedRoute currentUser={currentUser}><LessonDetail modules={modules} user={currentUser} onComplete={updateProgress} /></ProtectedRoute>} />
                  <Route path="/assistant" element={<ProtectedRoute currentUser={currentUser}><Assistant /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute currentUser={currentUser}><Profile user={currentUser} onUpdate={handleLogin} /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute currentUser={currentUser} role={UserRole.ADMIN}><AdminPanel modules={modules} setModules={updateModules} announcements={announcements} setAnnouncements={setAnnouncements} /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </main>
          </div>
        )}

        {!currentUser && (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick: () => void }> = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 transition-colors group"
  >
    <span className="text-blue-200 group-hover:text-white transition-colors">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default App;
