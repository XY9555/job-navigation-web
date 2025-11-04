@echo off
title 配置SQLite数据库
color 0A

echo ========================================
echo    配置SQLite数据库 (无需安装)
echo ========================================
echo.

echo 🔍 检查SQLite支持...

cd backend

REM 检查是否已安装sqlite3和sequelize
npm list sqlite3 >nul 2>&1
set sqlite_installed=%errorlevel%
npm list sequelize >nul 2>&1
set sequelize_installed=%errorlevel%

if %sqlite_installed% neq 0 (
    echo 📦 安装SQLite依赖...
    npm install sqlite3 sequelize
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ SQLite依赖安装成功
) else (
    echo ✅ SQLite依赖已存在
)

echo.
echo 🔧 配置SQLite数据库...

REM 备份原始配置
if exist .env.backup (
    echo ℹ️ 备份文件已存在
) else (
    copy .env .env.backup >nul 2>nul
    echo ✅ 已备份原始配置
)

REM 创建SQLite配置
echo PORT=3000> .env.sqlite
echo NODE_ENV=development>> .env.sqlite
echo DATABASE_TYPE=sqlite>> .env.sqlite
echo SQLITE_PATH=./data/database.sqlite>> .env.sqlite
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024>> .env.sqlite
echo JWT_EXPIRE=7d>> .env.sqlite
echo AI_PROVIDER=zhipu>> .env.sqlite
echo ZHIPU_API_KEY=43a7dfe5176748f0ba6cb13e0d963641.dGJdRvjJxrZy7q6f>> .env.sqlite

echo ✅ SQLite配置已创建

echo.
echo 🔄 切换到SQLite数据库...
copy .env.sqlite .env >nul
echo ✅ 已切换到SQLite配置

echo.
echo 📁 创建数据库目录...
if not exist "data" mkdir "data"
echo ✅ 数据目录已创建

echo.
echo 🧪 测试SQLite连接...
node -e "
const { testConnection } = require('./config/database-sqlite');
testConnection().then(success => {
  if (success) {
    console.log('✅ SQLite数据库测试成功！');
    process.exit(0);
  } else {
    console.log('❌ SQLite数据库测试失败');
    process.exit(1);
  }
}).catch(err => {
  console.log('❌ 测试过程出错:', err.message);
  process.exit(1);
});
"

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SQLite数据库配置完成！
    echo.
    echo 📋 配置信息:
    echo - 数据库类型: SQLite
    echo - 数据库文件: backend/data/database.sqlite
    echo - AI服务: 智谱AI (已配置)
    echo - 优势: 无需安装额外软件，开箱即用
    echo.
    echo 💡 使用说明:
    echo 1. 运行 start-sqlite-development.bat 启动SQLite版本
    echo 2. 数据库文件会自动创建
    echo 3. 如需恢复其他配置: copy backend\.env.backup backend\.env
    echo.
    echo 🚀 现在可以启动SQLite版本的开发环境了！
) else (
    echo.
    echo ❌ SQLite配置失败
    echo 请检查Node.js和npm是否正确安装
)

cd ..
pause