@echo off
echo ================================
echo       网络连接测试工具
echo ================================
echo.
echo 你的IP地址: 192.168.112.212
echo 后端端口: 3000
echo.
echo 正在测试网络连接...
echo.

echo 1. 测试本地端口是否开放...
netstat -an | findstr :3000
if %errorlevel% == 0 (
    echo ✅ 端口3000正在监听
) else (
    echo ❌ 端口3000未开放，请确保后端服务正在运行
)

echo.
echo 2. 测试防火墙规则...
netsh advfirewall firewall show rule name="Node.js Server Port 3000" >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ 防火墙规则已存在
) else (
    echo ❌ 防火墙规则不存在，正在添加...
    netsh advfirewall firewall add rule name="Node.js Server Port 3000" dir=in action=allow protocol=TCP localport=3000
    echo ✅ 防火墙规则已添加
)

echo.
echo 3. 显示网络配置...
ipconfig | findstr /i "IPv4"

echo.
echo ================================
echo 测试完成！
echo.
echo 如果后端服务正在运行，手机应该能够访问：
echo http://192.168.112.212:3000/api/health
echo.
echo 请确保：
echo - 后端服务正在运行 (npm start)
echo - 手机和电脑在同一WiFi网络
echo - 没有其他防火墙软件阻止连接
echo ================================
pause