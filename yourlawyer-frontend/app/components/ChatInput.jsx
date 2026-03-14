"use client";

export default function ChatInput({ input, setInput, handleSend, handleFileUpload }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

      {/* Hidden file input */}
      <input
        type="file"
        id="fileUpload"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Upload Button */}
      <button
        onClick={() => document.getElementById("fileUpload").click()}
        style={{
          background: "#1e293b",
          color: "white",
          fontSize: "20px",
          padding: "6px 12px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        +
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Ask legal question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #333"
        }}
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        style={{
          background: "#d4a63a",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Send
      </button>

    </div>
  );
}