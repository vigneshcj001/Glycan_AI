import React, { useState, useEffect, useRef } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

const GlycoGPTExplorer = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are GlycoGPT, an expert AI assistant specialized in glycobiology and glycoinformatics.",
    },
  ]);
  const [visualizationTarget, setVisualizationTarget] = useState("");
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [status, setStatus] = useState("ready");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setStatus("thinking");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: updatedMessages,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      const assistantReply = data.choices[0].message.content;

      const visTrigger = assistantReply.match(/\[VISUALIZE:(.+?)\]/);
      if (visTrigger) {
        setVisualizationTarget(visTrigger[1]);
        setShowVisualizer(true);
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: assistantReply },
      ]);
      setStatus("ready");
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "⚠️ There was an error fetching the response. Try again.",
        },
      ]);
      setStatus("ready");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-800 rounded-xl shadow-xl min-h-[90vh] font-sans">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src="./images/GPT.png"
            alt="GlycoGPT"
            className="w-12 h-12 rounded-full border border-blue-400"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              🧠 GlycoGPT Explorer
            </h1>
            <p className="text-sm text-blue-500">
              Specialist AI for Glycobiology
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="border border-blue-200 rounded-lg p-4 bg-white h-[60vh] overflow-y-auto space-y-4 shadow-inner">
        {messages.slice(1).map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 items-start ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <RiRobot2Line className="text-blue-500 mt-1" />
            )}
            <div
              className={`px-4 py-2 rounded-xl max-w-lg text-sm ${
                msg.role === "user"
                  ? "bg-blue-300 text-white"
                  : "bg-blue-100 border border-blue-200 text-blue-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {showVisualizer && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-xl">
          <h3 className="text-lg font-bold text-blue-700 mb-2">
            🧬 Glycan Structure Visualization
          </h3>
          <p className="text-sm text-blue-600 mb-2">
            Structure input: <code>{visualizationTarget}</code>
          </p>
          <div className="text-blue-500 italic">
            [🔬 Glycan Viewer Coming Soon]
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about motifs, glycans, or biosynthesis..."
          className="flex-1 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-gray-800"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition"
        >
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const color = status === "thinking" ? "bg-yellow-400/90" : "bg-green-400/90";
  const text = status === "thinking" ? "Thinking..." : "Ready";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs ${color} text-black font-semibold`}
    >
      {text}
    </span>
  );
};

export default GlycoGPTExplorer;
