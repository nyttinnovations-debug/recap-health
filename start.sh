#!/bin/bash
echo ""
echo "  RECAP - Recovery Intelligence Platform"
echo "  ========================================="
echo ""

if ! command -v node &> /dev/null; then
  echo "Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi
echo "Node.js $(node -v) found"

echo "Installing dependencies..."
npm install
[ $? -ne 0 ] && echo "npm install failed" && exit 1
echo "Dependencies installed"

[ ! -f .env ] && cp .env.example .env && echo ".env created (add ANTHROPIC_API_KEY for live AI)"

echo ""
echo "Starting RECAP..."
echo ""
echo "  Patient (QR landing): http://localhost:5173/"
echo "  Hospital dashboard:   http://localhost:5173/hospital"
echo "  QR generator:         http://localhost:5173/qr"
echo ""
npm run dev
