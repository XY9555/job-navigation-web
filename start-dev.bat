@echo off
echo ================================
echo    启动开发环境
echo ================================
echo.
echo IP地址: 192.168.112.212
echo 后端端口: 3000
echo.

echo 1. 启动后端服务...
cd backend
start "后端服务" cmd /k "npm start"

echo.
echo 2. 等待后端服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 3. 构建前端应用...
cd ..
call npm run build

echo.
echo 4. 同步到Android...
call npx cap sync android

echo.
echo ================================
echo 开发环境启动完成！
echo.
echo 后端服务: http://192.168.112.212:3000
echo 健康检查: http://192.168.112.212:3000/api/health
echo.
echo 现在可以：
echo 1. 运行 npx cap open android 打开Android Studio
echo 2. 或者直接安装APK到手机测试
echo ================================
pause