#!/bin/bash
set -e

echo "Step 1: Downloading and installing extensions/tools..."
# Install Vercel CLI globally
npm install -g vercel

# Ensure Azure Function Extensions are updated if still using Azure
az extension add --name functionapp --upgrade || true

echo "Step 2: Cleaning and Recreating build directories..."
# Deep clean to resolve duplicate attribute errors
find . -type d -name "obj" -exec rm -rf {} +
find . -type d -name "bin" -exec rm -rf {} +
rm -rf dist/
mkdir -p bin/Release

echo "Step 3: Compiling .NET NuGet Packages..."
dotnet restore
dotnet build treat.csproj -c Release

echo "Step 4: Compiling Frontend Assets..."
npm install && npm run build

echo "Step 5: Packaging Application..."
# Extract version from package.json
VERSION=$(node -p "require('./package.json').version")
TAR_NAME="treat-v$VERSION.tar.gz"

tar -czvf "$TAR_NAME" bin/Release/ dist/

echo "Step 6: Committing changes to Git..."
git add .
git commit -m "build: compile and package version $VERSION" --allow-empty

echo "Step 7: Pushing to GitHub..."
if git remote | grep -q "origin"; then
    git push -u origin main || git push -u origin master
else
    echo "Error: Remote 'origin' not found. Please run ./configure-git.sh first."
    exit 1
fi

echo "Execution complete. Version $VERSION packaged and pushed to GitHub."