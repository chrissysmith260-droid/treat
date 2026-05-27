cmake_minimum_required(VERSION 3.10)
project(TreatCppProject)

set(CMAKE_CXX_STANDARD 17)

# Set the output directory to the project root as expected by build.sh
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/..)

# Define the main executable
add_executable(treat_cpp main.cpp)

# Link the shared library produced by the 'shared' directory
target_link_libraries(treat_cpp PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}/../shared/build/libshared.so")