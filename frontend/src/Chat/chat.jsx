import React, { useState } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user_id, setuser_id] = useState(
    localStorage.getItem("user_id") || "user"
  );
  const [action, setaction] = useState("test_recommendation");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
        console.log("user_id: ", user_id);
        console.log("action: ", action);
        console.log("input: ", input);
      const response = await axios.get("http://localhost:2000/api/chroma", {
        user_id: user_id,
        action,
        prompt: input,
      });

      const aiMessage = {
        sender: "ai",
        text: response.data.reply || "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error communicating with AI:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-container">
      <h2>Chat with AI</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
        {loading && <div className="chat-message ai">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="chat-actions">
        <button
          onClick={() => {
            setaction("test_recommendation");
            handleSend();
          }}
          disabled={loading}
        >
          Course Recommendation
        </button>
        <button
          onClick={() => {
            setaction("test_job_recommendation");
            handleSend();
          }}
          disabled={loading}
        >
          Job Recommendation
        </button>
      </div>
    </div>
  );
};

export default Chat;
