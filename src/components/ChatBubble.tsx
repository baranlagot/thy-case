import { TypingIndicator } from "./TypingIndicator";

// components/ChatBubble.tsx
interface ChatBubbleProps {
  role: string;
  content?: string;
  isTyping?: boolean;
}

export function ChatBubble({ role, content, isTyping }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`mb-4 ${isUser ? "text-right" : "text-left"}`}>
      <div
        className={`
            inline-block p-3 rounded-2xl max-w-[80%] relative
            ${
              isUser
                ? "bg-green-500 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none"
            }
          `}
      >
        {isTyping ? <TypingIndicator /> : content}
        <div
          className={`
              absolute bottom-0 w-4 h-4 
              ${isUser ? "-right-2 bg-green-500" : "-left-2 bg-white"}
            `}
          style={{
            clipPath: isUser
              ? "polygon(0 0, 0% 100%, 100% 100%)"
              : "polygon(0 100%, 100% 0, 100% 100%)",
          }}
        />
      </div>
    </div>
  );
}
