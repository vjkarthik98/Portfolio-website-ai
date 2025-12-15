"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Terminal } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello. I am the AI Assistant for this portfolio. Ask me about my projects, skills, or experience." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "ai", content: "System error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 p-6 flex justify-between items-center bg-[#161616] sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tighter">PORTFOLIO <span className="text-blue-500">_AI</span></h1>
        <div className="text-sm text-gray-400">Gen AI Engineer / Python / RAG</div>
      </nav>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-0">
        
        {/* Left Panel: Info & Projects */}
        <div className="md:col-span-8 p-12 border-r border-gray-800 space-y-20">
          
          {/* Hero Section */}
          <section className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-6xl md:text-8xl font-light tracking-tight leading-none">
                BUILDING <br /> <span className="font-bold">INTELLIGENCE.</span>
              </h2>
              <p className="mt-8 text-xl text-gray-400 max-w-2xl">
                I engineer advanced RAG pipelines and deploy open-source LLMs. 
                This website is powered by a custom vector database trained on my experience.
              </p>
            </motion.div>
          </section>

          {/* Bento Grid Projects */}
          <section>
            <h3 className="text-sm font-mono text-blue-500 mb-8 tracking-widest uppercase">Selected Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['RAG Finance Bot', 'Auto-Agent Framework', 'Vision Transformer'].map((item, i) => (
                <div key={i} className="group border border-gray-800 p-8 hover:bg-gray-900 transition-colors cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Terminal className="mb-4 text-gray-500 group-hover:text-blue-500" />
                  <h4 className="text-2xl font-bold mb-2">{item}</h4>
                  <p className="text-gray-400">Full stack Gen AI integration using Llama 3 and Pinecone.</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel: The Chatbot */}
        <div className="md:col-span-4 h-[calc(100vh-80px)] sticky top-[80px] bg-[#262626] flex flex-col border-l border-gray-800">
          <div className="p-4 bg-[#393939] text-xs font-mono uppercase tracking-widest text-center border-b border-gray-700">
            Interactive Assistant Active
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#161616] border border-gray-700 text-gray-300'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 animate-pulse">Processing vector search...</div>}
          </div>

          <div className="p-6 bg-[#262626] border-t border-gray-700">
            <div className="flex items-center gap-2 bg-[#161616] border border-gray-600 p-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about my skills..."
                className="flex-1 bg-transparent outline-none text-sm text-white px-2"
              />
              <button onClick={sendMessage} className="p-2 hover:bg-gray-800 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}