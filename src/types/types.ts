export type quiz = {
  title: string;
  id: string;
  user_id: string;
  created_at: string;
  difficulty: string;
  number_of_items: number;
  source_file_url?: string;
  source_text?: string;
  style: string;
  status: string;
};

export type question = {
  id: string;
  quiz_id: string;
  answer: string;
  back: string | null;
  choices: string[];
  created_at: string;
  difficulty: string;
  explanation: string;
  front: string | null;
  hint: string;
  question: string;
  type: string;
};

export interface QuizletViewProps {
  title: string;
  questions: question[];
  currentIndex: number;
  nextCard: () => void;
  prevCard: () => void;
  onProgressMode: () => void;
  onMarkKnown: (questionId: string) => void;
  onMarkUnknown: (questionId: string) => void;
  showSummary: boolean;
  unknownQuestions: { [questionId: string]: string };
  knownQuestions: { [questionId: string]: string };
  progressMode: boolean;
  onRetake: () => void;
  onRestart: () => void;
  onShuffle: () => void;
  onBack: () => void;
  totalQuestions: number;
}

export interface CardProps {
  front: string | null;
  back: string | null;
  hueA?: number;
  hueB?: number;
  i: number;
  onInView?: () => void;
  isActive?: boolean;
  showSummary: boolean;
  unknownQuestions: { [questionId: string]: string };
  knownQuestions: { [questionId: string]: string };
  questions: question[];
  onRetake: () => void;
  totalQuestions: number;
  onRestart: () => void;
  onBack: () => void;
}

export type PracticeQuizUIProps = {
  questions: question[];
};

export type PracticeModeSummaryProps = {
  knownAnswer: { [questionId: string]: number };
  questions: question[];
  onHandleContinue: () => void;
  onHandleReset: () => void;
  percentageScore: number;
  summaryKnownCount: number;
};

export type ExamQuestion = {
  question: string;
  type: string;
  choices: string[];
  answer: string;
};

export type PracticeQuestion = {
  question: string;
  hint: string;
  type: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type Material = {
  id: number;
  title: string;
  type: string;
  author: string;
  readTime: string;
  excerpt: string;
  url: string;
  thumbnail: string;
  tags: string[];
};
