import React, { useState, useEffect } from "react";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyC55Bytp7TUWr2dywp3TDqPPyKDREMHwnU";
const CHAT_HISTORY_KEY = "kaspi_chat_history";

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setChatHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
    setIsInitialized(true);
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
  }, [chatHistory, isInitialized]);

  const handleSend = async () => {
    if (!userPrompt.trim()) return;

    const userMessage = { role: "user", parts: [{ text: userPrompt }] };
    const updatedHistory = [...chatHistory, userMessage];

    setChatHistory(updatedHistory);
    setUserPrompt("");
    setLoading(true);

    const hiddenPrompt = {
      role: "user",
      parts: [
        {
          text:
            "Ты помогаешь пользователю найти информацию о продуктах и рецептах. "
        },
      ],
    };

    const fullHistory = [hiddenPrompt, ...updatedHistory];

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: fullHistory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      const reply = res.data.candidates?.[0]?.content;
      if (reply) {
        setChatHistory(prev => [...prev, reply]);
      } else {
        alert("Gemini не вернул ответа.");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      alert("Ошибка при обращении к Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Вы уверены, что хотите очистить историю чата?")) {
      setChatHistory([]);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Gemini Chat</h2>

      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        {chatHistory.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "3px",
              padding: "3px 8px",
              cursor: "pointer",
            }}
            title="Очистить историю"
          >
            ×
          </button>
        )}
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "Вы" : "Gemini"}:</strong>
            <p>{msg.parts?.map((p) => p.text).join("")}</p>
          </div>
        ))}
      </div>

      <textarea
        rows="3"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Введите сообщение..."
        style={{ width: "100%", padding: "10px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ padding: "10px", flex: 1 }}
        >
          {loading ? "Ожидание ответа..." : "Отправить"}
        </button>
        {chatHistory.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              padding: "10px",
              background: "#ff4444",
              color: "white",
              border: "none",
            }}
          >
            Очистить историю
          </button>
        )}
      </div>
    </div>
  );
}

export default App; 