// SQLite版本的认证路由
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// 生成JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// 用户注册
router.post('/register', [
  body('phone')
    .isLength({ min: 11, max: 11 })
    .isNumeric()
    .withMessage('请输入11位手机号'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少6位'),
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('姓名长度为1-50个字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { phone, password, name, email } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该手机号已注册'
      });
    }

    // 创建新用户
    const user = await User.create({
      phone,
      password,
      name,
      email
    });

    // 生成token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请重试'
    });
  }
});

// 用户登录
router.post('/login', [
  body('phone')
    .isLength({ min: 11, max: 11 })
    .isNumeric()
    .withMessage('请输入11位手机号'),
  body('password')
    .notEmpty()
    .withMessage('请输入密码')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { phone, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '手机号或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '手机号或密码错误'
      });
    }

    // 生成token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请重试'
    });
  }
});

// 刷新token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: '缺少token'
      });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 生成新token
    const newToken = generateToken(user.id);

    res.json({
      success: true,
      message: 'Token刷新成功',
      data: {
        token: newToken,
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Token刷新错误:', error);
    res.status(401).json({
      success: false,
      message: 'Token无效或已过期'
    });
  }
});

module.exports = router;