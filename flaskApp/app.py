import os
from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///todo.db"
db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String, nullable=False)
    startDate = db.Column(db.DateTime, nullable=False)
    completed = db.Column(db.Boolean, nullable=False)
    deadLine = db.Column(db.DateTime, nullable=False)
    endDate = db.Column(db.DateTime)
    
    def getTimeStamp(self, date):
        if date != None:
            return date.timestamp()
        else:
            return None

    def getTodo(self):
        return {
        "id": self.id, 
        "task": self.task, 
        "startDate": self.getTimeStamp(self.startDate),
        "completed": self.completed,
        "deadLine": self.getTimeStamp(self.deadLine),
        "endDate": self.getTimeStamp(self.endDate) 
        }

    def __repr__(self):
        return f'Todo(id={self.id!r}, task={self.task!r}, startDate={self.startDate!r}, completed={self.completed!r}, deadLine={self.deadLine!r}, endDate={self.endDate!r})'

@app.route("/todo", methods=['GET', 'POST'])
def todo():
    if request.method == 'GET':
        todos = Todo.query.order_by(Todo.deadLine).all()
        dictTodo = [x.getTodo() for x in todos]
        return jsonify(dictTodo)
    else:
        todoData = convert_json(request.get_json())
        db.session.add(todoData)
        db.session.commit()
        return make_response("Created", 201)

def convert_json(jsonData):
    return Todo(task=jsonData['task'], 
    startDate=datetime.fromtimestamp(jsonData['startDate']),
    completed=False,
    deadLine=datetime.fromtimestamp(jsonData['deadLine'])
    )

@app.route("/todo/<int:id>", methods=['PUT'])
def updateTodo(id):
    jsonRequest = request.get_json()
    todo = Todo.query.get(id)
    if todo.task != jsonRequest['task']:
        todo.task = jsonRequest['task']
    if todo.getTimeStamp(todo.startDate) != jsonRequest['startDate']:
        todo.startDate = datetime.fromtimestamp(jsonRequest['startDate'])
    if todo.getTimeStamp(todo.deadLine) != jsonRequest['deadLine']:
        todo.deadLine = datetime.fromtimestamp(jsonRequest['deadLine'])
    if jsonRequest['completed']:
        todo.completed = True
    if jsonRequest['endDate']:
        todo.endDate = datetime.fromtimestamp(jsonRequest['endDate'])
    db.session.commit()
    return make_response(jsonify(todo.getTodo()), 200)
app.run()