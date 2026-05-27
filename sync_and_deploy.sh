#!/bin/bash
set -e

echo "--- Cleaning Legacy Files ---"
# Remove redundant/legacy deployment files
rm -f /workspaces/treat/deploy.yml

echo "--- Compiling App ---"
chmod +x ./build.sh
./build.sh

echo "--- Saving and Syncing to GitHub ---"
git add .

# Only commit if there are changes
if git diff-index --quiet HEAD --; then
    echo "No changes to commit."
else
    git commit -m "chore: merged projects, cleaned syntax errors, and updated build pipeline"
    
    echo "--- Pushing to GitHub ---"
    git push origin main
fi

echo "--- Build and Sync Complete ---"
echo "Monitor the deployment here: https://github.com/$(git remote get-url origin | sed 's/.*github.com[\/:]//;s/\.git$//')/actions"