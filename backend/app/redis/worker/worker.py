from rq import SimpleWorker
from app.redis.cleint.client import queue
worker=SimpleWorker(queues=[queue])
# worker.work()