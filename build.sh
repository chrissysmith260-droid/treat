#!/bin/bash
set -e
ROOT_DIR="/workspaces/treat"

echo "--- Initializing Directories ---"
mkdir -p "$ROOT_DIR/shared/build" "$ROOT_DIR/cpp/build" "$ROOT_DIR/treat" "$ROOT_DIR/Tests" "$ROOT_DIR/ui"

echo "--- Building C++ Shared Library ---"
pushd "$ROOT_DIR/shared/build" > /dev/null
cmake "$ROOT_DIR/shared" -DCMAKE_BUILD_TYPE=Release
make -j"$(nproc)"
popd > /dev/null

echo "--- Building C# Projects ---"
# Ensure the native library is available for C#
cp "$ROOT_DIR/libshared.so" "$ROOT_DIR/treat/" 2>/dev/null || cp "$ROOT_DIR/shared.dll" "$ROOT_DIR/treat/" 2>/dev/null || true

dotnet restore "$ROOT_DIR/treat.sln"
dotnet build "$ROOT_DIR/treat.sln" --configuration Release

echo "--- Building C++ Project ---"
mkdir -p "$ROOT_DIR/cpp/build"
pushd "$ROOT_DIR/cpp/build" > /dev/null
cmake "$ROOT_DIR/cpp" -DCMAKE_BUILD_TYPE=Release
make -j"$(nproc)"
popd > /dev/null

echo "--- Building React UI ---"
if [ -f "$ROOT_DIR/ui/package.json" ]; then
    pushd "$ROOT_DIR/ui" > /dev/null
    npm install
    # npm run build # Uncomment if you want to generate production assets
    popd > /dev/null
fi

if [ -f "$ROOT_DIR/treat_cpp" ]; then
    echo "---------------------------------------"
    echo "Build successful!"
    echo "C++ Main: ./treat_cpp"
    echo "C# Main:  dotnet run --project $ROOT_DIR/treat/treat.csproj"
    echo "UI:      cd $ROOT_DIR/ui && npm start"
fi