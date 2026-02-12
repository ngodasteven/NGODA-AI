
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Download, CheckCircle, ArrowRight } from 'lucide-react';
import { Module, User } from '../types';

interface LessonDetailProps {
  modules: Module[];
  user: User;
  onComplete: (id: string) => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ modules, user, onComplete }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const allLessons = modules.flatMap(m => m.lessons);
  const lesson = allLessons.find(l => l.id === id);
  const currentModule = modules.find(m => m.lessons.some(l => l.id === id));

  if (!lesson) {
    return <div className="text-center py-20">Lesson not found. <Link to="/dashboard" className="text-blue-600">Go back</Link></div>;
  }

  const isCompleted = user.progress.includes(lesson.id);
  
  // Find next lesson
  const currentIdx = allLessons.findIndex(l => l.id === id);
  const nextLesson = allLessons[currentIdx + 1];

  const handleMarkComplete = () => {
    onComplete(lesson.id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-blue-600 font-medium hover:underline">
          <ChevronLeft size={20} className="mr-1" />
          Back to Dashboard
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {currentModule?.title}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold">{lesson.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">{lesson.description}</p>

      {/* Video Section */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe 
          width="100%" 
          height="100%" 
          src={lesson.videoUrl} 
          title={lesson.title}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => window.alert('PDF Notes download started...')}
          className="flex items-center justify-center space-x-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition font-bold"
        >
          <Download size={20} />
          <span>Download Course Notes (PDF)</span>
        </button>

        <button 
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition font-bold ${
            isCompleted 
            ? 'bg-green-100 text-green-600 cursor-default' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <CheckCircle size={20} />
          <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
        </button>
      </div>

      {nextLesson && (
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Up Next</h4>
          <Link 
            to={`/lesson/${nextLesson.id}`}
            className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg hover:border-blue-400 transition group"
          >
            <div>
              <p className="text-xs font-medium text-blue-600">Next Lesson</p>
              <h5 className="text-xl font-bold">{nextLesson.title}</h5>
            </div>
            <ArrowRight size={24} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-2 transition" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default LessonDetail;
