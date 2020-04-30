#!/usr/bin/python3
#-*- coding: utf-8 -*-

import ctypes 
import ast
import random
import time
import typing
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILENAME_GRAPH = os.path.join(BASE_DIR, '../data/graph.txt')

FILENAME_OUT = os.path.join(BASE_DIR, 'out.txt')

# loading lib
libalgorithms = ctypes.CDLL(os.path.join(BASE_DIR, 'build/libalgorithms.so'))

# free_memory c++ func
libalgorithms.free_memory.argtypes = [
    ctypes.POINTER(ctypes.c_size_t)
]
libalgorithms.free_memory.restype = None

def task_1_1_a(id_objects, id_nodes, type_dir):
    """ Searching nearest object of infrastructure for selected nodes

        :param id_objects: list<int>
            * Ids objects of infrastructure - ALL
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param type_dir: int
            * Have 3 value:
                > 1 - TO  objects from nodes
                > 2 - FROM objects to nodes
                > 3 - 1 and 2
        
        Return: list<(int, int)>
            * Id objeсt for each ids nodes
    """
    # Linking types
    libalgorithms.task_1_1_a.restype = ctypes.c_size_t
    libalgorithms.task_1_1_a.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_1_1_a)
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
    """ Searching objects of infrastructure for selected nodes
        at a fixed distance

        :param id_objects: list<int>
            * Ids objects of infrastructure - ALL
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param type_dir: int
            * Have 3 value:
                > 1 - TO  objects from nodes
                > 2 - FROM objects to nodes
                > 3 - 1 and 2
        :param max_dist: double
            * Param for searching
        
        Return: list<(int, list<int>)>
            * Ids objects for each ids nodes
    """
    # Linking types
    libalgorithms.task_1_1_b.restype = ctypes.POINTER(ctypes.c_size_t)
    libalgorithms.task_1_1_b.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_double,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_size_t)
    ]
    # Calling c++ func (libalgorithms.task_1_1_b)
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
    """ Searching one object of infrastructure 
        which have minimal distance to farthest nodes among selected nodes

        :param id_objects: list<int>
            * Ids objects of infrastructure - ALL
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param type_dir: int
            * Have 3 value:
                > 1 - TO  objects from nodes
                > 2 - FROM objects to nodes
                > 3 - 1 and 2
        
        Return: int
            * Id object
    """
    # Linking types
    libalgorithms.task_1_2.restype = ctypes.c_size_t
    libalgorithms.task_1_2.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_1_2)
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
    """ Searching one object of infrastructure 
        which have minimal sum shortest distances to selected nodes

        :param id_objects: list<int>
            * Ids objects of infrastructure - ALL
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param type_dir: int
            * Have 3 value:
                > 1 - TO  objects from nodes
                > 2 - FROM objects to nodes
                > 3 - 1 and 2
        
        Return: int
            * Id object
    """
    # Linking types
    libalgorithms.task_1_3.restype = ctypes.c_size_t
    libalgorithms.task_1_3.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_1_3)
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
    """ Searching one object of infrastructure 
        which have minimal weight of tree shortest distances to selected nodes

        :param id_objects: list<int>
            * Ids objects of infrastructure - ALL
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param type_dir: int
            * Have 3 value:
                > 1 - TO  objects from nodes
                > 2 - FROM objects to nodes
                > 3 - 1 and 2
        
        Return: int
            * Id object
    """
    # Linking types
    libalgorithms.task_1_4.restype = ctypes.c_size_t
    libalgorithms.task_1_4.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_1_4)
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
    """ Searching tree shortest distances with minimal weight to selected nodes 
        from selected object of infrastructure

        :param id_object: int
            * Id object of infrastructure - SELECTED
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        
        Return: (float, list<(int, int)>)
            * weight and tree (array edges)
    """
    # Linking types
    libalgorithms.task_2_1.restype = None
    libalgorithms.task_2_1.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_2_1)
    libalgorithms.task_2_1(
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        id_object,
        FILENAME_GRAPH.encode('utf-8'),
        FILENAME_OUT.encode('utf-8')
    )
    # Parsing content from FILENAME_OUT -> (weight, tree)
    tree = []
    with open(FILENAME_OUT, 'r') as file_res:
        weight = float(file_res.readline())
        for edge in file_res:
            v_from, v_to = map(int, edge.split(' '))
            tree.append((v_from, v_to))

    return weight, tree

def task_2_2(id_nodes, number_clusters):
    """ Counting clusters for selected nodes (members + centroids + dendrogram)

        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param number_clusters: int
        
        Return: (list<list<int>>, list<int>, list<(float, float)>, list<list<int>>)
            * clusters, centroids_ids, centroids_coords, dendrogram
    """
    # Linking types
    libalgorithms.task_2_2.restype = None
    libalgorithms.task_2_2.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_2_2)
    libalgorithms.task_2_2(
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        number_clusters,
        FILENAME_GRAPH.encode('utf-8'),
        FILENAME_OUT.encode('utf-8')
    )
    # Parsing content from FILENAME_OUT -> clusters, centroids, dendrogram
    clusters = []
    centroids_ids = []
    centroids_coords = []
    dendrogram = []
    with open(FILENAME_OUT, 'r') as file_res:
        _ = file_res.readline()
        for _ in range(number_clusters):
            cluster = list(map(int, file_res.readline().replace(' \n', '\n').split(' ')))[1:]
            clusters.append(cluster)
        centroids_ids = map(int, file_res.readline().replace(' \n', '\n').split(' '))
        for _ in range(number_clusters):
            centroid_x, centroid_y = map(float, file_res.readline().split(' '))
            centroids_coords.append((centroid_x, centroid_y))
        file_res.readline()
        for merge_infos in file_res:
            merge_info = list(map(int, merge_infos.replace(' \n', '\n').split(' ')))
            dendrogram.append(merge_info)

    return clusters, centroids_ids, centroids_coords, dendrogram

def task_2_3_by_clust(id_object, id_nodes):
    """ Searching tree shortest distances with minimal weight from object 
        to centroids of clusters and from centroids to nodes of clusters
        from selected object of infrastructure

        :param id_object: int
            * Id object of infrastructure - SELECTED
        :param id_nodes: list<int>
            * Ids nodes - SELECTED
        :param number_clusters: int
        
        Return: (float, list<(int, int)> )
            * length, tree (array of pair ids)
    """
    # Linking types
    libalgorithms.task_2_3_by_clust.restype = None
    libalgorithms.task_2_3_by_clust.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char),
        ctypes.POINTER(ctypes.c_char)
    ]
    # Calling c++ func (libalgorithms.task_2_3_by_clust)
    libalgorithms.task_2_3_by_clust(
        (ctypes.c_size_t * len(id_nodes))(*id_nodes),
        len(id_nodes),
        id_object,
        FILENAME_GRAPH.encode('utf-8'),
        FILENAME_OUT.encode('utf-8')
    )
    # Parsing content from FILENAME_OUT -> tree
    tree = []
    with open(FILENAME_OUT, 'r') as file_res:
        length = float(file_res.readline())
        for edge in file_res:
            v_from, v_to = map(int, edge.split(' '))
            tree.append((v_from, v_to))
    return length, tree

if __name__ == "__main__":
    id_objects = []
    with open('parser/data/objects.txt', 'r') as file:
        for row in file:
            id_objects.append(int(row.replace('\n', '')))

    id_nodes = []
    for _ in range(30):
        id_node = random.randint(0, 71350)
        if id_node not in id_objects:
            id_nodes.append(id_node)

    print(id_nodes)

    # type_dir = 3

    # max_dist = 0.00001

    # number_clusters = 8

    # task_2_2(id_nodes, number_clusters)

    # time_start = time.monotonic()
    # length, tree = task_2_3_by_clust(id_objects[0], id_nodes)
    # time_end = time.monotonic()
    # print("Time:", time_end - time_start)

    # print(length, tree)
  
    
        