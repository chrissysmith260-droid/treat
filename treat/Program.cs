using System.Runtime.InteropServices;
using treat;

Console.WriteLine("Hello, Treat!");

try {
    int version = NativeMethods.GetLibraryVersion();
    Console.WriteLine($"Shared Library Version: {version}");

    int result = NativeMethods.Add(5, 10);
    Console.WriteLine($"Result from C++ Shared Library (5 + 10): {result}");

    result = NativeMethods.calculate_health_index(72, 95);
    Console.WriteLine($"Health Index: {result}");

    var myVitals = new VitalsData {
        heartRate = 75,
        glucose = 100,
        oxygen = 0.98f
    };

    float processed = NativeMethods.process_vitals(myVitals);
    Console.WriteLine($"Processed Vitals Score: {processed}");

} catch (DllNotFoundException) {
    Console.WriteLine("Error: libshared.so not found in the path.");
}

namespace treat
{
    [StructLayout(LayoutKind.Sequential)]
    public struct VitalsData {
        public int heartRate;
        public int glucose;
        public float oxygen;
    }

    public static class NativeMethods
    {
        [DllImport("shared", EntryPoint = "GetLibraryVersion")]
        public static extern int GetLibraryVersion();

        [DllImport("shared", EntryPoint = "Add")]
        public static extern int Add(int a, int b);

        // Use "shared" as the library name. 
        // The runtime automatically looks for libshared.so on Linux 
        // and shared.dll on Windows.
        [DllImport("shared", CallingConvention = CallingConvention.Cdecl)]
        public static extern int calculate_health_index(int heartRate, int glucose);

        [DllImport("shared", CallingConvention = CallingConvention.Cdecl)]
        public static extern float process_vitals(VitalsData data);
    }
}