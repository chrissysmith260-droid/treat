#!/bin/bash
echo "Cleaning workspace artifacts..."
ROOT_DIR="/workspaces/treat"

# Remove .NET build artifacts
find "$ROOT_DIR" -type d \( -name "bin" -o -name "obj" \) -exec rm -rf {} +

# Remove C++ build directories
rm -rf "$ROOT_DIR/cpp/build"
rm -rf "$ROOT_DIR/shared/build"
rm -rf "$ROOT_DIR/Tests/bin" "$ROOT_DIR/Tests/obj"
rm -rf "$ROOT_DIR/ui/node_modules" "$ROOT_DIR/ui/build"

# Remove compiled binaries in the root
rm -f "$ROOT_DIR/treat_cpp"
rm -f "$ROOT_DIR/libshared.so"
rm -f "$ROOT_DIR/treat/libshared.so"

echo "Cleanup complete."