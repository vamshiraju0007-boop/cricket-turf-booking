@echo off
echo ========================================
echo Cricket Turf Booking - Setup Script
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please restart your terminal or computer.
    pause
    exit /b 1
)
echo.

echo [2/6] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/6] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo.

echo [4/6] Creating database tables...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database tables
    echo Make sure your .env file has the correct database password
    pause
    exit /b 1
)
echo.

echo [5/6] Seeding test data...
call npx ts-node prisma/seed.ts
if %errorlevel% neq 0 (
    echo WARNING: Failed to seed data (may already exist)
)
echo.

echo [6/6] Starting development server...
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo The server will start now.
echo Open your browser to: http://localhost:3000
echo.
echo Test Accounts:
echo   Owner: owner@turf.com / Owner@1234
echo   User:  user@example.com / User@1234
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
