export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
}

export interface Tryout {
  id: string;
  userId: string;
  title: string;
  description: string;
  category:
    | "Programming"
    | "Math"
    | "Science"
    | "History"
    | "English"
    | "Geography"
    | "Art"
    | "Music"
    | "Sports";
  startAt: string;
  endAt: string;
  duration: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  submissionId: string;
  questionId: string;
  answerText: string;
  choiceId: string | null;
  shortAnswer: string | null;
  isCorrect: boolean;
}

export interface Choice {
  id: string;
  questionId: string;
  choiceText: string;
  isAnswer: boolean;
  answers: Answer[];
}

export interface Question {
  id: string;
  tryoutId: string;
  text: string;
  choices: Choice[];
  answer: Answer[];
  score: number;
  type: string;
  correctShortAnswer?: string | null;
}

export interface Submission {
  id: string;
  tryoutId: string;
  userId: string;
  score?: number | null;
  submittedAt?: string | null;
  answers: Answer[];
}

export interface User extends UserData {
  tryouts: Tryout[];
  submissions: Submission[];
}

export interface GetUserResponse extends ApiResponse<{ user: User }> {
  user?: User;
}

export interface GetUsersResponse extends ApiResponse<{ users: UserData[] }> {
  users?: UserData[];
}

export interface GetTryoutResponse extends ApiResponse<{ tryout: Tryout }> {
  tryout?: Tryout;
}

export interface GetTryoutsResponse extends ApiResponse<{ tryouts: Tryout[] }> {
  tryouts?: Tryout[];
}

export interface GetSubmissionResponse
  extends ApiResponse<{ submission: Submission }> {
  submission?: Submission;
}
