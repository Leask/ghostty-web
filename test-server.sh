#!/bin/bash
# Simple HTTP server for testing
echo "Starting HTTP server on http://localhost:8000"
echo "Open http://localhost:8000 in your browser"
echo "Press Ctrl+C to stop"
python3 -m http.server 8000
