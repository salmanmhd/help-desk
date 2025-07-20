import { useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

import {
  Send,
  Bot,
  User,
  Settings,
  MoreVertical,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
} from "lucide-react";

const socket = io("http://localhost:4000");

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant. I'm here to help you with any questions or tasks you might have. How can I assist you today?",
      role: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const scrollAreaRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState("");

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`client connected: ${socket.id}`);
      setIsConnected(true);
      setUser(socket.id);

      console.log(`🔺isConnected: ${socket.connected}`);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/v1/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content:
          data.answer ||
          "I apologize, but I'm unable to process your request at the moment.",
        role: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm experiencing connectivity issues. Please ensure the API server is running on localhost:3000 and try again.",
        role: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes slowPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    .animate-pulse-slow {
      animation: slowPulse 2s infinite;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    .gradient-bg {
      background: linear-gradient(135deg, #0f172a 0%, #374151 50%, #1e293b 100%);
    }
    
    .card-bg {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
    }
    
    .header-bg {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
    }
    
    .user-gradient {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    }
    
    .bot-gradient {
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    }
    
    .avatar-user-gradient {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
    }
    
    .status-dot {
      background: #10b981;
      animation: slowPulse 2s infinite;
    }
    
    .message-actions {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .message-container:hover .message-actions {
      opacity: 1;
    }
    
    .btn-base {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      outline: none;
    }
    
    .btn-ghost {
      background: transparent;
      color: #6b7280;
    }
    
    .btn-ghost:hover {
      background: #f3f4f6;
      color: #111827;
    }
    
    .btn-primary {
      background: #2563eb;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
    
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .input-field {
      width: 100%;
      height: 48px;
      border: 2px solid #d1d5db;
      border-radius: 12px;
      padding: 0 16px;
      font-size: 16px;
      background: white;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      outline: none;
    }
    
    .input-field:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .input-field:disabled {
      background: #f9fafb;
      cursor: not-allowed;
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div
        className="gradient-bg"
        style={{
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{ maxWidth: "1152px", margin: "0 auto", padding: "32px 16px" }}
        >
          <div
            className="card-bg"
            style={{
              height: "calc(100vh - 4rem)",
              border: "none",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              className="header-bg"
              style={{
                borderBottom: "1px solid #e5e7eb",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    className="bot-gradient"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: "2px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <Bot size={24} />
                  </div>
                  <div
                    className="status-dot"
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderRadius: "50%",
                    }}
                  ></div>
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    AI Assistant
                  </h1>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    Playniya • Chat Support
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  className="btn-base btn-ghost"
                  style={{ padding: "8px" }}
                >
                  <Settings size={16} />
                </button>
                <button
                  className="btn-base btn-ghost"
                  style={{ padding: "8px" }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                ref={scrollAreaRef}
                className="custom-scrollbar"
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className="animate-fade-in message-container"
                      style={{
                        display: "flex",
                        gap: "16px",
                        flexDirection:
                          message.role === "user" ? "row-reverse" : "row",
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <div
                        className={
                          message.role === "user"
                            ? "avatar-user-gradient"
                            : "bot-gradient"
                        }
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          flexShrink: 0,
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {message.role === "user" ? (
                          <User size={16} />
                        ) : (
                          <Bot size={16} />
                        )}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          maxWidth: "768px",
                          textAlign: message.role === "user" ? "right" : "left",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                            justifyContent:
                              message.role === "user"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#111827",
                            }}
                          >
                            {message.role === "user" ? "You" : "Assistant"}
                          </span>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div style={{ position: "relative" }}>
                          <div
                            className={
                              message.role === "user" ? "user-gradient" : ""
                            }
                            style={{
                              background:
                                message.role === "user" ? undefined : "#f9fafb",
                              border:
                                message.role === "bot"
                                  ? "1px solid #e5e7eb"
                                  : "none",
                              color:
                                message.role === "user" ? "white" : "#111827",
                              borderRadius: "16px",
                              padding: "12px 16px",
                              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.boxShadow =
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.boxShadow =
                                "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                            }}
                          >
                            <p
                              style={{
                                fontSize: "14px",
                                lineHeight: "1.5",
                                margin: 0,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {message.content}
                            </p>
                          </div>

                          {/* Message Actions */}
                          {message.role === "bot" && (
                            <div
                              className="message-actions"
                              style={{
                                position: "absolute",
                                bottom: "-32px",
                                left: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <button
                                className="btn-base btn-ghost"
                                style={{
                                  height: "24px",
                                  padding: "0 8px",
                                  borderRadius: "6px",
                                  color: "#6b7280",
                                }}
                                onClick={() =>
                                  copyToClipboard(message.content, message.id)
                                }
                                onMouseEnter={(e) => {
                                  e.target.style.background = "#f3f4f6";
                                  e.target.style.color = "#111827";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = "transparent";
                                  e.target.style.color = "#6b7280";
                                }}
                              >
                                {copiedMessageId === message.id ? (
                                  <Check
                                    size={12}
                                    style={{ color: "#10b981" }}
                                  />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                              <button
                                className="btn-base btn-ghost"
                                style={{
                                  height: "24px",
                                  padding: "0 8px",
                                  borderRadius: "6px",
                                  color: "#6b7280",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = "#f3f4f6";
                                  e.target.style.color = "#16a34a";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = "transparent";
                                  e.target.style.color = "#6b7280";
                                }}
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                className="btn-base btn-ghost"
                                style={{
                                  height: "24px",
                                  padding: "0 8px",
                                  borderRadius: "6px",
                                  color: "#6b7280",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = "#f3f4f6";
                                  e.target.style.color = "#dc2626";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = "transparent";
                                  e.target.style.color = "#6b7280";
                                }}
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div
                      className="animate-fade-in"
                      style={{ display: "flex", gap: "16px" }}
                    >
                      <div
                        className="bot-gradient"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          flexShrink: 0,
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Bot
                          size={16}
                          style={{ animation: "pulse 1s infinite" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#111827",
                            }}
                          >
                            Assistant
                          </span>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            typing...
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "16px",
                            padding: "12px 16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div style={{ display: "flex", gap: "4px" }}>
                              <div
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background: "#9ca3af",
                                  borderRadius: "50%",
                                  animation: "pulse 2s infinite",
                                }}
                              ></div>
                              <div
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background: "#9ca3af",
                                  borderRadius: "50%",
                                  animation: "pulse 2s infinite 0.2s",
                                }}
                              ></div>
                              <div
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background: "#9ca3af",
                                  borderRadius: "50%",
                                  animation: "pulse 2s infinite 0.4s",
                                }}
                              ></div>
                            </div>
                            <span
                              style={{ fontSize: "12px", color: "#6b7280" }}
                            >
                              Processing your request
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  background: "white",
                  padding: "24px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div style={{ flex: 1 }}>
                    <input
                      className="input-field"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                      placeholder="Type your message here..."
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="btn-base btn-primary"
                    style={{
                      height: "48px",
                      padding: "0 24px",
                      borderRadius: "12px",
                    }}
                  >
                    {isLoading ? (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid white",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  <span>Press Enter to send your message</span>
                  <span>Support at your fingertip</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header(params) {
  return (
    <div
      className="header-bg"
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative" }}>
          <div
            className="bot-gradient"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Bot size={24} />
          </div>
          <div
            className="status-dot"
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "-4px",
              width: "16px",
              height: "16px",
              border: "2px solid white",
              borderRadius: "50%",
            }}
          ></div>
        </div>
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
            }}
          >
            AI Assistant
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            Playniya • Chat Support
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button className="btn-base btn-ghost" style={{ padding: "8px" }}>
          <Settings size={16} />
        </button>
        <button className="btn-base btn-ghost" style={{ padding: "8px" }}>
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
