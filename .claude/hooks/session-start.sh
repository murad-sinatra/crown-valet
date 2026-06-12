#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-/home/user/crown-valet}"

# Install Node dependencies
npm install

# Generate Prisma client (requires DATABASE_URL placeholder)
DATABASE_URL="postgresql://crown_valet:crown_valet@localhost:5432/crown_valet?schema=public" \
  npx prisma generate
