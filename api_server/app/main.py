import mysql.connector 
import random
import requests

from fastapi import FastAPI

app = FastAPI()


KAFKA_CONNECT_IP = "172.18.0.6"
MYSQL_IP = "172.18.0.2"

@app.on_event("startup")
async def startup_event():
    global mydb
    mydb = mysql.connector.connect(
    host=MYSQL_IP,
    user="debezium",
    password="dbz",
    database="gameodds"
    )


@app.get("/games/{game_id}")
def get_game_odds(game_id: str):
    mycursor = mydb.cursor()

    mycursor.execute(f"SELECT * FROM game_{game_id}")

    myresult = mycursor.fetchall()

    return myresult

@app.get("/games")
def get_game_odds():
    mycursor = mydb.cursor()

    mycursor.execute(f"SELECT * FROM available_games")

    myresult = mycursor.fetchall()

    return myresult

@app.post("/games/{game_id}")
def create_game(game_id: str):
    mycursor = mydb.cursor()

    sql = f'''
        CREATE TABLE IF NOT EXISTS game_{game_id} (
            row_id INT AUTO_INCREMENT PRIMARY KEY,
            game_id VARCHAR(50) NOT NULL,
            odd1 VARCHAR(50),
            odd2 VARCHAR(50),
            odd3 VARCHAR(50),
            odd4 VARCHAR(50),
            odd5 VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );   
    '''

    mycursor.execute(sql)

    mydb.commit()

    mycursor = mydb.cursor()

    sql = f'''INSERT INTO available_games (game_id, game_id_name, connector_name) 
        SELECT '{game_id}', '{"game_" + str(game_id)}', 
        '{"mysql-debezium-json-no-schema-asgard.gameodds.game_" + str(game_id)}' 
        FROM DUAL WHERE NOT EXISTS ( SELECT 1 FROM available_games WHERE game_id = '{game_id}' ); 
        '''
    print(sql)
    mycursor.execute(sql)

    mydb.commit()

    create_connector = requests.post(f"http://{KAFKA_CONNECT_IP}:8083/connectors/", headers={"Accept": "application/json", "Content-Type":"application/json"}, json={
      "name": f"source-debezium-orders-{game_id}",
      "config": {
            "connector.class": "io.debezium.connector.mysql.MySqlConnector",
            "database.hostname": "mysql",
            "database.port": "3306",
            "database.user": "debezium",
            "database.password": "dbz",
            "database.server.id": f"{game_id}",
            "database.server.name": "asgard",
            "table.whitelist": f"gameodds.game_{game_id}",
            "database.history.kafka.bootstrap.servers": "kafka:29092",
            "database.history.kafka.topic": f"dbserver_{game_id}" ,
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
    })



@app.post("/sendodd/{game_id}")
def read_root(game_id: str):
    mycursor = mydb.cursor()

    odd1 = round(random.random() * 5, 2)
    odd2 = round(random.random() * 5, 2)
    odd3 = round(random.random() * 5, 2)
    odd4 = round(random.random() * 5, 2)
    odd5 = round(random.random() * 5, 2)

    sql = f'INSERT INTO game_{game_id} (game_id, odd1, odd2, odd3, odd4, odd5) VALUES ({game_id}, {str(odd1)}, {str(odd2)}, {str(odd3)}, {str(odd4)}, {str(odd5)})'

    mycursor.execute(sql)

    mydb.commit()

    print(mycursor.rowcount, "record inserted.")

    return {"game_id": game_id, "odd1": odd1, "odd2": odd2, "odd3": odd3, "odd4": odd4, "odd5" : odd5}

