@echo off
cd /d F:\technology-academy
git pull origin main --rebase
git add .
git commit -m "Auto update"
git push origin main