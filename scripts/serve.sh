#!/usr/bin/env bash
# Rebuild (with the engine harness) and (re)start `next start` on :3000. Used by the screenshot tooling.
set -e
cd "$(dirname "$0")/.."
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }" || true
ENGINE_HARNESS=1 npx next build > .next-build.log 2>&1 || { tail -30 .next-build.log; exit 1; }
nohup npx next start -p 3000 > .next-start.log 2>&1 &
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
echo "server up"
