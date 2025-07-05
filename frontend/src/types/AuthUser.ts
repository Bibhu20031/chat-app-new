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
}