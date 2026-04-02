import React from 'react';

const Message = ({ msg, isOwnTeam }) => {
  const { username, team, message, timestamp } = msg;
  
  return (
    <div className={`flex flex-col mb-4 ${isOwnTeam ? 'items-start' : 'items-end'}`}>
      <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
        isOwnTeam 
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tl-none' 
          : 'bg-rose-500/10 border border-rose-500/20 text-rose-100 rounded-tr-none'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm opacity-90">{username}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-medium ${
            isOwnTeam ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {team}
          </span>
        </div>
        <p className="text-base leading-relaxed break-words">{message}</p>
        <div className="mt-1 text-[10px] opacity-40 text-right italic">
          {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
        </div>
      </div>
    </div>
  );
};

export default Message;
