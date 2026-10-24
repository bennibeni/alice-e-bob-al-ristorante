@echo off
cd /d "%~dp0"
echo Apri http://localhost:3018 dopo il messaggio Ready.
call npm run dev
pause
