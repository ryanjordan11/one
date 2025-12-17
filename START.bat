@echo off
echo ================================================================
echo   STARTING AI AGENT GATEWAY
echo ================================================================
echo.
echo Installing dependencies...
call npm install

echo.
echo Starting server...
echo.
echo Dashboard will be at: http://localhost:3000
echo VibeCoding will be at: http://localhost:3000/vibecoding
echo.

call npm start
