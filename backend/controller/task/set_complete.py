from flask import jsonify
from . import tasks_bp
from config.database import db
from model.Task import Task
from utils.generate_utcnow import generate_utcnow
from sqlalchemy.exc import SQLAlchemyError


@tasks_bp.route("/<int:task_id>/complete", methods=["PATCH"])
def set_complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.is_complete = True
    task.updated_at = generate_utcnow()

    try:
        db.session.commit()

        response_data = {
            "id": task.id,
            "title": task.title,
            "is_complete": task.is_complete,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
        }

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Task succesfully set complete!",
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
                    "error": "Failed to set complete task!",
                }
            ),
            500,
        )
