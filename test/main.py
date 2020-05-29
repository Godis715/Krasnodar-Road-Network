import pandas as pd
import os
import sys
import argparse

sys.path.insert(0, os.path.join('./../algorithms'))
import algorithmsWrapper

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PATH_INPUT_GRAPH = 'input_graph.csv'
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

    # Number of vertexes
    n = input_graph.shape[0]

    # Matrix of adjacencies for testing
    # with open(PATH_INPUT_GRAPH, 'r') as input_file:
    #     _ = input_file.readline()
    #     with open('tmp.txt', 'w') as tmp_file:
    #         for row in input_file:
    #             tmp_file.write(row.split(',', 1)[1].replace('\n', '') + ',\n')

    # Convering tp list of adjacencies with weight
    data_graph = []
    for vartex_from in range(n):
        for vartex_to in range(n):
            dst = input_graph[vartex_from][vartex_to]
            if dst != 0:
                data_graph.append([vartex_from, vartex_to, dst])

    with open(PATH_GRAPH_FOR_ALGORITHMS, 'w') as file_graph:
        # Writing number of vertexes and links
        file_graph.write(f"{n} {len(data_graph)}\n")

        # Writing data of links
        for data_link in data_graph:
            vartex_from, vartex_to, dst = data_link
            file_graph.write(f"{vartex_from} {vartex_to} {input_graph[vartex_from][vartex_to]}\n")

        # Writing coords of vertexes (mock)
        for _ in range(n):
            file_graph.write(f"0 0\n")

    # Input params
    vertex_from = int(input("Input vertex FROM: "))
    vertexes_to = list(map(int, input("Input vertexes TO: ").split(' ')))

    # Calling algorithm
    tree_weight, paths_weight, edges = algorithmsWrapper.task_2_1(
        id_object=vertex_from,
        id_nodes=vertexes_to,
        filename_graph=PATH_GRAPH_FOR_ALGORITHMS
    )

    # Printing result
    print("Tree weight:", tree_weight)
    print("Paths weight:", paths_weight)
    print("Edges:")
    for edge in edges:
        print(f"From {edge[0]} to {edge[1]}")
