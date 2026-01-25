#!/bin/bash
# build.sh - Convert a single TeX file to HTML using make4ht
# Usage: ./build.sh <path-to-tex-file>

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-tex-file>"
    exit 1
fi

TEX_FILE="$1"
TEX_DIR=$(dirname "$TEX_FILE")
TEX_BASENAME=$(basename "$TEX_FILE" .tex)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if the tex file exists
if [ ! -f "$TEX_FILE" ]; then
    echo "Error: File not found: $TEX_FILE"
    exit 1
fi

echo "Converting: $TEX_FILE"

# Change to the tex file directory
cd "$TEX_DIR"

# Preprocessing: Replace split with aligned (tex4ht compatibility)
if grep -q '\\begin{split}' "$TEX_BASENAME.tex"; then
    echo "Preprocessing: Replacing split with aligned for tex4ht compatibility..."
    sed -i.bak 's/\\begin{split}/\\begin{aligned}/g; s/\\end{split}/\\end{aligned}/g' "$TEX_BASENAME.tex"
fi

# Run make4ht with LuaLaTeX for Japanese support
# -l: use lualatex
# -u: UTF-8 output
echo "Running make4ht with LuaLaTeX..."
make4ht -l -u "$TEX_BASENAME.tex" "mathml" "" "" "--interaction=nonstopmode"

# Move the generated HTML to index.html if needed
if [ -f "${TEX_BASENAME}.html" ] && [ "$TEX_BASENAME" != "index" ]; then
    echo "Generated: $TEX_DIR/${TEX_BASENAME}.html"
fi

# Clean up temporary files
find . -maxdepth 1 \( -name "*.aux" -o -name "*.log" -o -name "*.4ct" -o -name "*.4tc" -o -name "*.dvi" -o -name "*.idv" -o -name "*.lg" -o -name "*.tmp" -o -name "*.xref" -o -name "*.toc" -o -name "*.bak" \) -delete 2>/dev/null || true

echo "Conversion complete!"
