import './App.css';

import React, { useEffect, useState } from 'react';


//const WEBSOCKETSERVER_IP = "172.18.0.8";
const WEBSOCKETSERVER_IP = "127.0.0.1";
//const socket = new WebSocket('ws://localhost:8080');
const socket = new WebSocket(`ws://${WEBSOCKETSERVER_IP}:81`);
//const socket = new WebSocket(`ws://127.0.0.1:81`);

var user = {
  clientId: ''
}

const OutputComponent = ({ messages }) => {
  return (
    <div id="output">
      {messages.map((game, index) => (
        <div key={index} className="container">
          <ul className="list">
            <li>
              <div>Game ID: {game.game_id}</div>
              <div>Odd 1: {game.odd1.toFixed(4)}</div>
              <div>Odd 2: {game.odd2.toFixed(4)}</div>
              <div>Odd 3: {game.odd3.toFixed(4)}</div>
              <div>Odd 4: {game.odd4.toFixed(4)}</div>
              <div>Odd 5: {game.odd5.toFixed(4)}</div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

function App() {

  const [message1, setMessage1] = useState({});
  const [message2, setMessage2] = useState({});
  const [game_ids, setGameIds] = useState([]);

  const messages = [
    { game_id: "12345", odd1: 2.5, odd2: 3.1, odd3: 4.0, odd4: 1.8, odd5: 5.2 },
    { game_id: "67890", odd1: 1.5, odd2: 2.1, odd3: 3.0, odd4: 1.3, odd5: 4.2 },
    { game_id: "54321", odd1: 3.5, odd2: 4.1, odd3: 5.0, odd4: 2.8, odd5: 6.2 },
  ];

  useEffect(() => {

    socket.onopen = function (event) {
      console.log('You are Connected to WebSocket Server');
    };
    socket.onmessage = function (event) {

      if (user.clientId === '') {
        user['clientId'] = event.data;
        return;
      }

      const payload = JSON.parse(event.data);

      if (payload.game_id === '123120'){
        setMessage1(payload);
      } else if (payload.game_id === '123121') {
        setMessage2(payload);
      }

    };

    socket.onclose = function (event) {
      console.log('Disconnected from WebSocket server');
    };


  });

  function sendMessage() {

    const messageInput = { 'payload': 'vapo2', 'clientId': user.clientId };

    const message = JSON.stringify(messageInput);

    socket.send(message);

  };

  function addGame(game_id) {
    if (!game_ids.includes(game_id) ){
      setGameIds(game_ids => [...game_ids, game_id]);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Odds Market Simulator
        </h1>

        
        {/* <ul className="list">
            <li> {"Game: " +  message1.game_id } </li>
            <li> {"odd1: " +  message1.odd1}  </li>
            <li> {"odd2: " +  message1.odd2}  </li>
            <li> {"odd3: " +  message1.odd3}  </li>
            <li> {"odd4: " +  message1.odd4}  </li>
            <li> {"odd5: " +  message1.odd5}  </li>
        </ul> */}
        {/* <ul className="list">
        <li> {"Game: " +  message2.game_id } </li>
            <li> {"odd1: " +  message2.odd1}  </li>
            <li> {"odd2: " +  message2.odd2}  </li>
            <li> {"odd3: " +  message2.odd3}  </li>
            <li> {"odd4: " +  message2.odd4}  </li>
            <li> {"odd5: " +  message2.odd5}  </li>
        </ul> */}

{/* {messages.map((message, index) => (
        <OutputComponent key={index} message={message} />
      ))} */}

      <OutputComponent messages={messages} />
        {/* <OutputComponent message={message1} />
        <OutputComponent message={message1} />
        <OutputComponent message={message2} /> */}

        {/* </div> */}

        {/* <p>
          {game_ids}
        </p>
        

        <button className='btn btn-block btn-primary rounded-0 mr-auto ml-auto' onClick={() => sendMessage()}> Enviar mensagem</button>
        <button className='btn btn-block btn-primary rounded-0 mr-auto ml-auto' onClick={() => addGame('123121')}> Adicionar 123121</button>
        <button className='btn btn-block btn-primary rounded-0 mr-auto ml-auto' onClick={() => addGame('123122')}> Adicionar 123122</button>
      
       */}
      </header>
    </div>
  );
}

export default App;
