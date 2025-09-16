@echo off
cd /d F:\technology-academy

:: Add all changes
git add .

:: Commit with a generic message (ignores empty commits)
git commit -m "Auto update" 2>nul || echo Nothing to commit

:: Pull latest changes to avoid conflicts
git pull origin main --rebase

:: Push changes
git push origin main