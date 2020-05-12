import logging
import trafaret
import ast
import os
import algorithmsWrapper
import numpy as np
from flask import jsonify, abort, make_response, request
from flask import Blueprint
from flask_cors import CORS

PATH_DATA = './../data'

logger = logging.getLogger(__name__)

bp = Blueprint('api', __name__)
CORS(bp)

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

@bp.route('/roads/info', methods=['GET'])
def info_roads():
    '''
    Function for implementation API endpoint 'api/roads/info'.

    > Response:
        (Success)
            - body:[[str, str, ...], ...]
                * Array of roads. Road is array of <id_node>.
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    with open(os.path.join(PATH_DATA, 'data_roads.json'), 'r') as file:
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

@bp.route('/objects/find/closest', methods=['POST'])
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

@bp.route('/objects/find/in_radius', methods=['POST'])
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
    logger.info("Request on API Gateway 'api/objects/find/in_radius'")

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

    # Results: list<(int, list<int>)>. Array of pair (id_node, array id_object) 
    results = algorithmsWrapper.task_1_1_b(id_objects, id_nodes, type_dir, max_dist)
    
    # Converting results from graph to real
    with open(os.path.join(PATH_DATA, 'matching_from_graph.json'), 'r') as file:
        matching_from_graph = ast.literal_eval(file.read())
    response_data = {}
    for result in results:
        response_data[matching_from_graph[result[0]]] = list(matching_from_graph[id_object] for id_object in result[1])

    return jsonify(response_data), 200

@bp.route('/objects/find/optimal', methods=['POST'])
def find_object_optimal():
    '''
    Function for implementation API endpoint 'api/objects/find/optimal'.

    > Request:
        - body:
            :param nodes: list<str>,
                Ids nodes
            :param criterion: str
                Value: "closest-furthest"|"min-dist-sum"|"min-tree-weight"
            :param metrics: str
                Type direction: 'to', 'from', 'to-from'
                
    > Response:
        (Success)
            - body:
                :param id_object: <id_node>
                    * Id node for finding object
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    logger.setLevel(logging.INFO)
    logger.info("Request on API Gateway 'api/objects/find/optimal'")

    # Validation of body request
    validator = trafaret.Dict({
        trafaret.Key('nodes'): trafaret.List(trafaret.String),
        trafaret.Key('criterion'): trafaret.Enum(
            "closest-furthest",
            "min-dist-sum", 
            "min-tree-weight"
        ),
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
    criterion = validated_data['criterion']

    # Result: int (id_object) 
    if criterion == "closest-furthest":
        result = algorithmsWrapper.task_1_2(id_objects, id_nodes, type_dir)
    elif criterion == "min-dist-sum":
        result = algorithmsWrapper.task_1_3(id_objects, id_nodes, type_dir)
    elif criterion == "min-tree-weight":
        result = algorithmsWrapper.task_1_4(id_objects, id_nodes, type_dir)
    
    # Converting results from graph to real
    with open(os.path.join(PATH_DATA, 'matching_from_graph.json'), 'r') as file:
        matching_from_graph = ast.literal_eval(file.read())
    response_data = {"id_object": matching_from_graph[result]}

    return jsonify(response_data), 200

@bp.route('/shortest_paths_tree', methods=['POST'])
def shortest_paths_tree():
    '''
    Function for implementation API endpoint 'api/shortest_paths_tree'.

    > Request:
        - body:
            :param nodes: list<str>,
                Ids nodes
            :param object: str
                Id node for object
                
    > Response:
        (Success)
            - body:
                :param tree_weight: double
                :param paths_weight: double
                    * Sum of the shortest paths
                :param shortest_paths_tree: [(str, str), ...]
                    * Array edges
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    logger.setLevel(logging.INFO)
    logger.info("Request on API Gateway 'api/shortest_paths_tree'")

    # Validation of body request
    validator = trafaret.Dict({
        trafaret.Key('nodes'): trafaret.List(trafaret.String),
        trafaret.Key('object'): trafaret.String
    })
    try:
        validated_data = validator.check(request.json)
    except trafaret.DataError:
        return jsonify({'details': f"Error of body request: {trafaret.extract_error(validator, request.json)}"}), 400

    # Getting info for graph
    id_nodes = _graph__get_id_nodes(validated_data['nodes'])
    id_object = _graph__get_id_nodes([validated_data['object']])[0]

    # Result: float (tree_weight), list<(int, int)> (array edges)
    result = algorithmsWrapper.task_2_1(id_object, id_nodes)
    tree_weight, paths_weight, edges = result

    # Converting results from graph to real
    with open(os.path.join(PATH_DATA, 'matching_from_graph.json'), 'r') as file:
        matching_from_graph = ast.literal_eval(file.read())

    shortest_paths_tree = list(map(lambda edge: (matching_from_graph[edge[0]], matching_from_graph[edge[1]]), edges))
    
    response_data = {
        "tree_weight": tree_weight,
        "paths_weight": paths_weight,
        "shortest_paths_tree": shortest_paths_tree
    }

    return jsonify(response_data), 200

@bp.route('/clustering', methods=['POST'])
def clustering():
    '''
    Function for implementation API endpoint 'api/clustering'.

    > Request:
        - body:
            :param nodes: list<str>,
                Ids nodes
            :param clusters_n: int
                Number of clusters
            :param metrics: str
                Type direction: 'to', 'from', 'to-from'
                
    > Response:
        (Success)
            - body:
                :param clusters: {
                    :param centroid: {
                        :param id: <node_id>
                        :param location: [float, float]
                            * Coordinates (lan, lon)
                    }
                    :param members: array<<node_id>>
                        * Id nodes of cluster
                }
                :param dendrogram: {
                    <node_id>: [
                        {
                            :param cluster: <node_id>
                            :param height: int
                                * Height of merging
                        },
                        ...
                    ],
                    ...
                }
        (Failed)
            - body: 
                :param detail: str
        
        status: int
    '''
    logger.setLevel(logging.INFO)
    logger.info("Request on API Gateway 'api/clustering'")

    # Validation of body request
    validator = trafaret.Dict({
        trafaret.Key('nodes'): trafaret.List(trafaret.String),
        trafaret.Key('clusters_n'): trafaret.Int,
        trafaret.Key('metrics'): trafaret.Enum("to", "from", "to-from")
    })
    try:
        validated_data = validator.check(request.json)
    except trafaret.DataError:
        return jsonify({'details': f"Error of body request: {trafaret.extract_error(validator, request.json)}"}), 400

    # Getting info for graph
    id_nodes = _graph__get_id_nodes(validated_data['nodes'])
    clusters_n = validated_data['clusters_n']

    # Result: float (tree_weight), list<(int, int)> (array edges)
    result = algorithmsWrapper.task_2_2(id_nodes, clusters_n)
    clusters_members, centroids_ids, centroids_coords, dendrogram = result

    # Converting results from graph to real
    with open(os.path.join(PATH_DATA, 'matching_from_graph.json'), 'r') as file:
        matching_from_graph = ast.literal_eval(file.read())

    dendrogram_data = {}
    for merge_info in dendrogram:
        id_one_cur_clust = validated_data['nodes'][merge_info[0]]
        dendrogram_data[id_one_cur_clust] = []
        for i in range(1, len(merge_info) - 1, 2):
            id_other_cur_clust = validated_data['nodes'][merge_info[i]]
            height_merge = merge_info[i + 1]
            dendrogram_data[id_one_cur_clust].append({
                "cluster": id_other_cur_clust,
                "height": height_merge
            })

    clusters_data = []
    for i in range(clusters_n):
        clusters_data.append({
            "centroid": {
                "id": matching_from_graph[centroids_ids[i]],
                "location": centroids_coords[i]
            },
            "members": list(
                matching_from_graph[member_id] for member_id in clusters_members[i]
            )
        })

    response_data = {
        "clusters": clusters_data,
        "dendrogram": dendrogram_data
    }

    return jsonify(response_data), 200