from typing import Union
import mysql.connector 
import random

from fastapi import FastAPI

app = FastAPI()

import mysql.connector

@app.on_event("startup")
async def startup_event():
    global mydb
    mydb = mysql.connector.connect(
    host="172.18.0.6",
    user="debezium",
    password="dbz",
    database="gameodds"
    )


@app.get("/getall/{game_id}")
def read_root(game_id: str):
    mycursor = mydb.cursor()

    mycursor.execute(f"SELECT * FROM game_{game_id}")

    myresult = mycursor.fetchall()

    return myresult

# @app.post("/creategame/{game_id}")
# def read_root(game_id: str):
#     mycursor = mydb.cursor()

#     sql = f'''
#         CREATE TABLE IF NOT EXISTS game_{game_id} (
#             row_id INT AUTO_INCREMENT PRIMARY KEY,
#             game_id VARCHAR(50) NOT NULL,
#             odd1 VARCHAR(50),
#             odd2 VARCHAR(50),
#             odd3 VARCHAR(50),
#             odd4 VARCHAR(50),
#             odd5 VARCHAR(50),
#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#     );   
#     '''


#     mycursor.execute(sql)

#     mydb.commit()


@app.post("/sendodd/{game_id}")
def read_root(game_id: str):
    mycursor = mydb.cursor()

    odd1 = round(random.random() * 5, 2)
    odd2 = round(random.random() * 5, 2)
    odd3 = round(random.random() * 5, 2)
    odd4 = round(random.random() * 5, 2)
    odd5 = round(random.random() * 5, 2)

    print(game_id, odd1, odd2, odd3, odd4, odd5)
    sql = f'INSERT INTO game_{game_id} (game_id, odd1, odd2, odd3, odd4, odd5) VALUES ({game_id}, {str(odd1)}, {str(odd2)}, {str(odd3)}, {str(odd4)}, {str(odd5)})'

    mycursor.execute(sql)

    mydb.commit()

    print(mycursor.rowcount, "record inserted.")

    return {"game_id": game_id, "odd1": odd1, "odd2": odd2, "odd3": odd3, "odd4": odd4, "odd5" : odd5}

