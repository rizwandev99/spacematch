"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. 15 person team in SF, dog friendly, under $10k/mo"
        disabled={isLoading}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "#ffffff",
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(124,110,245,0.6)")}
        onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.2)")}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: "#7c6ef5",
          border: "none",
          color: "#fff",
          cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
          opacity: isLoading || !input.trim() ? 0.4 : 1,
          transition: "opacity 0.15s, background 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          if (!isLoading && input.trim())
            (e.currentTarget as HTMLButtonElement).style.background = "#6a5ce0";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#7c6ef5";
        }}
      >
        <Send style={{ width: 15, height: 15 }} />
      </button>
    </form>
  );
}
