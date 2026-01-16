from rq import Queue
from redis import Redis
from app.environment.environment import env_veriables
try:
    redis_url=env_veriables["REDIS"]["url"]
    redis_instance=Redis.from_url(redis_url)
    redis_instance.ping()
    print("Connected to Redis successfully!")
    queue=Queue(connection=redis_instance)
except Exception as e:
    print("Failed to connect to Redis:", e)
