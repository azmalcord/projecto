
#!/usr/bin/env bash
# ============================================================
# AORTIC EDU — PREMIUM PRODUCTION LAUNCHER
#
# ./run.sh             Build (if needed) + background start
# ./run.sh stop        Stop background server
# ./run.sh restart     Restart server
# ./run.sh foreground Run server in foreground
#
# Node >= 18 | Bash >= 4
# Original process management preserved.
# ============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# ------------------------------------------------------------
# COLORS
# ------------------------------------------------------------

RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

CYAN='\033[38;5;51m'
PURPLE='\033[38;5;141m'
GREEN='\033[38;5;82m'
RED='\033[38;5;196m'
YELLOW='\033[38;5;220m'
WHITE='\033[97m'
GRAY='\033[38;5;245m'

# Disable colors when output is redirected.
if [[ ! -t 1 ]]; then
  RESET='' BOLD='' DIM=''
  CYAN='' PURPLE='' GREEN='' RED=''
  YELLOW='' WHITE='' GRAY=''
fi

# ------------------------------------------------------------
# BANNER
# ------------------------------------------------------------

show_banner() {
  clear 2>/dev/null || true

  echo -e "${CYAN}${BOLD}"
  cat <<'EOF'
       █████╗  ██████╗ ████████╗██╗ ██████╗
      ██╔══██╗██╔═══██╗╚══██╔══╝██║██╔════╝
      ███████║██║   ██║   ██║   ██║██║
      ██╔══██║██║   ██║   ██║   ██║██║
      ██║  ██║╚██████╔╝   ██║   ██║╚██████╗
EOF
  echo -e "${RESET}"

  echo -e "${PURPLE}${BOLD}             AORTIC EDU${RESET}"
  echo -e "${GRAY}          PRODUCTION SERVER MANAGER${RESET}"
  echo -e "${CYAN}     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
}

# ------------------------------------------------------------
# COLORED OUTPUT
# ------------------------------------------------------------

info() {
  echo -e " ${CYAN}➜${RESET} $*"
}

success() {
  echo -e " ${GREEN}✔${RESET} $*"
}

warning() {
  echo -e " ${YELLOW}!${RESET} $*"
}

error() {
  echo -e " ${RED}✖ ERROR:${RESET} $*" >&2
}

# ------------------------------------------------------------
# PROGRESS BAR
# ------------------------------------------------------------

progress() {
  local percent="$1"
  local message="$2"
  local width=30

  local filled=$((percent * width / 100))
  local empty=$((width - filled))

  local left right

  printf -v left '%*s' "$filled" ''
  printf -v right '%*s' "$empty" ''

  left="${left// /█}"
  right="${right// /░}"

  echo -e ""
  echo -e " ${CYAN}[${left}${right}]${RESET} ${BOLD}${WHITE}${percent}%${RESET}"
  echo -e " ${PURPLE}${message}${RESET}"
  echo ""
}

# ------------------------------------------------------------
# EXECUTABLE PERMISSION
# ------------------------------------------------------------

if [[ ! -x "$0" ]]; then
  chmod +x "$0" 2>/dev/null || true
fi

# ------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------

NODE_BIN="$(command -v node || true)"

if [[ -z "$NODE_BIN" ]]; then
  error "Node.js is not installed."
  echo "Install Node.js using:"
  echo "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
  echo "sudo apt-get install -y nodejs"
  exit 1
fi

NODE_VERSION="$(node --version 2>/dev/null || true)"
NODE_MAJOR="${NODE_VERSION#v}"
NODE_MAJOR="${NODE_MAJOR%%.*}"

if ! [[ "$NODE_MAJOR" =~ ^[0-9]+$ ]] || (( NODE_MAJOR < 18 )); then
  error "Node >= 18 required. Found ${NODE_VERSION:-unknown}."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  error "NPM is not installed."
  exit 1
fi

# ------------------------------------------------------------
# LOAD ENVIRONMENT
# ------------------------------------------------------------

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

# ------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------

is_running() {
  [[ -f "$PIDFILE" ]] || return 1

  local pid
  pid="$(cat "$PIDFILE" 2>/dev/null || true)"

  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

# ------------------------------------------------------------
# STOP SERVER
# Original stop logic preserved.
# ------------------------------------------------------------

stop_server() {
  if is_running; then
    local pid
    pid="$(cat "$PIDFILE")"

    info "Stopping AORTIC EDU (PID ${pid})..."

    kill "$pid" 2>/dev/null || true

    for _ in $(seq 1 50); do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.2
    done

    kill -9 "$pid" 2>/dev/null || true

    rm -f "$PIDFILE"

    success "Server stopped."
  else
    warning "No running server found."
  fi
}

# ------------------------------------------------------------
# PORT CHECK
# Original wait logic preserved.
# ------------------------------------------------------------

wait_for_port() {
  local host="$1" port="$2" tries="${3:-60}"
  local i

  for ((i = 1; i <= tries; i++)); do

    if command -v nc >/dev/null 2>&1 &&
       nc -z "$host" "$port" 2>/dev/null; then
      return 0
    fi

    if (exec 3<>"/dev/tcp/${host}/${port}") 2>/dev/null; then
      exec 3>&- 3<&- 2>/dev/null || true
      return 0
    fi

    sleep 1
  done

  return 1
}

# ------------------------------------------------------------
# DEPENDENCIES
# ------------------------------------------------------------

install_dependencies() {
  if [[ ! -d "$ROOT/node_modules" ]]; then
    info "Installing application dependencies..."

    npm install --no-audit --no-fund

    success "Dependencies installed."
  else
    success "Dependencies already installed."
  fi
}

# ------------------------------------------------------------
# PRODUCTION BUILD
# ------------------------------------------------------------

build_application() {
  if [[ ! -d "$ROOT/.next/server" ]] ||
     [[ "${FORCE_REBUILD:-0}" == "1" ]]; then

    info "Building production bundle..."

    npm run build

    success "Production build completed."
  else
    success "Production build already present."
  fi
}

# ------------------------------------------------------------
# FOREGROUND MODE
# ------------------------------------------------------------

cmd_foreground() {
  show_banner

  progress 15 "Checking application dependencies..."
  install_dependencies

  progress 50 "Preparing production build..."
  if [[ ! -d "$ROOT/.next" ]] ||
     [[ "${FORCE_REBUILD:-0}" == "1" ]]; then
    npm run build
  fi

  progress 100 "Starting foreground server..."

  echo -e "${GREEN}${BOLD}"
  echo " AORTIC EDU is starting..."
  echo -e "${RESET}"

  echo " http://0.0.0.0:${PORT}"
  echo ""
  echo " Press Ctrl+C to stop."

  exec npm run start
}

# ------------------------------------------------------------
# START MODE
# Original nohup/npm startup preserved.
# ------------------------------------------------------------

cmd_start() {

  show_banner

  if is_running; then
    success "Server already running."
    echo ""
    echo " URL: http://localhost:${PORT}"
    echo " PID: $(cat "$PIDFILE")"
    return 0
  fi

  progress 10 "Initializing AORTIC EDU..."

  # 1. Dependencies
  progress 25 "Installing dependencies..."
  install_dependencies

  # 2. Production build
  progress 55 "Preparing production bundle..."
  build_application

  # 3. Background startup
  progress 75 "Starting production server..."

  : > "$LOGFILE"

  nohup npm run start > "$LOGFILE" 2>&1 &

  echo $! > "$PIDFILE"

  # 4. Health / port check
  progress 90 "Waiting for server response..."

  if wait_for_port "127.0.0.1" "$PORT" 60; then

    progress 100 "AORTIC EDU successfully launched!"

    echo ""
    echo -e "${GREEN}${BOLD}"
    echo "  ╔══════════════════════════════════════╗"
    echo "  ║       AORTIC EDU IS ONLINE           ║"
    echo "  ╚══════════════════════════════════════╝"
    echo -e "${RESET}"

    echo -e "${CYAN}  LOCAL ACCESS${RESET}"
    echo "  http://localhost:${PORT}"

    local ip=""

    if command -v ip >/dev/null 2>&1; then
      ip="$(ip route 2>/dev/null |
        awk '/default/ {for(i=1;i<=NF;i++) if($i=="via") {print $(i+1); exit}}')"
    fi

    if [[ -z "$ip" ]]; then
      ip="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
    fi

    if [[ -n "$ip" ]]; then
      echo "  http://${ip}:${PORT} (network)"
    fi

    echo ""
    echo -e "${PURPLE}  SERVER INFORMATION${RESET}"
    echo "  Node.js : $NODE_VERSION"
    echo "  PID     : $(cat "$PIDFILE")"
    echo "  Port    : $PORT"

    echo ""
    echo -e "${PURPLE}  MANAGEMENT${RESET}"
    echo "  Logs    : tail -f $LOGFILE"
    echo "  Stop    : ./run.sh stop"
    echo "  Restart : ./run.sh restart"

    echo ""
    echo -e "${GREEN}  Deployment ready.${RESET}"
    echo ""

  else

    error "Server did not start in time."

    echo ""
    echo "Recent application logs:"
    tail -n 40 "$LOGFILE" || true

    stop_server
    exit 1

  fi
}

# ------------------------------------------------------------
# ENTRY POINT
# ------------------------------------------------------------

case "${1:-start}" in

  start)
    cmd_start
    ;;

  stop)
    show_banner
    stop_server
    ;;

  restart)
    show_banner
    stop_server
    cmd_start
    ;;

  foreground)
    cmd_foreground
    ;;

  *)
    echo "Usage: $0 {start|stop|restart|foreground}"
    exit 2
    ;;

esac
