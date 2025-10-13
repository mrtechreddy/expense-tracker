#!/bin/bash

set -e

APP_NAME="expense-tracker"
APP_PORT=3000
APP_DIR="$HOME/expense-tracker"
DOC_ROOT="/var/www/html"
LOG_FILE="$APP_DIR/${APP_NAME}.log"

echo "🚀 Building $APP_NAME..."
npm run build

echo "📦 Deploying build to $DOC_ROOT..."
sudo rm -rf $DOC_ROOT/*
sudo cp -r dist/* $DOC_ROOT/

# ✅ Ensure DB is writable (important for SQLite)
if [ -d "$DOC_ROOT/db" ]; then
  echo "🔐 Fixing database permissions..."
  sudo chown -R ubuntu:www-data $DOC_ROOT/db
  sudo chmod -R 775 $DOC_ROOT/db
fi

echo "🧹 Stopping any existing Node.js app..."
pkill -f "node server.js" || true

echo "⚙️ Starting Node.js app on port $APP_PORT..."
cd $DOC_ROOT
nohup node server.js > "$LOG_FILE" 2>&1 &

sleep 2

echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Deployment complete!"
echo "🌍 App is live at: http://$(curl -s ifconfig.me)"
echo "📜 Logs: $LOG_FILE"
echo ""
echo "🪵 Last 10 log lines:"
tail -n 10 "$LOG_FILE" || echo "No logs yet."

