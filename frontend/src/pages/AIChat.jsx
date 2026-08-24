import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import notionAI from "../assets/notion-ai.jpg";
import { useLanguage } from "../context/useLanguage";

function AIChat() {
  const { language, setLanguage, changeLanguage } = useLanguage();

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
      content: getWelcomeMessage(language || "English"),
    },
  ]);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Voice Interaction States
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [speechError, setSpeechError] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentAudioRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Load and track available system/browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const populateVoices = () => {
      try {
        const vList = window.speechSynthesis.getVoices();
        if (vList && vList.length > 0) {
          setAvailableVoices(vList);
        }
      } catch (e) {
        console.warn("Could not get speech voices:", e);
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop active speech playback immediately
  const stopSpeaking = () => {
    isPlayingRef.current = false;

    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {}
      abortControllerRef.current = null;
    }

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current.src = "";
      } catch (e) {}
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setSpeakingMessageId(null);
  };

  // Clean markdown and symbols for natural voice synthesis
  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return "";
    return rawText
      .replace(/\*\*(.*?)\*\*/g, "$1") // bold
      .replace(/\*(.*?)\*/g, "$1")     // italics
      .replace(/#{1,6}\s+/g, "")       // headers
      .replace(/🌱|🌾|🚜|👨‍🌾|✨|✓|⊞|⚡|💬|🔔|👤|📷|🎙️|🔊|🛑|⚠️|❌|🍅/gu, "") // emoji
      .replace(/`([^`]+)`/g, "$1")     // code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // link text
      .replace(/^\s*[-*•+]\s+/gm, ". ") // bullet points to natural pauses
      .replace(/\n+/g, ". ")            // newlines to pauses
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  // Detect language and ISO code for TTS
  const getTTSLanguage = (textToSpeak, currentAppLang) => {
    const teluguMatches = (textToSpeak.match(/[\u0C00-\u0C7F]/g) || []).length;
    const hindiMatches = (textToSpeak.match(/[\u0900-\u097F]/g) || []).length;

    if (teluguMatches > 8 || currentAppLang === "Telugu") {
      return { code: "te", fullCode: "te-IN", name: "Telugu" };
    }
    if (hindiMatches > 8 || currentAppLang === "Hindi") {
      return { code: "hi", fullCode: "hi-IN", name: "Hindi" };
    }
    return { code: "en", fullCode: "en-IN", name: "English" };
  };

  // Split long text into speakable sentence chunks
  const splitIntoChunks = (text, maxLength = 160) => {
    const sentences = text.match(/[^.!?।\n]+[.!?।\n]*/g) || [text];
    const chunks = [];
    let current = "";

    for (const s of sentences) {
      if ((current + " " + s).trim().length <= maxLength) {
        current = (current + " " + s).trim();
      } else {
        if (current) chunks.push(current);
        if (s.length > maxLength) {
          const words = s.split(/\s+/);
          let sub = "";
          for (const w of words) {
            if ((sub + " " + w).trim().length <= maxLength) {
              sub = (sub + " " + w).trim();
            } else {
              if (sub) chunks.push(sub);
              sub = w;
            }
          }
          if (sub) chunks.push(sub);
          current = "";
        } else {
          current = s.trim();
        }
      }
    }
    if (current) chunks.push(current);
    return chunks.filter((c) => c.trim().length > 0);
  };

  // Web Speech synthesis fallback
  const fallbackWebSpeech = (text, fullCode, messageId) => {
    if (!isPlayingRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeakingMessageId(null);
      isPlayingRef.current = false;
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = fullCode;

      const voiceList =
        availableVoices.length > 0
          ? availableVoices
          : window.speechSynthesis.getVoices();

      const voice = voiceList.find(
        (v) =>
          v.lang.toLowerCase() === fullCode.toLowerCase() ||
          v.lang.toLowerCase().startsWith(fullCode.slice(0, 2).toLowerCase())
      );
      if (voice) utterance.voice = voice;

      utterance.rate = 0.95;
      utterance.onend = () => {
        setSpeakingMessageId(null);
        isPlayingRef.current = false;
      };
      utterance.onerror = () => {
        setSpeakingMessageId(null);
        isPlayingRef.current = false;
      };

      if (isPlayingRef.current) {
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      setSpeakingMessageId(null);
      isPlayingRef.current = false;
    }
  };

  // Play audio queue using authentic native backend TTS proxy
  const playAudioQueue = async (chunks, langName, fullCode, messageId, controller) => {
    if (!isPlayingRef.current || !chunks || chunks.length === 0) {
      setSpeakingMessageId(null);
      isPlayingRef.current = false;
      return;
    }

    const [firstChunk, ...rest] = chunks;
    audioQueueRef.current = rest;

    try {
      const response = await API.get("/ai/tts", {
        params: {
          text: firstChunk,
          language: langName,
        },
        responseType: "blob",
        signal: controller?.signal,
      });

      if (!isPlayingRef.current) return;

      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch (e) {}
        if (isPlayingRef.current && audioQueueRef.current.length > 0) {
          playAudioQueue(audioQueueRef.current, langName, fullCode, messageId, controller);
        } else {
          setSpeakingMessageId(null);
          currentAudioRef.current = null;
          isPlayingRef.current = false;
        }
      };

      audio.onerror = () => {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch (e) {}
        if (!isPlayingRef.current) return;
        console.warn("Backend TTS playback error, switching to Web Speech API fallback");
        fallbackWebSpeech([firstChunk, ...rest].join(" "), fullCode, messageId);
      };

      if (!isPlayingRef.current) {
        audio.pause();
        return;
      }

      await audio.play();
    } catch (err) {
      if (!isPlayingRef.current || err?.name === "CanceledError" || err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
        return;
      }
      console.warn("Backend TTS call error, switching to Web Speech API:", err.message);
      if (isPlayingRef.current) {
        fallbackWebSpeech([firstChunk, ...rest].join(" "), fullCode, messageId);
      }
    }
  };

  // Speak assistant response aloud
  const speakMessage = (messageId, textToSpeak) => {
    if (speakingMessageId === messageId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleaned = cleanTextForSpeech(textToSpeak);
    if (!cleaned) return;

    isPlayingRef.current = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setSpeakingMessageId(messageId);

    const { fullCode, name } = getTTSLanguage(textToSpeak, language);
    const chunks = splitIntoChunks(cleaned);

    playAudioQueue(chunks, name, fullCode, messageId, controller);
  };

  // Toggle voice recognition (Speech-to-Text)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    stopSpeaking();
    setSpeechError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Voice input is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      setTimeout(() => setSpeechError(""), 6000);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      let langCode = "en-IN";
      if (language === "Telugu") langCode = "te-IN";
      else if (language === "Hindi") langCode = "hi-IN";
      recognition.lang = langCode;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setSpeechError("Microphone permission was denied. Please allow microphone access in your browser settings.");
        } else if (event.error !== "no-speech") {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setTimeout(() => setSpeechError(""), 6000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Could not start speech recognition:", err);
      setIsListening(false);
      setSpeechError("Unable to access microphone. Please check browser permissions.");
      setTimeout(() => setSpeechError(""), 6000);
    }
  };

  // Clean up speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

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

  // Handle language switch
  const handleSelectLanguage = (newLang) => {
    stopSpeaking();
    if (isListening) toggleListening();
    if (changeLanguage) {
      changeLanguage(newLang);
    } else if (setLanguage) {
      setLanguage(newLang);
    }
    setMessages((previous) => {
      if (previous.length === 1 && previous[0].role === "assistant") {
        return [
          {
            ...previous[0],
            content: getWelcomeMessage(newLang),
          },
        ];
      }
      return previous;
    });
  };

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
    stopSpeaking();
    if (isListening) toggleListening();
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
    if (isListening) toggleListening();
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
      <div className="border-b border-neutral-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/85 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-1 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60">
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
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Voice + Vision AI
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Ask with text or voice in English, Telugu & Hindi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle Selector */}
            <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-0.5 text-xs shadow-2xs dark:border-neutral-800 dark:bg-neutral-950">
              {["English", "Telugu", "Hindi"].map((langKey) => {
                const isSelected = language === langKey;
                const labels = {
                  English: "EN",
                  Telugu: "తెలుగు",
                  Hindi: "हिन्दी",
                };
                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => handleSelectLanguage(langKey)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    {labels[langKey]}
                  </button>
                );
              })}
            </div>

            {speakingMessageId && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-2xs transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 cursor-pointer"
                title="Stop audio readout"
              >
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-1" />
                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-2" />
                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-3" />
                </div>
                <span>Stop Voice</span>
              </button>
            )}

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
              const msgKey = message.id || message._id || idx;
              const isPlaying = speakingMessageId === msgKey;
              const msgLang = getTTSLanguage(message.content, language).name;

              return (
                <div
                  key={msgKey}
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

                      {/* Assistant Voice Output Button */}
                      {!isUser && (
                        <div className="mt-2.5 flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800/80">
                          <button
                            type="button"
                            onClick={() => speakMessage(msgKey, message.content)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                              isPlaying
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold"
                                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                            }`}
                            title={
                              isPlaying
                                ? "Stop voice readout"
                                : `Listen in ${msgLang}`
                            }
                          >
                            {isPlaying ? (
                              <>
                                <div className="flex items-center gap-0.5 h-3">
                                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-1" />
                                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-2" />
                                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-3" />
                                  <span className="w-0.5 h-3 bg-emerald-600 rounded-full animate-soundwave-4" />
                                </div>
                                <span>Stop Reading</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                                <span>Listen ({msgLang})</span>
                              </>
                            )}
                          </button>

                          <span className="text-[10px] text-neutral-400 font-medium">
                            {msgLang}
                          </span>
                        </div>
                      )}
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

          {/* Active Voice Listening Banner */}
          {isListening && (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-xs text-red-900 shadow-sm dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200 animate-fade-up">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="font-semibold">
                  {language === "Telugu"
                    ? "🎙️ తెలుగులో మాట్లాడుతున్నారు... (Speak in Telugu)"
                    : language === "Hindi"
                    ? "🎙️ हिन्दी में बोल रहे हैं... (Speak in Hindi)"
                    : "🎙️ Listening in English... Speak your question now"}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition hover:bg-red-700 cursor-pointer"
              >
                Done Speaking
              </button>
            </div>
          )}

          {/* Speech Error Banner */}
          {speechError && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 animate-fade-up">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{speechError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechError("")}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

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

            {/* Photo Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Upload crop leaf photo"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-700 cursor-pointer"
            >
              📷
            </button>

            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading}
              title={
                isListening
                  ? "Recording audio... Click to stop"
                  : `Speak your question in ${language}`
              }
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm transition cursor-pointer ${
                isListening
                  ? "animate-mic-pulse border-red-500 bg-red-500 text-white shadow-md shadow-red-500/20"
                  : "border-neutral-200 bg-neutral-50 text-neutral-700 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-700"
              }`}
            >
              {isListening ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "Telugu"
                  ? "Agro AI ని వ్యవసాయం గురించి అడగండి (లేదా మైక్ నొక్కండి)..."
                  : language === "Hindi"
                  ? "Agro AI से खेती के बारे में पूछें (या माइक दबाएं)..."
                  : "Ask Agro AI about crops, fertilizers, pest control (or click mic)..."
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