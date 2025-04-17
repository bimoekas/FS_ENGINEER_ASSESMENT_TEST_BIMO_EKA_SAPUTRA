from flask import jsonify
from . import tasks_bp
from model.Task import Task
from sqlalchemy.exc import SQLAlchemyError


@tasks_bp.route("/ongoing", methods=["GET"])
def get_ongoing_tasks():
    try:
        ongoing_tasks = (
            Task.query.filter_by(is_complete=False)
            .order_by(Task.created_at.asc())
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
            for task in ongoing_tasks
        ]

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Task succesfully fetched!",
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
                    "error": "Failed to fetch ongoing tasks!",
                }
            ),
            500,
        )
