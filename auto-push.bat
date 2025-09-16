@echo off
cd /d F:\technology-academy

:: Add all changes
git add -A

:: Try to commit; if nothing to commit, ignore the error
git commit -m "Auto update" 2>nul || exit 0