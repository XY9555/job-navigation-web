@echo off
echo 🔧 修复Android网络连接问题
echo.

echo 1. 检查服务器状态...
netstat -an | findstr :3000
netstat -an | findstr :8080

echo.
echo 2. 同步Android项目...
npx cap sync android

echo.
echo 3. 重新构建项目...
npm run build

echo.
echo 4. 更新Android项目...
npx cap copy android

echo.
echo 5. 打开Android Studio...
npx cap open android

echo.
echo ✅ 修复完成！
echo.
echo 📱 接下来请在Android Studio中：
echo 1. 清理项目 (Build -> Clean Project)
echo 2. 重新构建 (Build -> Rebuild Project)  
echo 3. 运行应用
echo.
echo 🌐 如果仍有问题，请确保：
echo - 手机和电脑在同一WiFi网络
echo - 防火墙允许端口8080和3000
echo - 开发服务器正在运行
echo.
pause