using System.Runtime.InteropServices;

Console.WriteLine("Hello, Treat!");

try {
    int version = NativeMethods.GetLibraryVersion();
    Console.WriteLine($"Shared Library Version: {version}");

    int result = NativeMethods.Add(5, 10);
    Console.WriteLine($"Result from C++ Shared Library (5 + 10): {result}");
} catch (DllNotFoundException) {
    Console.WriteLine("Error: libshared.so not found in the path.");
}

static partial class NativeMethods
{
    [DllImport("shared", EntryPoint = "GetLibraryVersion")]
    public static extern int GetLibraryVersion();

    [DllImport("shared", EntryPoint = "Add")]
    public static extern int Add(int a, int b);
}