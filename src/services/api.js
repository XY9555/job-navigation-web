// API服务层 - 统一管理所有API调用
import { API_CONFIG } from '@/config/api-config.js';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // 获取认证头
  getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API请求错误:', error);
      
      // 处理认证错误
      if (error.message.includes('token') || error.message.includes('认证')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  // GET请求
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST请求
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT请求
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // 文件上传
  async uploadFile(endpoint, file, fieldName = 'file') {
    const formData = new FormData();
    formData.append(fieldName, file);

    const token = localStorage.getItem('userToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || '上传失败');
    }

    return data;
  }

  // 文件下载方法
  async downloadFile(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '下载失败');
      }

      // 获取文件名
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'download.docx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
        }
      }

      // 获取文件内容
      const blob = await response.blob();
      
      // 创建下载链接
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return { success: true, filename };
      
    } catch (error) {
      console.error('文件下载失败:', error);
      throw error;
    }
  }
}

// 认证相关API
export const authAPI = {
  // 用户注册
  register: (userData) => api.post('/auth/register', userData),
  
  // 用户登录
  login: (credentials) => api.post('/auth/login', credentials),
  
  // 刷新token
  refreshToken: (token) => api.post('/auth/refresh', { token }),
  
  // 忘记密码
  forgotPassword: (phone) => api.post('/auth/forgot-password', { phone }),
  
  // 重置密码
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getProfile: () => api.get('/users/profile'),
  
  // 更新用户信息
  updateProfile: (userData) => api.put('/users/profile', userData),
  
  // 上传头像
  uploadAvatar: (file) => api.uploadFile('/users/avatar', file, 'avatar'),
  
  // 更新头像(base64)
  updateAvatar: (avatar) => api.put('/users/avatar', { avatar }),
  
  // 删除头像
  deleteAvatar: () => api.delete('/users/avatar'),
  
  // 修改密码
  changePassword: (passwordData) => api.put('/users/password', passwordData),
  
  // 更新设置
  updateSettings: (settings) => api.put('/users/settings', settings)
};

// 简历相关API
export const resumeAPI = {
  // 获取简历列表
  getResumes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/resumes?${query}`);
  },
  
  // 获取简历详情
  getResume: (id) => api.get(`/resumes/${id}`),
  
  // 创建简历
  createResume: (resumeData) => api.post('/resumes', resumeData),
  
  // 更新简历
  updateResume: (id, resumeData) => api.put(`/resumes/${id}`, resumeData),
  
  // 删除简历
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  
  // 复制简历
  copyResume: (id) => api.post(`/resumes/${id}/copy`),
  
  // 更新简历状态
  updateStatus: (id, status) => api.patch(`/resumes/${id}/status`, { status }),
  
  // 获取简历统计
  getStats: (id) => api.get(`/resumes/${id}/stats`),
  
  // 保存评测结果为新记录
  saveEvaluationResult: (title, evaluationData, sourceInfo) => 
    api.post('/resumes/save-evaluation-result', { title, evaluationData, sourceInfo }),
  
  // 保存匹配分析结果为新记录
  saveMatchingResult: (title, analysisData, sourceInfo) => 
    api.post('/resumes/save-matching-result', { title, analysisData, sourceInfo }),
  
  // 下载评测结果Word文档
  downloadEvaluationReport: (evaluationData, sourceInfo) => 
    api.downloadFile('/resumes/download-evaluation-report', { evaluationData, sourceInfo }),
  
  // 下载匹配分析Word文档
  downloadMatchingReport: (analysisData, sourceInfo) => 
    api.downloadFile('/resumes/download-matching-report', { analysisData, sourceInfo })
};

// AI功能API
export const aiAPI = {
  // 简历评测
  evaluateResume: (resumeId, options = {}) => api.post(`/ai/evaluate-resume/${resumeId}`, { evaluationOptions: options }),
  
  // 文件解析
  parseFile: (file) => api.uploadFile('/ai/parse-file', file, 'file'),
  
  // 职位匹配分析
  analyzeJobMatching: (data) => api.post('/ai/job-matching', data),
  
  // 生成面试问题
  generateInterviewQuestions: (data) => api.post('/ai/interview-questions', data),
  
  // 简历优化建议
  optimizeResume: (resumeId) => api.post(`/ai/optimize-resume/${resumeId}`)
};

// 创建API实例
const api = new ApiService();

export default api;




