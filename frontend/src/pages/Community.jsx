import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

function Community() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const region = user?.region || "Local Region";

  useEffect(() => {
    if (!user?.region) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("agro_token");
        const response = await fetch(
          `${API_URL}/messages/${encodeURIComponent(user.region)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to load messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Message loading error:", error);
      }
    };

    loadMessages();
  }, [user?.region]);

  useEffect(() => {
    if (!user?.region || !user) return;

    const token = localStorage.getItem("agro_token");
    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("connect_error", () => setConnected(false));
    socket.on("disconnect", () => setConnected(false));

    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !socketRef.current || !connected) return;

    socketRef.current.emit("send-message", trimmed);
    setMessage("");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        {/* Community Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-6 py-4 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-base dark:border-neutral-700 dark:bg-neutral-800">
              💬
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-neutral-950 dark:text-white">
                {region} Farmer Channel
              </h1>
              <p className="text-[11px] text-neutral-400">
                Live community discussion for local farmers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-neutral-400"}`} />
            <span className="text-xs text-neutral-500 font-medium">
              {connected ? "Connected" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/30 dark:bg-neutral-950/30">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="text-3xl mb-2">👨‍🌾</div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">No messages yet</h3>
                <p className="mt-1 text-xs text-neutral-400">Start the conversation with farmers in {region}.</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const currentUserId = user?._id || user?.id;
              const senderId = msg.sender?._id || msg.sender;
              const isMine = String(senderId) === String(currentUserId);

              return (
                <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      isMine
                        ? "bg-neutral-950 text-white shadow-xs dark:bg-white dark:text-neutral-950"
                        : "border border-neutral-200/80 bg-white text-neutral-900 shadow-2xs dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-100"
                    }`}
                  >
                    {!isMine && (
                      <p className="mb-0.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <p className={`mt-1 text-[9px] text-right ${isMine ? "text-neutral-400" : "text-neutral-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <form onSubmit={sendMessage} className="flex gap-2.5 border-t border-neutral-200/80 p-3.5 bg-white dark:border-neutral-800/80 dark:bg-neutral-900">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message farmers in ${region}...`}
            className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-neutral-950 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-white dark:focus:bg-neutral-800"
          />
          <button
            type="submit"
            disabled={!connected || !message.trim()}
            className="rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Community;