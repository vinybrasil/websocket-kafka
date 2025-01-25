import "./App.css";

import React, { useEffect, useState } from "react";

const WEBSOCKETSERVER_IP = "127.0.0.1";
const socket = new WebSocket(`ws://${WEBSOCKETSERVER_IP}:81`);

const OutputComponent = ({ messages }) => {
  return (
    <div id="output">
      {messages.map((game, index) => (
        <div key={index} className="container">
          <ul className="list">
            <li>
              <div>Game ID: {game.game_id}</div>
              <div>Odd 1: {game.odd1}</div>
              <div>Odd 2: {game.odd2}</div>
              <div>Odd 3: {game.odd3}</div>
              <div>Odd 4: {game.odd4}</div>
              <div>Odd 5: {game.odd5}</div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.onopen = function (event) {
      console.log("You are Connected to WebSocket Server");
    };
    socket.onmessage = function (event) {
      const payload = JSON.parse(event.data);

      setMessages((prevMessages) => {
        const existingIndex = prevMessages.findIndex(
          (msg) => msg.game_id === payload.game_id
        );

        if (existingIndex >= 0) {
          const updatedMessages = [...prevMessages];
          updatedMessages[existingIndex] = {
            ...updatedMessages[existingIndex],
            ...payload,
          };
          return updatedMessages;
        } else {
          return [...prevMessages, payload];
        }
      });
    };

    socket.onclose = function (event) {
      console.log("Disconnected from WebSocket server");
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Odds Market Simulator</h1>

        <OutputComponent messages={messages} />
      </header>
    </div>
  );
}

export default App;
