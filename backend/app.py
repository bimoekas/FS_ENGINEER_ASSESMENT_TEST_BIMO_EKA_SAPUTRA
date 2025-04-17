from flask_cors import CORS
from flask import Flask
from config.database import init_db, db
from controller.task import tasks_bp

app = Flask(__name__)
init_db(app)
CORS(app)

with app.app_context():
    db.create_all()

app.register_blueprint(tasks_bp, url_prefix="/tasks")

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
