@echo off
chcp 65001 > nul
echo.
echo ============================================
echo     OZONE Phone - Upload pe GitHub
echo ============================================
echo.
set /p GITHUB_USER=GitHub username: 
set /p VERSION=Versiune release (ex: v1.0): 
echo.

echo [1/5] Creez arhiva ZIP pentru release...
if exist "%~dp0..\ozone-phone-release.zip" del "%~dp0..\ozone-phone-release.zip"
"C:\Program Files\7-Zip\7z.exe" a -tzip "%~dp0..\ozone-phone-release.zip" "%~dp0*" -xr!.git -xr!upload_to_github.bat -xr!docs > nul 2>&1
if not exist "%~dp0..\ozone-phone-release.zip" (
    powershell -command "Compress-Archive -Path '%~dp0*' -DestinationPath '%~dp0..\ozone-phone-release.zip' -Force"
)
echo OK - ZIP creat in folderul parinte
echo.

echo [2/5] Configurez remote origin...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." remote add origin https://github.com/%GITHUB_USER%/ozone-phone.git
echo OK
echo.

echo [3/5] Schimb branch in main...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." branch -M main
echo OK
echo.

echo [4/5] Urc codul pe GitHub (se deschide autentificare)...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." push -u origin main
echo OK
echo.

echo [5/5] Creez tag pentru release %VERSION%...
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." tag -a %VERSION% -m "Release %VERSION%"
"C:\Program Files\Git\cmd\git.exe" -C "%~dp0." push origin %VERSION%
echo OK
echo.

echo ============================================
echo  GATA! Acum mergi pe GitHub si creeaza Release:
echo.
echo  1. https://github.com/%GITHUB_USER%/ozone-phone/releases/new
echo  2. Alege tag-ul %VERSION%
echo  3. Titlu: OZONE Phone %VERSION%
echo  4. Ataseaza ZIP-ul din: %~dp0..\ozone-phone-release.zip
echo  5. Apasa Publish Release
echo ============================================
echo.
pause