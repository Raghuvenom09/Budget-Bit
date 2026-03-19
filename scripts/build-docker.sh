#!/usr/bin/env bash
# Budget Bit — Build Docker Images

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building Budget Bit Docker Images..."
echo ""

# Build client
echo "Building Client..."
docker build -t budget-bit-client:latest \
  --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
  --build-arg VITE_AI_BASE_URL="${VITE_AI_BASE_URL}" \
  -f "$SCRIPT_DIR/client/Dockerfile" \
  "$SCRIPT_DIR/client"

echo "✓ Client built: budget-bit-client:latest"
echo ""

# Build AI service
echo "Building AI Service..."
docker build -t budget-bit-ai:latest \
  --build-arg GEMINI_API_KEY="${GEMINI_API_KEY}" \
  --build-arg SUPABASE_URL="${SUPABASE_URL}" \
  --build-arg SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY}" \
  -f "$SCRIPT_DIR/ai/Dockerfile" \
  "$SCRIPT_DIR/ai"

echo "✓ AI Service built: budget-bit-ai:latest"
echo ""

echo "All images built successfully!"
docker images | grep budget-bit
