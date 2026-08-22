import { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm FormSaathi. Ask me anything about filling out a digital form, and I'll help you.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    const trimmedInput = inputText.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = { sender: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/analyze-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formText: trimmedInput }),
      });

      const data = await response.json();

      if (data.success && data.explanation) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.explanation }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              data.message ||
              "I'm sorry, I couldn't process your question. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chatbot network error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "I'm having trouble connecting to the FormSaathi assistant server. Please check if the server is running on port 5000.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section
      className="settings-section chatbot-section"
      aria-label="FormSaathi Assistant Chat"
      style={{
        marginTop: "24px",
        padding: "24px",
        borderRadius: "16px",
        border: "1.5px solid #cbd5e1",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        className="chatbot-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
        }}
      >
        <span style={{ fontSize: "24px" }} aria-hidden="true">
          💬
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: "1.2em",
            fontWeight: "700",
            color: "#1e3a8a",
          }}
        >
          FormSaathi Assistant
        </h2>
      </div>

      {/* Scrollable messages container with aria-live */}
      <div
        className="chatbot-messages"
        aria-live="polite"
        role="log"
        aria-label="Chat message history"
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "12px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "16px",
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={index}
              className={`chat-message ${
                isUser ? "chat-message-user" : "chat-message-bot"
              }`}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: isUser
                  ? "14px 14px 2px 14px"
                  : "14px 14px 14px 2px",
                backgroundColor: isUser ? "#2563eb" : "#f1f5f9",
                color: isUser ? "#ffffff" : "#1e293b",
                fontSize: "0.95em",
                lineHeight: "1.5",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75em",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  opacity: 0.85,
                }}
              >
                {isUser ? "👤 You" : "🤖 FormSaathi"}
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
            </div>
          );
        })}

        {isLoading && (
          <div
            className="chat-message chat-message-loading"
            style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: "14px 14px 14px 2px",
              backgroundColor: "#f1f5f9",
              color: "#64748b",
              fontSize: "0.95em",
              fontStyle: "italic",
            }}
          >
            FormSaathi is thinking...
          </div>
        )}
      </div>

      {/* Input and Action Controls */}
      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "220px" }}>
          <label
            htmlFor="chatbot-input"
            style={{
              display: "block",
              fontSize: "0.9em",
              fontWeight: "700",
              marginBottom: "6px",
              color: "#334155",
            }}
          >
            Ask a question about your form:
          </label>
          <input
            id="chatbot-input"
            type="text"
            className="text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here (e.g. What is gross income?)..."
            disabled={isLoading}
            autoComplete="off"
            style={{
              width: "100%",
              boxSizing: "border-box",
              minHeight: "44px",
            }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-action btn-read-aloud"
          disabled={isLoading || !inputText.trim()}
          aria-label="Send question to FormSaathi assistant"
          style={{
            minHeight: "44px",
            padding: "10px 20px",
            fontWeight: "700",
            cursor: isLoading || !inputText.trim() ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Sending..." : "Send 📤"}
        </button>
      </form>
    </section>
  );
}

export default Chatbot;
