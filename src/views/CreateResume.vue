<template>
  <div class="create-resume-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">新建简历</h1>
    </div>
    
    <div class="content">
      <div class="template-section">
        <h3 class="section-title">选择简历模板</h3>
        <div class="template-grid">
          <div v-for="template in templates" :key="template.id" 
               class="template-item" 
               :class="{ active: selectedTemplate === template.id }"
               @click="selectTemplate(template.id)">
            <div class="template-preview">
              <!-- <img :src="template.preview" :alt="template.name" /> -->
              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999;">{{ template.name }}</div>
            </div>
            <div class="template-name">{{ template.name }}</div>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">简历基本信息</h3>
        <div class="form-group">
          <label>简历标题</label>
          <input v-model="resumeTitle" type="text" placeholder="请输入简历标题" class="input-field" />
        </div>
      </div>
      
      <button class="create-btn" @click="createResume" :disabled="!canCreate">
        创建简历
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateResume',
  data() {
    return {
      selectedTemplate: 1,
      resumeTitle: '',
      templates: [
        { id: 1, name: '经典模板', preview: '/images/template-1.jpg' },
        { id: 2, name: '现代模板', preview: '/images/template-2.jpg' },
        { id: 3, name: '简约模板', preview: '/images/template-3.jpg' }
      ]
    }
  },
  computed: {
    canCreate() {
      return this.selectedTemplate && this.resumeTitle.trim()
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    selectTemplate(id) {
      this.selectedTemplate = id
    },
    createResume() {
      if (this.canCreate) {
        this.$router.push('/fill-resume-1')
      }
    }
  }
}
</script>

<style scoped>
.create-resume-container {
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
  transition: background-color 0.3s ease;
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

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.template-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.template-item.active {
  border-color: #667eea;
}

.template-preview {
  width: 100%;
  height: 120px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.template-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
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

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
}

.create-btn {
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
}

.create-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

