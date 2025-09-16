@echo off
cd /d F:\technology-academy

:loop
echo ================================
echo [Auto Git Push Running...]
echo Time: %date% %time%
echo ================================

git add .
git commit -m "Auto backup at %date% %time%"
git push origin main

echo -------------------------------
echo Waiting 60 seconds...
echo -------------------------------

REM استخدام ping بدل timeout لأنه موجود في كل الويندوز
ping -n 61 127.0.0.1 >nul

goto loop