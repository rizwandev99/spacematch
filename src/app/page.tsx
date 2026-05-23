"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { ChatInput } from "@/components/search/chat-input";
import { ChatMessages } from "@/components/search/chat-messages";
import { SuggestedQueries } from "@/components/search/suggested-queries";
import { Search } from "lucide-react";

export default function Home() {
  const chatObj = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
  const { messages, sendMessage, isLoading } = chatObj;

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
      style={{
        minHeight: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          background: "radial-gradient(ellipse at center, rgba(124,110,245,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div style={{ maxWidth: 700, width: "100%", margin: "0 auto" }}>
        {/* title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 100,
              background: "rgba(124,110,245,0.1)",
              border: "1px solid rgba(124,110,245,0.25)",
              fontSize: 11,
              fontWeight: 500,
              color: "#a89cf5",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7c6ef5",
                display: "inline-block",
              }}
            />
            AI-Powered Search
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: "#e8e8ea",
              marginBottom: 16,
            }}
          >
            Find your team&apos;s next{" "}
            <span style={{ color: "#7c6ef5" }}>office space</span>
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "#6b6b7a",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Describe what your team needs and our AI will search the full market to find matching offices.
          </p>
        </div>

        {/* glass card chat */}
        <div
          className="glass"
          style={{
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          {messages.length === 0 && (
            <div style={{ marginBottom: 24 }}>
              <SuggestedQueries onSelect={handleSend} />
            </div>
          )}

          {/* chat messages */}
          <div
            ref={scrollContainerRef}
            style={{ maxHeight: 500, overflowY: "auto", marginBottom: 16 }}
          >
            <ChatMessages messages={messages} isLoading={effectiveLoading} />
          </div>

          {/* chat input */}
          <ChatInput onSend={handleSend} isLoading={effectiveLoading} />
        </div>
      </div>
    </main>
  );
}
