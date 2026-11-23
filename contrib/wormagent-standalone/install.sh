#!/bin/bash
# WormAgent Installer - https://WormAgent.net/install
# Rebranded from wormagent.net

set -e

WORMAGENT_VERSION="1.19.6"
WORMAGENT_SITE="https://WormAgent.net"
WORMAGENT_INSTALL_URL="https://wormagent.net/install"

echo ""
echo "  ██╗    ██╗ ██████╗ ██████╗ ███╗   ███╗ █████╗  ██████╗ ███████╗███╗   ██╗████████╗"
echo "  ██║    ██║██╔═══██╗██╔══██╗████╗ ████║██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝"
echo "  ██║ █╗ ██║██║   ██║██████╔╝██╔████╔██║███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   "
echo "  ██║███╗██║██║   ██║██╔══██╗██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   "
echo "  ╚███╔███╔╝╚██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   "
echo "   ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   "
echo ""
echo "  WormAgent.net - Installing WormAgent v$WORMAGENT_VERSION"
echo "  Site: $WORMAGENT_SITE"
echo ""

# 1. تثبيت wormagent الأصلي
echo "→ Downloading core from wormagent.net..."
curl -fsSL $WORMAGENT_INSTALL_URL | bash

# 2. إعادة التسمية
echo "→ Rebranding to WormAgent..."
mkdir -p "$HOME/.wormagent/bin"
cp "$HOME/.wormagent/bin/wormagent" "$HOME/.wormagent/bin/WormAgent" 2>/dev/null || true
cp "$HOME/.wormagent/bin/wormagent" "$HOME/.wormagent/bin/wormagent" 2>/dev/null || true

# 3. إنشاء wrapper
mkdir -p "$HOME/WormAgent/bin"
cat > "$HOME/WormAgent/bin/WormAgent" <<'WRAPPER'
#!/bin/bash
export WORMAGENT_SITE="https://WormAgent.net"
exec "$HOME/.wormagent/bin/wormagent" "$@"
WRAPPER
chmod +x "$HOME/WormAgent/bin/WormAgent"
cp "$HOME/WormAgent/bin/WormAgent" "$HOME/WormAgent/bin/wormagent" 2>/dev/null || true

# 4. إضافة للـ PATH
if ! grep -q "WormAgent" "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH=$HOME/.wormagent/bin:$HOME/WormAgent/bin:$PATH  # WormAgent.net' >> "$HOME/.bashrc"
fi
if ! grep -q "WormAgent" "$HOME/.profile" 2>/dev/null; then
  echo 'export PATH=$HOME/.wormagent/bin:$HOME/WormAgent/bin:$PATH  # WormAgent.net' >> "$HOME/.profile"
fi

echo ""
echo "✅ WormAgent installed successfully!"
echo "   Run: WormAgent --version"
echo "   Run: WormAgent --help"
echo "   Site: https://WormAgent.net"
echo ""
