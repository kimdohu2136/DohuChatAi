import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: message };
    setChatLog([...chatLog, userMessage]);
    setMessage("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatLog, userMessage] }),
      });
      const data = await res.json();
      setChatLog([...chatLog, userMessage, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChatLog([...chatLog, userMessage, { role: "assistant", content: "오류가 발생했어요!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 32, color: "#ff69b4" }}>DohuChatAi</h1>
      <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 10 }}>
        {chatLog.map((msg, i) => (
          <div key={i} style={{
            background: msg.role === "user" ? "#ffffcc" : "#ccf2ff",
            margin: "5px 0", padding: 10, borderRadius: 10,
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="무엇이든 물어보세요!"
        style={{ padding: 10, width: "80%", marginRight: 10 }}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "..." : "보내기"}
      </button>
    </div>
  );
}
