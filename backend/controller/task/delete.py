from flask import jsonify
from . import tasks_bp
from config.database import db
from model.Task import Task
from sqlalchemy.exc import SQLAlchemyError


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)

    try:
        db.session.delete(task)
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
                    "message": "Task succesfully deleted!",
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
                    "error": "Failed to delete task!",
                }
            ),
            500,
        )
