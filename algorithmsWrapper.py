#!/usr/bin/python3
#-*- coding: utf-8 -*-

import ctypes 
import ast
import random
import time

# loading lib
libalgorithms = ctypes.CDLL('./build/libalgorithms.so')

FILENAME_GRAPH = 'parser/data/graph.txt'

FILENAME_OUT = 'out.txt'

libalgorithms.free_memory.argtypes = [
    ctypes.POINTER(ctypes.c_size_t)
]
libalgorithms.free_memory.restype = None

def task_1_1_a(id_objects, id_nodes, type_dir):
    libalgorithms.task_1_1_a.restype = ctypes.c_size_t
    libalgorithms.task_1_1_a.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    result = []
    for id_node in id_nodes:
        id_object = libalgorithms.task_1_1_a(
            (ctypes.c_size_t * len(id_objects))(*id_objects),
            len(id_objects),
            id_node,
            type_dir,
            FILENAME_GRAPH.encode('utf-8')
        )
        result.append((id_node, id_object))
    return result

def task_1_1_b(id_objects, id_nodes, type_dir, max_dist):
    libalgorithms.task_1_1_b.restype = ctypes.POINTER(ctypes.c_size_t)
    libalgorithms.task_1_1_b.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_size_t)
    ]
    result = []
    for id_node in id_nodes:
        size_res = ctypes.c_size_t()
        id_res_objects = libalgorithms.task_1_1_b(
            (ctypes.c_size_t * len(id_objects))(*id_objects),
            len(id_objects),
            id_node,
            max_dist,
            type_dir,
            FILENAME_GRAPH.encode('utf-8'),
            ctypes.byref(size_res)
        )
        result.append(
            (id_node, id_res_objects[:size_res.value])
        )
        libalgorithms.free_memory(id_res_objects)
    return result

def task_1_2(id_objects, id_nodes, type_dir):
    libalgorithms.task_1_2.restype = ctypes.c_size_t
    libalgorithms.task_1_2.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    id_object = libalgorithms.task_1_2(
        (ctypes.c_size_t * len(id_objects))(*id_objects),
        len(id_objects),
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        type_dir,
        FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_1_3(id_objects, id_nodes, type_dir):
    libalgorithms.task_1_3.restype = ctypes.c_size_t
    libalgorithms.task_1_3.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    id_object = libalgorithms.task_1_3(
        (ctypes.c_size_t * len(id_objects))(*id_objects),
        len(id_objects),
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        type_dir,
        FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_1_4(id_objects, id_nodes, type_dir):
    libalgorithms.task_1_4.restype = ctypes.c_size_t
    libalgorithms.task_1_4.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    id_object = libalgorithms.task_1_4(
        (ctypes.c_size_t * len(id_objects))(*id_objects),
        len(id_objects),
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        type_dir,
        FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_2_1(id_object, id_nodes):
    libalgorithms.task_2_1.restype = None
    libalgorithms.task_2_1.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_char)
    ]
    libalgorithms.task_2_1(
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        id_object,
        FILENAME_GRAPH.encode('utf-8'),
        FILENAME_OUT.encode('utf-8')
    )
    # parse content from FILENAME_OUT
    # return tree

def task_2_2(id_nodes, k):
    libalgorithms.task_2_2.restype = None
    libalgorithms.task_2_2.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_char)
    ]
    libalgorithms.task_2_2(
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        k,
        FILENAME_GRAPH.encode('utf-8'),
        FILENAME_OUT.encode('utf-8')
    )
    # parse content from FILENAME_OUT
    # return clusters and dendrogramma

def task_2_3_by_clust(id_object, id_nodes):
    # clusters in FILENAME_OUT 
    libalgorithms.task_2_3_by_clust.restype = None
    libalgorithms.task_2_3_by_clust.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_char)
    ]
    libalgorithms.task_2_3_by_clust(
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        id_object,
        FILENAME_GRAPH.encode('utf-8'),
        FILENAME_OUT.encode('utf-8')
    )
    # parse content from FILENAME_OUT
    # return tree and length


if __name__ == "__main__":
    id_objects = []
    with open('parser/data/objects.txt', 'r') as file:
        for row in file:
            id_objects.append(int(row.replace('\n', '')))
    #print(id_objects)

    id_nodes = []
    for _ in range(10):
        id_node = random.randint(0, 71350)
        if id_node not in id_objects:
            id_nodes.append(id_node)

    #id_nodes.append(51575)
    print(id_nodes)

    type_dir = 2

    max_dist = 1

    time_start = time.monotonic()
    find_object = task_1_4(id_objects, id_nodes, type_dir)
    time_end = time.monotonic()
    print("Time:", time_end - time_start)

    print(find_object)

    # for node_find_objects in nodes_find_objects:
    #     print(node_find_objects)
  
    
        
