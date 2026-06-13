"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { ChatInput } from "@/components/search/chat-input";
import { ChatMessages } from "@/components/search/chat-messages";
import { SuggestedQueries } from "@/components/search/suggested-queries";
import { Search, RotateCcw } from "lucide-react";

export default function Home() {
  const chatObj = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
  const { messages, sendMessage, status, setMessages } = chatObj;
  const isLoading = status === 'submitted' || status === 'streaming';

  const [isPending, setIsPending] = useState(false);
  const effectiveLoading = isPending || isLoading;

  useEffect(() => {
    if (!isLoading) setIsPending(false);
  }, [isLoading]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, effectiveLoading]);

  const handleSend = (text: string) => {
    setIsPending(true);
    sendMessage({ text });
  };

  return (
    <main
      className="relative flex flex-1 w-full flex-col items-center justify-center p-4 md:p-8"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/unsplash/hero-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* title */}
        {messages.length === 0 && (
          <div className="text-center mb-10 w-full">
            <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-4 drop-shadow-md">
              How top startups<br />find <span className="italic font-light">office space</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-200 font-medium drop-shadow">
              Access the whole market with expert support
            </p>
          </div>
        )}

        {/* glass card chat */}
        <div
          className="w-full max-w-2xl glass backdrop-blur-xl bg-black/70 border border-white/10"
          style={{
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          }}
        >
          {messages.length > 0 && (
            <div className="flex justify-end mb-4 border-b border-white/10 pb-4">
              <button
                onClick={() => setMessages([])}
                className="text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start New Search
              </button>
            </div>
          )}

          {/* chat messages */}
          {messages.length > 0 && (
            <div
              ref={scrollContainerRef}
              style={{ maxHeight: 500, overflowY: "auto", marginBottom: 16 }}
            >
              <ChatMessages messages={messages} isLoading={effectiveLoading} />
            </div>
          )}

          {/* chat input */}
          <ChatInput onSend={handleSend} isLoading={effectiveLoading} />

          {messages.length === 0 && (
            <div style={{ marginTop: 24 }}>
              <SuggestedQueries onSelect={handleSend} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
