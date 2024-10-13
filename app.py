from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import sqlite3
import json
import pickle

app = Flask(__name__)
CORS(app)  # Apply CORS to the app

# # Load your pre-trained machine learning model
# with open('ml_model.pkl', 'rb') as f:
#     model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

def connect_db(db_name):
    return sqlite3.connect(db_name)

@app.route('/signup', methods=['POST'])
def addAccount():
    data = request.get_json()
    login = data['username']  # Corrected how data is accessed
    password = data['password']
    print(login, password)
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Users (username, password, block) VALUES (?, ?, ?)", (login, password, 0))
    except sqlite3.IntegrityError as e:
        return jsonify({'success' : login})
    return jsonify({'success' : True})

@app.route('/changeblock', methods=['POST'])
def changeBlock():
    data = request.get_json()
    login = data.username
    block = data.block
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE Users SET block = ? WHERE username = ?", (block, login))

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login = data.username
    password = data.password
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("SELECT EXISTS(SELECT * FROM Users WHERE username = ? AND password = ?)", (login, password))
    if(cursor.fetchone()[0]):
        return jsonify({'success' : True})
    else:
        return jsonify({'success' : False})

@app.route('/getblock', methods=['GET'])
def getBlock():
    data = request.get_json()
    login = data.username
    password = data.password
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("SELECT block FROM Users WHERE username = ? AND password = ?", (login, password))
    return jsonify({'block' : cursor.fetchone()[0]})

if __name__ == '__main__':
    app.run(debug=True)
