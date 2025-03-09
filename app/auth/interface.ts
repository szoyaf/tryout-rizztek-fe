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
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  tryoutId: string;
  userId: string;
  score?: number | null;
  submittedAt?: string | null;
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
