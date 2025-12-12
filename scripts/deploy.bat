@echo off
REM Script de deploy automático para CapiShop_Web
setlocal enabledelayedexpansion
set TIMESTAMP=%date% %time%
git add .
git commit -m "auto: !TIMESTAMP! [Cambios automáticos]"
git push origin main
REM Espera 10 segundos para que Vercel detecte el push
timeout /t 10
vercel --prod --confirm
vercel status | findstr READY
endlocal
