import React, { useState, useEffect, useRef } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";
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
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
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
            model: selectedModel,
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
    <div className="p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-xl shadow-2xl min-h-[90vh] font-sans">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src="./images/GPT.png"
            alt="GlycoGPT"
            className="w-12 h-12 rounded-full border border-indigo-400"
          />
          <div>
            <h1 className="text-2xl font-bold">🧠 GlycoGPT Explorer</h1>
            <p className="text-sm text-indigo-300">
              Specialist AI for Glycobiology
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span>Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-zinc-800 text-white border border-indigo-400 px-2 py-1 rounded-md"
          >
            <option value="gpt-4o">GPT-4 Omni</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
          <StatusBadge status={status} />
        </div>
      </header>

      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 h-[60vh] overflow-y-auto space-y-4 shadow-inner">
        {messages.slice(1).map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 items-start ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <RiRobot2Line className="text-indigo-400 mt-1" />
            )}
            <div
              className={`px-4 py-2 rounded-xl max-w-lg text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 border border-zinc-700 text-indigo-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {showVisualizer && (
        <div className="mt-6 p-4 bg-indigo-100/10 border border-indigo-400 rounded-xl">
          <h3 className="text-lg font-bold text-indigo-300 mb-2">
            🧬 Glycan Structure Visualization
          </h3>
          <p className="text-sm text-indigo-200 mb-2">
            Structure input: <code>{visualizationTarget}</code>
          </p>
          <div className="text-indigo-400 italic">
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
          className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition"
        >
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const color = status === "thinking" ? "bg-yellow-400/90" : "bg-green-500/90";
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
