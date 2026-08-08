@echo off
echo.
echo ============================================
echo     OZONE Phone - Upload pe GitHub
echo ============================================
echo.
set /p GITHUB_USER=GitHub username: 
echo.

echo [1/3] Configurez remote origin...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." remote add origin https://github.com/%GITHUB_USER%/ozone-phone.git
echo OK
echo.

echo [2/3] Schimb branch in main...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." branch -M main
echo OK
echo.

echo [3/3] Urc pe GitHub...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." push -u origin main --force
echo.

echo ============================================
echo  GATA! Mergi pe:
echo  https://github.com/%GITHUB_USER%/ozone-phone
echo ============================================
pause