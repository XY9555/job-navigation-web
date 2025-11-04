<template>
  <div class="profile-container">
    <!-- 背景图片 -->
    <!-- <img src="/images/bg-profile.jpg" alt="背景" class="bg-image" /> -->
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="avatar">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
          <div v-else class="default-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        <div class="user-info">
          <h2 class="username">{{ userInfo.name || '用户' }}</h2>
          <p class="phone">{{ userInfo.phone || '未绑定手机' }}</p>
        </div>
        <button class="edit-btn" @click="navigateTo('/user-settings')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      
      <!-- 设置菜单 -->
      <div class="menu-section">
        <div class="menu-item" @click="navigateTo('/account-security')">
          <div class="menu-icon">🔒</div>
          <div class="menu-content">
            <div class="menu-title">账户安全</div>
            <div class="menu-desc">密码和安全设置</div>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="navigateTo('/feedback')">
          <div class="menu-icon">💭</div>
          <div class="menu-content">
            <div class="menu-title">意见反馈</div>
            <div class="menu-desc">帮助我们改进</div>
          </div>
          <div class="menu-arrow">›</div>
        </div>
        
        <div class="menu-item" @click="navigateTo('/about-us')">
          <div class="menu-icon">ℹ️</div>
          <div class="menu-content">
            <div class="menu-title">关于我们</div>
            <div class="menu-desc">了解更多信息</div>
          </div>
          <div class="menu-arrow">›</div>
        </div>
      </div>
      
      <!-- 退出登录 -->
      <div class="logout-section">
        <button class="logout-btn" @click="handleLogout">
          退出登录
        </button>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="nav-text">首页</div>
      </router-link>
      
      <router-link to="/my-resume" class="nav-item">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="nav-text">我的简历</div>
      </router-link>
      
      <router-link to="/my-profile" class="nav-item active">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="nav-text">我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyProfile',
  data() {
    return {
      userInfo: {}
    }
  },
  
  mounted() {
    this.loadUserInfo()
  },
  
  methods: {
    loadUserInfo() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    },
    
    navigateTo(path) {
      this.$router.push(path)
    },
    
    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userInfo')
        this.$router.replace('/login')
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120px;
}

.content {
  padding: 20px;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  color: white;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
}

.user-info {
  flex: 1;
}

.username {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.phone {
  font-size: 14px;
  opacity: 0.8;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.menu-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-icon {
  font-size: 24px;
  margin-right: 16px;
  width: 32px;
  text-align: center;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.menu-desc {
  font-size: 14px;
  color: #666;
}

.menu-arrow {
  font-size: 20px;
  color: #ccc;
}

.logout-section {
  margin-top: 32px;
}

.logout-btn {
  width: 100%;
  padding: 16px;
  background: white;
  color: #ff4757;
  border: 1px solid #ff4757;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #ff4757;
  color: white;
}

/* 底部导航样式 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0 32px;
  z-index: 9999;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  transition: color 0.3s ease;
}

.nav-item.active {
  color: #667eea;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}
</style>

