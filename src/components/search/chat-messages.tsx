"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DynamicLoader } from "./dynamic-loader";
import { useState, useEffect } from "react";

const FALLBACK_IMG = "/images/unsplash/office-1.jpg";

const ListingCard = ({ listing }: { listing: any }) => {
  const [imgSrc, setImgSrc] = useState(listing.imageUrl || FALLBACK_IMG);

  useEffect(() => {
    setImgSrc(listing.imageUrl || FALLBACK_IMG);
  }, [listing.imageUrl]);

  const price = listing.pricePerMonth
    ? `$${listing.pricePerMonth.toLocaleString()}/mo`
    : "Price on request";

  return (
    <a
      href={`/listings/${listing.slug}`}
      style={{
        display: "block",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
        textDecoration: "none",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,110,245,0.4)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      <img
        src={imgSrc}
        alt={listing.title}
        onError={() => setImgSrc(FALLBACK_IMG)}
        style={{
          width: "100%",
          height: 160,
          objectFit: "cover",
          display: "block",
        }}
      />
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#e8e8ea", marginBottom: 4 }}>
          {listing.title}
        </div>
        <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 6 }}>
          {listing.neighborhood}{listing.city ? `, ${listing.city}` : ""}
          {" · "}{listing.sqft?.toLocaleString()} sqft
          {" · "}<span style={{ color: "#d4d4d8" }}>{price}</span>
        </div>
        {listing.petFriendly && (
          <span style={{
            fontSize: 10,
            background: "rgba(34,197,94,0.12)",
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 4,
            padding: "2px 6px",
          }}>
            🐾 Pet-friendly
          </span>
        )}
      </div>
    </a>
  );
};

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  if (messages.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {messages.map((message) => {
        if (message.role !== "user" && message.role !== "assistant") return null;
        if (!message.parts || message.parts.length === 0) return null;

        const isUser = message.role === "user";

        return (
          <div
            key={message.id}
            style={{
              display: "flex",
              gap: 10,
              justifyContent: isUser ? "flex-end" : "flex-start",
              alignItems: "flex-start",
            }}
          >
            {!isUser && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(124,110,245,0.15)",
                  border: "1px solid rgba(124,110,245,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot style={{ width: 14, height: 14, color: "#7c6ef5" }} />
              </div>
            )}

            <div
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                background: isUser
                  ? "rgba(124,110,245,0.2)"
                  : "rgba(255,255,255,0.05)",
                border: isUser
                  ? "1px solid rgba(124,110,245,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
                fontSize: 13,
                color: "#e8e8ea",
                lineHeight: 1.6,
              }}
            >
              <div style={{ whiteSpace: "pre-wrap" }}>
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <ReactMarkdown
                          key={index}
                          components={{
                            ul: ({ children }) => (
                              <ul style={{ paddingLeft: 16, margin: "6px 0" }}>{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol style={{ paddingLeft: 16, margin: "6px 0" }}>{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li style={{ marginBottom: 2 }}>{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong style={{ color: "#c8c8d8", fontWeight: 600 }}>{children}</strong>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                style={{ color: "#a5b4fc", textDecoration: "underline" }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            ),
                            img: () => null,
                            p: ({ children }) => (
                              <p style={{ marginBottom: 8 }}>{children}</p>
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      );
                    case "tool-invocation":
                    case "dynamic-tool": {
                      const isOutputAvailable =
                        "state" in part && part.state === "output-available";
                      if (!isOutputAvailable) {
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 12,
                              color: "#ffffff",
                            }}
                          >
                            <span
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                border: "1.5px solid rgba(255,255,255,0.15)",
                                borderTopColor: "#7c6ef5",
                                display: "inline-block",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                            Searching...
                          </div>
                        );
                      }
                      // Render listing cards from the actual tool output
                      const toolOutput = (part as any).output;
                      const listings: any[] = Array.isArray(toolOutput) ? toolOutput : [];
                      return (
                        <div key={index}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12,
                              color: "#ffffff",
                              marginBottom: listings.length > 0 ? 12 : 0,
                            }}
                          >
                            <span style={{ color: "#22c55e", fontSize: 11 }}>✓</span>
                            Searched database — {listings.length} result{listings.length !== 1 ? "s" : ""}
                          </div>
                          {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                          ))}
                        </div>
                      );
                    }
                    default: {
                      if (part.type.startsWith("tool-")) {
                        const isOutputAvailableDefault =
                          "state" in part && part.state === "output-available";
                        if (!isOutputAvailableDefault) {
                          return (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 12,
                                color: "#ffffff",
                              }}
                            >
                              <span
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  border: "1.5px solid rgba(255,255,255,0.15)",
                                  borderTopColor: "#7c6ef5",
                                  display: "inline-block",
                                  animation: "spin 0.8s linear infinite",
                                }}
                              />
                              Searching...
                            </div>
                          );
                        }
                        const toolOutputDefault = (part as any).output;
                        const listingsDefault: any[] = Array.isArray(toolOutputDefault) ? toolOutputDefault : [];
                        return (
                          <div key={index}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 12,
                                color: "#ffffff",
                                marginBottom: listingsDefault.length > 0 ? 12 : 0,
                              }}
                            >
                              <span style={{ color: "#22c55e", fontSize: 11 }}>✓</span>
                              Searched database — {listingsDefault.length} result{listingsDefault.length !== 1 ? "s" : ""}
                            </div>
                            {listingsDefault.map((listing) => (
                              <ListingCard key={listing.id} listing={listing} />
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }
                  }
                })}
              </div>
            </div>

            {isUser && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <User style={{ width: 14, height: 14, color: "#9191a0" }} />
              </div>
            )}
          </div>
        );
      })}

      {(() => {
        const lastMsg = messages[messages.length - 1];
        const lastMsgHasText = lastMsg?.parts?.some(
          (p) => p.type === "text" && (p as { text?: string }).text
        );

        const loadingPhase =
          isLoading &&
          (lastMsg?.role === "user" ||
            (lastMsg?.role === "assistant" && !lastMsgHasText));

        const betweenRequests =
          !isLoading &&
          lastMsg?.role === "assistant" &&
          !lastMsgHasText &&
          lastMsg.parts?.some(
            (p) =>
              (p.type === "tool-invocation" || p.type.startsWith("tool-")) &&
              "state" in p &&
              p.state === "output-available"
          );

        return loadingPhase || betweenRequests ? <DynamicLoader /> : null;
      })()}

      <div data-scroll-anchor />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
