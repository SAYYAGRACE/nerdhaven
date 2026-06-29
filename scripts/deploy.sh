#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# Nerdhaven — VPS Deployment Script (standalone Next.js)
# ═══════════════════════════════════════════════════════════════
# Prerequisites:
#   1. Set env vars on VPS (see .env.production template below)
#   2. Node.js 20+ installed on VPS
#   3. SSH access to VPS
# ═══════════════════════════════════════════════════════════════

# ── Config (edit these) ───────────────────────────────────────
VPS_HOST="root@your-server-ip"
VPS_DIR="/opt/nerdhaven"
LOCAL_BUILD=".next/standalone/nerdhaven"
SSH_PORT=22

# ── Build locally ─────────────────────────────────────────────
echo "🔨 Building Next.js standalone..."
npm run build

# ── Rsync to VPS ──────────────────────────────────────────────
echo "📦 Syncing build to $VPS_HOST:$VPS_DIR ..."
rsync -avz --delete -e "ssh -p $SSH_PORT" \
  "$LOCAL_BUILD/" \
  "$VPS_HOST:$VPS_DIR/"

# ── Restart process on VPS ────────────────────────────────────
echo "🔄 Restarting Nerdhaven..."
ssh -p "$SSH_PORT" "$VPS_HOST" bash -c "'
  cd $VPS_DIR
  # Install production deps
  npm install --production --ignore-scripts 2>/dev/null || true

  # Run database migrations (if any)
  # npx prisma migrate deploy

  # Restart with PM2 (or systemd)
  if command -v pm2 &>/dev/null; then
    pm2 restart nerdhaven 2>/dev/null || pm2 start server.js --name nerdhaven
  else
    echo "⚠️  PM2 not found. Start manually with: node $VPS_DIR/server.js"
  fi
'"

echo "✅ Done! Verify at http://$VPS_HOST:3000 or your reverse proxy URL."

# ═══════════════════════════════════════════════════════════════
# .env.production template  (place on VPS at VPS_DIR/.env)
# ═══════════════════════════════════════════════════════════════
# DATABASE_URL="postgresql://neondb_owner:npg_nvqyt9UENTx6@ep-cold-art-ateubg01-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# AUTH_SECRET="<generate with: openssl rand -base64 32>"
# PAYSTACK_SECRET_KEY="sk_live_..."
# SENDGRID_API_KEY="SG.xxxxx"
# NEXT_PUBLIC_APP_URL="https://nerdhaven.com"
# AUTH_GOOGLE_ID=""           # optional
# AUTH_GOOGLE_SECRET=""       # optional
