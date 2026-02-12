
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award, 
  ChevronRight, 
  Search, 
  Download,
  Bell,
  MessageSquare 
} from 'lucide-react';
import { User, Module, Announcement } from '../types';

interface DashboardProps {
  user: User;
  modules: Module[];
  announcements: Announcement[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, modules, announcements }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = user.progress.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100) || 0;

  const filteredModules = modules.map(mod => ({
    ...mod,
    lessons: mod.lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mod.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(mod => mod.lessons.length > 0);

  const handleDownloadCertificate = () => {
    // Basic certificate simulation
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>NGODA AI School Certificate</title>
            <style>
              body { font-family: 'Inter', sans-serif; text-align: center; padding: 100px; border: 20px solid #1d4ed8; }
              h1 { color: #1d4ed8; font-size: 48px; }
              p { font-size: 24px; color: #374151; }
              .name { font-weight: bold; font-size: 36px; text-decoration: underline; margin: 40px 0; }
              .footer { margin-top: 100px; font-size: 14px; color: #9ca3af; }
            </style>
          </head>
          <body>
            <h1>NGODA AI LEARNING SCHOOL</h1>
            <p>This is to certify that</p>
            <div class="name">${user.fullName}</div>
            <p>has successfully completed the</p>
            <p><strong>Mastery in Artificial Intelligence Course</strong></p>
            <p>on this day, ${new Date().toLocaleDateString()}</p>
            <div class="footer">Verification ID: NGODA-${user.id}-${Date.now()}</div>
          </body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to NGODA AI LEARNING SCHOOL</h1>
          <p className="text-blue-100 text-lg">Hello, <span className="font-semibold">{user.fullName}</span>! Ready to master Artificial Intelligence today?</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center">
              <BookOpen className="mr-2" size={20} />
              <span>{totalLessons} Lessons</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center">
              <Award className="mr-2" size={20} />
              <span>{completedCount} Completed</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Progress & Modules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center">
                <Clock className="mr-2 text-blue-500" />
                Overall Progress
              </h3>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-right text-xs font-medium text-gray-500 dark:text-gray-400">Keep going! You're almost there.</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold">Curriculum</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search lessons..." 
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">{module.title}</h4>
                  <span className="text-xs text-gray-400">{module.lessons.length} lessons</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {module.lessons.map((lesson) => {
                    const isCompleted = user.progress.includes(lesson.id);
                    return (
                      <Link 
                        key={lesson.id} 
                        to={`/lesson/${lesson.id}`}
                        className="flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {isCompleted ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lesson.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{lesson.description}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">No lessons found matching your search.</p>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Announcements */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center text-red-500">
              <Bell className="mr-2" size={20} />
              Announcements
            </h3>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No new announcements at this time.</p>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-xs text-gray-400 font-medium mb-1">{ann.date}</p>
                    <h5 className="font-bold text-sm text-red-700 dark:text-red-400">{ann.title}</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{ann.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certificate Generation */}
          {progressPercent === 100 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700 shadow-sm text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={40} className="text-yellow-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-2">You're a Graduate!</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 mb-4">You have mastered the curriculum. Claim your digital certificate now.</p>
              <button 
                onClick={handleDownloadCertificate}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center space-x-2"
              >
                <Download size={18} />
                <span>Download PDF Certificate</span>
              </button>
            </div>
          )}

          {/* Quick Help */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
            <h3 className="font-bold mb-2 flex items-center">
              <MessageSquare className="mr-2 text-blue-600" size={18} />
              Quick Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Our NGODA AI Assistant is ready to help you understand tough concepts.</p>
            <Link to="/assistant" className="block text-center py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Open Chatbot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
