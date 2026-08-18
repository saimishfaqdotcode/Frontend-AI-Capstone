"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const messagesContainerRef = useRef(null);
  const userScrolledRef = useRef(false);

  const { messages, sendMessage, status, stop } = useChat({
    api: "/api/chat",
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Keep the chat at the bottom while the user is already near the bottom.
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !shouldAutoScroll) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, shouldAutoScroll]);

  function handleScroll() {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    const isNearBottom = distanceFromBottom < 80;

    setShouldAutoScroll(isNearBottom);
    userScrolledRef.current = !isNearBottom;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const text = input.trim();

    if (!text || isLoading) return;

    setInput("");

    // New message starts from the latest position.
    setShouldAutoScroll(true);
    userScrolledRef.current = false;

    await sendMessage({
      text,
    });
  }

  function jumpToLatest() {
    const container = messagesContainerRef.current;

    if (!container) return;

    setShouldAutoScroll(true);
    userScrolledRef.current = false;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <section className="chat-wrapper">
      <div className="chat-header">
        <div>
          <h1>AI Assistant</h1>
          <p>Ask me anything about web development.</p>
        </div>

        {isLoading && (
          <span className="chat-status">
            {status === "submitted" ? "Thinking..." : "Generating..."}
          </span>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
      >
        {messages.length === 0 && (
          <div className="chat-empty">
            <h2>How can I help?</h2>
            <p>
              Start a conversation and watch the response stream in real time.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.role === "user"
                ? "message-user"
                : "message-assistant"
            }`}
          >
            <div className="message-label">
              {message.role === "user" ? "You" : "AI"}
            </div>

            <div className="message-content">
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <span key={`${message.id}-${index}`}>
                      {part.text}
                    </span>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      {!shouldAutoScroll && (
        <button
          type="button"
          className="jump-button"
          onClick={jumpToLatest}
        >
          ↓ Jump to latest
        </button>
      )}

      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Message the AI..."
          rows={1}
          disabled={isLoading}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="stop-button"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="send-button"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}