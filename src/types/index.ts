export type Role = string;

export type CourseStatus = "published" | "draft" | "in_progress";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  phone?: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  totalVideos: number;
  status: CourseStatus;
}

export interface Video {
  id: string;
  number: number;
  title: string;
  duration?: string;
  youtubeUrl?: string;
  description?: string;
}

export interface VideoWithProgress extends Video {
  watched: boolean;
}

export interface CourseWithProgress extends Course {
  watchedVideos: number;
}

export interface QAItem {
  id: string;
  author: { name: string; avatar?: string };
  question: string;
  askedAt: string;
  answer?: {
    author: { name: string; avatar?: string };
    text: string;
    answeredAt: string;
  };
}

export interface Question {
  id: string;
  memberName: string;
  question: string;
  askedAt: string;
  course: string;
  videoTitle: string;
  videoUrl: string;
  answered: boolean;
}

export interface Resource {
  label: string;
  url: string;
}
