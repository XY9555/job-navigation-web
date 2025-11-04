// SQLite版本的简历路由
const express = require('express');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取简历列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Resume.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('获取简历列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取简历列表失败'
    });
  }
});

// 获取简历详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在'
      });
    }

    res.json({
      success: true,
      data: resume
    });

  } catch (error) {
    console.error('获取简历详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取简历详情失败'
    });
  }
});

// 创建简历
router.post('/', [
  authenticateToken,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('简历标题长度为1-100个字符')
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

    const resumeData = {
      ...req.body,
      userId: req.user.id
    };

    const resume = await Resume.create(resumeData);
    
    console.log('✅ 简历创建成功:', {
      id: resume.id,
      title: resume.title,
      userId: resume.userId
    });

    res.status(201).json({
      success: true,
      message: '简历创建成功',
      data: resume
    });

  } catch (error) {
    console.error('创建简历错误:', error);
    res.status(500).json({
      success: false,
      message: '创建简历失败'
    });
  }
});

// 更新简历
router.put('/:id', [
  authenticateToken,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('简历标题长度为1-100个字符')
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

    const resume = await Resume.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在'
      });
    }

    await resume.update(req.body);

    res.json({
      success: true,
      message: '简历更新成功',
      data: resume
    });

  } catch (error) {
    console.error('更新简历错误:', error);
    res.status(500).json({
      success: false,
      message: '更新简历失败'
    });
  }
});

// 删除简历
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在'
      });
    }

    await resume.destroy();

    res.json({
      success: true,
      message: '简历删除成功'
    });

  } catch (error) {
    console.error('删除简历错误:', error);
    res.status(500).json({
      success: false,
      message: '删除简历失败'
    });
  }
});

// 保存评测结果为新记录
router.post('/save-evaluation-result', [
  authenticateToken,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('标题长度为1-100个字符'),
  body('evaluationData')
    .notEmpty()
    .withMessage('评测数据不能为空')
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

    const { title, evaluationData, sourceInfo } = req.body;

    // 创建新的简历记录，包含评测结果
    const resumeData = {
      title: title,
      userId: req.user.id,
      evaluation: evaluationData,
      sourceInfo: sourceInfo,
      type: 'evaluation_result', // 标记为评测结果类型
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const resume = await Resume.create(resumeData);
    
    console.log('✅ 评测结果保存成功:', {
      id: resume.id,
      title: resume.title,
      userId: resume.userId,
      type: 'evaluation_result'
    });

    res.status(201).json({
      success: true,
      message: '评测结果保存成功',
      data: resume
    });

  } catch (error) {
    console.error('保存评测结果错误:', error);
    res.status(500).json({
      success: false,
      message: '保存评测结果失败'
    });
  }
});

// 保存职位匹配分析结果为新记录
router.post('/save-matching-result', [
  authenticateToken,
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('标题长度为1-100个字符'),
  body('analysisData')
    .notEmpty()
    .withMessage('分析数据不能为空')
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

    const { title, analysisData, sourceInfo } = req.body;

    // 创建新的简历记录，包含匹配分析结果
    const resumeData = {
      title: title,
      userId: req.user.id,
      jobMatching: analysisData,
      sourceInfo: sourceInfo,
      type: 'matching_result', // 标记为匹配分析结果类型
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const resume = await Resume.create(resumeData);
    
    console.log('✅ 匹配分析结果保存成功:', {
      id: resume.id,
      title: resume.title,
      userId: resume.userId,
      type: 'matching_result'
    });

    res.status(201).json({
      success: true,
      message: '匹配分析结果保存成功',
      data: resume
    });

  } catch (error) {
    console.error('保存匹配分析结果错误:', error);
    res.status(500).json({
      success: false,
      message: '保存匹配分析结果失败'
    });
  }
});

// 生成并下载评测结果Word文档
router.post('/download-evaluation-report', [
  authenticateToken,
  body('evaluationData').notEmpty().withMessage('评测数据不能为空')
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

    const { evaluationData, sourceInfo = {} } = req.body;
    const DocumentService = require('../services/documentService');
    
    console.log('📄 生成评测结果Word文档...');
    
    // 生成文档
    const doc = await DocumentService.generateEvaluationReport(evaluationData, sourceInfo);
    
    // 生成文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `简历评测报告_${timestamp}.docx`;
    
    // 保存文档
    const filePath = await DocumentService.saveDocument(doc, filename);
    
    // 设置响应头并发送文件
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    // 发送文件
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('发送文件失败:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: '文件下载失败'
          });
        }
      } else {
        console.log('✅ 文件发送成功:', filename);
        // 可选：删除临时文件
        // fs.unlinkSync(filePath);
      }
    });

  } catch (error) {
    console.error('生成评测报告失败:', error);
    res.status(500).json({
      success: false,
      message: '生成报告失败'
    });
  }
});

// 生成并下载职位匹配分析Word文档
router.post('/download-matching-report', [
  authenticateToken,
  body('analysisData').notEmpty().withMessage('分析数据不能为空')
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

    const { analysisData, sourceInfo = {} } = req.body;
    const DocumentService = require('../services/documentService');
    
    console.log('📄 生成匹配分析Word文档...');
    
    // 生成文档
    const doc = await DocumentService.generateMatchingReport(analysisData, sourceInfo);
    
    // 生成文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const jobTitle = analysisData.jobInfo?.title || '未知职位';
    const filename = `职位匹配分析_${jobTitle}_${timestamp}.docx`;
    
    // 保存文档
    const filePath = await DocumentService.saveDocument(doc, filename);
    
    // 设置响应头并发送文件
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    // 发送文件
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('发送文件失败:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: '文件下载失败'
          });
        }
      } else {
        console.log('✅ 文件发送成功:', filename);
        // 可选：删除临时文件
        // fs.unlinkSync(filePath);
      }
    });

  } catch (error) {
    console.error('生成匹配分析报告失败:', error);
    res.status(500).json({
      success: false,
      message: '生成报告失败'
    });
  }
});

module.exports = router;


