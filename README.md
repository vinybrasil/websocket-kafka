

# Building a real-time Websocket webapp with Kafka and Javascript



In this project we’ll build a sports betting app. We’ll create a webapp which send a websocket message to their clients after receiving a message from a Kafka topic. This message comes from a new record being inserted in the database from a API and captured by Kafka-Connect with the debezium plugin.
The full explanation of the code in on this [blogpost](https://vinybrasil.github.io/blog/websockets-kafka/).

## To run

Build Kafka, Kafka-Connect and the MySQL database:
```
docker-compose up -d -f docker-compose.yml
```
Build the API to send the odds:
```
cd api_server
docker build -t fastapi-image . 
docker run -d --name fastapi-container -p 80:80 --net websockets_default fastapi-image
```
Build the websocker server:
```
cd websocket_server
docker build -t websocket-server . 
docker run -d --name websocket-server-container -p 81:81 --net websockets_default websocket-server 
```
Build the websocker client:
```
cd websocket_client
docker build -t websocket-client . 
docker run -d -p 3000:80 --name websocket-client-container --net websockets_default websocket-client
```
Add some games and some odds
```
POST localhost:80/games/123120
POST localhost:80/sendodd/123120
```
And now just see them updating in the browser when calling
```
POST localhost:80/sendodd/123120
```
## todo 

  - update the list of topics to read in the websocket server dynamically;

