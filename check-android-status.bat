@echo off
echo 🔍 检查Android应用状态
echo.

echo 1. 检查后端服务器状态...
echo 后端服务器 (端口3000):
netstat -an | findstr :3000
echo.
echo 前端开发服务器 (端口8080):
netstat -an | findstr :8080
echo.

echo 2. 检查数据库文件...
if exist "backend\database.sqlite" (
    echo ✅ 数据库文件存在: backend\database.sqlite
    dir "backend\database.sqlite"
) else (
    echo ❌ 数据库文件不存在
)
echo.

echo 3. 检查网络配置...
echo 当前IP配置:
ipconfig | findstr "IPv4"
echo.

echo 4. 测试API连接...
echo 测试后端API连接:
curl -s http://192.168.112.212:3000/api/health || echo "连接失败"
echo.

echo 5. 检查防火墙状态...
netsh advfirewall firewall show rule name="Node.js Server" 2>nul || echo "防火墙规则不存在"
echo.

echo 📱 Android应用调试建议:
echo 1. 确保手机和电脑在同一WiFi网络
echo 2. 在应用中点击右下角的🔍按钮查看调试信息
echo 3. 使用"测试连接"功能检查网络状态
echo 4. 如果显示登录页面，使用"模拟登录"功能
echo.

echo 🗄️ 关于数据库:
echo - 数据库文件位于: backend\database.sqlite
echo - 数据库运行在后端服务器上 (端口3000)
echo - Android应用通过API访问数据库
echo - 不需要在Android Studio中配置数据库
echo.

pause