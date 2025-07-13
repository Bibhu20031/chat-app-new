import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  console.log("authUser:", authUser);

  return (
    <div className="min-h-screen bg-[#111b21] text-gray-200 pt-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-[#1e2a32] rounded-xl p-6 space-y-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your profile details</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={selectedImg || authUser?.ProfilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#25D366]"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-[#25D366] hover:scale-105 p-2 rounded-full cursor-pointer transition ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none opacity-70" : ""
                }`}
              >
                <Camera className="w-4 h-4 text-black" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Tap the camera to update your photo"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4 text-[#25D366]" />
              Full Name
            </div>
            <p className="px-4 py-2 bg-[#111b21] rounded border border-zinc-700">
              {authUser?.FullName}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4 text-[#25D366]" />
              Email Address
            </div>
            <p className="px-4 py-2 bg-[#111b21] rounded border border-zinc-700 ">
              {authUser?.Email}
            </p>
          </div>

          <div className="mt-6 bg-[#1e2a32] p-4 rounded-lg border border-zinc-700 space-y-4">
            <h2 className="text-lg font-semibold">Account Information</h2>
            <div className="flex justify-between text-sm border-b border-zinc-600 pb-2">
              <span className="text-gray-400">Member Since</span>
              <span>{authUser?.CreatedAt?.split("T")[0]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
