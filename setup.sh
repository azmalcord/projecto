
#!/usr/bin/env bash
set -Eeuo pipefail

# ==========================================================
# AORTIC EDU - AUTOMATED CLEAN INSTALLER
# ==========================================================

REPO="https://github.com/azmalcord/projecto"
PROJECT_DIR="${PROJECT_DIR:-$PWD/projecto}"
PORT="8080"

# AORTIC EDU Banner
banner() {
    clear 2>/dev/null || true
    echo ""
    echo "  █████╗  ██████╗ ██████╗ ████████╗██╗ ██████╗"
    echo " ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██║██╔════╝"
    echo " ███████║██║   ██║██████╔╝   ██║   ██║██║"
    echo " ██╔══██║██║   ██║██╔══██╗   ██║   ██║██║"
    echo " ██║  ██║╚██████╔╝██║  ██║   ██║   ██║╚██████╗"
    echo " ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝"
    echo ""
    echo "             AORTIC EDU DEPLOYMENT"
    echo "======================================================"
    echo ""
}

log() {
    echo -e "\n[ AORTIC EDU ] $*"
}

fail() {
    echo -e "\n[ ERROR ] $*" >&2
    exit 1
}

# ==========================================================
# ROOT / DEPENDENCY CHECK
# ==========================================================

banner

command -v git >/dev/null 2>&1 || fail "Git is not installed."
command -v node >/dev/null 2>&1 || fail "Node.js is not installed."
command -v npm >/dev/null 2>&1 || fail "NPM is not installed."

[[ "$(node -p 'Number(process.versions.node.split(".")[0])')" -ge 18 ]] \
    || fail "Node.js 18 or newer is required."

# Prevent accidental deletion of important directories.
PROJECT_DIR="$(realpath -m "$PROJECT_DIR")"

[[ "$PROJECT_DIR" != "/" ]] || fail "Invalid project directory."
[[ "$PROJECT_DIR" != "$HOME" ]] || fail "Project directory cannot be HOME."

# ==========================================================
# STEP 1 - STOP OLD SERVER
# ==========================================================

log "Stopping previous AORTIC EDU installation..."

if [[ -d "$PROJECT_DIR" && -f "$PROJECT_DIR/run.sh" ]]; then
    (
        cd "$PROJECT_DIR"
        bash run.sh stop || true
    )
fi

# ==========================================================
# STEP 2 - FREE PORT 8080
# ==========================================================

log "Cleaning port $PORT..."

if command -v fuser >/dev/null 2>&1; then
    if fuser -n tcp "$PORT" >/dev/null 2>&1; then
        if [[ "$EUID" -eq 0 ]]; then
            fuser -k -TERM "$PORT"/tcp || true
        elif command -v sudo >/dev/null 2>&1; then
            sudo fuser -k -TERM "$PORT"/tcp || true
        else
            fail "Cannot stop port $PORT processes. Run with sudo."
        fi

        sleep 3

        if fuser -n tcp "$PORT" >/dev/null 2>&1; then
            if [[ "$EUID" -eq 0 ]]; then
                fuser -k -KILL "$PORT"/tcp || true
            else
                sudo fuser -k -KILL "$PORT"/tcp || true
            fi
        fi
    fi
else
    fail "fuser is missing. Install it using: apt install psmisc"
fi

log "Port $PORT cleanup completed."

# ==========================================================
# STEP 3 - REMOVE OLD PROJECT
# ==========================================================

log "Removing previous project files..."

if [[ -e "$PROJECT_DIR" ]]; then
    rm -rf -- "$PROJECT_DIR"
fi

# ==========================================================
# STEP 4 - CLONE REPOSITORY
# ==========================================================

log "Cloning AORTIC EDU repository..."

git clone --depth 1 "$REPO" "$PROJECT_DIR" \
    || fail "Git clone failed."

cd "$PROJECT_DIR"

[[ -f run.sh ]] || fail "run.sh not found in repository."

chmod +x run.sh

# ==========================================================
# STEP 5 - START APPLICATION
# ==========================================================

log "Launching AORTIC EDU..."

bash run.sh \
    || fail "AORTIC EDU failed to start."

# ==========================================================
# STEP 6 - RESTART CLOUDFLARED
# ==========================================================

log "Restarting Cloudflare Tunnel..."

if command -v systemctl >/dev/null 2>&1; then
    if systemctl list-unit-files cloudflared.service \
        --no-legend 2>/dev/null | grep -q cloudflared; then

        if [[ "$EUID" -eq 0 ]]; then
            systemctl restart cloudflared
        elif command -v sudo >/dev/null 2>&1; then
            sudo systemctl restart cloudflared
        else
            log "WARNING: Run sudo systemctl restart cloudflared manually."
        fi
    else
        log "WARNING: cloudflared.service not found."
    fi
else
    log "WARNING: systemctl unavailable. Restart Cloudflare manually."
fi

# ==========================================================
# STEP 7 - FINAL STATUS
# ==========================================================

banner

echo "  DEPLOYMENT COMPLETED"
echo ""
echo "  Repository : $REPO"
echo "  Directory  : $PROJECT_DIR"
echo "  Port       : $PORT"
echo "  Local URL  : http://localhost:$PORT"
echo ""
echo "  Logs:"
echo "  cd \"$PROJECT_DIR\" && tail -f .run.log"
echo ""
echo "  Stop:"
echo "  cd \"$PROJECT_DIR\" && bash run.sh stop"
echo ""
echo "======================================================"
echo "          AORTIC EDU IS READY!"
echo "======================================================"
