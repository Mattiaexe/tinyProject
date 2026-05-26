"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

interface Message {
  role: "user" | "server";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "server", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "server", text: "Error: could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <span className={styles.label}>SYSTEM</span>
        <h1 className={styles.title}>mini-chat</h1>
        <p className={styles.subtitle}>Next.js · App Router · TypeScript</p>
      </header>

      <div className={styles.window}>
        <div className={styles.windowBar}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
          <span className={styles.windowTitle}>~/mini-chat</span>
        </div>

        <div className={styles.messages}>
          {messages.length === 0 && (
            <p className={styles.empty}>// send a message to begin</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={styles.row} data-role={m.role}>
              <span className={styles.badge}>{m.role === "user" ? "YOU" : "SRV"}</span>
              <span className={styles.msgText}>{m.text}</span>
            </div>
          ))}
          {loading && (
            <div className={styles.row} data-role="server">
              <span className={styles.badge}>SRV</span>
              <span className={styles.dots}>
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={styles.inputRow}>
          <span className={styles.prompt}>&gt;</span>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type something..."
            autoFocus
            disabled={loading}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "···" : "SEND"}
          </button>
        </div>
      </div>
    </main>
  );
}
