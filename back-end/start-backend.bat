@echo off
echo Verificando porta 5000...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :5000') do (
    echo Matando processo %%i na porta 5000...
    taskkill /PID %%i /F >nul 2>&1
)
echo Porta 5000 liberada!
echo Iniciando backend...
cd /d "%~dp0"
npm run dev
