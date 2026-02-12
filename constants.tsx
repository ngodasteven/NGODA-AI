
import { Module } from './types';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-1',
    title: 'Module 1: Introduction to Artificial Intelligence',
    lessons: [
      {
        id: 'l1-1',
        moduleId: 'mod-1',
        title: 'What is AI?',
        description: 'Understand the fundamental definitions of intelligence in machines and how it differs from human intelligence.',
        videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg',
        notesUrl: '#'
      },
      {
        id: 'l1-2',
        moduleId: 'mod-1',
        title: 'Types of AI',
        description: 'Exploring Narrow AI, General AI, and Superintelligence.',
        videoUrl: 'https://www.youtube.com/embed/kWmX39ko_bw',
        notesUrl: '#'
      },
      {
        id: 'l1-3',
        moduleId: 'mod-1',
        title: 'Real life examples in Tanzania',
        description: 'How AI is being used locally for agriculture diagnostics, traffic management in Dar es Salaam, and FinTech.',
        videoUrl: 'https://www.youtube.com/embed/5dZ_lvDgevk',
        notesUrl: '#'
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Module 2: Machine Learning Basics',
    lessons: [
      {
        id: 'l2-1',
        moduleId: 'mod-2',
        title: 'What is Machine Learning?',
        description: 'A subset of AI that focuses on building systems that learn from data.',
        videoUrl: 'https://www.youtube.com/embed/HcqpanDadyQ',
        notesUrl: '#'
      },
      {
        id: 'l2-2',
        moduleId: 'mod-2',
        title: 'Types of Machine Learning',
        description: 'Supervised, Unsupervised, and Reinforcement learning explained.',
        videoUrl: 'https://www.youtube.com/embed/xtOg44r6Lss',
        notesUrl: '#'
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Module 3: AI Tools',
    lessons: [
      {
        id: 'l3-1',
        moduleId: 'mod-3',
        title: 'ChatGPT & LLMs',
        description: 'Mastering prompt engineering and understanding how Large Language Models work.',
        videoUrl: 'https://www.youtube.com/embed/jPcM6rVki6o',
        notesUrl: '#'
      },
      {
        id: 'l3-2',
        moduleId: 'mod-3',
        title: 'Image Generation',
        description: 'Introduction to Midjourney, DALL-E, and Stable Diffusion.',
        videoUrl: 'https://www.youtube.com/embed/SVcsDDABEkM',
        notesUrl: '#'
      },
      {
        id: 'l3-3',
        moduleId: 'mod-3',
        title: 'AI for Business & Education',
        description: 'Practical workflows to increase productivity in professional settings.',
        videoUrl: 'https://www.youtube.com/embed/2eHrepa7W_g',
        notesUrl: '#'
      }
    ]
  }
];
