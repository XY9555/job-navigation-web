<template>
  <div class="fill-resume-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">完善简历</h1>
      <div class="progress">2/2</div>
    </div>
    
    <div class="content">
      <div class="form-section">
        <h3 class="section-title">工作经历</h3>
        <div class="form-group">
          <label>公司名称</label>
          <input v-model="resumeData.company" type="text" placeholder="请输入公司名称" class="input-field" />
        </div>
        
        <div class="form-group">
          <label>职位</label>
          <input v-model="resumeData.jobTitle" type="text" placeholder="请输入职位" class="input-field" />
        </div>
        
        <div class="form-group">
          <label>工作描述</label>
          <textarea v-model="resumeData.jobDescription" placeholder="请描述工作内容和成就" class="textarea-field" rows="4"></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">技能特长</h3>
        <div class="form-group">
          <label>专业技能</label>
          <textarea v-model="resumeData.skills" placeholder="请输入专业技能，用逗号分隔" class="textarea-field" rows="3"></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">自我评价</h3>
        <div class="form-group">
          <textarea v-model="resumeData.selfEvaluation" placeholder="请输入自我评价" class="textarea-field" rows="4"></textarea>
        </div>
      </div>
      
      <button class="complete-btn" @click="completeResume" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? '保存中...' : '完成简历' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FillResume2',
  data() {
    return {
      loading: false,
      resumeData: {
        company: '',
        jobTitle: '',
        jobDescription: '',
        skills: '',
        selfEvaluation: ''
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async completeResume() {
      this.loading = true
      
      try {
        // 获取第一步的数据
        const step1Data = JSON.parse(localStorage.getItem('resumeData') || '{}')
        const completeData = { ...step1Data, ...this.resumeData }
        
        // 模拟保存简历
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 清除临时数据
        localStorage.removeItem('resumeData')
        
        alert('简历创建成功！')
        this.$router.push('/my-resume')
      } catch (error) {
        alert('保存失败，请重试')
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    // 从本地存储恢复数据
    const savedData = localStorage.getItem('resumeData')
    if (savedData) {
      const data = JSON.parse(savedData)
      Object.keys(this.resumeData).forEach(key => {
        if (data[key]) {
          this.resumeData[key] = data[key]
        }
      })
    }
  }
}
</script>

<style scoped>
.fill-resume-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.progress {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.content {
  padding: 20px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-field, .textarea-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  font-family: inherit;
}

.input-field:focus, .textarea-field:focus {
  outline: none;
  border-color: #667eea;
}

.textarea-field {
  resize: vertical;
  min-height: 80px;
}

.complete-btn {
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

.complete-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.complete-btn:disabled {
  opacity: 0.7;
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



