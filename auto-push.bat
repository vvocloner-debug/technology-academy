@echo off
:loop
git add .
git commit -m "auto commit"
git push
timeout /t 60 >nul
goto loop