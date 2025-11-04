const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const { authenticateToken, checkOwnership } = require('../middleware/auth');
const aiService = require('../services/aiService');
const fileParser = require('../services/fileParser');

const router = express.Router();

// 配置文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式，请上传PDF或Word文档'));
    }
  }
});

// 文件解析
router.post('/parse-file', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    console.log('📁 收到文件解析请求:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // 解析文件内容
    const parsedContent = await fileParser.parseFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    console.log('✅ 文件解析完成');

    res.json({
      success: true,
      message: '文件解析完成',
      data: {
        parsedContent,
        fileInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      }
    });

  } catch (error) {
    console.error('❌ 文件解析失败:', error);
    
    // 返回错误信息，但仍提供基本结构
    res.status(200).json({
      success: false,
      message: '文件解析失败: ' + error.message,
      data: {
        parsedContent: {
          title: req.file?.originalname?.replace(/\.[^/.]+$/, "") || '未知文件',
          personalInfo: {
            name: '解析失败',
            phone: '',
            email: ''
          },
          skills: [],
          experience: [],
          education: [],
          rawText: `文件解析失败: ${error.message}\n\n请检查文件格式是否正确，或联系技术支持。`,
          parseMethod: 'error'
        },
        error: error.message
      }
    });
  }
});

// 简历评测
router.post('/evaluate-resume/:id', authenticateToken, checkOwnership(Resume), async (req, res) => {
  try {
    const resume = req.resource;
    const evaluationOptions = req.body.evaluationOptions || {
      content: true,
      format: true,
      keywords: true,
      experience: true
    };

    // 使用真实AI服务进行评测
    console.log('🤖 调用智谱AI进行简历评测...');
    console.log('📊 评测维度选项:', evaluationOptions);
    const evaluation = await aiService.evaluateResume(resume, evaluationOptions);

    // 保存评测结果
    resume.evaluation = {
      ...evaluation,
      lastEvaluatedAt: new Date()
    };
    await resume.save();

    res.json({
      success: true,
      message: '简历评测完成',
      data: evaluation
    });

  } catch (error) {
    console.error('简历评测错误:', error);
    res.status(500).json({
      success: false,
      message: '简历评测失败'
    });
  }
});


// 职位匹配分析
router.post('/job-matching', [
  authenticateToken,
  body('resumeId')
    .isInt()
    .withMessage('简历ID格式无效'),
  body('jobDescription')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('职位描述长度为10-5000个字符'),
  body('jobTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('职位标题不能超过100个字符')
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

    const { resumeId, jobDescription, jobTitle } = req.body;

    // 验证简历所有权
    const resume = await Resume.findOne({ 
      where: { 
        id: resumeId, 
        userId: req.user.id 
      } 
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在或无权访问'
      });
    }

    // 使用真实AI服务进行职位匹配分析
    console.log('🤖 调用智谱AI进行职位匹配分析...');
    const matchingResult = await aiService.analyzeJobMatching(resume, jobDescription, jobTitle);

    res.json({
      success: true,
      message: '职位匹配分析完成',
      data: matchingResult
    });

  } catch (error) {
    console.error('职位匹配分析错误:', error);
    res.status(500).json({
      success: false,
      message: '职位匹配分析失败'
    });
  }
});

// 生成面试问题
router.post('/interview-questions', [
  authenticateToken,
  body('resumeId')
    .isInt()
    .withMessage('简历ID格式无效'),
  body('jobPosition')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('职位名称长度为1-100个字符'),
  body('focusAreas')
    .isArray({ min: 1 })
    .withMessage('请至少选择一个侧重点'),
  body('questionCount')
    .isInt({ min: 1, max: 20 })
    .withMessage('问题数量为1-20个')
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

    const { resumeId, jobPosition, focusAreas, questionCount } = req.body;

    // 验证简历所有权
    const resume = await Resume.findOne({ 
      where: { 
        id: resumeId, 
        userId: req.user.id 
      } 
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '简历不存在或无权访问'
      });
    }

    // 使用真实AI服务生成面试问题
    console.log('🤖 调用智谱AI生成面试问题...');
    const questions = await aiService.generateInterviewQuestions(resume, jobPosition, focusAreas, questionCount);

    res.json({
      success: true,
      message: '面试问题生成完成',
      data: {
        questions,
        metadata: {
          resumeTitle: resume.title,
          jobPosition,
          focusAreas,
          questionCount: questions.length,
          generatedAt: new Date()
        }
      }
    });

  } catch (error) {
    console.error('生成面试问题错误:', error);
    res.status(500).json({
      success: false,
      message: '生成面试问题失败'
    });
  }
});

// 简历优化建议
router.post('/optimize-resume/:id', authenticateToken, checkOwnership(Resume), async (req, res) => {
  try {
    const resume = req.resource;

    // 生成优化建议
    const suggestions = await generateOptimizationSuggestions(resume);

    res.json({
      success: true,
      message: '简历优化建议生成完成',
      data: suggestions
    });

  } catch (error) {
    console.error('生成优化建议错误:', error);
    res.status(500).json({
      success: false,
      message: '生成优化建议失败'
    });
  }
});

// 生成优化建议函数 (保留用于简历优化建议功能)
async function generateOptimizationSuggestions(resume) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const suggestions = [];

  // 检查各个部分并给出建议
  if (!resume.personalInfo?.avatar) {
    suggestions.push({
      type: 'personal',
      priority: 'medium',
      title: '添加个人头像',
      description: '专业的头像能给HR留下良好的第一印象'
    });
  }

  if (!resume.jobIntention?.salary) {
    suggestions.push({
      type: 'intention',
      priority: 'low',
      title: '添加期望薪资',
      description: '明确的薪资期望有助于HR快速匹配合适的职位'
    });
  }

  if (!resume.skills || resume.skills.length < 5) {
    suggestions.push({
      type: 'skills',
      priority: 'high',
      title: '丰富技能描述',
      description: '建议添加更多相关技能，并标注熟练程度'
    });
  }

  if (!resume.projects || resume.projects.length === 0) {
    suggestions.push({
      type: 'projects',
      priority: 'high',
      title: '添加项目经历',
      description: '项目经历能很好地展示您的实际能力和经验'
    });
  }

  return {
    totalSuggestions: suggestions.length,
    suggestions,
    overallScore: 85,
    nextSteps: [
      '完善技能描述',
      '添加项目经历',
      '优化工作描述'
    ]
  };
}

module.exports = router;