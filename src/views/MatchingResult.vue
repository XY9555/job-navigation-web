<template>
  <div class="matching-result-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">职位匹配分析结果</h1>
    </div>
    
    <div class="content">
      <!-- 匹配度总览 -->
      <div class="score-card">
        <div class="score-header">
          <div class="score-title">综合匹配度</div>
          <div class="score-circle">
            <div class="score-number">{{ analysisData.matchingScore }}%</div>
            <div class="score-level">{{ getScoreLevel(analysisData.matchingScore) }}</div>
          </div>
        </div>
        <div class="score-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: analysisData.matchingScore + '%' }"
              :class="getScoreClass(analysisData.matchingScore)"
            ></div>
          </div>
        </div>
      </div>

      <!-- 职位信息 -->
      <div class="job-info-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          分析职位
        </div>
        <div class="job-details">
          <div class="job-title">{{ analysisData.jobInfo.title }}</div>
          <div class="job-description">{{ analysisData.jobInfo.description }}</div>
        </div>
      </div>

      <!-- 评分理由 -->
      <div class="analysis-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 11H3m6 0a3 3 0 106 0m-6 0a3 3 0 016 0M9 7h.01M9 15h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
          评分理由
        </div>
        <div class="reason-list">
          <div v-for="reason in analysisData.reasons" :key="reason.id" class="reason-item">
            <div class="reason-icon" :class="reason.type">
              <svg v-if="reason.type === 'positive'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="reason.type === 'negative'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="reason-content">
              <div class="reason-title">{{ reason.title }}</div>
              <div class="reason-desc">{{ reason.description }}</div>
            </div>
            <div class="reason-score">{{ reason.score }}分</div>
          </div>
        </div>
      </div>

      <!-- 改进建议 -->
      <div class="suggestions-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          改进建议
        </div>
        <div class="suggestion-list">
          <div v-for="suggestion in analysisData.suggestions" :key="suggestion.id" class="suggestion-item">
            <div class="suggestion-priority" :class="suggestion.priority">
              {{ getPriorityText(suggestion.priority) }}
            </div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-desc">{{ suggestion.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关注方向 -->
      <div class="focus-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" stroke-width="2"/>
          </svg>
          关注方向
        </div>
        <div class="focus-tags">
          <div v-for="focus in analysisData.focusAreas" :key="focus" class="focus-tag">
            {{ focus }}
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn secondary" @click="reAnalyze">
          重新分析
        </button>
        <button class="action-btn primary" @click="saveResult" :disabled="saving">
          <span v-if="saving">生成中...</span>
          <span v-else>📄 生成Word报告</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchingResult',
  data() {
    return {
      saving: false,
      analysisData: {
        matchingScore: 85,
        jobInfo: {
          title: '前端开发工程师',
          description: '负责公司前端产品的开发和维护，使用Vue.js、React等技术栈...'
        },
        resumeData: {
          name: '张三'
        },
        reasons: [
          {
            id: 1,
            type: 'positive',
            title: '技术栈匹配度高',
            description: '您的Vue.js和JavaScript技能与职位要求高度匹配',
            score: 25
          },
          {
            id: 2,
            type: 'positive',
            title: '项目经验丰富',
            description: '您有3年相关项目开发经验，符合职位要求',
            score: 20
          },
          {
            id: 3,
            type: 'neutral',
            title: '学历背景适合',
            description: '本科学历满足基本要求，但非计算机专业稍有劣势',
            score: 15
          },
          {
            id: 4,
            type: 'negative',
            title: '缺少移动端经验',
            description: '职位要求有React Native经验，您的简历中未体现',
            score: -5
          }
        ],
        suggestions: [
          {
            id: 1,
            priority: 'high',
            title: '补充移动端开发技能',
            description: '建议学习React Native或Flutter，增加移动端开发经验'
          },
          {
            id: 2,
            priority: 'medium',
            title: '完善项目描述',
            description: '在简历中详细描述项目中使用的技术栈和解决的问题'
          },
          {
            id: 3,
            priority: 'low',
            title: '获得相关认证',
            description: '考虑获得前端相关的技术认证，提升专业度'
          }
        ],
        focusAreas: ['移动端开发', 'TypeScript', '性能优化', '团队协作', '项目管理']
      }
    }
  },
  
  mounted() {
    // 从localStorage获取分析数据
    const savedData = localStorage.getItem('matchingAnalysisData')
    if (savedData) {
      const data = JSON.parse(savedData)
      this.analysisData.matchingScore = data.matchingScore
      this.analysisData.jobInfo = data.jobInfo
      this.analysisData.resumeData = data.resumeData
      
      // 根据匹配度生成动态的评分理由
      this.generateDynamicReasons(data.matchingScore, data.jobInfo)
    }
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    getScoreLevel(score) {
      if (score >= 90) return '优秀匹配'
      if (score >= 80) return '良好匹配'
      if (score >= 70) return '一般匹配'
      return '匹配度较低'
    },
    
    getScoreClass(score) {
      if (score >= 90) return 'excellent'
      if (score >= 80) return 'good'
      if (score >= 70) return 'average'
      return 'low'
    },
    
    getPriorityText(priority) {
      const priorityMap = {
        'high': '高优先级',
        'medium': '中优先级',
        'low': '低优先级'
      }
      return priorityMap[priority] || '一般'
    },
    
    generateDynamicReasons(score, jobInfo) {
      // 根据职位信息和分数动态生成评分理由
      const reasons = []
      
      if (jobInfo.title.includes('前端') || jobInfo.title.includes('Vue') || jobInfo.title.includes('React')) {
        reasons.push({
          id: 1,
          type: 'positive',
          title: '技术栈匹配度高',
          description: `您的前端开发技能与"${jobInfo.title}"职位要求高度匹配`,
          score: 25
        })
      }
      
      if (score >= 80) {
        reasons.push({
          id: 2,
          type: 'positive',
          title: '综合能力突出',
          description: '您的技能组合和项目经验很好地满足了职位需求',
          score: 20
        })
      }
      
      if (jobInfo.description.includes('经验') || jobInfo.description.includes('年')) {
        reasons.push({
          id: 3,
          type: score >= 75 ? 'positive' : 'neutral',
          title: '工作经验',
          description: score >= 75 ? '您的工作经验符合职位要求' : '工作经验基本符合要求，但还有提升空间',
          score: score >= 75 ? 15 : 10
        })
      }
      
      if (score < 85) {
        reasons.push({
          id: 4,
          type: 'negative',
          title: '部分技能待提升',
          description: '在某些专业技能方面还需要进一步学习和实践',
          score: -10
        })
      }
      
      this.analysisData.reasons = reasons
    },
    
    reAnalyze() {
      this.$router.push('/job-matching')
    },
    
    async saveResult() {
      console.log('🔄 开始保存匹配分析结果...')
      
      if (this.saving) {
        console.log('⏳ 正在保存中，请勿重复点击')
        return
      }
      
      this.saving = true
      
      try {
        // 获取当前简历ID（从localStorage）
        const resumeId = localStorage.getItem('currentMatchingResumeId')
        console.log('📋 当前简历ID:', resumeId)
        console.log('📊 分析结果数据:', this.analysisData)
        
        // 生成并下载Word文档
        try {
          const { resumeAPI } = await import('@/services/api')
          
          // 准备源信息
          const sourceInfo = {
            type: this.analysisData.analysisMode || 'unknown',
            resumeId: resumeId || null,
            fileName: this.analysisData.sourceInfo?.fileName || null,
            timestamp: new Date().toISOString()
          }
          
          console.log('📄 生成匹配分析Word文档...', { sourceInfo })
          
          const response = await resumeAPI.downloadMatchingReport(this.analysisData, sourceInfo)

          if (response.success) {
            this.showSuccessMessage(`✅ 匹配分析报告已生成并下载：${response.filename}`)
            console.log('✅ Word文档下载成功:', response.filename)
          } else {
            throw new Error('下载失败')
          }
        } catch (error) {
          console.error('❌ 生成Word文档失败:', error)
          // 如果生成Word文档失败，降级到本地保存
          console.log('🔄 降级到本地保存...')
          this.saveToLocalStorage()
        }

      } catch (error) {
        console.error('保存匹配分析结果失败:', error)
        alert('保存失败：' + error.message)
      } finally {
        this.saving = false
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        console.log('💽 开始保存到本地存储...')
        
        // 保存分析结果到localStorage
        const resultData = {
          ...this.analysisData,
          savedAt: new Date().toISOString(),
          id: Date.now(), // 使用时间戳作为ID
          title: `匹配分析 - ${this.analysisData.jobInfo?.title || '未知职位'} - ${new Date().toLocaleString()}`
        }
        
        let savedResults = JSON.parse(localStorage.getItem('savedMatchingResults') || '[]')
        savedResults.unshift(resultData)
        
        // 只保留最近20个结果
        if (savedResults.length > 20) {
          savedResults = savedResults.slice(0, 20)
        }
        
        localStorage.setItem('savedMatchingResults', JSON.stringify(savedResults))
        console.log('✅ 本地保存成功，共保存', savedResults.length, '个结果')
        this.showSuccessMessage('✅ 匹配分析结果已保存到本地历史记录')
      } catch (error) {
        console.error('❌ 保存到本地失败:', error)
        alert('保存失败：' + error.message)
      }
    },

    // 生成结果标题
    generateResultTitle() {
      const now = new Date()
      const dateStr = now.toLocaleDateString('zh-CN')
      const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false })
      const jobTitle = this.analysisData.jobInfo?.title || '未知职位'
      
      if (this.analysisData.analysisMode === 'select') {
        return `职位匹配分析 - ${jobTitle} - ${dateStr} ${timeStr}`
      } else if (this.analysisData.analysisMode === 'upload') {
        const fileName = this.analysisData.sourceInfo?.fileName || '上传文件'
        return `文件匹配分析 - ${jobTitle} - ${fileName} - ${dateStr} ${timeStr}`
      } else {
        return `职位匹配分析 - ${jobTitle} - ${dateStr} ${timeStr}`
      }
    },

    // 显示成功消息
    showSuccessMessage(message) {
      // 可以添加一个成功提示组件，这里先用alert
      alert(message)
    }
  }
}
</script>

<style scoped>
.matching-result-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120px;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  border-radius: 8px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.content {
  padding: 20px;
}

/* 匹配度卡片 */
.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  color: white;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-title {
  font-size: 18px;
  font-weight: 600;
}

.score-circle {
  text-align: center;
}

.score-number {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.score-level {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.score-progress {
  margin-top: 16px;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
}

.progress-fill.excellent {
  background: #28a745;
}

.progress-fill.good {
  background: #17a2b8;
}

.progress-fill.average {
  background: #ffc107;
}

.progress-fill.low {
  background: #dc3545;
}

/* 通用卡片样式 */
.job-info-card,
.analysis-card,
.suggestions-card,
.focus-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.card-title svg {
  color: #667eea;
}

/* 职位信息 */
.job-details {
  padding-left: 28px;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.job-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 评分理由 */
.reason-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.reason-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reason-icon.positive {
  background: #d4edda;
  color: #155724;
}

.reason-icon.negative {
  background: #f8d7da;
  color: #721c24;
}

.reason-icon.neutral {
  background: #fff3cd;
  color: #856404;
}

.reason-content {
  flex: 1;
}

.reason-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.reason-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.reason-score {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
  text-align: right;
}

/* 改进建议 */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.suggestion-priority {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.suggestion-priority.high {
  background: #f8d7da;
  color: #721c24;
}

.suggestion-priority.medium {
  background: #fff3cd;
  color: #856404;
}

.suggestion-priority.low {
  background: #d1ecf1;
  color: #0c5460;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.suggestion-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 关注方向 */
.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 28px;
}

.focus-tag {
  padding: 8px 12px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.action-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e9ecef;
}

.action-btn.secondary:hover {
  background: #e9ecef;
  color: #333;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .score-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .reason-item,
  .suggestion-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .reason-score {
    text-align: left;
  }
}
</style>



