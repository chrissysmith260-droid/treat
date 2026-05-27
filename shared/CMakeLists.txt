cmake_minimum_required(VERSION 3.10)
project(TreatSharedLibrary)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Define the shared library
add_library(shared SHARED library.cpp)