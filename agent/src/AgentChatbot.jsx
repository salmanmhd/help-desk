import React, { useState, useEffect, useRef } from "react";
import {
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";

// Login Screen Component
const LoginScreen = ({ agentUsername, setAgentUsername, setCurrentScreen }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (agentUsername.trim()) {
      setCurrentScreen("requests");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Agent Portal
          </h1>
          <p className="text-gray-600">Sign in to start helping customers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Agent Username
            </label>
            <input
              type="text"
              value={agentUsername}
              onChange={(e) => setAgentUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// Request Item Component
const RequestItem = ({ request, onAccept, onReject }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="text-2xl">{request.avatar}</div>
          <div className="flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {request.username}
              </h3>
              <span className="text-sm text-gray-500">
                • {request.timestamp}
              </span>
            </div>
            <p className="mb-3 text-gray-700">{request.message}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-3">
        <button
          onClick={() => onAccept(request)}
          className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Accept</span>
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          <XCircle className="h-4 w-4" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};

// Requests Screen Component
const RequestsScreen = ({
  agentUsername,
  requests,
  handleAcceptRequest,
  handleRejectRequest,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {agentUsername}
              </h1>
              <p className="text-sm text-gray-600">Agent Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Online</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl p-4">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Incoming Chat Requests
          </h2>
          <p className="text-gray-600">
            Accept or reject customer support requests
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No pending requests
            </h3>
            <p className="text-gray-600">
              New customer requests will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestItem
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Message Component
const Message = ({ message }) => {
  return (
    <div
      className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
          message.sender === "agent"
            ? "bg-blue-600 text-white"
            : "border bg-white text-gray-900 shadow-sm"
        }`}
      >
        <p>{message.text}</p>
        <p
          className={`mt-1 text-xs ${
            message.sender === "agent" ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

// Chat Screen Component
const ChatScreen = ({
  currentUser,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleEndChat,
  messagesEndRef,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{currentUser.avatar}</div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentUser.username}
              </h1>
              <p className="text-sm text-green-600">Connected</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEndChat}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
            >
              End Chat
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(e);
            }}
            className="flex space-x-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main AgentChatbot Component
const AgentChatbot = () => {
  const [currentScreen, setCurrentScreen] = useState("login"); // login, requests, chat
  const [agentUsername, setAgentUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [requests, setRequests] = useState([
    {
      id: 1,
      username: "john_doe",
      message: "Hi, I need help with my account settings",
      timestamp: "2 minutes ago",
      avatar: "👨",
    },
    {
      id: 2,
      username: "sarah_smith",
      message: "Having trouble with payment processing",
      timestamp: "5 minutes ago",
      avatar: "👩",
    },
    {
      id: 3,
      username: "mike_johnson",
      message: "Need assistance with order tracking",
      timestamp: "8 minutes ago",
      avatar: "👱‍♂️",
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAcceptRequest = (request) => {
    setCurrentUser(request);
    setCurrentScreen("chat");
    // Initialize chat with user's original message
    setMessages([
      {
        id: 1,
        sender: "user",
        text: request.message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    // Remove request from list
    setRequests(requests.filter((r) => r.id !== request.id));
  };

  const handleRejectRequest = (requestId) => {
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "agent",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate user response after 2 seconds
      setTimeout(() => {
        const responses = [
          "Thanks for your help!",
          "That makes sense, let me try that.",
          "Could you explain that a bit more?",
          "Perfect, that solved my issue!",
          "I'm still having trouble with this part.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        const userMessage = {
          id: messages.length + 2,
          sender: "user",
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, userMessage]);
      }, 2000);
    }
  };

  const handleEndChat = () => {
    setCurrentScreen("requests");
    setCurrentUser(null);
    setMessages([]);
  };

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case "login":
      return (
        <LoginScreen
          agentUsername={agentUsername}
          setAgentUsername={setAgentUsername}
          setCurrentScreen={setCurrentScreen}
        />
      );
    case "requests":
      return (
        <RequestsScreen
          agentUsername={agentUsername}
          requests={requests}
          handleAcceptRequest={handleAcceptRequest}
          handleRejectRequest={handleRejectRequest}
        />
      );
    case "chat":
      return (
        <ChatScreen
          currentUser={currentUser}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleEndChat={handleEndChat}
          messagesEndRef={messagesEndRef}
        />
      );
    default:
      return null;
  }
};

export default AgentChatbot;
