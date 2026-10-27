@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3018 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
  echo Il server sulla porta 3018 e' gia' avviato: non serve rilanciarlo.
  echo Continua nel browser: http://localhost:3018/
  exit /b 0
)
echo Apri http://localhost:3018 dopo il messaggio Ready.
call npm run dev
pause
