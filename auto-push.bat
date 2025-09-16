@echo off
cd /d F:\technology-academy

:loop
echo ===============================
echo [Auto Git Push Running...]
echo Time: %date% %time%
echo ===============================

git add -A

set msg=Auto commit at %date% %time%
git commit -m "%msg%" >nul 2>&1

git push origin main

echo -------------------------------
echo Waiting 60 seconds...
timeout /t 60 /nobreak >nul
goto loop