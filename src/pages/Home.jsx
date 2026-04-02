import React, { useState, useEffect } from 'react';

const Home = ({ onJoinMatch }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/matches/live/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch matches');
        return res.json();
      })
      .then(data => {
        setMatches(data.matches || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching matches:', err);
        setError('Ensure the backend server is running on localhost:8000');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-8">
      <div className="animate-pulse text-xl font-light opacity-50 italic">Looking for live matches...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent mb-2">MatChatX</h1>
        <p className="text-slate-400 text-lg">Real-time ephemeral chat for sports fans.</p>
      </header>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-rose-300">
           {error}
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-slate-800/20 border border-slate-700/30 p-12 rounded-3xl text-center">
          <p className="text-slate-400 text-xl font-light italic opacity-60">No live matches at the moment. Try again later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map(match => (
            <div 
              key={match.id} 
              className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-3xl hover:bg-slate-800/40 transition-all hover:border-emerald-500/30 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  {match.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {match.id.slice(0, 8)}</span>
              </div>
              
              <div className="flex items-center justify-center gap-6 mb-8 text-center text-xl font-bold text-slate-100">
                <div className="w-1/3">{match.team_1}</div>
                <div className="text-emerald-500 italic font-black opacity-40">VS</div>
                <div className="w-1/3">{match.team_2}</div>
              </div>

              <button 
                onClick={() => onJoinMatch(match)}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Join Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
