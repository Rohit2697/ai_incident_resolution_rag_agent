from app.server import app
import uvicorn
import multiprocessing
from app.redis.worker.worker import worker

def start_worker():
  print("Starting worker process")
  worker.work()

def main():
    print("Starting web server...")
    uvicorn.run(app,host="0.0.0.0",port=8080)
    
if __name__ == "__main__":
  worker_process = multiprocessing.Process(target=start_worker)
  worker_process.daemon = True
  worker_process.start()
  main()







