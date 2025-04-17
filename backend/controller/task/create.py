from flask import request, jsonify
from . import tasks_bp
from config.database import db
from model.Task import Task
from utils.generate_utcnow import generate_utcnow
from sqlalchemy.exc import SQLAlchemyError


@tasks_bp.route("", methods=["POST"])
def create_task():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"success": False, "error": "No data provided!"}), 400

    title = data.get("title")
    if not title or title.strip() == "":
        return jsonify({"success": False, "error": "Title is required!"}), 400

    try:
        now = generate_utcnow()
        value = Task(
            title=title.strip(),
            is_complete=False,
            created_at=now,
            updated_at=now,
        )

        db.session.add(value)
        db.session.commit()

        response_data = {
            "id": value.id,
            "title": value.title,
            "is_complete": value.is_complete,
            "created_at": value.created_at.isoformat(),
            "updated_at": value.updated_at.isoformat(),
        }

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Task successfully added!",
                    "data": response_data,
                }
            ),
            201,
        )

    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({"success": False, "error": "Failed to add task!"}), 500
