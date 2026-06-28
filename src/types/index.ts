export type QuizStatus = 'draft' | 'published';
export type QuestionType = 'multiple_choice' | 'true_false';

export interface Answer {
  id: string;
  question_id: string;
  content: string;
  is_correct?: boolean; // Optional on client-side for security, or inside mock data
}

export interface Question {
  id: string;
  quiz_id: string;
  type: QuestionType;
  content: string;
  points: number;
  answers: Answer[]; // Nested answers for convenience on FE
}

export interface Quiz {
  id: string;
  creator_id: string;
  course_id?: string; // Links to Course
  title: string;
  timer_minutes: number;
  status: QuizStatus;
  created_at?: string;
  questions?: Question[]; // Nested questions
  participant_count?: number; // UI metadata helper
  average_score?: number; // UI metadata helper
}

export interface Course {
  id: string;
  title: string;
  code: string; // Course Join Code
  creator_id: string;
  created_at?: string;
}

export interface Attempt {
  id: string;
  quiz_id: string;
  student_id: string; // ID of the student
  display_name: string; // Name of the student
  score: number;
  max_score: number;
  raw_score?: number;
  raw_max_score?: number;
  duration_seconds: number;
  attempt_number: number;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  full_name: string;
  joined_courses: string[]; // List of Course IDs
}

export interface ParticipantSession {
  id: string;
  quiz_id: string;
  display_name: string;
  started_at: string;
  completed_at?: string;
  total_score?: number;
}

export interface ParticipantResponse {
  id: string;
  session_id: string;
  question_id: string;
  answer_id: string; // ID of the answer chosen by participant
}
