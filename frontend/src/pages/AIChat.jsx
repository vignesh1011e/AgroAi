import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import notionAI from "../assets/notion-ai.jpg";

function AIChat() {
  const [language, setLanguage] = useState(
    localStorage.getItem("agro_language") || "English"
  );

  const getWelcomeMessage = (selectedLanguage) => {
    if (selectedLanguage === "Telugu") {
      return "నమస్కారం! 🌱 నేను Agro AI. పంటలు, ఎరువులు, తెగుళ్లు, నేల, సాగు పద్ధతులు లేదా పంట చిత్రాన్ని విశ్లేషించడం గురించి నన్ను అడగండి.";
    }
    if (selectedLanguage === "Hindi") {
      return "नमस्ते! 🌱 मैं Agro AI हूँ। फसलों, उर्वरकों, कीटों, मिट्टी, खेती के तरीकों के बारे में पूछें या फसल की तस्वीर अपलोड करें।";
    }
    return "Hello! 🌱 I'm your Agro AI Assistant. Ask me anything about crop health, soil, fertilizers, weather impacts, or upload a leaf photograph for disease diagnostics.";
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: getWelcomeMessage(language),
    },
  ]);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load chat history from DB on component mount
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const res = await API.get("/ai/history");
        if (!cancelled && res.data?.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.warn("Could not load previous AI chat history:", err.message);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for language changes across topbar
  useEffect(() => {
    const handleLanguageChange = (event) => {
      const newLanguage = event.detail;
      if (
        newLanguage !== "English" &&
        newLanguage !== "Telugu" &&
        newLanguage !== "Hindi"
      ) {
        return;
      }

      setLanguage(newLanguage);
      setMessages((previous) => {
        if (previous.length === 1 && previous[0].role === "assistant") {
          return [
            {
              ...previous[0],
              content: getWelcomeMessage(newLanguage),
            },
          ];
        }
        return previous;
      });
    };

    window.addEventListener("agro-language-change", handleLanguageChange);
    return () => {
      window.removeEventListener("agro-language-change", handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (PNG, JPG, JPEG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearChat = async () => {
    try {
      await API.delete("/ai/history");
    } catch (err) {
      console.warn("Failed to clear DB history:", err.message);
    }

    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: getWelcomeMessage(language),
      },
    ]);
    removeImage();
    setInput("");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage && !selectedImage) return;

    const currentImagePreview = imagePreview;
    const tempUserMsg = {
      id: Date.now(),
      role: "user",
      content: userMessage || "Uploaded crop photograph for diagnosis",
      image: currentImagePreview,
    };

    setMessages((previous) => [...previous, tempUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      if (userMessage) formData.append("message", userMessage);
      formData.append("language", language);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await API.post("/ai/chat", formData);
      const data = response.data;

      let reply = data.reply;
      if (data.disease) {
        if (language === "Telugu") {
          reply = `🌱 **పంట వ్యాధి గుర్తింపు ఫలితం**\n\n**అంచనా:** ${data.disease.label.replaceAll(
            "___",
            " — "
          )}\n**నమ్మక స్థాయి:** ${data.disease.confidence}%\n\n${reply}`;
        } else if (language === "Hindi") {
          reply = `🌱 **फसल रोग पहचान परिणाम**\n\n**अनुमान:** ${data.disease.label.replaceAll(
            "___",
            " — "
          )}\n**विश्वास स्तर:** ${data.disease.confidence}%\n\n${reply}`;
        } else {
          reply = `🌱 **Disease Diagnostics Result**\n\n**Prediction:** ${data.disease.label.replaceAll(
            "___",
            " — "
          )}\n**Confidence:** ${data.disease.confidence}%\n\n${reply}`;
        }
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: reply,
          disease: data.disease,
        },
      ]);
      removeImage();
    } catch (error) {
      console.error("AI chat error:", error);
      let errorMessage = "Sorry, I couldn't process your request right now. Please try again.";
      if (language === "Telugu") {
        errorMessage = "క్షమించండి, మీ అభ్యర్థనను ప్రస్తుతం ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి.";
      } else if (language === "Hindi") {
        errorMessage = "क्षमा करें, मैं अभी आपके अनुरोध को संसाधित नहीं कर सका। कृपया फिर से प्रयास करें।";
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedQuestions = () => {
    if (language === "Telugu") {
      return [
        "టమోటా తెగుళ్లను ఎలా నివారించాలి?",
        "వరి పంటకు ఉత్తమ ఎరువు ఏది?",
        "పత్తి పంటలో గులాబీ రంగు పురుగు నివారణ ఎలా?",
      ];
    }
    if (language === "Hindi") {
      return [
        "टमाटर में कीटों को कैसे रोकें?",
        "धान के लिए सबसे अच्छी खाद कौन सी है?",
        "कपास में गुलाबी सुंडी का नियंत्रण कैसे करें?",
      ];
    }
    return [
      "How to treat early blight in tomatoes?",
      "Optimal NPK fertilizer schedule for wheat?",
      "Best natural remedies for cotton bollworm?",
    ];
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header Bar */}
      <div className="border-b border-neutral-200/80 bg-white/85 px-6 py-3 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/85">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-1 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60">
              <img
                src={notionAI}
                alt="Agro AI Assistant"
                className="h-full w-full object-contain filter grayscale contrast-125 dark:invert"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-neutral-950 dark:text-white">
                  Agro AI Assistant
                </h1>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  OpenRouter + Vision
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Instant crop disease scanning & agronomic guidance
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            disabled={messages.length <= 1 && !input && !selectedImage}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-2xs transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 cursor-pointer"
            title="Clear conversation"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {historyLoading ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              <p className="mt-2">Loading conversation history...</p>
            </div>
          ) : (
            messages.map((message, idx) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id || message._id || idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[85%] gap-2.5 ${
                      isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                        isUser
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {isUser ? "👨‍🌾" : "🌱"}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isUser
                          ? "bg-emerald-600 text-white shadow-xs font-normal"
                          : "border border-neutral-200/80 bg-white text-neutral-800 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                      }`}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Crop uploaded"
                          className="mb-2.5 max-h-56 rounded-xl border border-neutral-200 object-cover dark:border-neutral-700"
                        />
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                🌱
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer Footer */}
      <div className="border-t border-neutral-200/80 bg-white/90 px-4 pt-3 pb-4 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/90">
        <div className="mx-auto max-w-3xl space-y-2.5">
          {/* Suggested Questions */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {getSuggestedQuestions().map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                disabled={loading}
                className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50/60 px-3 py-1 text-[11px] font-medium text-emerald-800 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-2 dark:border-emerald-800 dark:bg-emerald-950/40">
              <img
                src={imagePreview}
                alt="Selected leaf"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  {selectedImage?.name}
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Attached for leaf diagnosis</p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="h-6 w-6 rounded-md text-xs text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Upload crop leaf photo"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-700 cursor-pointer"
            >
              📷
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "Telugu"
                  ? "Agro AI ని వ్యవసాయం గురించి అడగండి..."
                  : language === "Hindi"
                  ? "Agro AI से खेती के बारे में पूछें..."
                  : "Ask Agro AI about crops, fertilizers, pest control..."
              }
              disabled={loading}
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-emerald-400"
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedImage)}
              className="flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400 cursor-pointer"
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIChat;