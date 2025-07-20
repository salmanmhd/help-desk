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

const socket = io("http://localhost:4000", {
  autoConnect: false,
});

// Avatar Component
const Avatar = ({ role, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div
        className={`flex items-center justify-center rounded-full text-white shadow-sm ${
          role === "user"
            ? "bg-gradient-to-br from-gray-700 to-gray-800"
            : "bg-gradient-to-br from-blue-600 to-indigo-600"
        } ${size === "md" ? "border-2 border-gray-200" : ""}`}
      >
        {role === "user" ? (
          <User size={size === "md" ? 24 : 16} />
        ) : (
          <Bot size={size === "md" ? 24 : 16} />
        )}
      </div>
      {role === "bot" && size === "md" && (
        <div className="absolute -bottom-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-emerald-500"></div>
      )}
    </div>
  );
};

// Message Component
const Message = ({
  message,
  copiedMessageId,
  copyToClipboard,
  isTyping = false,
}) => {
  return (
    <div
      className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar role={message.role} size="sm" />

      <div
        className={`max-w-3xl flex-1 text-${message.role === "user" ? "right" : "left"}`}
      >
        <div
          className={`mb-1 flex items-center gap-2 justify-${message.role === "user" ? "end" : "start"}`}
        >
          <span className="text-sm font-medium text-gray-900">
            {message.role === "user" ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-gray-500">
            {isTyping
              ? "typing..."
              : message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </span>
        </div>

        <div className="relative">
          <div
            className={`rounded-xl p-3 shadow-sm transition-all ${
              message.role === "user"
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                : "border border-gray-200 bg-gray-50 text-gray-900"
            } hover:shadow-md`}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {isTyping ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay) => (
                      <div
                        key={delay}
                        className="h-2 w-2 animate-pulse rounded-full bg-gray-400"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    Processing your request
                  </span>
                </div>
              ) : (
                message.content
              )}
            </p>
          </div>

          {message.role === "bot" && !isTyping && (
            <div className="absolute bottom-[-28px] left-0 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => copyToClipboard(message.content, message.id)}
              >
                {copiedMessageId === message.id ? (
                  <Check size={12} className="text-emerald-500" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
              <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-green-600">
                <ThumbsUp size={12} />
              </button>
              <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600">
                <ThumbsDown size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// InputArea Component
const InputArea = ({ input, setInput, handleSubmit, isLoading }) => {
  return (
    <div className="border-t border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            className="h-12 w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-base shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>Press Enter to send your message</span>
        <span>Support at your fingertip</span>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ user, isConnected, handleSocket }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <Avatar role="bot" size="md" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500">Playniya • Chat Support</p>
        </div>
      </div>
      <button
        onClick={handleSocket}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Connect with us
      </button>
      <div className="flex items-center gap-2">
        <div>{isConnected ? `Online: ${user}` : "Offline"}</div>
        <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
          <Settings size={16} />
        </button>
        <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};

// Main ChatBot Component
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
  const messagesEndRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState("");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      console.log("Bot Answer:", data.answer);

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

  const handleSocket = () => {
    console.log(`🔻inside: handleSocket`);
    socket.connect();
    socket.on("connect", () => {
      console.log(`client connected: ${socket.id}`);
      setIsConnected(true);
      setUser(socket.id);
      console.log(`🔺isConnected: ${socket.connected}`);
    });

    return () => {
      socket.off("connect");
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-700 to-slate-800 font-sans antialiased">
      <div className="mx-auto flex h-screen max-w-6xl flex-col p-8">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white/95 shadow-xl backdrop-blur-lg">
          <Header
            user={user}
            isConnected={isConnected}
            handleSocket={handleSocket}
          />

          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Scrollable messages area */}
            <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-fade-in group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Message
                      message={message}
                      copiedMessageId={copiedMessageId}
                      copyToClipboard={copyToClipboard}
                    />
                  </div>
                ))}

                {isLoading && (
                  <div className="animate-fade-in">
                    <Message
                      message={{
                        id: "typing",
                        content: "",
                        role: "bot",
                        timestamp: new Date(),
                      }}
                      isTyping={true}
                    />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Fixed input area at the bottom */}
            <InputArea
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
