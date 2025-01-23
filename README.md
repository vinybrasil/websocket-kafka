
POST localhost:80/games/123120
POST localhost:80/sendodd/123120



POST localhost:80/games

## todo 

 - adiciona um topico para toda vez que tiver um jogo novo ele atualize

## run

docker-compose up -d

docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq --filter "name=mysql")

docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq --filter "name=kafka")

docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq --filter "name=kafka-connect")

docker build -t fastapi-image . && docker run -d --name fastapi-container -p 80:80 --net websockets_default fastapi-image

sh create_connectors.sh

docker build -t websocket-server . && docker run -d --name websocket-server-container -p 81:81 --net websockets_default websocket-server 

 docker build -t websocket-client . && docker run -d -p 3000:80 --name websocket-client-container --net websockets_default websocket-client


## debug 

mysql -h"172.18.0.4" -P"3306" -uroot -p"debezium"

kafka-topics --bootstrap-server localhost:9092 --list

kafka-console-consumer --bootstrap-server localhost:9092 --topic mysql-debezium-json-no-schema-asgard.gameodds.game_123120 --from-beginning

curl -H "Accept:application/json" localhost:8083/connectors

curl -i -X DELETE -H "Accept:application/json" localhost:8083/connectors/source-debezium-orders-123120


curl -i -X POST -H "Accept:application/json" \
    -H  "Content-Type:application/json" http://localhost:8083/connectors/ \
    -d '{
      "name": "source-debezium-orders-123121",
      "config": {
            "connector.class": "io.debezium.connector.mysql.MySqlConnector",
            "database.hostname": "mysql",
            "database.port": "3306",
            "database.user": "debezium",
            "database.password": "dbz",
            "database.server.id": "123121",
            "database.server.name": "asgard",
            "table.whitelist": "gameodds.game_123121",
            "database.history.kafka.bootstrap.servers": "kafka:29092",
            "database.history.kafka.topic": "dbserver123120" ,
            "decimal.handling.mode": "double",
            "include.schema.changes": "true",
            "value.converter": "org.apache.kafka.connect.json.JsonConverter",
            "value.converter.schemas.enable": "false",
            "key.converter": "org.apache.kafka.connect.json.JsonConverter",
            "key.converter.schemas.enable": "false",
            "transforms": "unwrap,addTopicPrefix",
            "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
            "transforms.addTopicPrefix.type":"org.apache.kafka.connect.transforms.RegexRouter",
            "transforms.addTopicPrefix.regex":"(.*)",
            "transforms.addTopicPrefix.replacement":"mysql-debezium-json-no-schema-$1",
            "database.allowPublicKeyRetrieval": "true"
       }
    }'


