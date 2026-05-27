#!/bin/bash
set -e
ROOT_DIR="/workspaces/treat"

echo "--- Building C++ Shared Library ---"
if [ -d "$ROOT_DIR/shared" ]; then
    mkdir -p "$ROOT_DIR/shared/build"
    pushd "$ROOT_DIR/shared/build" > /dev/null
    cmake .. -DCMAKE_BUILD_TYPE=Release
    make -j"$(nproc)"
    popd > /dev/null
fi

echo "--- Building C# Projects ---"
# Ensure the native library is available for C#
cp "$ROOT_DIR/shared/build/libshared.so" "$ROOT_DIR/treat/" 2>/dev/null || cp "$ROOT_DIR/shared/build/shared.dll" "$ROOT_DIR/treat/" 2>/dev/null || true

dotnet restore "$ROOT_DIR/treat.sln"
dotnet build "$ROOT_DIR/treat.sln" --configuration Release

echo "--- Building C++ Project ---"
if [ -d "$ROOT_DIR/cpp" ]; then
    mkdir -p "$ROOT_DIR/cpp/build"
    pushd "$ROOT_DIR/cpp/build" > /dev/null
    cmake .. -DCMAKE_BUILD_TYPE=Release
    make -j"$(nproc)"
    popd > /dev/null
fi

echo "--- Building React UI ---"
if [ -f "$ROOT_DIR/package.json" ]; then
    npm install
    npm run build
fi

echo "--- Verifying Linking ---"
chmod +x ./verify_build.sh
./verify_build.sh

if [ -f "$ROOT_DIR/treat_cpp" ]; then
    echo "---------------------------------------"
    echo "Build successful!"
    echo "C++ Main: ./treat_cpp"
    echo "C# Main:  dotnet run --project $ROOT_DIR/treat/treat.csproj"
    echo "UI:      cd $ROOT_DIR/ui && npm start"
fi