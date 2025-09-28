import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader.tsx";
import MessageInput from "./MessageInput.tsx";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    messages,
    // getMessages,
    isMessagesLoading,
    selectedUser,
    
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-[#111b21] text-gray-200">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#111b21] text-gray-200">
      <ChatHeader />

      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.senderId === authUser?.ID;
          return (
            <div
              key={message.ID}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              ref={messageEndRef}
            >
              
              {!isMe && (
                <img
                  src={selectedUser?.ProfilePic || "/avatar.png"}
                  alt="profile pic"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                />
              )}

              
              <div
                className={`max-w-xs sm:max-w-md rounded-lg px-3 py-2 text-sm shadow-md ${
                  isMe ? "bg-[#005C4B] text-white" : "bg-[#202C33] text-gray-200"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.content && <p>{message.content}</p>}
                <div className="text-[10px] text-gray-400 text-right mt-1">
                  (message.createdAt)
                </div>
              </div>

              {isMe && (
                <img
                  src={authUser?.ProfilePic || "/avatar.png"}
                  alt="profile pic"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                />
              )}
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};


const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => {
        const isMe = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
          >
            {!isMe && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
            )}

            <div
              className={`max-w-xs sm:max-w-md rounded-lg px-3 py-2 ${
                isMe ? "bg-[#005C4B]" : "bg-[#202C33]"
              }`}
            >
              <div className="h-4 w-32 bg-zinc-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-zinc-700 rounded animate-pulse" />
            </div>

            {isMe && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatContainer;
