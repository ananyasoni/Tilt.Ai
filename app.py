from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import sqlite3
import json
import pickle
from pokernowgrabber import grab

app = Flask(__name__)
CORS(app)  # Apply CORS to the app

def connect_db(db_name):
    return sqlite3.connect(db_name)

@app.route('/signup', methods=['POST'])
def addAccount():
    data = request.get_json()
    login = data['username']  # Corrected how data is accessed
    password = data['password']
    print("data: " + login, password)
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Users (user, password, block) VALUES (?, ?, ?);", (login, password, 0))
        conn.commit()
    except sqlite3.IntegrityError as e:
        return jsonify({'success' : False})
    return jsonify({'success' : login})

@app.route('/getpercentage', methods=['GET'])
def getPercentage():
    return jsonify({'percentage' : grab()})

@app.route('/changeblock', methods=['POST'])
def changeBlock():
    data = request.get_json()
    login = data['username']
    block = data['block']
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE Users SET block = ? WHERE user = ?;", (block, login))
    conn.commit()
    return jsonify({'success' : block})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login = data["username"]
    password = data["password"]
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("SELECT EXISTS(SELECT * FROM Users WHERE user = ? AND password = ?);", (login, password))
    conn.commit()
    if(cursor.fetchone()[0]):
        return jsonify({'success' : login})
    else:
        return jsonify({'success' : False})

@app.route('/getblock', methods=['GET'])
def getBlock():
    data = request.get_json()
    login = data['username']
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("SELECT block FROM Users WHERE user = ?;", (login))
    conn.commit()
    return jsonify({'block' : cursor.fetchone()[0]})

if __name__ == '__main__':
    app.run(port=5000)
