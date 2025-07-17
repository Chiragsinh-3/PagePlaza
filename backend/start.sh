#!/bin/bash
# Simple shell script to start the application in production

# First, check if we're running in production
if [ "$NODE_ENV" = "production" ]; then
  # In production, we use the compiled JavaScript
  node dist/index.js
else
  # In development, we use ts-node
  npx ts-node --transpile-only index.ts
fi
