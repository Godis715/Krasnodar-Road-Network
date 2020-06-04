import pandas as pd
import os
import sys
import argparse
import time

sys.path.insert(0, os.path.join('./../algorithms'))
import algorithmsWrapper

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PATH_INPUT_GRAPH = './test_graph/input_graph.csv'
PATH_GRAPH_FOR_ALGORITHMS = os.path.join(BASE_DIR, 'graph.txt')

if __name__ == "__main__":
    # Arguments of command line
    parser = argparse.ArgumentParser()
    parser.add_argument('-ig', '--input_graph', default=PATH_INPUT_GRAPH, type=str,
                        help='CSV file with data of graph')

    namespace = parser.parse_args(sys.argv[1:])
    name_input_graph = namespace.input_graph

    # Reading graph
    input_graph = pd.read_csv(name_input_graph, index_col=0).rename(columns=int)
    input_graph = pd.read_csv(name_input_graph, index_col=0)

    # Number of vertices
    n = input_graph.shape[0]

    # Convering tp list of adjacencies with weight
    data_graph = []
    for vеrtex_from in range(n):
        links = list(input_graph[str(vеrtex_from)])
        for vertex_to in range(vеrtex_from, n):
            dst = links[vertex_to]
            if dst != 0:
                data_graph.append([vеrtex_from, vertex_to, dst])
                data_graph.append([vertex_to, vеrtex_from, dst])

    with open(PATH_GRAPH_FOR_ALGORITHMS, 'w') as file_graph:
        # Writing number of vertices and links
        file_graph.write(f"{n} {len(data_graph)}\n")

        # Writing data of links
        for data_link in data_graph:
            vеrtex_from, vertex_to, dst = data_link
            file_graph.write(f"{vеrtex_from} {vertex_to} {dst}\n")

        # Writing coords of vertices (mock)
        for _ in range(n):
            file_graph.write(f"0 0\n")

    # Input params
    vertex_from = int(input("Input vertex FROM: "))
    vertices_to = list(map(int, input("Input vertices TO: ").split(' ')))

    # Calling algorithm
    time_start = time.monotonic()
    tree_weight, paths_weight, edges = algorithmsWrapper.task_2_1(
        id_object=vertex_from,
        id_nodes=vertices_to,
        filename_graph=PATH_GRAPH_FOR_ALGORITHMS
    )
    time_end = time.monotonic()

    # Printing result
    print("\nTime:", round(time_end - time_start, 6))
    print("\nTree weight:", tree_weight)
    print("Paths weight:", paths_weight)
    print("Ways:")

    ways = []

    q_vertex = []
    q_vertex.append((vertex_from, [vertex_from]))
    while len(q_vertex) != 0:
        cur_vertex, cur_way = q_vertex.pop()
        check_end = True
        for edge in edges:
            if edge[0] == cur_vertex:
                check_end = False
                new_way = cur_way + [edge[1]]
                q_vertex.append((edge[1], new_way))
        if check_end or cur_vertex in vertices_to:
            ways.append(cur_way)
            
    for way in ways:
        print(way)
