const WebSocket = require("ws");
const uuidv4 = require("uuid").v4;

console.log("Server running");

const wss = new WebSocket.Server({ port: 8080 });

const clients = {};
var raw_odds = {};

const { Kafka } = require("kafkajs");

const host = "localhost";

const kafka = new Kafka({
  brokers: [`${host}:9092`],
});

const consumer = kafka.consumer({ groupId: "group-1" });

var raw_odds = {};

const run = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "mysql-debezium-json-no-schema-asgard.gameodds.game_123121",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "mysql-debezium-json-no-schema-asgard.gameodds.game_123122",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        topic,
        partition,
      });
      raw_odds = JSON.parse(message.value.toString());
    },
  });
};

run().catch(console.error);

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
  console.log(raw_odds);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(raw_odds));
    }
  });
}

const intervalId = setInterval(update, 5000);
