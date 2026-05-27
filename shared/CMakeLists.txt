cmake_minimum_required(VERSION 3.10)
project(TreatShared)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Output to the workspace root for easy loading
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/..)

add_library(shared SHARED shared.cpp)