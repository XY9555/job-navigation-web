@echo off
echo ================================
echo     配置Windows防火墙
echo ================================
echo.
echo 正在为端口3000添加防火墙规则...
echo.

REM 添加入站规则允许端口3000
netsh advfirewall firewall add rule name="Node.js Server Port 3000" dir=in action=allow protocol=TCP localport=3000

echo.
echo ================================
echo 防火墙规则添加完成！
echo 端口3000现在应该可以被外部访问
echo ================================
echo.
echo 如果仍然无法连接，请手动检查：
echo 1. Windows Defender防火墙设置
echo 2. 路由器防火墙设置
echo 3. 杀毒软件防火墙设置
echo.
pause