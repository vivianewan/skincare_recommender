#!/bin/bash
set -e

echo "Starting Skincare Recommender..."

# Start backend
cd "$(dirname "$0")/backend"
export PATH="$HOME/.local/bin:$PATH"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
cd "$(dirname "$0")/frontend"
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  护肤智选 App 已启动"
echo "  前端: http://localhost:5173"
echo "  后端 API: http://localhost:8000"
echo "  API 文档: http://localhost:8000/docs"
echo "============================================"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
