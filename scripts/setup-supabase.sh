#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI not found. Install it first: https://supabase.com/docs/guides/cli"
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

if [ ! -f supabase/config.toml ]; then
  echo "Missing supabase/config.toml. Please ensure the supabase folder exists."
  exit 1
fi

PROJECT_REF="${SUPABASE_PROJECT_ID:-}"
if [ -z "$PROJECT_REF" ]; then
  echo "SUPABASE_PROJECT_ID is not set. Please add it to your environment or .env file."
  exit 1
fi

if [ ! -f .env ]; then
  echo "No .env file found after copy. Exiting."
  exit 1
fi

echo "Linking local Supabase config to project: $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF"

echo "Applying database migrations..."
supabase db push

echo "Setup completed."
echo "Next steps:"
echo "  1. Fill in .env with your actual Supabase values"
echo "  2. Run: npm run dev"
