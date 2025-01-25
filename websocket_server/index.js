const WebSocket = require("ws");
var mysql = require("mysql2");

const MYSQL_IP = "172.18.0.2";
const KAFKA_IP = "172.18.0.5";

let connection_names = [];

var con = mysql.createConnection({
  host: MYSQL_IP,
  port: "3306",
  user: "debezium",
  password: "dbz",
  database: "gameodds",
});

const wss = new WebSocket.Server({ port: 81 });
const { Kafka } = require("kafkajs");

console.log("Server running");

var last_odds = {};

const kafka = new Kafka({
  brokers: [`${KAFKA_IP}:29092`],
});

const consumer = kafka.consumer({ groupId: "group-1" });

con.connect(function (err) {
  if (err) throw err;
  con.query(
    "SELECT connector_name FROM available_games",
    function (err, result, fields) {
      if (err) throw err;
      var values = result.map((item) => item.connector_name);
      connection_names = values;
      run(connection_names).catch(console.error);
    }
  );
});


const run = async (connection_names) => {
  await consumer.connect();


  await connection_names.forEach((item) => {
    console.log(`connecting: ${item}`);
    consumer.subscribe({
      topics: [item],
      fromBeginning: false,
    });
  });


  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        topic,
        partition,
      });
      last_odds = JSON.parse(message.value.toString());
    },
  });
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  console.log("Received a new connection");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function update() {
  console.log(last_odds);
  console.log(connection_names);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(last_odds));
    }
  });
}

const intervalId = setInterval(update, 5000);
