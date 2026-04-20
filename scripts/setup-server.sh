#!/bin/bash
# One-time setup for a fresh Ubuntu EC2 instance (eu-north-1).
# Run as: bash scripts/setup-server.sh
set -e

EC2_USER="${USER:-ubuntu}"
APP_DIR="/home/$EC2_USER/Cloths-by-ASF"
WEB_ROOT="/var/www/cloths-by-asf"
 
echo "==> Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

echo "==> Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$EC2_USER"

echo "==> Installing Nginx..."
sudo apt-get install -y nginx

echo "==> Installing Certbot (Let's Encrypt SSL)..."
sudo apt-get install -y certbot python3-certbot-nginx

echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Installing Git..."
sudo apt-get install -y git

echo "==> Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status

echo "==> Creating web root directories..."
sudo mkdir -p "$WEB_ROOT/dist"
sudo mkdir -p "$WEB_ROOT/staticfiles"
sudo mkdir -p "$WEB_ROOT/media"
sudo chown -R "$EC2_USER:$EC2_USER" "$WEB_ROOT"

echo ""
echo "======================================================"
echo "  Setup complete!"
echo "======================================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "  1. Log out and back in so Docker group takes effect."
echo ""
echo "  2. Clone your repo:"
echo "       git clone https://github.com/AliRazaDeveloper75/Cloths-by-ASF.git $APP_DIR"
echo ""
echo "  3. Create production .env:"
echo "       cp $APP_DIR/.env.production.example $APP_DIR/backend/.env"
echo "       nano $APP_DIR/backend/.env   # fill in real values"
echo ""
echo "  4. Install Nginx config:"
echo "       sudo cp $APP_DIR/nginx/cloths-by-asf.conf /etc/nginx/sites-available/cloths-by-asf"
echo "       sudo ln -s /etc/nginx/sites-available/cloths-by-asf /etc/nginx/sites-enabled/"
echo "       sudo rm -f /etc/nginx/sites-enabled/default"
echo "       sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  5. Deploy:"
echo "       bash $APP_DIR/scripts/deploy.sh"
echo ""
echo "  6. (Optional) Enable HTTPS after pointing your domain to this IP:"
echo "       sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "       # Then set SECURE_SSL_REDIRECT=True in backend/.env and redeploy"
echo ""
