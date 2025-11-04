@echo off
echo 🚀 自动构建Release APK
echo.

echo 📱 当前配置：
echo - API地址: https://job-navigation-api.onrender.com/api
echo - 构建类型: Release
echo - 目标: 生产环境APK
echo.

echo 🔨 开始构建...
cd android

echo 第1步：清理项目...
call gradlew clean

echo.
echo 第2步：构建Release APK...
call gradlew assembleRelease

echo.
echo 🎯 构建完成！APK位置：
echo android\app\build\outputs\apk\release\app-release-unsigned.apk
echo.

echo 📋 接下来需要：
echo 1. 对APK进行签名（如果需要发布到应用商店）
echo 2. 或者直接安装测试（开发测试用）
echo.

echo 📱 安装命令（如果已连接手机）：
echo adb install android\app\build\outputs\apk\release\app-release-unsigned.apk
echo.

pause