<template>
  <div class="about-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">关于我们</h1>
    </div>
    
    <div class="content">
      <div class="logo-section">
        <div class="app-logo">💼</div>
        <h2 class="app-name">求职导航</h2>
        <p class="app-version">v1.0.0</p>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <h3 class="info-title">产品介绍</h3>
          <p class="info-desc">
            求职导航是一款智能求职助手APP，提供简历管理、AI评测、职位匹配、面试问题生成等功能，帮助求职者提高求职效率。
          </p>
        </div>
        
        <div class="info-item">
          <h3 class="info-title">联系我们</h3>
          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-label">客服邮箱：</span>
              <span class="contact-value">support@jobnavigation.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">客服电话：</span>
              <span class="contact-value">400-123-4567</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">工作时间：</span>
              <span class="contact-value">周一至周五 9:00-18:00</span>
            </div>
          </div>
        </div>
        
        <div class="info-item">
          <h3 class="info-title">隐私政策</h3>
          <p class="info-desc">
            我们非常重视您的隐私保护，所有个人信息均会得到严格保密，不会向第三方泄露您的个人信息。
          </p>
        </div>
        
        <div class="info-item">
          <h3 class="info-title">版本信息</h3>
          <div class="version-list">
            <div class="version-item">
              <span class="version-label">v1.0.0</span>
              <span class="version-date">2024-01-20</span>
            </div>
            <div class="version-desc">初始版本发布，包含基础功能</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.about-container {
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

.logo-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  color: white;
  margin-bottom: 24px;
}

.app-logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.app-version {
  font-size: 16px;
  opacity: 0.8;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.info-item {
  margin-bottom: 32px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.info-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  font-size: 14px;
}

.contact-label {
  color: #666;
  min-width: 80px;
}

.contact-value {
  color: #333;
  flex: 1;
}

.version-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-label {
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 12px;
}

.version-date {
  font-size: 12px;
  color: #999;
}

.version-desc {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>



