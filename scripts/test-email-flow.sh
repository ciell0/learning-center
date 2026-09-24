#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  echo "Missing .env file. Copy .env.example first."
  exit 1
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI not found. Install it first."
  exit 1
fi

if [ -z "${SUPABASE_PROJECT_ID:-}" ]; then
  echo "SUPABASE_PROJECT_ID is not set. Add it to .env or environment."
  exit 1
fi

if [ -z "${RESEND_API_KEY:-}" ]; then
  echo "RESEND_API_KEY is not set. Add it to .env or secrets."
  exit 1
fi

echo "Checking Supabase connection..."
supabase status

echo "Deploying edge function..."
supabase functions deploy send-magang-email

echo "Example test payload:"
cat <<'EOF'
{
  "pelamar_id": "<uuid-pelamar-valid>"
}
EOF

echo "Use the Supabase Function endpoint to test sending an email to a valid pelamar record."
