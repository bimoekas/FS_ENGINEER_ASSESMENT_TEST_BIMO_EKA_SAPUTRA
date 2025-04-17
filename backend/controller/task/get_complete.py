from flask import jsonify
from . import tasks_bp
from config.database import db
from model.Task import Task
from sqlalchemy.exc import SQLAlchemyError


@tasks_bp.route("/completed", methods=["GET"])
def get_completed_tasks():
    try:
        completed_tasks = (
            Task.query.filter_by(is_complete=True)
            .order_by(Task.updated_at.desc())
            .all()
        )

        response_data = [
            {
                "id": task.id,
                "title": task.title,
                "is_complete": task.is_complete,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat(),
            }
            for task in completed_tasks
        ]

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Task successfully fetched!",
                    "data": response_data,
                }
            ),
            200,
        )

    except SQLAlchemyError:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Failed to fetch completed tasks!",
                }
            ),
            500,
        )
