//import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';

const socket = new WebSocket('ws://localhost:8080');

var user = {
  clientId: ''
}

function App() {

  const [message1, setMessage1] = useState({});
  const [message2, setMessage2] = useState({});
  const [game_ids, setGameIds] = useState([]);

  useEffect(() => {

    socket.onopen = function (event) {
      console.log('You are Connected to WebSocket Server');
    };
    socket.onmessage = function (event) {

      if (user.clientId === '') {
        user['clientId'] = event.data;
        return;
      }



      //console.log(event.data)
      //console.log(typeof(event.data))
      //console.log(JSON.parse(event.data).odd1)
      const payload = JSON.parse(event.data);

      if (payload.game_id === '123121'){
        setMessage1(payload);
      } else if (payload.game_id === '123122') {
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
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          Odds Market
        </h1>

        <div id="output" className="container"> 
        <ul className="list">
            <li> {"Game: " +  message1.game_id } </li>
            <li> {"odd1: " +  message1.odd1}  </li>
            <li> {"odd2: " +  message1.odd2}  </li>
            <li> {"odd3: " +  message1.odd3}  </li>
            <li> {"odd4: " +  message1.odd4}  </li>
            <li> {"odd5: " +  message1.odd5}  </li>
        </ul>
        <ul className="list">
        <li> {"Game: " +  message2.game_id } </li>
            <li> {"odd1: " +  message2.odd1}  </li>
            <li> {"odd2: " +  message2.odd2}  </li>
            <li> {"odd3: " +  message2.odd3}  </li>
            <li> {"odd4: " +  message2.odd4}  </li>
            <li> {"odd5: " +  message2.odd5}  </li>
        </ul>
        </div>

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
