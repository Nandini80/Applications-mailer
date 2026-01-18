@echo off
:loop
echo [%date% %time%] Checking for due emails...
node worker.js --once
timeout /t 60 /nobreak >nul
goto loop

