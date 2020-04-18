import sys
import os
from flask import Flask
from config import Configuration


def create_app(config_class=Configuration):
    app = Flask(__name__)
    app.config.from_object(config_class)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app