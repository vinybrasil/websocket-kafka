import WebSocket from 'ws';

var user = {
    clientId: '',
    data: {'payload': {'odd1': 1.2}} 
  }

const wss = new WebSocket('ws://localhost:8080', {
  perMessageDeflate: false
});

wss.on('open', function open() {
    wss.send('{}');
  });

wss.on('message', function message(event) {

    if (user.clientId === ''){
      user['clientId'] = event.toString();

    }
    console.log(user);
  });

function sendMessage(){
    const message = JSON.stringify(user.data);
    wss.send(message);
    wss.close();
}
setTimeout(      
    sendMessage, 2000
)