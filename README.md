
# 🧾 ExpenseTrackr — Node.js Expense Tracker (Express + SQLite + EJS)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Lightblue)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Nginx](https://img.shields.io/badge/Reverse%20Proxy-Nginx-orange)](https://nginx.org/)

> A lightweight expense tracker app built using **Node.js**, **Express**, and **SQLite**, with **EJS** templating — production-ready for Nginx deployment.

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Setup Environment](#-1-setup-environment)
- [Clone the Repository](#-2-clone-the-repository)
- [Project Structure](#-3-project-structure)
- [Install Dependencies](#-4-install-dependencies)
- [Build the Project](#-5-build-the-project)
- [Configure Nginx](#-6-configure-nginx)
- [Deploy the App](#-7-deploy-the-app)
- [Check Logs](#-8-check-logs)
- [Redeploy After Changes](#-9-redeploy-after-changes)
- [Database Permissions](#-10-database-permissions)
- [Auto Start on Reboot](#-11-auto-start-on-reboot)
- [Common Issues](#-12-common-issues)
- [Author](#-author)

---

## 🌍 Overview

**ExpenseTrackr** helps you manage your expenses, visualize your spending, and track your financial habits.  
It’s server-rendered using **EJS**, and uses a **SQLite database** — no external DB setup needed!

It’s production-ready and runs **behind Nginx on port 80**.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | EJS (templating), HTML, CSS |
| Backend | Node.js + Express |
| Database | SQLite |
| Reverse Proxy | Nginx |
| OS Tested | Ubuntu 22.04 LTS |

---

## ✨ Features

✅ User Authentication (Signup & Login)  
✅ Add, Edit, and Delete Expenses  
✅ View Total Spending Summary  
✅ EJS-based UI Templates  
✅ SQLite Local Database  
✅ Ready-to-Deploy Build System  
✅ Nginx Reverse Proxy Integration  

---

## 🧑‍💻 1. Setup Environment

Install dependencies:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx unzip wget
````

Check versions:

```bash
node -v
npm -v
nginx -v
```

> ✅ Node.js must be **v18+**

---

## 📦 2. Clone the Repository

```bash
cd ~
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
```

> Replace `<your-username>` with your GitHub username or repo URL.

---

## 🧱 3. Project Structure

```
expense-tracker/
├── config/              # App configurations
├── db/                  # SQLite database
├── public/              # CSS, JS, static assets
├── routes/              # Express route handlers
├── services/            # Business logic
├── views/               # EJS templates
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── deploy.sh            # Automated build + deploy script
```

---

## ⚙️ 4. Install Dependencies

```bash
npm install
```

---

## 🏗️ 5. Build the Project

Build the app and prepare the `dist/` folder:

```bash
npm run build
```

✅ This will copy necessary files and install production dependencies.

---

## 🌐 6. Configure Nginx

Create a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/expense-tracker
```

Paste the following:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    access_log /var/log/nginx/expense-access.log;
    error_log /var/log/nginx/expense-error.log;
}
```

Enable the configuration:

```bash
sudo ln -sf /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
sudo systemctl status nginx
```

---

## 🚀 7. Deploy the App (Single Command)

Ensure the script is executable:

```bash
chmod +x deploy.sh
```

Deploy the app:

```bash
./deploy.sh
```

### ✅ Output Example

```
🚀 Building expense-tracker...
📦 Deploying build to /var/www/html...
🔐 Fixing database permissions...
🧹 Stopping any existing Node.js app...
⚙️ Starting Node.js app on port 3000...
🌐 Reloading Nginx...

✅ Deployment complete!
🌍 App is live at: http://<your-server-ip>
📜 Logs: /home/ubuntu/expense-tracker/expense-tracker.log
```

---

## 🪵 8. Check Logs

```bash
tail -f ~/expense-tracker/expense-tracker.log
```

---

## 🔁 9. Redeploy After Changes

```bash
git pull origin main
./deploy.sh
```

---

## 🔐 10. Database Permissions

If you see this error:

```
SQLITE_READONLY: attempt to write a readonly database
```

Run:

```bash
sudo chown -R ubuntu:www-data /var/www/html/db
sudo chmod -R 775 /var/www/html/db
```

---

## ⚙️ 11. Auto Start on Reboot

Create a systemd service:

```bash
sudo nano /etc/systemd/system/expense-tracker.service
```

Paste:

```ini
[Unit]
Description=Expense Tracker Node.js App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/html
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
StandardOutput=append:/home/ubuntu/expense-tracker/expense-tracker.log
StandardError=append:/home/ubuntu/expense-tracker/expense-tracker.log

[Install]
WantedBy=multi-user.target
```

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable expense-tracker
sudo systemctl start expense-tracker
sudo systemctl status expense-tracker
```

---

## 🧩 12. Common Issues

| Issue                   | Solution                                    |
| ----------------------- | ------------------------------------------- |
| `SQLITE_READONLY`       | Fix file permissions for `/var/www/html/db` |
| `EADDRINUSE: port 3000` | Kill old process: `pkill -f server.js`      |
| `502 Bad Gateway`       | Check Node logs or restart app              |
| Port 80 unavailable     | Stop Apache: `sudo systemctl stop apache2`  |

---

## 🧑‍🚀 Author

**ExpenseTrackr** — built with ❤️ by *Your Name*
Made for developers learning **Node.js**, **Express**, and **Cloud Deployment**.

---

## 💬 Support

If this project helped you, ⭐ **star the repo** on GitHub
and feel free to connect on [LinkedIn](https://www.linkedin.com/in/kiranreddy-adulla/) 🌐

---

> “Build once, deploy everywhere — the DevOps way.” 🛠️

```

---

### 🎨 How to Host on GitHub Pages (Optional)

If you want to make this README available as a **mini website**:
1. Go to your GitHub repo → **Settings → Pages**
2. Choose branch: `main` → folder: `/ (root)`
3. Save.

