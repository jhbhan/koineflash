#!/bin/bash

# Configuration
SOURCE="assets/icon.png"
OUTPUT_DIR="ios-icons"
mkdir -p "$OUTPUT_DIR"

if [ ! -f "$SOURCE" ]; then
    echo "Error: $SOURCE not found!"
    exit 1
fi

echo "Generating iOS icon sizes from $SOURCE..."

# List of name:size pairs
SIZES=(
    "icon-20@1x.png:20"
    "icon-20@2x.png:40"
    "icon-20@3x.png:60"
    "icon-29@1x.png:29"
    "icon-29@2x.png:58"
    "icon-29@3x.png:87"
    "icon-40@1x.png:40"
    "icon-40@2x.png:80"
    "icon-40@3x.png:120"
    "icon-60@2x.png:120"
    "icon-60@3x.png:180"
    "icon-76@1x.png:76"
    "icon-76@2x.png:152"
    "icon-83.5@2x.png:167"
    "icon-1024.png:1024"
)

for item in "${SIZES[@]}"; do
    filename="${item%%:*}"
    size="${item##*:}"
    echo "Creating $filename ($size x $size)..."
    sips -z "$size" "$size" "$SOURCE" --out "$OUTPUT_DIR/$filename" > /dev/null
done

echo "Success! All icons are ready in the '$OUTPUT_DIR' folder."
