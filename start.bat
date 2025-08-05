@echo off
echo Starting Teacher Management System...
echo.

echo Starting backend server...
start cmd /k "cd server && npm run dev"

echo Waiting for server to start...
timeout /t 3

echo Starting frontend client...
start cmd /k "cd client && npm start"

echo.
echo Both backend and frontend are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause