import React, { useState, useEffect, useRef } from 'react';
import wsService from '../services/websocket';
import Message from '../components/Message';

const ChatRoom = ({ match, onLeave }) => {
  const [username, setUsername] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [userEvent, setUserEvent] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!match) return;

    wsService.connect(match.id);

    const onOpen = () => setStatus('connected');
    const onClose = () => {
      setStatus('disconnected');
      setError('Chat ended or connection lost.');
    };
    const onError = () => setError('WebSocket Error. Check if backend is running.');
    
    const onHistory = (data) => {
      setMessages(data.messages || []);
    };

    const onChatMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const onUserEvent = (data) => {
      setUserEvent(data);
      // Auto-clear user event notification
      setTimeout(() => setUserEvent(null), 3000);
    };

    const onConnectionEstablished = (data) => {
      console.log('Connection established:', data);
    };

    wsService.on('open', onOpen);
    wsService.on('close', onClose);
    wsService.on('error', onError);
    wsService.on('chat_history', onHistory);
    wsService.on('chat_message', onChatMessage);
    wsService.on('user_event', onUserEvent);
    wsService.on('connection_established', onConnectionEstablished);

    return () => {
      wsService.disconnect();
      wsService.off('open', onOpen);
      wsService.off('close', onClose);
      wsService.off('error', onError);
      wsService.off('chat_history', onHistory);
      wsService.off('chat_message', onChatMessage);
      wsService.off('user_event', onUserEvent);
      wsService.off('connection_established', onConnectionEstablished);
    };
  }, [match]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim() || !selectedTeam) return;
    wsService.join(username, selectedTeam);
    setIsJoined(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || status !== 'connected') return;
    wsService.sendMessage(username, selectedTeam, input);
    setInput('');
  };

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl w-full max-w-md backdrop-blur-xl">
          <h2 className="text-2xl font-black mb-1 text-slate-100">Join the Chat</h2>
          <p className="text-slate-400 mb-8 text-sm">{match.team_1} vs {match.team_2}</p>
          
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                required
                className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none hover:border-slate-600 transition-all text-slate-100 placeholder:opacity-30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Support Team</label>
              <div className="grid grid-cols-2 gap-3">
                {[match.team_1, match.team_2].map(team => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setSelectedTeam(team)}
                    className={`py-4 rounded-2xl font-bold transition-all border ${
                      selectedTeam === team 
                        ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                        : 'bg-slate-900 text-slate-400 border-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status !== 'connected'}
              className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-4"
            >
              Enter Match Chat
            </button>
            {status !== 'connected' && (
              <p className="text-center text-xs text-rose-400 animate-pulse font-medium">Waiting for WebSocket connection...</p>
            )}
          </form>
          
          <button onClick={onLeave} className="w-full mt-6 text-slate-500 text-sm hover:text-slate-300 font-medium transition-all">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto bg-slate-950 border-x border-slate-900 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-5 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-sm font-black text-slate-100 uppercase tracking-tighter">Match Live Chat</h1>
          <div className="flex items-center gap-1.5 grayscale group hover:grayscale-0 transition-all cursor-default">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] text-slate-400 font-mono tracking-widest">{match.team_1} vs {match.team_2}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${
             status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
           }`}>
             {status}
           </div>
           <button onClick={onLeave} className="text-slate-500 hover:text-white transition-all text-sm font-black uppercase tracking-widest">Quit</button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-950 no-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-30 italic text-sm text-slate-400">
            No messages yet. Be the first to shout!
          </div>
        )}
        {messages.map((msg, i) => (
          <Message 
            key={i} 
            msg={msg} 
            isOwnTeam={msg.team === selectedTeam} 
          />
        ))}
      </div>

      {/* Notification Toast (Join/Leave) */}
      {userEvent && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800/90 backdrop-blur text-xs font-bold rounded-full border border-slate-700 shadow-2xl z-20 animate-bounce">
          <span className="text-emerald-400">{userEvent.username}</span> 
          <span className="text-slate-300 ml-1 opacity-60"> {userEvent.event === 'join' ? 'joined the' : 'left'} chat</span>
        </div>
      )}

      {/* Footer / Input */}
      <footer className="p-4 bg-slate-900 border-t border-slate-800">
        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-300 text-sm italic text-center">
            {error}
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input 
              type="text" 
              value={input}
              disabled={status !== 'connected'}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Send message to ${selectedTeam} fans...`}
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:opacity-20 text-slate-100 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || status !== 'connected'}
              className="bg-emerald-500 text-slate-950 font-black px-6 rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-30 disabled:grayscale"
            >
              SEND
            </button>
          </form>
        )}
        <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></div>
                <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Live Activity</span>
            </div>
            <span className="text-[9px] text-slate-600 font-mono italic">#{match.id.slice(0, 5)}</span>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoom;
