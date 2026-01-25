#!/bin/bash
# convert-all.sh - Find and convert all TeX files in content/ directories
# Usage: ./convert-all.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTENT_DIR="$PROJECT_ROOT/content"
BUILD_SCRIPT="$SCRIPT_DIR/build.sh"

echo "Searching for .tex files in $CONTENT_DIR..."

# Find all .tex files in content/ (page bundles)
TEX_FILES=$(find "$CONTENT_DIR" -name "*.tex" -type f)

if [ -z "$TEX_FILES" ]; then
    echo "No .tex files found in $CONTENT_DIR"
    exit 0
fi

echo "Found the following .tex files:"
echo "$TEX_FILES"
echo ""

# Convert each tex file
CONVERTED=0
FAILED=0

for TEX_FILE in $TEX_FILES; do
    echo "========================================"
    echo "Processing: $TEX_FILE"
    echo "========================================"

    if "$BUILD_SCRIPT" "$TEX_FILE"; then
        CONVERTED=$((CONVERTED + 1))
    else
        echo "Warning: Failed to convert $TEX_FILE"
        FAILED=$((FAILED + 1))
    fi
    echo ""
done

echo "========================================"
echo "Conversion Summary"
echo "========================================"
echo "Converted: $CONVERTED"
echo "Failed: $FAILED"
echo "Total: $((CONVERTED + FAILED))"
