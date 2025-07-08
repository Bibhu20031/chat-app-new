export interface AuthUser {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  profilePic?: string;
}


export interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}