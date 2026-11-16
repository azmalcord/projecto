#!/usr/bin/env bash
# AORTIC EDU — one-command launcher.
#
#   ./run.sh            build (if needed) + start the production server in the
#                       background, then print the URL.
#   ./run.sh stop       stop the background server started by this script.
#   ./run.sh foreground run the server in the foreground (useful for logs).
#
# Works on Debian / Ubuntu / any Linux with Node >= 18 and Bash >= 4.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# Ensure this file is executable even on a fresh clone (git may drop the
# exec bit; e.g. a Windows checkout or a tarball without mode bits).
if [[ ! -x "$0" ]]; then
  chmod +x "$0" 2>/dev/null || true
fi

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------
NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" ]]; then
  echo "ERROR: Node.js is not installed. Install it (Debian/Ubuntu):"
  echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
  echo "  sudo -E apt-get install -y nodejs"
  echo "then re-run this script."
  exit 1
fi

NODE_VERSION="$(node --version 2>/dev/null || true)"
NODE_MAJOR="${NODE_VERSION#v}"
NODE_MAJOR="${NODE_MAJOR%%.*}"
if ! [[ "$NODE_MAJOR" =~ ^[0-9]+$ ]] || (( NODE_MAJOR < 18 )); then
  echo "ERROR: Node >= 18 is required (found ${NODE_VERSION:-unknown})."
  exit 1
fi

# npm ships with Node, but some minimal installs (e.g. a bare node binary,
# or the Debian "nodejs" package without npm) only provide `node`. Bail out
# early with a clear message instead of failing inside `npm install`.
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is not installed. Install it (Debian/Ubuntu):"
  echo "  sudo -E apt-get install -y npm"
  echo "or use a full Node.js release from https://nodejs.org/."
  exit 1
fi

# Load .env if present (so PORT / NEXT_PUBLIC_* take effect).
if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$ROOT/.env"
  set +a
fi

PORT="${PORT:-8080}"
HOST="${HOST:-0.0.0.0}"
PIDFILE="$ROOT/.run.pid"
LOGFILE="$ROOT/.run.log"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
is_running() {
  [[ -f "$PIDFILE" ]] || return 1
  local pid
  pid="$(cat "$PIDFILE" 2>/dev/null || true)"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

stop_server() {
  if is_running; then
    local pid
    pid="$(cat "$PIDFILE")"
    echo "Stopping server (pid ${pid}) ..."
    kill "$pid" 2>/dev/null || true
    # Wait up to 10s for a graceful exit.
    for _ in $(seq 1 50); do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.2
    done
    kill -9 "$pid" 2>/dev/null || true
    rm -f "$PIDFILE"
    echo "Stopped."
  else
    echo "No running server found."
  fi
}

wait_for_port() {
  local host="$1" port="$2" tries="${3:-60}"
  local i
  for ((i = 1; i <= tries; i++)); do
    # Prefer nc when it is actually usable. Some distros ship an nc that
    # exists but is a no-op stub (e.g. "netcat-openbsd" symlinked to
    # "nc.traditional"), so probe it rather than trusting `command -v`.
    if command -v nc >/dev/null 2>&1 && nc -z "$host" "$port" 2>/dev/null; then
      return 0
    fi
    # Fallback: open a TCP socket with bash /dev/tcp (works on Bash >= 4,
    # which is what Debian/Ubuntu/any modern distro ship).
    if (exec 3<>"/dev/tcp/${host}/${port}") 2>/dev/null; then
      exec 3>&- 3<&- 2>/dev/null || true
      return 0
    fi
    sleep 1
  done
  return 1
}

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
cmd_stop() {
  stop_server
}

cmd_foreground() {
  if [[ ! -d "$ROOT/node_modules" ]]; then
    echo "Installing dependencies ..."
    npm install --no-audit --no-fund
  fi
  if [[ ! -d "$ROOT/.next" ]]; then
    echo "Building ..."
    npm run build
  fi
  echo "Starting server on http://0.0.0.0:${PORT} (foreground, Ctrl+C to stop)"
  exec npm run start
}

cmd_start() {
  if is_running; then
    echo "Server already running on http://0.0.0.0:${PORT} (pid $(cat "$PIDFILE"))"
    return 0
  fi

  # 1) Dependencies
  if [[ ! -d "$ROOT/node_modules" ]]; then
    echo "Installing dependencies ..."
    npm install --no-audit --no-fund
  fi

  # 2) Build (only if there is no production output, or a rebuild is requested)
  if [[ ! -d "$ROOT/.next/server" ]] || [[ "${FORCE_REBUILD:-0}" == "1" ]]; then
    echo "Building production bundle ..."
    npm run build
  else
    echo "Production build already present (set FORCE_REBUILD=1 to rebuild)."
  fi

  # 3) Start in the background
  echo "Starting server in the background ..."
  : > "$LOGFILE"
  nohup npm run start > "$LOGFILE" 2>&1 &
  echo $! > "$PIDFILE"

  # 4) Wait until it answers.
  if wait_for_port "127.0.0.1" "$PORT" 60; then
    echo ""
    echo "✓ AORTIC EDU is running:"
    echo "    http://localhost:${PORT}"
    local ip
    # Prefer the address on the default route (works on any Linux with
    # iproute2, the standard on Debian/Ubuntu). Fall back to hostname -I,
    # which can return several addresses on multi-homed hosts.
    if command -v ip >/dev/null 2>&1; then
      ip="$(ip route 2>/dev/null | awk '/default/ {for (i=1;i<=NF;i++) if ($i=="via") {print $(i+1); exit}}')"
    fi
    if [[ -z "$ip" ]]; then
      ip="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
    fi
    if [[ -n "$ip" ]]; then
      echo "    http://${ip}:${PORT}  (on your network)"
    fi
    echo ""
    echo "  Logs:     tail -f ${LOGFILE}"
    echo "  Stop:     ./run.sh stop"
  else
    echo "ERROR: server did not come up in time. Recent log:"
    tail -n 40 "$LOGFILE" || true
    stop_server
    exit 1
  fi
}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
case "${1:-start}" in
  start)        cmd_start ;;
  stop)         cmd_stop ;;
  restart)      stop_server; cmd_start ;;
  foreground)   cmd_foreground ;;
  *)            echo "Usage: $0 {start|stop|restart|foreground}"; exit 2 ;;
esac