#!/bin/sh
set -e

echo "DATABASE_URL: $DATABASE_URL"
npx prisma db push

exec "$@"