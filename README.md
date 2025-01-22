
POST localhost:80/games/123120
POST localhost:80/sendodd/123120

curl -H "Accept:application/json" localhost:8083/connectors

POST localhost:80/games

docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq --filter "name=mysql")

docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq --filter "name=kafka-connect")

docker build -t fastapi-image . && docker run -d --name fastapi-container -p 80:80 --net websockets_default fastapi-image

docker build -t websocket-server . && docker run -d --name websocket-server-container -p 81:81 --net websockets_default websocket-server 