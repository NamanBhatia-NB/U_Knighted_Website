#!/bin/bash

# List of page files to fix
FILES=(
  "client/src/pages/join.tsx"
  "client/src/pages/members.tsx"
  "client/src/pages/news.tsx"
  "client/src/pages/events.tsx"
  "client/src/pages/about.tsx"
  "client/src/pages/contact.tsx"
  "client/src/pages/news-detail.tsx"
  "client/src/pages/event-detail.tsx"
)

# Process each file
for file in "${FILES[@]}"; do
  echo "Processing $file..."
  
  # Fix multiple empty lines
  sed -i '/^$/N;/^\n$/D' "$file"
  
  echo "Completed $file"
done

echo "All done!"
