
import React, { useState, useEffect } from 'react';
import { User, Module, Announcement, UserRole, Lesson } from '../types';
import { Users, BookPlus, Megaphone, Trash2, Plus, Layout, Search, Save, X } from 'lucide-react';

interface AdminPanelProps {
  modules: Module[];
  setModules: (modules: Module[]) => void;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ modules, setModules, announcements, setAnnouncements }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'lessons' | 'announcements'>('users');
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lesson Management states
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null); // moduleId
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');

  // Form states for new announcements
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  useEffect(() => {
    const savedUsers = localStorage.getItem('ngoda_users_db');
    if (savedUsers) {
      setStudents(JSON.parse(savedUsers).filter((u: User) => u.role === UserRole.STUDENT));
    }
  }, []);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    
    const newAnn: Announcement = {
      id: Date.now().toString(),
      title: newAnnTitle,
      content: newAnnContent,
      date: new Date().toLocaleDateString()
    };
    
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('ngoda_announcements', JSON.stringify(updated));
    setNewAnnTitle('');
    setNewAnnContent('');
    alert('Announcement posted successfully!');
  };

  const handleAddLesson = (moduleId: string) => {
    if (!newLessonTitle) return;
    
    const updatedModules = modules.map(mod => {
      if (mod.id === moduleId) {
        const newLesson: Lesson = {
          id: `l-${Date.now()}`,
          moduleId,
          title: newLessonTitle,
          description: newLessonDesc,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
          notesUrl: '#'
        };
        return { ...mod, lessons: [...mod.lessons, newLesson] };
      }
      return mod;
    });
    
    setModules(updatedModules);
    setShowAddLesson(null);
    setNewLessonTitle('');
    setNewLessonDesc('');
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    const updatedModules = modules.map(mod => {
      if (mod.id === moduleId) {
        return { ...mod, lessons: mod.lessons.filter(l => l.id !== lessonId) };
      }
      return mod;
    });
    setModules(updatedModules);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('ngoda_announcements', JSON.stringify(updated));
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Control Center</h1>
          <p className="text-gray-500">Manage students, curriculum, and announcements.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 rounded-lg transition ${activeTab === 'users' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            <Users size={18} className="mr-2" />
            Students
          </button>
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center px-4 py-2 rounded-lg transition ${activeTab === 'lessons' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            <Layout size={18} className="mr-2" />
            Curriculum
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center px-4 py-2 rounded-lg transition ${activeTab === 'announcements' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            <Megaphone size={18} className="mr-2" />
            Alerts
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px] overflow-hidden">
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-lg font-bold">Enrolled Students ({students.length})</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Progress</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 pl-2 font-medium">{student.fullName}</td>
                      <td className="py-4 text-gray-500 dark:text-gray-400 text-sm">{student.email}</td>
                      <td className="py-4">
                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-bold uppercase tracking-tight">
                          {student.course}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-100 dark:bg-gray-900 rounded-full">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${(student.progress.length / Math.max(1, modules.reduce((a, b) => a + b.lessons.length, 0))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button className="p-2 text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-gray-50 dark:bg-gray-900/30 rounded-xl mt-4 border-2 border-dashed border-gray-100 dark:border-gray-800">
                  No students found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Course Modules</h3>
              <button 
                onClick={() => {
                  const name = window.prompt('Enter Module Name:');
                  if (name) {
                    setModules([...modules, { id: `mod-${Date.now()}`, title: name, lessons: [] }]);
                  }
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition font-bold text-sm shadow-md"
              >
                <Plus size={18} />
                <span>New Module</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {modules.map((mod) => (
                <div key={mod.id} className="border dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-blue-600">{mod.title}</h4>
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this entire module?')) {
                          setModules(modules.filter(m => m.id !== mod.id));
                        }
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete Module
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {mod.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 group">
                        <span className="text-sm font-medium">{lesson.title}</span>
                        <button 
                          onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    {showAddLesson === mod.id ? (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-900 space-y-3 animate-in zoom-in-95 duration-200">
                        <input 
                          type="text" 
                          placeholder="Lesson Title" 
                          className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                        />
                        <textarea 
                          placeholder="Short Description" 
                          className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                          rows={2}
                          value={newLessonDesc}
                          onChange={(e) => setNewLessonDesc(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => setShowAddLesson(null)} className="text-xs font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                          <button onClick={() => handleAddLesson(mod.id)} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Save Lesson</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowAddLesson(mod.id)}
                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-500 transition text-sm flex items-center justify-center space-x-2"
                      >
                        <Plus size={16} />
                        <span>Add Lesson</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-6">Create Alert</h3>
              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Course Update"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Content</label>
                  <textarea 
                    rows={4}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Enter message details..."
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition flex items-center justify-center space-x-2 shadow-lg active:scale-95"
                >
                  <Megaphone size={18} />
                  <span>Push Announcement</span>
                </button>
              </form>
            </div>
            
            <div className="border-l dark:border-gray-700 pl-0 md:pl-8">
              <h3 className="text-lg font-bold mb-6">History</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {announcements.length === 0 ? (
                  <p className="text-gray-400 italic text-sm text-center py-10">No records found.</p>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl relative group border border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="absolute top-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 transition hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                      <p className="text-[10px] font-bold text-gray-400 mb-1">{ann.date}</p>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{ann.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ann.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
