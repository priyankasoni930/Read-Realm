import { Message } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/hooks/useMessages";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface MessageListProps {
  groupId: string;
}

const MessageList = ({ groupId }: MessageListProps) => {
  const { user } = useAuth();
  const { data: messages = [] } = useMessages(groupId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom when messages change or group changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };

    scrollToBottom();
    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, groupId]);

  const handleAvatarClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4 flex flex-col-reverse">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.userId === user?.id ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar 
              className="h-8 w-8 bg-gray-700 cursor-pointer"
              onClick={() => handleAvatarClick(message.userId)}
            >
              <AvatarFallback className="bg-gray-600 text-gray-200">
                {message.userEmail?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                message.userId === user?.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <p className="break-words">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;