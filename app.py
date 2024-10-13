from flask import Flask, request, jsonify
import numpy as np
import sqlite3
import json
import pickle

app = Flask(__name__)

# Load your pre-trained machine learning model
with open('ml_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

def connect_db(db_name):
    return sqlite3.connect(db_name)

@app.route('/addaccount', methods=['POST'])
def addAccount():
    data = request.get_json()
    login = data.username
    password = data.password
    conn = connect_db('User_Info.db')
    cursor = conn.cursor()
    cursor.execute("INSERT users (name, email) VALUES ('John Doe', 'john@example.com')")

if __name__ == '__main__':
    app.run(debug=True)
