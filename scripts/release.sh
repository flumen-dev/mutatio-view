#!/usr/bin/env bash
set -euo pipefail

PKG="packages/mutatio-view/package.json"
CURRENT=$(node -p "require('./$PKG').version")

echo "Current version: $CURRENT"
echo ""
echo "Select bump type:"
echo "  1) patch  (bug fixes)"
echo "  2) minor  (new features)"
echo "  3) major  (breaking changes)"
echo "  4) custom"
echo ""
read -rp "Choice [1-4]: " choice

case $choice in
  1) BUMP="patch" ;;
  2) BUMP="minor" ;;
  3) BUMP="major" ;;
  4) read -rp "Enter version (e.g. 0.2.0-beta.1): " CUSTOM ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

if [ -n "${CUSTOM:-}" ]; then
  NEW="$CUSTOM"
else
  IFS='.' read -r MAJ MIN PAT <<< "${CURRENT%%-*}"
  case $BUMP in
    patch) NEW="$MAJ.$MIN.$((PAT + 1))" ;;
    minor) NEW="$MAJ.$((MIN + 1)).0" ;;
    major) NEW="$((MAJ + 1)).0.0" ;;
  esac
fi

echo ""
echo "$CURRENT → $NEW"
read -rp "Confirm? [y/N] " confirm
[[ "$confirm" =~ ^[yY]$ ]] || { echo "Aborted."; exit 0; }

# Update version in package.json
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('$PKG', 'utf8'));
  pkg.version = '$NEW';
  fs.writeFileSync('$PKG', JSON.stringify(pkg, null, 2) + '\n');
"

git add "$PKG"
git commit -m "release: v$NEW"
git tag "v$NEW"
git push origin HEAD
git push origin "v$NEW"

echo ""
echo "Released v$NEW — GitHub Actions will publish to npm."
