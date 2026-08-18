"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

function WebsiteAnalysisCard({ output }) {
  return (
    <div className="tool-result-card">
      <div className="tool-result-header">
        <div>
          <span className="tool-result-eyebrow">TOOL RESULT</span>
          <h3>Website Analysis</h3>
        </div>

        <span className="tool-success-badge">Success</span>
      </div>

      <div className="tool-result-grid">
        <div className="tool-result-item">
          <span>URL</span>
          <strong>{output.url}</strong>
        </div>

        <div className="tool-result-item">
          <span>Page Title</span>
          <strong>{output.title}</strong>
        </div>

        <div className="tool-result-item">
          <span>Meta Description</span>
          <strong>{output.description}</strong>
        </div>

        <div className="tool-result-item">
          <span>Title Found</span>
          <strong>{output.titleFound ? "Yes" : "No"}</strong>
        </div>

        <div className="tool-result-item">
          <span>Description Found</span>
          <strong>{output.descriptionFound ? "Yes" : "No"}</strong>
        </div>

        <div className="tool-result-item">
          <span>Analyzed At</span>
          <strong>{new Date(output.analyzedAt).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}

function ToolPart({ part }) {
  const state = part.state;

  if (state === "input-streaming") {
    return (
      <div className="tool-state tool-state-streaming">
        <div className="tool-state-icon">◌</div>
        <div>
          <strong>Preparing website analysis</strong>
          <p>The tool is receiving the website URL...</p>
        </div>
      </div>
    );
  }

  if (state === "input-available") {
    return (
      <div className="tool-state tool-state-input">
        <div className="tool-state-icon">→</div>
        <div>
          <strong>Website analysis requested</strong>
          <p>
            URL: <span>{part.input?.url}</span>
          </p>
        </div>
      </div>
    );
  }

  if (state === "output-available") {
    return <WebsiteAnalysisCard output={part.output} />;
  }

  if (state === "output-error") {
    return (
      <div className="tool-state tool-state-error">
        <div className="tool-state-icon">!</div>
        <div>
          <strong>Website analysis failed</strong>
          <p>
            {part.errorText || "The website could not be analyzed."}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const messagesContainerRef = useRef(null);
  const userScrolledRef = useRef(false);

  const { messages, sendMessage, status, stop } = useChat({
    api: "/api/chat",
  });

  const isLoading = status === "submitted" || status === "streaming";

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

                if (part.type === "tool-analyzeWebsite") {
                  return (
                    <ToolPart
                      key={`${message.id}-${index}`}
                      part={part}
                    />
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