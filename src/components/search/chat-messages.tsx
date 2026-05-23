"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DynamicLoader } from "./dynamic-loader";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        // skip tool messages
        if (message.role !== "user" && message.role !== "assistant") return null;
        if (!message.parts || message.parts.length === 0) return null;

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-4">
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <ReactMarkdown
                          key={index}
                          components={{
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li>{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            a: ({ href, children }) => (
                              <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      );
                    case "tool-invocation":
                    case "dynamic-tool":
                      // Show loading state or completed state for tool calls
                      const isOutputAvailable = "state" in part && part.state === "output-available";
                      if (!isOutputAvailable) {
                        return (
                          <div key={index} className="text-gray-500 italic flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                            Searching...
                          </div>
                        );
                      }
                      return (
                        <div key={index} className="text-gray-500 italic flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Searched database
                        </div>
                      );
                    default:
                      // Catch specific tool UI parts
                      if (part.type.startsWith("tool-")) {
                         const isOutputAvailableDefault = "state" in part && part.state === "output-available";
                         if (!isOutputAvailableDefault) {
                           return (
                             <div key={index} className="text-gray-500 italic flex items-center gap-2">
                               <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                               Searching...
                             </div>
                           );
                         }
                         return (
                           <div key={index} className="text-gray-500 italic flex items-center gap-2">
                             <span className="text-green-500">✓</span>
                             Searched database
                           </div>
                         );
                      }
                      return null;
                  }
                })}
              </div>
            </div>
            {message.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        );
      })}

      {(() => {
        const lastMsg = messages[messages.length - 1];
        const lastMsgHasText = lastMsg?.parts?.some((p) => p.type === "text" && (p as { text?: string }).text);

        // Show while SDK is loading (any phase)
        const loadingPhase = isLoading && (lastMsg?.role === "user" || (lastMsg?.role === "assistant" && !lastMsgHasText));

        // Bridge the brief gap between request 1 finishing and request 2 starting:
        // if the last assistant message has completed tool calls but no text yet,
        // keep the loader visible even if isLoading is momentarily false.
        const betweenRequests =
          !isLoading &&
          lastMsg?.role === "assistant" &&
          !lastMsgHasText &&
          lastMsg.parts?.some(
            (p) => (p.type === "tool-invocation" || p.type.startsWith("tool-")) &&
              "state" in p && p.state === "output-available"
          );

        return loadingPhase || betweenRequests ? <DynamicLoader /> : null;
      })()}

      {/* scroll anchor — always kept at the bottom */}
      <div data-scroll-anchor />
    </div>
  );
}
