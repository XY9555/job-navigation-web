// 离线模式支持
export class OfflineMode {
  static isEnabled() {
    return localStorage.getItem('offlineMode') === 'true';
  }
  
  static enable() {
    localStorage.setItem('offlineMode', 'true');
    console.log('🔄 离线模式已启用');
  }
  
  static disable() {
    localStorage.setItem('offlineMode', 'false');
    console.log('🌐 在线模式已启用');
  }
  
  // 模拟登录（离线模式）
  static mockLogin(phone, password) {
    if (!phone || !password) {
      throw new Error('请输入手机号和密码');
    }
    
    // 简单验证
    if (phone.length < 11) {
      throw new Error('请输入正确的手机号');
    }
    
    if (password.length < 6) {
      throw new Error('密码长度不能少于6位');
    }
    
    // 生成模拟用户数据
    const mockUser = {
      id: Date.now(),
      phone: phone,
      name: `用户${phone.slice(-4)}`,
      avatar: '',
      createdAt: new Date().toISOString()
    };
    
    const mockToken = `offline-token-${Date.now()}`;
    
    return {
      success: true,
      data: {
        token: mockToken,
        user: mockUser
      },
      message: '离线模式登录成功'
    };
  }
  
  // 模拟注册（离线模式）
  static mockRegister(userData) {
    const { phone, password, code } = userData;
    
    if (!phone || !password || !code) {
      throw new Error('请填写完整信息');
    }
    
    // 简单验证
    if (phone.length < 11) {
      throw new Error('请输入正确的手机号');
    }
    
    if (password.length < 6) {
      throw new Error('密码长度不能少于6位');
    }
    
    return {
      success: true,
      message: '离线模式注册成功，请登录'
    };
  }
  
  // 获取离线简历数据
  static getOfflineResumes() {
    const resumes = localStorage.getItem('offlineResumes');
    return resumes ? JSON.parse(resumes) : [];
  }
  
  // 保存离线简历数据
  static saveOfflineResume(resume) {
    const resumes = this.getOfflineResumes();
    const existingIndex = resumes.findIndex(r => r.id === resume.id);
    
    if (existingIndex >= 0) {
      resumes[existingIndex] = resume;
    } else {
      resume.id = Date.now();
      resumes.push(resume);
    }
    
    localStorage.setItem('offlineResumes', JSON.stringify(resumes));
    return resume;
  }
  
  // 删除离线简历
  static deleteOfflineResume(resumeId) {
    const resumes = this.getOfflineResumes();
    const filteredResumes = resumes.filter(r => r.id !== resumeId);
    localStorage.setItem('offlineResumes', JSON.stringify(filteredResumes));
  }
  
  // 显示离线模式提示
  static showOfflineNotice() {
    const message = `
🔄 当前为离线模式

功能说明：
✅ 用户登录/注册
✅ 简历创建/编辑
✅ 本地数据存储
❌ AI功能（需要网络）
❌ 云端同步

网络恢复后将自动切换到在线模式。
    `;
    
    if (window.Capacitor) {
      alert(message);
    } else {
      console.log(message);
    }
  }
}