
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  course?: string;
  password?: string;
  role: UserRole;
  progress: string[]; // List of completed lesson IDs
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  notesUrl: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}
