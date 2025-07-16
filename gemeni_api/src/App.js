import React, { useState } from "react";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyC55Bytp7TUWr2dywp3TDqPPyKDREMHwnU"; // твой ключ

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userPrompt.trim()) return;

    const userMessage = { role: "user", parts: [{ text: userPrompt }] };
    const visibleHistory = [...chatHistory, userMessage];

    setChatHistory(visibleHistory);
    setUserPrompt("");
    setLoading(true);

    // Добавляем скрытый промпт от "user" в начало (он не будет виден в интерфейсе)
    const hiddenPrompt = {
      role: "user",
      parts: [
        {
          text:
            "Ты помощник Kaspi.kz. Отвечай только на вопросы, связанные с Kaspi — покупки, Kaspi Gold, переводы, рассрочка. " +
            "Если вопрос не связан с Kaspi, вежливо скажи, что можешь говорить только о Kaspi." +
            "Если пользователь спрашивает человек ли ты, ответь, что ты виртуальный помощник Kaspi.kz по имени Арман" +
            "Если скажут привет, ответь приветствием и представься как Арман, виртуальный помощник Kaspi.kz." +
            "Не добавляй ** звездочки ** в ответах, просто пиши текст.",
        },
      ],
    };

    const fullHistory = [hiddenPrompt, ...visibleHistory];

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
        setChatHistory((prev) => [...prev, reply]);
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
        }}
      >
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
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px" }}
      >
        {loading ? "Ожидание ответа..." : "Отправить"}
      </button>
    </div>
  );
}

export default App;
