<template>
  <div class="evaluation-container">
    <!-- 头部 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">简历评测</h1>
    </div>
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 选择简历 -->
      <div class="section">
        <div class="select-header">
          <span class="select-label">选择简历</span>
          <div class="select-dropdown">
            <select v-model="selectedResume" class="resume-select">
              <option value="">请选择简历</option>
              <option v-for="resume in resumeList" :key="resume.id" :value="resume.id">
                {{ resume.title }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- 选中的简历预览 -->
        <div v-if="selectedResumeData" class="selected-resume-card">
          <div class="resume-header">
            <div class="resume-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="resume-title">{{ selectedResumeData.title }}</div>
          </div>
          
          <div class="resume-info">
            <div class="info-row">
              <span class="label">{{ selectedResumeData.personalInfo?.name || '未填写' }}</span>
              <span class="value">{{ selectedResumeData.personalInfo?.gender || '未填写' }} / {{ selectedResumeData.personalInfo?.age || '未填写' }}岁</span>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="value">{{ selectedResumeData.personalInfo?.phone || '未填写' }}</span>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="value">{{ selectedResumeData.personalInfo?.email || '未填写' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 评测选项 -->
      <div class="section">
        <h3 class="section-title">评测维度</h3>
        <div class="evaluation-options">
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.content" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">内容完整性</div>
              <div class="option-desc">检查简历信息是否完整</div>
            </div>
          </label>
          
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.format" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">格式规范性</div>
              <div class="option-desc">评估简历格式和排版</div>
            </div>
          </label>
          
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.keywords" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">关键词匹配</div>
              <div class="option-desc">分析行业关键词覆盖度</div>
            </div>
          </label>
          
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.experience" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">经验描述</div>
              <div class="option-desc">评估工作经验描述质量</div>
            </div>
          </label>
        </div>
      </div>
      
      <!-- 开始评测按钮 -->
      <div class="action-section">
        <button 
          class="evaluate-btn" 
          @click="startEvaluation" 
          :disabled="!canEvaluate || loading"
        >
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'AI评测中...' : '开始AI评测' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeEvaluation',
  data() {
    return {
      selectedResume: '',
      loading: false,
      resumeList: [],
      evaluationOptions: {
        content: true,
        format: true,
        keywords: true,
        experience: true
      }
    }
  },
  
  computed: {
    canEvaluate() {
      return (this.selectedResume && this.selectedResume !== '') && 
             Object.values(this.evaluationOptions).some(option => option)
    },
    
    selectedResumeData() {
      if (!this.selectedResume || this.selectedResume === '') return null
      return this.resumeList.find(resume => resume.id == this.selectedResume)
    }
  },
  
  async mounted() {
    await this.loadResumes()
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    async loadResumes() {
      try {
        const { resumeAPI } = await import('@/services/api')
        const result = await resumeAPI.getResumes()
        this.resumeList = result.data || []
        console.log('简历列表加载成功:', this.resumeList.length, '个简历')
      } catch (error) {
        console.error('加载简历列表失败:', error)
        // 显示空列表
        this.resumeList = []
      }
    },
    
    async startEvaluation() {
      if (!this.selectedResume) {
        alert('请选择一个简历进行评测')
        return
      }
      
      this.loading = true
      
      try {
        // 调用真实的AI评测API
        const { aiAPI } = await import('@/services/api')
        console.log('🤖 开始AI评测，简历ID:', this.selectedResume)
        const result = await aiAPI.evaluateResume(this.selectedResume)
        console.log('✅ AI评测完成:', result)
        
        // 将评测结果保存到localStorage，供结果页面使用
        localStorage.setItem('evaluationResult', JSON.stringify(result.data))
        
        // 跳转到评测结果页面
        this.$router.push('/evaluation-result')
      } catch (error) {
        console.error('❌ 简历评测失败:', error)
        alert('AI评测失败：' + (error.message || '请重试'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.evaluation-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding-bottom: 40px;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: transparent;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #f8f9fa;
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

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.select-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.select-dropdown {
  position: relative;
}

.resume-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 10px 32px 10px 12px;
  font-size: 14px;
  color: #333 !important;
  cursor: pointer;
  min-width: 140px;
  font-family: inherit;
  line-height: 1.4;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
}

.resume-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.selected-resume-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
}

.resume-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.resume-icon {
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.resume-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-left: 12px;
}

.resume-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.info-row:first-child {
  margin-bottom: 16px;
}

.info-row:first-child .label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-row:first-child .value {
  font-size: 14px;
  color: #666;
  margin-left: auto;
}

.info-row svg {
  margin-right: 8px;
  color: #666;
}

.value {
  color: #333;
}

.evaluation-options {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.option-item input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.option-item input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.option-info {
  flex: 1;
}

.option-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 14px;
  color: #666;
}

.action-section {
  padding-top: 20px;
}

.evaluate-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.evaluate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.evaluate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>