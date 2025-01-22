const WebSocket = require("ws");
const uuidv4 = require("uuid").v4;
var mysql = require('mysql2');

const MYSQL_IP = "172.18.0.2";
const KAFKA_IP = "172.18.0.4";

let connection_names = ["mysql-debezium-json-no-schema-asgard.gameodds.game_123120"];

var con = mysql.createConnection({
  host: MYSQL_IP ,
  port: "3306",
  user: "debezium",
  password: "dbz",
  database: "gameodds"
});


const wss = new WebSocket.Server({ port: 8080 });
const { Kafka } = require("kafkajs");

console.log("Server running");

const clients = {};
var last_odds = {};

const kafka = new Kafka({
  brokers: [`${KAFKA_IP}:29092`],
  //brokers: [ `172.18.0.4:29092` ],
});

const consumer = kafka.consumer({ groupId: "group-1" });

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT connector_name FROM available_games", function (err, result, fields) {
    if (err) throw err;
    console.log(`c3: ${result}`);
    var values = result.map(item => item.connector_name);
    connection_names = values;
    console.log(`c4: ${connection_names}`);
    run(connection_names).catch(console.error);
  });
});

var last_odds = {};

const run = async (connection_names) => {

  await consumer.connect();

  console.log(`c2: ${connection_names}`);

  // connection_names.forEach((item, index) => {
  //   console.log(`c5: ${connection_names}`);
  // });

  // await consumer.subscribe({
  //   topics: connection_names,
  //   fromBeginning: false,
  // });

  // await consumer.subscribe({
  //   topic: "mysql-debezium-json-no-schema-asgard.gameodds.game_123121",
  //   fromBeginning: false,
  // });

  // await consumer.subscribe({
  //   topic: "mysql-debezium-json-no-schema-asgard.gameodds.game_123120",
  //   fromBeginning: false,
  // });

    await connection_names.forEach((item) => {
      console.log(`connecting: ${item}`);
      consumer.subscribe({
          topics: [item],
          fromBeginning: false,
        });
  });

  // await consumer.subscribe({
  //   topic: "mysql-debezium-json-no-schema-asgard.gameodds.game_123122",
  //   fromBeginning: false,
  // });



  //let topics2 = ["mysql-debezium-json-no-schema-asgard.gameodds.game_123120", "mysql-debezium-json-no-schema-asgard.gameodds.game_123121"];
  
  // await consumer.subscribe({
  //   topics: connection_names,
  //   fromBeginning: false,
  // });

  // for (const topic2 in connection_names ) {
  //   await consumer.subscribe({
  //     topic: topic2,
  //     fromBeginning: false,
  //   });
  // };

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

  const userId = uuidv4();
  console.log("Received a new connection");

  clients[userId] = ws;

  ws.send(`${userId}`);

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
