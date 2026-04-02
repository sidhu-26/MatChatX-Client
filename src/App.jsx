import React, { useState } from 'react';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

function App() {
  const [currentMatch, setCurrentMatch] = useState(null);

  const handleJoinMatch = (match) => {
    setCurrentMatch(match);
  };

  const handleLeaveChat = () => {
    setCurrentMatch(null);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 font-inter selection:bg-emerald-500 selection:text-slate-900">
      {!currentMatch ? (
        <Home onJoinMatch={handleJoinMatch} />
      ) : (
        <ChatRoom 
          match={currentMatch} 
          onLeave={handleLeaveChat} 
        />
      )}
    </main>
  );
}

export default App;
