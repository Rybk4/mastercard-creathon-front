import { useState, useEffect } from "react";
import { clearHistory as clearHistoryAPI } from "../api/textProcessor";
import { useUserIp } from "./useUserIp";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: number;
  contentType?: "text" | "table" | "chart" | "error";
  data?: unknown[];
  metadata?: {
    row_count?: number;
    execution_time_ms?: number;
  };
}

const STORAGE_KEY = "chat_history";

export function useChatHistory() {
  const userIp = useUserIp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory) as ChatMessage[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [showWelcome, setShowWelcome] = useState(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as ChatMessage[];
        return parsed.length === 0;
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    setShowWelcome(false);
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  };

  const clearHistory = async () => {
    try {
      const userId = userIp || "unknown";

      await clearHistoryAPI(userId);

      setMessages([]);
      setShowWelcome(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Ошибка при очистке истории:", error);
      setMessages([]);
      setShowWelcome(true);
      localStorage.removeItem(STORAGE_KEY);
      throw error;
    }
  };

  return {
    messages,
    showWelcome,
    addMessage,
    updateMessage,
    clearHistory,
  };
}
