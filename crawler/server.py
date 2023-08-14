from typing import Any
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from link_crawler import LinkCrawler
from job_info_crawler import JobInfoCrawler
from database_manager import db_manager
import os
import functools
from log_queue import LogQueue
from utils import restart_docker_container
import logging
logging.basicConfig(level=logging.DEBUG)

queue = LogQueue()
restart_firefox_container = lambda : restart_docker_container("firefox")

def handle_server_error(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return {
                "data": func(*args, **kwargs),
                "error": None
            }
        except Exception as error:
            return {
                "data": None,
                "error": str(error)
            }
    return wrapper


app = Flask(__name__)
CORS(app)
sio = SocketIO(app, cors_allowed_origins="*")

def emit_log(log: Any) -> None:
    sio.emit('on_log_resp', log)

@sio.on('connect')
def handle_connect():
    print(f'Client {request.sid} connected')
    emit('connect_resp', {'data': 'connected sucessfully with server'})

@sio.on('disconnect')
def handle_connect():
    print(f'Client {request.sid} disconnected')
    emit('connect_resp', {'data': 'disconnected sucessfully with server'})
    emit('on_log_resp', {'data': queue.logs})

@app.route("/crawl_links", methods=["POST"])
@handle_server_error
def crawl_link():
    key_workd = request.json["key_word"]
    crawler = LinkCrawler(key_workd)
    for log in crawler.crawl():
        queue.push(log)
        sio.start_background_task(emit_log, {"data": queue.logs})
    for doc in crawler.link_summary:
        db_manager.insert_link_doc(doc)

    return crawler.link_summary
@app.route("/get_all_links", methods=["GET"])
@handle_server_error
def get_all_link():
    return db_manager.get_all_link_summary()

@app.route("/crawl_job_info", methods=["POST"])
@handle_server_error
def crawl_job_info():
    crawler = JobInfoCrawler()
    urls:list[str] = request.json["urls"]
    app.logger.info(urls)
    for log_dict in crawler.crawl(urls):
        app.logger.info(log_dict)
        log = log_dict["log"]
        link = log_dict["link"]
        job_info = log_dict["job_info"]
        queue.push(log)
        sio.start_background_task(emit_log, {"data": queue.logs})
        if job_info is None:
            continue
    
        db_manager.update_data_with_query({"link": link } ,log_dict["job_info"])
        
    return "Crawlling successfully"


@app.route("/")
def index():
    return "Welcome to socket server for crawlling data"

@app.route("/restart_server", methods=["GET"])
@handle_server_error
def restart_server():
    os._exit(0)

@app.route("/restart_browser", methods=["GET"])
@handle_server_error
def restart_firefox():
    return restart_firefox_container()

@app.route("/get_logs", methods=["GET"])
@handle_server_error
def get_logs():
    return queue.logs

@app.route("/clear_logs", methods=["GET"])
@handle_server_error
def clear_logs():
    queue.clear()
    emit('on_log_resp', {'data': queue.logs})
    return "Clear logs successfully"


if __name__ == "__main__":
    restart_firefox_container()
    sio.run(app, host="0.0.0.0", debug= True, port= 8080)
