
#!/usr/bin/env bash
# ============================================================
# AORTIC EDU — COMPLETE UNINSTALLER
# ============================================================

set -Eeuo pipefail

DIR="${PROJECT_DIR:-/opt/aortic-edu}"
PORT=8080

RESET='\033[0m'
BOLD='\033[1m'
CYAN='\033[38;5;51m'
PURPLE='\033[38;5;141m'
GREEN='\033[38;5;82m'
RED='\033[38;5;196m'
YELLOW='\033[38;5;220m'
GRAY='\033[38;5;245m'

if [[ ! -t 1 ]]; then
    RESET='' BOLD='' CYAN='' PURPLE=''
    GREEN='' RED='' YELLOW='' GRAY=''
fi

# ------------------------------------------------------------
# BANNER
# ------------------------------------------------------------

banner() {
    clear 2>/dev/null || true

    echo -e "${RED}${BOLD}"
    cat <<'EOF'
       █████╗  ██████╗ ████████╗██╗ ██████╗
      ██╔══██╗██╔═══██╗╚══██╔══╝██║██╔════╝
      ███████║██║   ██║   ██║   ██║██║
      ██╔══██║██║   ██║   ██║   ██║██║
      ██║  ██║╚██████╔╝   ██║   ██║╚██████╗
EOF
    echo -e "${RESET}"
    echo -e "${RED}${BOLD}             AORTIC EDU UNINSTALLER${RESET}"
    echo -e "${GRAY}       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
}

info() {
    echo -e " ${CYAN}➜${RESET} $*"
}

success() {
    echo -e " ${GREEN}✔${RESET} $*"
}

warning() {
    echo -e " ${YELLOW}!${RESET} $*"
}

fail() {
    echo -e "\n ${RED}✖ ERROR: $*${RESET}" >&2
    exit 1
}

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

    echo ""
    echo -e " ${CYAN}[${left}${right}]${RESET} ${BOLD}${percent}%${RESET}"
    echo -e " ${PURPLE}${message}${RESET}"
    echo ""
}

# ------------------------------------------------------------
# ROOT CHECK
# ------------------------------------------------------------

[[ "$EUID" -eq 0 ]] || fail "Please run this script as root."

DIR="$(realpath -m "$DIR")"

# Safety protection
case "$DIR" in
    /|/root|/home|/opt|/var|/usr|/etc|/tmp|/boot|/dev|/proc|/sys)
        fail "Unsafe deletion directory: $DIR"
        ;;
esac

# ------------------------------------------------------------
# START
# ------------------------------------------------------------

banner

echo -e "${RED}${BOLD} WARNING: PERMANENT DELETION${RESET}"
echo ""
echo " The following directory will be deleted:"
echo ""
echo -e " ${YELLOW}$DIR${RESET}"
echo ""
echo " This includes:"
echo "  - Application source files"
echo "  - .env configuration"
echo "  - node_modules"
echo "  - .next production build"
echo "  - .run.pid and .run.log"
echo ""
echo " Port $PORT will also be checked."
echo ""
echo -e "${GRAY}Node.js, npm, Git and Cloudflare will be preserved.${RESET}"
echo ""

read -r -p "Type DELETE to continue: " CONFIRM

if [[ "$CONFIRM" != "DELETE" ]]; then
    warning "Deletion cancelled."
    exit 0
fi

echo ""

# ------------------------------------------------------------
# 01. STOP SERVER
# ------------------------------------------------------------

progress 15 "PHASE 01 / STOPPING APPLICATION"

if [[ -f "$DIR/run.sh" ]]; then
    info "Stopping AORTIC EDU..."

    (
        cd "$DIR"
        bash run.sh stop
    ) || warning "Could not stop through run.sh."
else
    warning "run.sh not found."
fi

# ------------------------------------------------------------
# 02. CLEAN PORT
# ------------------------------------------------------------

progress 35 "PHASE 02 / PORT CLEANUP"

if command -v fuser >/dev/null 2>&1; then

    if fuser -n tcp "$PORT" >/dev/null 2>&1; then

        info "Terminating processes listening on port $PORT..."

        fuser -k -TERM -n tcp "$PORT" || true

        for ((i=0; i<25; i++)); do
            fuser -n tcp "$PORT" >/dev/null 2>&1 || break
            sleep 0.2
        done

        if fuser -n tcp "$PORT" >/dev/null 2>&1; then
            fuser -k -KILL -n tcp "$PORT" || true
        fi

        success "Port cleanup completed."

    else
        success "Port $PORT is already free."
    fi
else
    warning "fuser unavailable; skipping port cleanup."
fi

# ------------------------------------------------------------
# 03. DELETE PROJECT
# ------------------------------------------------------------

progress 60 "PHASE 03 / REMOVING PROJECT FILES"

if [[ -e "$DIR" || -L "$DIR" ]]; then

    info "Deleting application directory..."

    rm -rf -- "$DIR"

    [[ ! -e "$DIR" && ! -L "$DIR" ]] ||
        fail "Could not completely remove project directory."

    success "Application directory deleted."

else
    warning "Project directory does not exist."
fi

# ------------------------------------------------------------
# 04. REMOVE INSTALLER LOGS
# ------------------------------------------------------------

progress 80 "PHASE 04 / CLEANING INSTALLER DATA"

if [[ -d /var/log/aortic-edu ]]; then
    rm -rf -- /var/log/aortic-edu
    success "Installer logs deleted."
fi

if [[ -f /var/log/aortic-edu-setup.log ]]; then
    rm -f /var/log/aortic-edu-setup.log
    success "Setup log deleted."
fi

# ------------------------------------------------------------
# 05. FINAL VERIFICATION
# ------------------------------------------------------------

progress 100 "PHASE 05 / DELETION COMPLETED"

banner

echo -e "${GREEN}${BOLD}"
echo "  ╔════════════════════════════════════════╗"
echo "  ║        AORTIC EDU REMOVED              ║"
echo "  ╚════════════════════════════════════════╝"
echo -e "${RESET}"

echo ""
echo -e "${GREEN} ✔ Application files removed${RESET}"
echo -e "${GREEN} ✔ Project configuration removed${RESET}"
echo -e "${GREEN} ✔ Build files removed${RESET}"
echo -e "${GREEN} ✔ Project logs removed${RESET}"
echo ""
echo -e "${YELLOW} Preserved:${RESET}"
echo "  - Node.js and npm"
echo "  - Git"
echo "  - Cloudflare Tunnel configuration"
echo "  - Other system files"
echo ""
echo -e "${PURPLE}${BOLD}       UNINSTALLATION SUCCESSFUL${RESET}"
echo ""
