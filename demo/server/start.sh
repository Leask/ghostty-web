#!/bin/bash

# Kill any existing server on port 3001
echo "🔍 Checking for existing server on port 3001..."
if lsof -ti:3001 >/dev/null 2>&1; then
  echo "⚠️  Port 3001 is in use. Killing existing process..."
  fuser -k 3001/tcp 2>/dev/null || true
  sleep 1
fi

echo "🚀 Starting File Browser WebSocket Server..."
cd "$(dirname "$0")"
exec bun run file-browser-server.ts
