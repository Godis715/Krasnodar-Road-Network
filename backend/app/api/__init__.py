import logging
import trafaret
import ast
import os
import algorithmsWrapper
from flask import jsonify, abort, make_response, request
from flask import Blueprint

PATH_DATA = './../data'

logger = logging.getLogger(__name__)

bp = Blueprint('api', __name__)

@bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@bp.route('/nodes/info', methods=['GET'])
def info_nodes():
    '''
    Function for implementation API endpoint 'api/nodes/info'.

    > Response:
        (Success)
            - body:
                <id_node>: [float, float]
                    Real location on map (lon, lat)
                ...
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    with open(os.path.join(PATH_DATA, 'data_nodes.json'), 'r') as file:
        data_nodes = file.read()
    response = make_response(data_nodes, 200)
    response.mimetype="application/json"
    return response

@bp.route('/objects/info', methods=['GET'])
def info_objects():
    '''
    Function for implementation API endpoint 'api/objects/info'.

    > Response:
        (Success)
            - body:
                <id_object>: {
                    :param type: str
                        Value: 'infrastructure', 'other'
                    :param name: str
                        For example, 'hospital'
                    :param location: [float, float]
                        Real location on map (lon, lat)
                    :param ref: <id_node>
                }
                ...
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    with open(os.path.join(PATH_DATA, 'data_objects.json'), 'r') as file:
        data_objects = file.read()
    response = make_response(data_objects, 200)
    response.mimetype="application/json"
    return response


def _graph__get_all_id_objects():
    id_objects = []
    with open(os.path.join(PATH_DATA, 'graph_objects.txt'), 'r') as file:
        for row in file:
            id_objects.append(int(row.replace('\n', '')))
    return id_objects

def _graph__get_id_nodes(nodes):
    with open(os.path.join(PATH_DATA, 'matching_to_graph.json'), 'r') as file:
        matching_to_graph = ast.literal_eval(file.read())
    id_nodes = list([matching_to_graph[node] for node in nodes])
    return id_nodes

@bp.route('/objects/find/closest', methods=['GET'])
def find_objects_closest():
    '''
    Function for implementation API endpoint 'api/objects/find/closest'.

    > Request:
        - body:
            :param nodes: list<str>,
                Ids nodes
            :param metrics: str
                Type direction: 'to', 'from', 'to-from'
                
    > Response:
        (Success)
            - body:
                <id_node>: <id_object>
                ...
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    logger.setLevel(logging.INFO)
    logger.info("Request on API Gateway 'api/objects/find/closest'")

    # Validation of body request
    validator = trafaret.Dict({
        trafaret.Key('nodes'): trafaret.List(trafaret.String),
        trafaret.Key('metrics'): trafaret.Enum("to", "from", "to-from")
    })
    try:
        validated_data = validator.check(request.json)
    except trafaret.DataError:
        return jsonify({'details': f"Error of body request: {trafaret.extract_error(validator, request.json)}"}), 400

    # Getting info for graph
    id_objects = _graph__get_all_id_objects()
    id_nodes = _graph__get_id_nodes(validated_data['nodes'])

    type_dir = {"to": 1, "from": 2, "to-from": 3}[validated_data['metrics']]

    # Results: list<(int, int)>. Array of pair (id_node, id_object) 
    results = algorithmsWrapper.task_1_1_a(id_objects, id_nodes, type_dir)
    
    # Converting results from graph to real
    with open(os.path.join(PATH_DATA, 'matching_from_graph.json'), 'r') as file:
        matching_from_graph = ast.literal_eval(file.read())
    response_data = {}
    for result in results:
        response_data[matching_from_graph[result[0]]] = matching_from_graph[result[1]]

    return jsonify(response_data), 200

@bp.route('/objects/find/in_radius', methods=['GET'])
def find_objects_in_radius():
    '''
    Function for implementation API endpoint 'api/objects/find/in_radius'.

    > Request:
        - body:
            :param nodes: list<str>,
                Ids nodes
            :param metrics: str
                Type direction: 'to', 'from', 'to-from'
            :param max_dist: float
                
    > Response:
        (Success)
            - body:
                <id_node>: list<<id_object>>
                ...
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    logger.setLevel(logging.INFO)
    logger.info("Request on API Gateway 'api/objects/find/closest'")

    # Validation of body request
    validator = trafaret.Dict({
        trafaret.Key('nodes'): trafaret.List(trafaret.String),
        trafaret.Key('metrics'): trafaret.Enum("to", "from", "to-from"),
        trafaret.Key('max_dist'): trafaret.Float
    })
    try:
        validated_data = validator.check(request.json)
    except trafaret.DataError:
        return jsonify({'details': f"Error of body request: {trafaret.extract_error(validator, request.json)}"}), 400

    # Getting info for graph
    id_objects = _graph__get_all_id_objects()
    id_nodes = _graph__get_id_nodes(validated_data['nodes'])

    type_dir = {"to": 1, "from": 2, "to-from": 3}[validated_data['metrics']]
    max_dist = validated_data['max_dist']

    # Results: list<(int, int)>. Array of pair (id_node, id_object) 
    results = algorithmsWrapper.task_1_1_b(id_objects, id_nodes, type_dir, max_dist)
    
    # Converting results from graph to real
    with open(os.path.join(PATH_DATA, 'matching_from_graph.json'), 'r') as file:
        matching_from_graph = ast.literal_eval(file.read())
    response_data = {}
    for result in results:
        response_data[matching_from_graph[result[0]]] = list([matching_from_graph[id_object] for id_object in result[1]])

    return jsonify(response_data), 200