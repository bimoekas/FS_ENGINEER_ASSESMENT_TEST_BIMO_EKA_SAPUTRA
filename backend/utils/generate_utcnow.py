from datetime import datetime
import pytz

def generate_utcnow():
  return datetime.now(pytz.timezone('Asia/Jakarta'))