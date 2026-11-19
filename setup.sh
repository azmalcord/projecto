
#!/usr/bin/env bash
# ================================================================
# AORTIC EDU | FINAL BOSS DEPLOYMENT ENGINE
# Version: 3.0.0
#
# Repository : https://github.com/azmalcord/projecto
# Target     : /opt/aortic-edu
# Runtime    : Node.js 20+
# Server     : Next.js Production
# ================================================================

set -Eeuo pipefail

# ================================================================
# CONFIGURATION
# ================================================================

REPO="https://github.com/azmalcord/projecto"
BRANCH="main"
DIR="${PROJECT_DIR:-/opt/aortic-edu}"
PORT=8080

LOG_FILE="/var/log/aortic-edu-setup.log"
TEMP_DIR=""

# ================================================================
# TERMINAL COLORS
# ================================================================

RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

BLACK='\033[38;5;16m'
CYAN='\033[38;5;51m'
BLUE='\033[38;5;39m'
PURPLE='\033[38;5;141m'
PINK='\033[38;5;213m'
GREEN='\033[38;5;82m'
RED='\033[38;5;196m'
YELLOW='\033[38;5;220m'
WHITE='\033[97m'
GRAY='\033[38;5;245m'

if [[ ! -t 1 ]]; then
    RESET='' BOLD='' DIM=''
    BLACK='' CYAN='' BLUE='' PURPLE=''
    PINK='' GREEN='' RED='' YELLOW=''
    WHITE='' GRAY=''
fi

# ================================================================
# TERMINAL ENGINE
# ================================================================

banner() {
    if [[ -t 1 ]]; then
        clear 2>/dev/null || true
    fi

    echo -e "${CYAN}${BOLD}"

    cat <<'EOF'
        █████╗  ██████╗ ██████╗ ████████╗██╗ ██████╗
       ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██║██╔════╝
       ███████║██║   ██║██████╔╝   ██║   ██║██║
       ██╔══██║██║   ██║██╔══██╗   ██║   ██║██║
       ██║  ██║╚██████╔╝██║  ██║   ██║   ██║╚██████╗
       ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝
EOF

    echo -e "${RESET}"
    echo -e "${PURPLE}${BOLD}             AORTIC EDU DEPLOYMENT ENGINE${RESET}"
    echo -e "${GRAY}          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${DIM}                  FINAL BOSS EDITION v3.0${RESET}"
    echo ""
}

info() {
    echo -e "  ${CYAN}➜${RESET} $*"
}

success() {
    echo -e "  ${GREEN}✔${RESET} $*"
}

warning() {
    echo -e "  ${YELLOW}!${RESET} $*"
}

failure() {
    echo -e "  ${RED}✖${RESET} $*" >&2
}

line() {
    echo -e "${GRAY}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}

# ================================================================
# PROGRESS ENGINE
# ================================================================

progress() {
    local percent="$1"
    local message="$2"
    local width=35

    local filled=$((percent * width / 100))
    local empty=$((width - filled))

    local left right

    printf -v left '%*s' "$filled" ''
    printf -v right '%*s' "$empty" ''

    left="${left// /█}"
    right="${right// /░}"

    echo ""
    echo -e "  ${CYAN}[${left}${right}]${RESET} ${WHITE}${BOLD}${percent}%${RESET}"
    echo -e "  ${PURPLE}${message}${RESET}"
    echo ""
}

# ================================================================
# ANIMATED TASK ENGINE
# ================================================================

run_task() {
    local name="$1"
    shift

    local pid
    local spin=0

    local frames=(
        "⠋" "⠙" "⠹" "⠸" "⠼"
        "⠴" "⠦" "⠧" "⠇" "⠏"
    )

    info "$name"

    "$@" >> "$LOG_FILE" 2>&1 &
    pid=$!

    if [[ -t 1 ]]; then
        while kill -0 "$pid" 2>/dev/null; do
            printf "\r  ${CYAN}%s${RESET} ${WHITE}Working...${RESET} " \
                "${frames[$((spin % 10))]}"

            spin=$((spin + 1))
            sleep 0.12
        done
    fi

    local status=0
    wait "$pid" || status=$?

    if (( status == 0 )); then
        printf "\r\033[K"
        success "$name completed."
    else
        printf "\r\033[K"
        failure "$name failed (exit code $status)."
        echo ""
        echo -e "${YELLOW}Recent installer logs:${RESET}"
        tail -n 35 "$LOG_FILE" || true
        return "$status"
    fi
}

# ================================================================
# CLEANUP
# ================================================================

cleanup() {
    if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
        rm -rf -- "$TEMP_DIR"
    fi
}

trap cleanup EXIT

trap 'failure "Installation interrupted."; exit 130' INT TERM

# ================================================================
# INITIALIZATION
# ================================================================

banner

[[ "$EUID" -eq 0 ]] ||
    {
        failure "Root privileges required."
        echo "Run: sudo -i"
        exit 1
    }

command -v apt-get >/dev/null 2>&1 ||
    {
        failure "Debian/Ubuntu is required."
        exit 1
    }

DIR="$(realpath -m -- "$DIR")"

# Prevent dangerous deletion targets.
case "$DIR" in
    /|/root|/home|/home/*|/opt|/var|/var/*|/usr|/usr/*|/etc|/etc/*|/tmp|/tmp/*|/boot|/boot/*|/dev|/dev/*|/proc|/proc/*|/sys|/sys/*)
        failure "Unsafe deployment directory: $DIR"
        exit 1
        ;;
esac

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

# Save complete terminal output.
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${CYAN}  DEPLOYMENT CONFIGURATION${RESET}"
line
echo "  Repository : $REPO"
echo "  Branch     : $BRANCH"
echo "  Directory  : $DIR"
echo "  Port       : $PORT"
echo "  Log        : $LOG_FILE"
line

# ================================================================
# CONFIRMATION
# ================================================================

echo ""
echo -e "${YELLOW}${BOLD}  WARNING: FRESH DEPLOYMENT${RESET}"
echo ""
echo "  This installer will:"
echo "  1. Install system dependencies."
echo "  2. Stop the previous AORTIC EDU server."
echo "  3. Terminate processes using port $PORT."
echo "  4. Replace the deployment directory."
echo "  5. Clone a fresh GitHub repository."
echo "  6. Build and start the application."
echo "  7. Restart Cloudflare if configured."
echo ""
echo -e "${GRAY}  Existing .env will be backed up and restored.${RESET}"
echo -e "${GRAY}  Other old project files will be deleted.${RESET}"
echo ""

if [[ "${CONFIRM_INSTALL:-0}" != "1" ]]; then
    if [[ ! -t 0 ]]; then
        failure "Interactive confirmation required."
        echo "Run with CONFIRM_INSTALL=1 to explicitly approve."
        exit 1
    fi

    read -r -p "  Type INSTALL to continue: " ANSWER

    [[ "$ANSWER" == "INSTALL" ]] || {
        warning "Installation cancelled."
        exit 0
    }
fi

# ================================================================
# PHASE 01 — SYSTEM PREPARATION
# ================================================================

progress 3 "PHASE 01 / SYSTEM INITIALIZATION"

run_task "Updating package repositories" \
    apt-get update -qq ||
    exit 1

run_task "Installing system utilities" \
    env DEBIAN_FRONTEND=noninteractive apt-get install -y \
    git curl ca-certificates gnupg psmisc procps coreutils ||
    exit 1

success "System dependencies ready."

# ================================================================
# PHASE 02 — NODE.JS ENVIRONMENT
# ================================================================

progress 13 "PHASE 02 / NODE.JS RUNTIME"

NODE_MAJOR=0

if command -v node >/dev/null 2>&1; then
    NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
fi

if (( NODE_MAJOR < 20 )); then

    warning "Node.js 20+ not detected."

    run_task "Configuring NodeSource repository" \
        bash -c 'set -euo pipefail; curl -fsSL https://deb.nodesource.com/setup_20.x | bash -' ||
        exit 1

    run_task "Installing Node.js and NPM" \
        env DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs ||
        exit 1

else
    success "Compatible Node.js runtime detected."
fi

command -v node >/dev/null ||
    {
        failure "Node.js installation failed."
        exit 1
    }

command -v npm >/dev/null ||
    {
        failure "NPM installation failed."
        exit 1
    }

NODE_VERSION="$(node --version)"
NPM_VERSION="$(npm --version)"

success "Node.js: $NODE_VERSION"
success "NPM: $NPM_VERSION"

progress 23 "PHASE 02 / RUNTIME READY"

# ================================================================
# PHASE 03 — EXISTING INSTALLATION
# ================================================================

progress 29 "PHASE 03 / EXISTING INSTALLATION CHECK"

TEMP_DIR="$(mktemp -d /tmp/aortic-edu-setup.XXXXXX)"

# Preserve .env before deleting the previous installation.
if [[ -f "$DIR/.env" ]]; then
    cp -p "$DIR/.env" "$TEMP_DIR/.env"
    success "Existing .env backed up."
else
    warning "No existing .env found."
fi

if [[ -f "$DIR/run.sh" ]]; then

    info "Stopping existing AORTIC EDU installation..."

    if (
        cd "$DIR"
        bash run.sh stop
    ); then
        success "Previous application stopped."
    else
        warning "Previous application may already be stopped."
    fi

else
    info "No previous run.sh found."
fi

# ================================================================
# PHASE 04 — PORT CLEANUP
# ================================================================

progress 37 "PHASE 04 / NETWORK PORT CLEANUP"

if command -v fuser >/dev/null 2>&1; then

    if fuser -n tcp "$PORT" >/dev/null 2>&1; then

        warning "Port $PORT is occupied."

        fuser -v -n tcp "$PORT" 2>&1 || true

        info "Terminating port $PORT listeners..."

        fuser -k -TERM -n tcp "$PORT" || true

        for ((i=1; i<=30; i++)); do
            fuser -n tcp "$PORT" >/dev/null 2>&1 || break
            sleep 0.2
        done

        if fuser -n tcp "$PORT" >/dev/null 2>&1; then
            fuser -k -KILL -n tcp "$PORT" || true
        fi

    fi

else
    failure "fuser is unavailable."
    exit 1
fi

if fuser -n tcp "$PORT" >/dev/null 2>&1; then
    failure "Port $PORT is still occupied."
    exit 1
fi

success "Port $PORT is completely free."

progress 44 "PHASE 04 / PORT READY"

# ================================================================
# PHASE 05 — OLD DEPLOYMENT CLEANUP
# ================================================================

progress 50 "PHASE 05 / CLEANING PREVIOUS DEPLOYMENT"

if [[ -e "$DIR" || -L "$DIR" ]]; then

    info "Removing old project directory..."

    rm -rf -- "$DIR"

    [[ ! -e "$DIR" && ! -L "$DIR" ]] ||
        {
            failure "Could not remove old deployment."
            exit 1
        }

    success "Old deployment removed."

else
    success "No previous deployment to remove."
fi

mkdir -p "$(dirname "$DIR")"

# ================================================================
# PHASE 06 — GITHUB DEPLOYMENT
# ================================================================

progress 57 "PHASE 06 / GITHUB SOURCE DEPLOYMENT"

run_task "Cloning AORTIC EDU repository" \
    git clone --depth 1 --branch "$BRANCH" "$REPO" "$DIR" ||
    exit 1

cd "$DIR"

[[ -f "$DIR/run.sh" ]] ||
    {
        failure "Repository does not contain run.sh."
        exit 1
    }

[[ -f "$DIR/package.json" ]] ||
    {
        failure "package.json not found."
        exit 1
    }

chmod +x "$DIR"/*.sh

success "GitHub repository downloaded."

# ================================================================
# PHASE 07 — RESTORE CONFIGURATION
# ================================================================

progress 64 "PHASE 07 / CONFIGURATION RESTORATION"

if [[ -f "$TEMP_DIR/.env" ]]; then

    cp -p "$TEMP_DIR/.env" "$DIR/.env"

    success "Previous .env restored."

else
    warning "Using repository/default environment configuration."
fi

# ================================================================
# PHASE 08 — APPLICATION BUILD
# ================================================================

progress 72 "PHASE 08 / PRODUCTION BUILD"

info "Launching original AORTIC EDU run.sh..."

# The original run.sh handles:
# - npm dependency installation
# - Production build
# - Background startup
# - PID file
# - Log file
# - Startup port check

run_task "Installing dependencies and building application" \
    bash -c 'cd "$1" && bash run.sh' _ "$DIR" ||
    exit 1

success "Original run.sh completed."

# ================================================================
# PHASE 09 — APPLICATION HEALTH CHECK
# ================================================================

progress 87 "PHASE 09 / SERVER HEALTH VERIFICATION"

APP_PORT="$PORT"

# Read the configured PORT using the same shell environment style.
if [[ -f "$DIR/.env" ]]; then
    APP_PORT="$(
        bash -c '
            set -a
            source "$1"
            printf "%s" "${PORT:-8080}"
        ' _ "$DIR/.env"
    )" || exit 1
fi

[[ "$APP_PORT" =~ ^[0-9]+$ ]] ||
    {
        failure "Invalid application port."
        exit 1
    }

HEALTHY=0

for ((i=1; i<=30; i++)); do

    if curl -sS \
        --connect-timeout 2 \
        --max-time 3 \
        -o /dev/null \
        "http://127.0.0.1:${APP_PORT}"; then

        HEALTHY=1
        break
    fi

    sleep 1
done

[[ "$HEALTHY" -eq 1 ]] ||
    {
        failure "Application HTTP health check failed."
        echo ""
        tail -n 40 "$DIR/.run.log" 2>/dev/null || true
        exit 1
    }

success "AORTIC EDU is responding successfully."

# ================================================================
# PHASE 10 — CLOUDFLARE INTEGRATION
# ================================================================

progress 93 "PHASE 10 / CLOUDFLARE INTEGRATION"

if command -v systemctl >/dev/null 2>&1 &&
   systemctl cat cloudflared.service >/dev/null 2>&1; then

    info "Restarting Cloudflare Tunnel..."

    if systemctl restart cloudflared.service; then

        if systemctl is-active --quiet cloudflared.service; then
            success "Cloudflare Tunnel is active."
        else
            warning "Cloudflare restart attempted, but service is not active."
        fi

    else
        warning "Cloudflare restart failed."
    fi

else
    warning "Cloudflare systemd service not detected."
    warning "Application remains accessible locally."
fi

# ================================================================
# PHASE 11 — FINAL CLEANUP
# ================================================================

progress 97 "PHASE 11 / FINAL CLEANUP"

cleanup
TEMP_DIR=""

success "Temporary installation files removed."

# ================================================================
# FINAL DEPLOYMENT REPORT
# ================================================================

progress 100 "ALL DEPLOYMENT PHASES COMPLETED"

banner

echo -e "${GREEN}${BOLD}"
cat <<'EOF'
       ╔════════════════════════════════════════════╗
       ║                                            ║
       ║          DEPLOYMENT SUCCESSFUL             ║
       ║                                            ║
       ╚════════════════════════════════════════════╝
EOF
echo -e "${RESET}"

echo -e "${CYAN}${BOLD}  APPLICATION INFORMATION${RESET}"
line

echo -e "  Application : ${WHITE}AORTIC EDU${RESET}"
echo -e "  Status      : ${GREEN}ONLINE${RESET}"
echo -e "  Runtime     : ${WHITE}$NODE_VERSION${RESET}"
echo -e "  NPM         : ${WHITE}$NPM_VERSION${RESET}"
echo -e "  Port        : ${WHITE}$APP_PORT${RESET}"
echo -e "  Directory   : ${WHITE}$DIR${RESET}"

echo ""
echo -e "${CYAN}${BOLD}  ACCESS INFORMATION${RESET}"
line

echo -e "  Local URL : ${CYAN}http://localhost:${APP_PORT}${RESET}"

SERVER_IP=""

if command -v ip >/dev/null 2>&1; then
    SERVER_IP="$(
        ip route 2>/dev/null |
        awk '/default/ {for(i=1;i<=NF;i++) if($i=="src") {print $(i+1); exit}}'
    )"
fi

if [[ -z "$SERVER_IP" ]]; then
    SERVER_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
fi

if [[ -n "$SERVER_IP" ]]; then
    echo -e "  Network URL : ${CYAN}http://${SERVER_IP}:${APP_PORT}${RESET}"
fi

echo ""
echo -e "${PURPLE}${BOLD}  MANAGEMENT COMMANDS${RESET}"
line

echo "  Start   : cd $DIR && bash run.sh start"
echo "  Stop    : cd $DIR && bash run.sh stop"
echo "  Restart : cd $DIR && bash run.sh restart"
echo "  Logs    : tail -f $DIR/.run.log"
echo "  Delete  : cd $DIR && bash delete.sh"
echo "  Update  : cd $DIR && bash update.sh"

echo ""
echo -e "${PURPLE}${BOLD}  INSTALLATION LOGS${RESET}"
line

echo "  $LOG_FILE"

echo ""
echo -e "${GREEN}${BOLD}"
echo "          AORTIC EDU IS READY!"
echo -e "${RESET}"
echo ""
