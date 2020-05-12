import xml.etree.ElementTree as ET
import matplotlib.pyplot as plt
import numpy as np
import click
import math
from functools import reduce

PATH_DATA = './../data'

def create_nodes(osm_root):
    print('==> nodes...')
    # Getting all nodes from osm
    osm_all_nodes = osm_root.findall("node")
    # Converting
    all_nodes = dict({osm_node.get('id'): [float(osm_node.get('lon')), float(osm_node.get('lat'))] for osm_node in osm_all_nodes})

    # Getting all roads from osm
    roads_osm = osm_root.findall("way/tag[@k='highway']/..")
    # Converting
    roads = list([list([nd.get('ref') for nd in road_osm.findall('nd')]) for road_osm in roads_osm])

    # Getting base nodes
    nodes_roads = np.unique(reduce(lambda prev, cur: prev + cur, roads))
    base_nodes = dict({node_roads: all_nodes[node_roads] for node_roads in nodes_roads})

    return base_nodes, all_nodes

def _measure(lat1, lon1, lat2, lon2):
    R = 6378.137 # Radius of earth in KM
    dLat = lat2 * math.pi / 180 - lat1 * math.pi / 180
    dLon = lon2 * math.pi / 180 - lon1 * math.pi / 180
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.cos(lat1 * math.pi / 180) * math.cos(lat2 * math.pi / 180) * \
        math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = R * c
    return d * 1000 # meters

def create_links_and_roads(osm_root, nodes, matching_graph):
    print('==> links and roads...')
    # Getting all roads from osm
    roads_osm = osm_root.findall("way/tag[@k='highway']/..")

    # Getting links: [[id1, id2, d], ...]
    links = []
    roads = []
    for road_osm in roads_osm:
        tag_oneway = road_osm.find("tag[@k='oneway']")
        is_road_oneway = True if tag_oneway is not None and tag_oneway.get('v') == 'yes' else False
        road_nodes_osm = road_osm.findall('nd')

        # links
        for i in range(1,len(road_nodes_osm)):
            road_node1_id = road_nodes_osm[i-1].get('ref')
            road_node2_id = road_nodes_osm[i].get('ref')
            road_node1_coord = nodes[road_node1_id]
            road_node2_coord = nodes[road_node2_id]
            d = _measure(
                lat1=road_node1_coord[1],
                lon1=road_node1_coord[0],
                lat2=road_node2_coord[1],
                lon2=road_node2_coord[0]
            )
            links.append([matching_graph[road_node1_id], matching_graph[road_node2_id], d])
            if not is_road_oneway:
                links.append([matching_graph[road_node2_id], matching_graph[road_node1_id], d])

        # road
        road = list(road_node_osm.get('ref') for road_node_osm in road_nodes_osm)
        roads.append(road)
        if not is_road_oneway:
            roads.append(road[::-1])
    
    return links, roads

def _searching_near_node(object_location, nodes):

    near_node = None
    near_node_dst = 10000

    for node_id, node_coord in nodes.items():
        dst = (object_location[0] - node_coord[0]) ** 2 + (object_location[1] - node_coord[1]) ** 2
        if dst < near_node_dst:
            near_node_dst = dst
            near_node = node_id

    return near_node

def _converting_object(osm_root, base_nodes, all_nodes, object_type, object_name):
    print('Getting objects...')
    osm_node_objects = osm_root.findall(f"node/tag[@v='{object_name}']/..")
    osm_way_objects = osm_root.findall(f"way/tag[@v='{object_name}']/..")
    osm_relation_objects = osm_root.findall(f"relation/tag[@v='{object_name}']/..")

    print('Count: ', len(osm_node_objects) + len(osm_way_objects) + len(osm_relation_objects))

    data_object = {}

    print("Converting nodes... ")
    with click.progressbar(osm_node_objects) as osm_node_objects_bar:
        for osm_node_object in osm_node_objects_bar:
            object_location = [float(osm_node_object.get('lon')), float(osm_node_object.get('lat'))]
            object_ref = _searching_near_node(object_location, base_nodes)

            data_object[osm_node_object.get('id')] = {
                'type': object_type,
                'name': object_name,
                'location': object_location,
                'ref': object_ref
            }

    if object_name != '-':
        print("Converting ways... ")
        with click.progressbar(osm_way_objects) as osm_way_objects_bar:
            for osm_way_object in osm_way_objects_bar:
                object_outer = np.array([[all_nodes[nd.get('ref')][0], all_nodes[nd.get('ref')][1]] for nd in osm_way_object.findall('nd')])
                object_down_border = min(object_outer[:, 0])
                object_up_border = max(object_outer[:, 0])
                object_left_border = min(object_outer[:, 1])
                object_right_border = max(object_outer[:, 1])
                
                object_location = [
                    (object_down_border + object_up_border) / 2,
                    (object_left_border + object_right_border) / 2
                ]
                object_ref = _searching_near_node(object_location, base_nodes)

                data_object[osm_way_object.get('id')] = {
                    'type': object_type,
                    'name': object_name,
                    'location': object_location,
                    'ref': object_ref
                }

    print("Converting relations... ")
    with click.progressbar(osm_relation_objects) as osm_relation_objects_bar:
        for osm_relation_object in osm_relation_objects_bar:
            osm_object_members = osm_relation_object.findall("member[@role='outer']")
            object_down_border = 1000
            object_up_border = 0
            object_left_border = 1000
            object_right_border = 0
            for osm_object_member in osm_object_members:
                osm_object_member_outer = osm_root.find(f"way[@id='{osm_object_member.get('ref')}']")
                object_member_outer = np.array([[all_nodes[nd.get('ref')][0], all_nodes[nd.get('ref')][1]] for nd in osm_object_member_outer.findall('nd')])
                object_down_border = min(object_down_border, min(object_member_outer[:, 0]))
                object_up_border = max(object_up_border, max(object_member_outer[:, 0]))
                object_left_border = min(object_left_border, min(object_member_outer[:, 1]))
                object_right_border = max(object_right_border, max(object_member_outer[:, 1]))
            
            object_location = [
                (object_down_border + object_up_border) / 2,
                (object_left_border + object_right_border) / 2
            ]
            object_ref = _searching_near_node(object_location, base_nodes)

            data_object[osm_relation_object.get('id')] = {
                'type': object_type,
                'name': object_name,
                'location': object_location,
                'ref': object_ref
            }

    return data_object

def create_objects(osm_root, base_nodes, all_nodes):
    print('==> objects...')
    print('============INFRASTRUCTURE============')
    print('> HOSPITAL')
    data_hospitals = _converting_object(osm_root, base_nodes, all_nodes, 'infrastructure', 'hospital')
    print('> FIRE_STATION')
    data_fire_stations = _converting_object(osm_root, base_nodes, all_nodes, 'infrastructure', 'fire_station')
    print('> SUPERMARKET')
    data_supermarkets = _converting_object(osm_root, base_nodes, all_nodes, 'infrastructure', 'supermarket')
    print('============OTHER OBJECTS============')
    print('> HOUSE')
    data_houses = _converting_object(osm_root, base_nodes, all_nodes, 'other', 'house')

    print('*Concatenating...')
    data_objects = {}
    data_objects.update(data_hospitals)
    data_objects.update(data_fire_stations)
    data_objects.update(data_supermarkets)
    data_objects.update(data_houses)

    return data_objects

if __name__ == "__main__":
    print('Parsing...')
    tree = ET.parse('osm/krasnodar.osm') 
    osm_root = tree.getroot()

    print('Creating:')
    base_nodes, all_nodes = create_nodes(osm_root)
    
    matching_to_graph = dict({node_id: i for i, node_id in enumerate(base_nodes)})
    matching_from_graph = dict({i: node_id for i, node_id in enumerate(base_nodes)})
    links, roads = create_links_and_roads(osm_root, base_nodes, matching_to_graph)
    
    data_objects = create_objects(osm_root, base_nodes, all_nodes)

    print('Saving...')
    # Graph (nodes and links)
    with open(f'{PATH_DATA}/graph.txt', 'w') as file:
        file.write(f"{len(base_nodes)} {len(links)}\n")
        for link in links:
            file.write(f"{link[0]} {link[1]} {link[2]}\n")
        for node_id, _ in sorted(matching_to_graph.items(), key=lambda x: x[1]):
            file.write(f"{base_nodes[node_id][0]} {base_nodes[node_id][1]}\n")
    # Graph objects
    try:
        with open(f'{PATH_DATA}/graph_objects.txt', 'w') as file:
            for _, object_info in data_objects.items():
                if object_info['type'] == 'infrastructure':
                    object_match_id = matching_graph[object_info['ref']]
                    file.write(f"{object_match_id}\n")
    except:
        pass

    # Real links (roads)
    with open(f'{PATH_DATA}/data_roads.json', 'w') as file:
        file.write(str(roads).replace("'", '"'))

    # Real nodes
    with open(f'{PATH_DATA}/data_nodes.json', 'w') as file:
        file.write(str(base_nodes).replace("'", '"'))

    # Real objects
    with open(f'{PATH_DATA}/data_objects.json', 'w') as file:
        file.write(str(data_objects).replace("'", '"'))

     # Matching: real and graph
    with open(f'{PATH_DATA}/matching_to_graph.json', 'w') as file:
        file.write(str(matching_to_graph).replace("'", '"'))

    with open(f'{PATH_DATA}/matching_from_graph.json', 'w') as file:
        file.write(str(matching_from_graph).replace("'", '"'))
