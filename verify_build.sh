#!/bin/bash
# Verification script for Treat App linking
ROOT_DIR="/workspaces/treat"

echo "--- Verifying Native Library Existence ---"
if [ -f "$ROOT_DIR/treat/libshared.so" ] || [ -f "$ROOT_DIR/treat/shared.dll" ]; then
    echo "✅ Native library found in C# project directory."
else
    echo "❌ Native library MISSING in C# project directory."
    exit 1
fi

echo "--- Verifying C# Build Artifacts ---"
CS_BIN="$ROOT_DIR/treat/bin/Release/net8.0/treat.dll"
if [ -f "$CS_BIN" ]; then
    echo "✅ C# Assembly found at $CS_BIN"
else
    echo "❌ C# Build artifacts missing."
    exit 1
fi

echo "--- Checking for Shared Symbols (Linux) ---"
nm -D "$ROOT_DIR/treat/libshared.so" | grep " T " || echo "Warning: No exported functions found in library."

echo "Linking Verification Complete."