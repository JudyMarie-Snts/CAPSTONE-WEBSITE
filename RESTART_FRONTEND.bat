@echo off
echo ========================================
echo SISZUM POS - Frontend Server Restart
echo ========================================
echo.
echo Stopping any running frontend servers...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*" 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting frontend server...
echo.
cd /d "%~dp0"
npm run dev
