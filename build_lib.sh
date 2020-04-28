#!/bin/bash
rm -r ./build
mkdir ./build
g++ -fPIC -shared -o ./build/libalgorithms.so algorithms.cpp
