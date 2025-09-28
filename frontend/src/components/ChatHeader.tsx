// ChatHeader.tsx
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader: React.FC = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-3 bg-[#202c33] border-b border-[#1f2c34]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <div className="avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={selectedUser.ProfilePic || "/avatar.png"}
                alt={selectedUser.FullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white text-sm">
              {selectedUser.FullName}
            </h3>
          </div>
        </div>

        
        <button
          onClick={() => setSelectedUser(null)}
          className="text-gray-400 hover:text-red-400"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
