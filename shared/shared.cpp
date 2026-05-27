#include <iostream>

extern "C" {
    // Feature: Return library version
    int GetLibraryVersion() {
        return 100; // v1.0.0
    }

    // Exported function for P/Invoke
    int Add(int a, int b) {
        return a + b;
    }
}