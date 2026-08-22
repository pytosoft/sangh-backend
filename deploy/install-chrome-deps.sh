#!/usr/bin/env bash
set -u
export DEBIAN_FRONTEND=noninteractive

sudo apt-get update

packages=(
  ca-certificates
  fonts-liberation
  libasound2t64
  libasound2
  libatk-bridge2.0-0t64
  libatk-bridge2.0-0
  libatk1.0-0t64
  libatk1.0-0
  libcups2t64
  libcups2
  libdrm2
  libgbm1
  libgtk-3-0t64
  libgtk-3-0
  libnspr4
  libnss3
  libpango-1.0-0
  libpangocairo-1.0-0
  libx11-6
  libx11-xcb1
  libxcb1
  libxcomposite1
  libxdamage1
  libxfixes3
  libxkbcommon0
  libxrandr2
  libxss1
  libxtst6
  wget
  xdg-utils
)

for pkg in "${packages[@]}"; do
  sudo apt-get install -y "$pkg" && echo "installed $pkg" || echo "skip $pkg"
done

chrome="/var/www/backend/node_modules/puppeteer/.local-chromium/linux-901912/chrome-linux/chrome"
if [ -x "$chrome" ]; then
  echo "Missing libs:"
  ldd "$chrome" | grep "not found" || echo "none"
fi
