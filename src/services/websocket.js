/**
 * MatChatX WebSocket Service
 * 
 * Handles connection lifecycle and messaging for the chat rooms.
 */

class WebSocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect(matchId) {
    const url = `ws://localhost:8000/ws/chat/${matchId}/`;
    console.log(`Connecting to ${url}...`);
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      this.emit('open');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WS Message:', data.type || 'message', data);
        this.emit(data.type || 'message', data);
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket Disconnected:', event.code);
      this.emit('close', event);
    };

    this.socket.onerror = (err) => {
      console.error('WebSocket Error:', err);
      this.emit('error', err);
    };
  }

  join(username, team) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        username,
        team_supported: team
      }));
    }
  }

  sendMessage(username, team, message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        username,
        team,
        message
      }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  off(event, callback) {
      if (!this.callbacks[event]) return;
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }
}

const wsService = new WebSocketService();
export default wsService;
