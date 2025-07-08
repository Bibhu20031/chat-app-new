import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  PhoneCall,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim())
      return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center pt-20 text-gray-200">
      <div className="w-full max-w-md bg-[#1e2a32] p-8 rounded-xl shadow-lg space-y-8">
        
        <div className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-[#25D366]" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-sm text-gray-400">
              Get started with your free account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366]" />
              <input
                type="text"
                className="w-full pl-10 p-2 bg-[#111b21] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366]" />
              <input
                type="email"
                className="w-full pl-10 p-2 bg-[#111b21] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366]" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 p-2 bg-[#111b21] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#25D366]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-[#25D366] text-black py-2 rounded font-semibold hover:bg-[#20ba5b] transition"
          >
            {isSigningUp ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                Loading...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#25D366] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
