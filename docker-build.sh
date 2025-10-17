#!/bin/bash

echo "Updating package-lock.json in frontend..."
cd frontend
npm install --package-lock-only
cd ..

echo "Now running Docker build..."
./docker.sh "$@"