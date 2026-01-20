#!/bin/bash
# LaTeX to HTML conversion script using make4ht
# Usage: ./build.sh <input.tex> [output_dir]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ $# -lt 1 ]; then
    echo "Usage: $0 <input.tex> [output_dir]"
    echo "Example: $0 samples/19.tex content/math/csa/"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_DIR="${2:-.}"

# Get the base name without extension
BASENAME=$(basename "$INPUT_FILE" .tex)

# Convert paths to absolute
INPUT_FILE="$(cd "$(dirname "$INPUT_FILE")" && pwd)/$(basename "$INPUT_FILE")"
OUTPUT_DIR="$(mkdir -p "$OUTPUT_DIR" && cd "$OUTPUT_DIR" && pwd)"

# Create a temporary directory for build
BUILD_DIR=$(mktemp -d)
cleanup() {
    rm -rf "$BUILD_DIR"
}
trap cleanup EXIT

# Copy necessary files to build directory
cp "$INPUT_FILE" "$BUILD_DIR/"
cp -r "$PROJECT_ROOT/preambles" "$BUILD_DIR/"
cp "$SCRIPT_DIR/tex4ht.cfg" "$BUILD_DIR/"
cp "$SCRIPT_DIR/mathjax-macros.tex" "$BUILD_DIR/"
cp "$PROJECT_ROOT/preambles/operators_and_letters.tex" "$BUILD_DIR/"

# Change to build directory
cd "$BUILD_DIR"

# Create a wrapper file that defines HTMLMODE
cat > "build_$BASENAME.tex" << 'TEXEOF'
\def\HTMLMODE{1}
TEXEOF
cat "$BASENAME.tex" >> "build_$BASENAME.tex"

# Run make4ht with LuaLaTeX
# -ul: use LuaLaTeX with UTF-8
# -c: use custom config file
# -d: output directory
echo "Converting $INPUT_FILE to HTML..."
mkdir -p output
make4ht -ul -c tex4ht.cfg -d output "build_$BASENAME.tex" "mathjax, tikz+" 2>&1 || true

# Rename output file to original name
if [ -f "output/build_$BASENAME.html" ]; then
    mv "output/build_$BASENAME.html" "output/$BASENAME.html"
fi

# Also rename SVG files if they exist
for svg in output/build_${BASENAME}*.svg; do
    if [ -f "$svg" ]; then
        newname=$(echo "$svg" | sed "s/build_${BASENAME}/${BASENAME}/")
        mv "$svg" "$newname"
    fi
done

# Rename CSS file if it exists
if [ -f "output/build_$BASENAME.css" ]; then
    mv "output/build_$BASENAME.css" "output/$BASENAME.css"
fi

# Update HTML to reference renamed SVG files
if [ -f "output/$BASENAME.html" ]; then
    sed -i.bak "s/build_${BASENAME}/${BASENAME}/g" "output/$BASENAME.html"
    rm -f "output/$BASENAME.html.bak"
fi

# Check if HTML was generated
if [ -f "output/$BASENAME.html" ]; then
    echo "HTML generated successfully!"

    # Copy output files to destination
    echo "Copying output to $OUTPUT_DIR..."
    cp "output/$BASENAME.html" "$OUTPUT_DIR/"

    # Copy CSS file if it exists
    if [ -f "output/$BASENAME.css" ]; then
        cp "output/$BASENAME.css" "$OUTPUT_DIR/"
    fi

    # Copy SVG files if they exist
    for svg in output/${BASENAME}*.svg; do
        if [ -f "$svg" ]; then
            cp "$svg" "$OUTPUT_DIR/"
        fi
    done

    # Copy math CSS file
    cp "$PROJECT_ROOT/static/css/math-content.css" "$OUTPUT_DIR/"

    echo "Conversion complete!"
    echo "Output files in: $OUTPUT_DIR"
    ls -la "$OUTPUT_DIR"
else
    echo "Error: HTML file was not generated"
    exit 1
fi
