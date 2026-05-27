#!/bin/bash
# Script to fix the "no such repository" error and link the local folder to GitHub

REPO_URL="https://github.com/chrissysmith260-droid/treat.git"

echo "Reconfiguring Git remote for: $REPO_URL"

# Initialize if not already a repo
[ -d .git ] || git init

# Remove existing origin to clear any stale/broken links
git remote remove origin 2>/dev/null || true

# Add the correct remote URL
git remote add origin "$REPO_URL"

echo "Remote origin successfully set to $REPO_URL"
echo "Now you can run ./setup.sh to build, commit, and push."