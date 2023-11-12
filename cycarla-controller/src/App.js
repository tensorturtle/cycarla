import React, { useState, useEffect } from 'react';
import { socket } from './socket';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastHeartbeatMessage, setLastHeartbeatMessage] = useState(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onHeartbeat(message) {
      console.log('heartbeat', message)
      console.log("time: ", new Date().toLocaleString())
      setLastHeartbeatMessage(message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('heartbeat', onHeartbeat);

    return () => {
      // all socket registration events should be removed when the component unmounts
      // to avoid duplicate receptions
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('heartbeat', onHeartbeat)
    }
  }, [])



  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="p-6 max-w-sm mx-auto bg-gray-700 rounded-xl shadow-md flex flex-col items-center space-y-4">
        <div className="text-3xl font-bold underline text-white">
          Hello world!
        </div>
        <div>
          Websocket connection status:{' '}
          {isConnected ? 'connected' : 'disconnected'}
        </div>
        <div>
          Last heartbeat message: {lastHeartbeatMessage}
        </div>
      </div>
    </div>
  );
}

export default App;