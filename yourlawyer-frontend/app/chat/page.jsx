"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiRequest } from "../lib/api";
import Link from "next/link";

export default function ChatPage() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hello! How can I assist you today? If you have any legal questions, feel free to ask.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [cases, setCases] = useState([]);
  const [summary, setSummary] = useState("");

  const [notification, setNotification] = useState("");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [chatName, setChatName] = useState("");

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

      await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      setNotification("Document uploaded successfully!");

    } catch {
      setNotification("Upload failed");
    }

    setTimeout(() => setNotification(""), 3000);
  };

  /* ================= SEND MESSAGE ================= */

  const handleSend = async () => {

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {

      const data = await apiRequest(
        "/api/ai-chat",
        "POST",
        { message: userMessage.content }
      );

      const aiMessage = {
        role: "ai",
        content: data.reply || "No response from AI.",
      };

      setMessages((prev) => [...prev, aiMessage]);

      setCases(data.similarCases || []);
      setSummary(data.summary || "");

    } catch {
      setNotification("Failed to get AI response");
      setTimeout(() => setNotification(""), 3000);
    }

    setLoading(false);
  };

  /* ================= SAVE CHAT ================= */

  const handleSaveChat = () => {

    if (messages.length <= 1) {
      setNotification("No conversation to save.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    setShowSaveModal(true);
  };

  const confirmSaveChat = async () => {

    if (!chatName.trim()) {
      setNotification("Chat name required.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    try {

      await apiRequest("/api/ai-chat/register", "POST", {
        name: chatName,
        messages: messages,
      });

      setNotification("Chat saved successfully!");
      setChatName("");
      setShowSaveModal(false);

    } catch {
      setNotification("Failed to save chat");
    }

    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="chat-layout">

      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#C6A85C",
            color: "black",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "500",
            zIndex: 999,
          }}
        >
          {notification}
        </div>
      )}

      {/* LEFT PANEL */}
      <div className="chat-side">
        <div className="side-block">
          <h3 className="side-title">Chat Summary</h3>
          <p className="side-text">
            {summary || "No summary available yet."}
          </p>
        </div>
      </div>

      {/* CENTER CHAT */}
      <div className="chat-center">
        <div className="chat-container">

          {/* SAVED CHATS BUTTON */}
          <div style={{ marginBottom: "10px" }}>
            <Link href="/saved-chats">
              <button
                className="send-btn"
                style={{
                  backgroundColor: "#C6A85C",
                  color: "black",
                  fontWeight: "600"
                }}
              >
                Saved Chats
              </button>
            </Link>
          </div>

          {/* SAVE CHAT BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <button
              onClick={handleSaveChat}
              className="send-btn"
              style={{ backgroundColor: "#C6A85C", color: "black" }}
            >
              Save Chat
            </button>
          </div>

          {/* CHAT MESSAGES */}
          <div className="chat-messages">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  msg.role === "ai" ? "ai" : "user"
                }`}
              >
                {msg.role === "ai"
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble ai">
                Thinking...
              </div>
            )}

          </div>

          {/* INPUT AREA */}
          <div
            className="chat-input-wrapper"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            <button
              className="send-btn"
              style={{
                backgroundColor: "#C6A85C",
                color: "black",
                padding: "6px 12px",
                fontSize: "18px",
                fontWeight: "bold"
              }}
              onClick={() =>
                document.getElementById("fileUpload").click()
              }
            >
              +
            </button>

            <input
              type="text"
              className="chat-input"
              placeholder="Ask legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
            />

            <button
              className="send-btn"
              onClick={handleSend}
              style={{
                backgroundColor: "#C6A85C",
                color: "black"
              }}
            >
              Send
            </button>

          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="chat-side">
        <div className="side-block">
          <h3 className="side-title">Similar Cases</h3>

          <ul className="case-list">
            {cases.length === 0 ? (
              <li>No similar cases found.</li>
            ) : (
              cases.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#C6A85C" }}
                  >
                    {item.title}
                  </a>
                </li>
              ))
            )}
          </ul>

        </div>
      </div>

    </div>
  );
}