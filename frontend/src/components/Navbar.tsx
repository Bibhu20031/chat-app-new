import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, PhoneCall, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-[#1e2a32] border-b border-[#2f3e45] fixed w-full top-0 z-40 shadow">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full text-white">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-9 h-9 rounded-full bg-[#25D366]/20 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-[#25D366]" />
            </div>
            <h1 className="text-xl font-semibold text-[#25D366]">Waveline</h1>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/settings"
              className="hover:text-[#25D366] transition flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="hover:text-[#25D366] transition flex items-center gap-1">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="hover:text-[#25D366] transition flex items-center gap-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
