#!/bin/bash
# Generates an SSH key for GitHub Actions auto-deploy.
# Run ONCE on your EC2 instance.
# Usage: bash scripts/setup-github-deploy-key.sh

KEY_FILE="$HOME/.ssh/github_actions_deploy"

echo "======================================================"
echo "  GitHub Actions Deploy Key Setup"
echo "======================================================"
echo ""

# Generate key (no passphrase — needed for automated deploy)
ssh-keygen -t ed25519 -C "github-actions-deploy@cloths-by-asf" -f "$KEY_FILE" -N ""

# Add public key to authorized_keys
cat "$KEY_FILE.pub" >> "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"

echo ""
echo "======================================================"
echo "  Done! Now add these 3 secrets to GitHub:"
echo "  Repo → Settings → Secrets → Actions → New secret"
echo "======================================================"
echo ""
echo "  Secret name : EC2_HOST"
echo "  Secret value: 51.20.91.11"
echo ""
echo "  Secret name : EC2_USER"
echo "  Secret value: ubuntu"
echo ""
echo "  Secret name : EC2_SSH_KEY"
echo "  Secret value: (copy everything below including BEGIN/END lines)"
echo ""
echo "──────────────────────────────────────────────────────"
cat "$KEY_FILE"
echo "──────────────────────────────────────────────────────"
echo ""
echo "  After adding secrets, every 'git push origin main'"
echo "  will auto-deploy to this EC2 server."
echo ""
