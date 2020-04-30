#!/bin/bash
rm -r ./algorithms/build
mkdir ./algorithms/build
g++ -fPIC -shared -o ./algorithms/build/libalgorithms.so ./algorithms/algorithms.cpp
