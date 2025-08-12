export type quiz = {
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
  back: string;
  choices: string[];
  created_at: string;
  difficulty: string;
  explanation: string;
  front: string;
  hint: string;
  question: string;
  type: string;
};

export interface QuizletViewProps {
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
  onRetake: any;
  onRestart?: any;
  onShuffle: any;
  totalQuestions: number;
}
