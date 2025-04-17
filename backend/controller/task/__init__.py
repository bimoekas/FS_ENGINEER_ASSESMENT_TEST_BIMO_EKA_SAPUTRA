from flask import Blueprint

tasks_bp = Blueprint("tasks", __name__)

from . import create, update, show, set_complete, delete, get_ongoing, get_complete
