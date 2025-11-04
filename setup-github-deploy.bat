@echo off
echo 🚀 设置GitHub和云端部署
echo.

echo 请按照以下步骤操作：
echo.

echo 📋 第一步：创建GitHub仓库
echo 1. 访问 https://github.com
echo 2. 点击右上角 "+" → "New repository"
echo 3. 仓库名称：job-navigation-app
echo 4. 设置为 Public
echo 5. 点击 "Create repository"
echo.

echo 📋 第二步：上传代码到GitHub
echo 复制以下命令到命令行执行：
echo.
echo git init
echo git add .
echo git commit -m "Initial commit - Job Navigation App"
echo git branch -M main
echo git remote add origin https://github.com/你的用户名/job-navigation-app.git
echo git push -u origin main
echo.

echo 📋 第三步：部署到Render
echo 1. 访问 https://render.com
echo 2. 点击 "Get Started for Free"
echo 3. 使用GitHub账号登录
echo 4. 点击 "New +" → "Web Service"
echo 5. 选择你的 job-navigation-app 仓库
echo 6. 配置如下：
echo    - Name: job-navigation-api
echo    - Root Directory: backend
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo    - Plan: Free
echo.

echo 📋 第四步：设置数据库
echo 1. 在Render控制台，点击 "New +" → "PostgreSQL"
echo 2. Name: job-navigation-db
echo 3. Plan: Free
echo 4. 点击 "Create Database"
echo.

echo 📋 第五步：配置环境变量
echo 在Web Service的Environment页面添加：
echo - NODE_ENV = production
echo - ZHIPU_API_KEY = 你的智谱AI密钥
echo - DATABASE_URL = (从PostgreSQL数据库复制External Database URL)
echo.

echo 📋 第六步：等待部署完成
echo 部署通常需要5-10分钟
echo 完成后你会得到一个类似这样的URL：
echo https://job-navigation-api.onrender.com
echo.

echo 📋 第七步：更新APP配置
echo 1. 记录你的API地址
echo 2. 运行 update-api-url.bat 脚本
echo 3. 重新构建APP
echo.

echo 🎉 完成后你的APP将完全独立运行！
echo.
pause