import logging
from flask import jsonify, abort, make_response, request
from flask import Blueprint

logger = logging.getLogger(__name__)

bp = Blueprint('api', __name__)

@bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@bp.route("/")
def hello():
    return "Main page of api Krasnodar-Road-Network!"

@bp.route('/example', methods=['GET'])
def example():
    logger.setLevel(logging.INFO)
    logger.info("Request on API Gateway 'api/example'")
    return make_response(jsonify({'data': 'Some info'}), 200)

