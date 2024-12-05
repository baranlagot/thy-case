"use client";

import { useState, useCallback, FormEvent, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { TypingIndicator } from "./TypingIndicator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChatBubble } from "./ChatBubble";

interface ChatBoxProps {
  menuItems: string[];
}

export default function ChatBox({ menuItems }: ChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    { role: string; content: string; key: number }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);

  const handleViewportRef = useCallback((node: HTMLDivElement | null) => {
    setViewportNode(node);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (viewportNode) {
      viewportNode.scrollTo({
        top: viewportNode.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, viewportNode]);

  const handleSendMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      const newMessages = [
        ...messages,
        {
          role: "user",
          content: input,
          key: messages.length + 1,
        },
      ];

      setMessages(newMessages);
      setInput("");
      setIsTyping(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: newMessages,
            menuItems: menuItems,
          }),
        });

        const data = await response.json();

        if (data.message) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.message,
              key: prev.length + 1,
            },
          ]);
        }
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [input, messages, menuItems, isLoading]
  );

  return (
    <div className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <ScrollArea className="h-[300px] pr-4" viewportRef={handleViewportRef}>
        {messages.map((m) => (
          <ChatBubble key={m.key} role={m.role} content={m.content} />
        ))}
        {isTyping && <ChatBubble role="assistant" isTyping={true} />}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <Button
          type="submit"
          className="rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
