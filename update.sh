
#!/usr/bin/env bash

R='\033[0m'
C='\033[38;5;51m'
P='\033[38;5;141m'
Y='\033[38;5;220m'

clear 2>/dev/null || true

echo -e "${C}"
echo "=============================================="
echo "          AORTIC EDU UPDATE MANAGER"
echo "=============================================="
echo -e "${R}"

echo -e "${P}  Update system${R}"
echo ""
echo -e "${Y}  No update available right now.${R}"
echo "  Update functionality is currently disabled."
echo ""
echo -e "${C}==============================================${R}"
echo ""
