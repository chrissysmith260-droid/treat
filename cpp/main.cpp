#include <iostream>
#include <cstdint>

// Define the same struct as in shared/library.cpp to ensure memory layout matches
struct VitalsData {
    int32_t heartRate;
    int32_t glucose;
    float oxygen;
};

// Declarations for functions exported by the shared library
extern "C" {
    int GetLibraryVersion();
    int Add(int a, int b);
    int calculate_health_index(int heartRate, int glucose);
    float process_vitals(VitalsData data);
}

int main() {
    std::cout << "--- Treat C++ CLI Interface ---" << std::endl;

    // Call functions from the shared library
    std::cout << "Library Version: " << GetLibraryVersion() << std::endl;
    std::cout << "Test Addition (15 + 27): " << Add(15, 27) << std::endl;
    
    int hr = 72;
    int glucose = 95;
    std::cout << "Health Index for HR " << hr << " and Glucose " << glucose << ": " 
              << calculate_health_index(hr, glucose) << std::endl;

    VitalsData sampleVitals = { 75, 105, 0.98f };
    std::cout << "Processing Vitals struct... Result: " << process_vitals(sampleVitals) << std::endl;

    return 0;
}