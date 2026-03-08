import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Mic, MicOff, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pft-chat`;

const suggestions = [
  "Show all Central Government schemes",
  "What schemes are running in Tamil Nadu?",
  "Show all schemes in Karnataka",
  "Which state received the highest funding?",
  "कर्नाटक में कौन सी योजनाएं चल रही हैं?",
  "Show healthcare schemes across India",
  "கேரளாவில் என்ன திட்டங்கள் உள்ளன?",
  "Compare spending across states",
];

async function streamChat({
  messages, onDelta, onDone, onError, language,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
  language: string;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, language }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setLoading(false),
        onError: (err) => { upsert(`⚠️ ${err}`); setLoading(false); },
        language,
      });
    } catch {
      upsert("⚠️ Connection error. Please try again.");
      setLoading(false);
    }
  }, [messages, loading, language]);

  const toggleVoice = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href?.startsWith("/")) { e.preventDefault(); navigate(href); setOpen(false); }
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-elevated text-primary-foreground hover:scale-105 transition-transform duration-200"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-saffron border-2 border-card animate-pulse-gentle" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-[540px] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevated"
          >
            {/* Header */}
            <div className="relative bg-primary px-5 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-navy-light opacity-80" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/20">
                    <Bot className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <span className="font-display text-sm font-semibold text-primary-foreground">{t("chatbot.title")}</span>
                    <p className="text-[10px] text-primary-foreground/50 font-medium">{t("chatbot.subtitle")}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 pattern-dots" onClick={handleLinkClick}>
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("chatbot.welcome")}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("chatbot.quickQuestions")}</p>
                    {suggestions.map(s => (
                      <button key={s} onClick={() => send(s)} className="block w-full rounded-lg border border-border/50 bg-card px-3 py-2 text-left text-xs text-foreground hover:bg-muted/50 hover:border-secondary/30 transition-all duration-200">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/60 text-foreground rounded-bl-md"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&_a]:text-secondary [&_a]:underline [&_table]:text-xs [&_p]:mb-1 [&_ul]:mb-1 [&_li]:mb-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </motion.div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-muted/60 px-4 py-3">
                    <span className="inline-flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/40 p-3 bg-muted/20">
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
                <button type="button" onClick={toggleVoice} className={`flex-shrink-0 rounded-xl p-2.5 transition-all duration-200 ${listening ? "bg-destructive/10 text-destructive scale-110" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} title="Voice input">
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder={t("chatbot.placeholder")} className="flex-1 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/50 transition-all duration-200" disabled={loading} />
                <Button type="submit" size="sm" disabled={!input.trim() || loading} className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 p-0 rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
