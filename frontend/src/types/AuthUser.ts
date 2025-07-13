export interface AuthUser {
  ID: number;
  FullName: string;
  Email: string;
  ProfilePic: string;
  Password: string;
  CreatedAt: string;
  UpdatedAt: string;
  UserName: string;
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
  updateProfile: (data: UpdateProfileData) => Promise<void>;

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

export interface UpdateProfileData {
  profilePic: string;
}