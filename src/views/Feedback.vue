<template>
  <div class="feedback-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">意见反馈</h1>
    </div>
    
    <div class="content">
      <div class="feedback-form">
        <div class="form-group">
          <label>反馈类型</label>
          <select v-model="feedback.type" class="select-field">
            <option value="">请选择反馈类型</option>
            <option value="bug">问题反馈</option>
            <option value="feature">功能建议</option>
            <option value="improvement">体验优化</option>
            <option value="other">其他</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>联系方式</label>
          <input v-model="feedback.contact" type="text" placeholder="请输入您的手机号或邮箱" class="input-field" />
        </div>
        
        <div class="form-group">
          <label>反馈内容 *</label>
          <textarea 
            v-model="feedback.content" 
            placeholder="请详细描述您的问题或建议"
            class="textarea-field" 
            rows="6"
          ></textarea>
        </div>
        
        <button class="submit-btn" @click="submitFeedback" :disabled="!canSubmit || loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '提交中...' : '提交反馈' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feedback',
  data() {
    return {
      loading: false,
      feedback: {
        type: '',
        contact: '',
        content: ''
      }
    }
  },
  computed: {
    canSubmit() {
      return this.feedback.content.trim().length > 0
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async submitFeedback() {
      this.loading = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('反馈提交成功，谢谢您的建议！')
        this.feedback = { type: '', contact: '', content: '' }
      } catch (error) {
        alert('提交失败，请重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.feedback-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
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

.feedback-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-field, .select-field, .textarea-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  font-family: inherit;
}

.input-field:focus, .select-field:focus, .textarea-field:focus {
  outline: none;
  border-color: #667eea;
}

.textarea-field {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
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



