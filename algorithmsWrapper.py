#!/usr/bin/python3
#-*- coding: utf-8 -*-

import ctypes 

# loading lib
libalgorithms = ctypes.CDLL('./build/libalgorithms.so')

FILENAME_GRAPH = 'graph.json'

def task_1_1_a(id_nodes, type_dir):
    libalgorithms.task_1_1_a.restype = ctypes.c_size_t
    libalgorithms.task_1_1_a.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    id_object = libalgorithms.task_1_1_a(
        _fixed_objects=(ctypes.c_size_t * len(id_nodes))(*id_nodes),
        size=len(id_nodes),
        object=None, # ?
        way=type_dir,
        _file_name=FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_1_1_b(id_nodes, type_dir, max_dist):
    libalgorithms.task_1_1_b.restype = ctypes.POINTER(ctypes.c_size_t * 10) # ? count
    libalgorithms.task_1_1_b.argtypes = [
        ctypes.POINTER(ctypes.c_size_t), 
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char)
    ]
    id_objects = libalgorithms.task_1_1_b( # ? count
        _fixed_objects=(ctypes.c_size_t * len(id_nodes))(*id_nodes),
        size=len(id_nodes),
        object=None, # ?
        max=max_dist,
        way=type_dir,
        _file_name=FILENAME_GRAPH.encode('utf-8')
    )
    return [i for i in id_objects.contents] #!

def task_1_2(id_nodes, id_objects, type_dir):
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
        _fixed_objects=(ctypes.c_size_t * len(id_nodes))(*id_nodes),
        f_size=len(id_nodes),
        _objects=(ctypes.c_size_t * len(id_objects))(*id_objects),
        o_size=len(id_objects),
        way=type_dir,
        _file_name=FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_1_3(id_nodes, id_objects, type_dir):
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
        _fixed_objects=(ctypes.c_size_t * len(id_nodes))(*id_nodes),
        f_size=len(id_nodes),
        _objects=(ctypes.c_size_t * len(id_objects))(*id_objects),
        o_size=len(id_objects),
        way=type_dir,
        _file_name=FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_1_4(id_nodes, id_objects, type_dir):
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
        _fixed_objects=(ctypes.c_size_t * len(id_nodes))(*id_nodes),
        f_size=len(id_nodes),
        _objects=(ctypes.c_size_t * len(id_objects))(*id_objects),
        o_size=len(id_objects),
        way=type_dir,
        _file_name=FILENAME_GRAPH.encode('utf-8')
    )
    return id_object

def task_2_1():
    # class int_pair(ctypes.Structure):
    #     _fields_ = [
    #         ('first', ctypes.c_size_t),
    #         ('second', ctypes.c_size_t)] 
    # class pair(ctypes.Structure):
    #     _fields_ = [
    #         ('first', ctypes.POINTER(int_pair * 10)),
    #         ('second', ctypes.c_size_t)]
    pass

def task_2_2():
    pass

def task_2_3():
    pass

