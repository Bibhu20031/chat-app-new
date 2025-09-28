
import { PhoneCall } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#111b21]">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl bg-[#202c33] flex items-center
             justify-center animate-bounce"
            >
              <PhoneCall className="w-10 h-10 text-[#25D366]" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to Waveline</h2>
        <p className="text-gray-400">
          Select a chat from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
