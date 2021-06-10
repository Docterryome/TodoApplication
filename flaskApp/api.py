from flask import Blueprint, jsonify
from flask import request

api = Blueprint('api', __name__, url_prefix="/api/v1")

## GET
@api.route("/todo", methods=['GET'])
def get_todos():
    pass

## POST
@api.route("/todo", methods=['POST'])
def post_todo():
    pass

## UPDATE

## DELETE
    
