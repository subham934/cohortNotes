import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ArenaHeader from './components/ArenaHeader';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { fetchBattleResponse } from './services/battleService';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, title: 'Factorial in JavaScript', time: '2h ago' },
    { id: 2, title: 'React Hook patterns', time: '5h ago' },
    { id: 3, title: 'Python list comprehension', time: 'Yesterday' },
  ]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { type: 'user', text: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    if (messages.length === 0) {
      const item = { id: Date.now(), title: trimmed.slice(0, 32) + (trimmed.length > 32 ? '…' : ''), time: 'Just now' };
      setHistory((prev) => [item, ...prev]);
      setActiveHistoryId(item.id);
    }

    try {
      const battleData = await fetchBattleResponse(trimmed);
      setMessages((prev) => [...prev, { type: 'battle', data: battleData, id: Date.now() + 1 }]);
    } catch {
      setMessages((prev) => [...prev, { type: 'error', text: 'Battle failed. Please try again.', id: Date.now() + 1 }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleNewBattle = () => { setMessages([]); setActiveHistoryId(null); setInput(''); };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#030712', position: 'relative' }}>
      {/* Animated mesh orbs – isolated in own stacking layer */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)', top: '-100px', left: '15%', animation: 'orb1 18s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)', bottom: '-80px', right: '20%', animation: 'orb2 22s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', top: '40%', right: '5%', animation: 'orb3 16s ease-in-out infinite' }} />
      </div>


      <Sidebar history={history} activeHistoryId={activeHistoryId} onNewBattle={handleNewBattle} onSelectHistory={setActiveHistoryId} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <ArenaHeader isLoading={isLoading} />
        <ChatArea messages={messages} isLoading={isLoading} onChipClick={(t) => setInput(t)} />
        <InputArea input={input} setInput={setInput} onSend={handleSend} onKeyDown={handleKeyDown} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;