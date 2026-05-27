// Shared C++ Library Source
#include <cstdint>

struct VitalsData {
    int32_t heartRate;
    int32_t glucose;
    float oxygen;
};

extern "C" {
    int GetLibraryVersion() {
        return 1;
    }

    int Add(int a, int b) {
        return a + b;
    }

    int calculate_health_index(int heartRate, int glucose) {
        return (heartRate + glucose) / 2; 
    }

    // Example of receiving a struct
    float process_vitals(VitalsData data) {
        // Simple logic using the struct fields
        return (data.heartRate + data.glucose) * data.oxygen;
    }
}