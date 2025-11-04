@echo off
echo 🚀 部署生产环境APP
echo.

echo 1. 设置生产环境...
set NODE_ENV=production

echo 2. 构建生产版本...
npm run build

echo 3. 同步到Android...
npx cap sync android

echo 4. 复制资源...
npx cap copy android

echo 5. 打开Android Studio进行最终构建...
npx cap open android

echo.
echo ✅ 生产环境构建完成！
echo.
echo 📱 接下来在Android Studio中：
echo 1. 选择 Build → Generate Signed Bundle/APK
echo 2. 选择 APK
echo 3. 创建或选择签名密钥
echo 4. 选择 release 构建类型
echo 5. 构建生产版本APK
echo.
echo 🌐 生产环境配置：
echo - API地址: https://job-navigation-api.onrender.com/api
echo - 数据库: 云端PostgreSQL
echo - AI服务: 智谱AI
echo.
pause