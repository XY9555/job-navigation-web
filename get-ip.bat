@echo off
echo ================================
echo        查看电脑IP地址
echo ================================
echo.
echo 正在获取网络配置信息...
echo.
ipconfig | findstr /i "IPv4"
echo.
echo ================================
echo 请找到上面显示的IPv4地址
echo 通常格式为：192.168.x.x 或 10.x.x.x
echo ================================
pause