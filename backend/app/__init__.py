import sys
import os
import logging

from logging.handlers import RotatingFileHandler, SMTPHandler
from flask import Flask, request
from config import Configuration

# For visibility of folder
sys.path.insert(0, os.path.join('./../algorithms'))

def register_logger(app, logs_dir):
    log_file_format = "[%(levelname)s] - %(asctime)s - %(name)s - : %(message)s in %(pathname)s:[%(funcName)s]:%(lineno)d"
    log_console_format = "[%(levelname)s]: %(message)s"

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter(log_console_format))

    file_handler = RotatingFileHandler(os.path.join(logs_dir, 'api.log'), maxBytes=1e6, backupCount=10, encoding='utf-8')
    file_handler.setFormatter(logging.Formatter(log_file_format))

    app.logger.addHandler(file_handler)

    log_werkzeug = logging.getLogger('werkzeug')
    log_werkzeug.addHandler(file_handler)
    log_werkzeug.addHandler(console_handler)

def create_app(config_class=Configuration):
    app = Flask(__name__)
    app.config.from_object(config_class)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    base_dir = os.path.join(app.root_path, '..')

    logs_dir = os.path.join(base_dir, 'logs')
    if not os.path.exists(logs_dir):
        os.mkdir(logs_dir)
    
    register_logger(app, logs_dir)

    app.logger.setLevel(logging.INFO)
    app.logger.info('Krasnodar-Road-Network API startup')

    return app
