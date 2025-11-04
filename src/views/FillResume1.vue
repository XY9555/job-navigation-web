<template>
  <div class="fill-resume-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">{{ currentResumeTitle }}</h1>
    </div>
    
    <div class="content">
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>
        <div class="form-card">
          <div class="form-row">
            <div class="form-group">
              <label>姓名</label>
              <input v-model="resumeData.name" type="text" placeholder="请输入姓名" class="input-field" />
            </div>
            <div class="form-group">
              <label>性别</label>
              <select v-model="resumeData.gender" class="input-field">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>手机号</label>
              <input v-model="resumeData.phone" type="tel" placeholder="请输入手机号" class="input-field" />
            </div>
            <div class="form-group">
              <label>出生日期</label>
              <input v-model="resumeData.birthDate" type="date" class="input-field" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="resumeData.email" type="email" placeholder="请输入邮箱" class="input-field" />
            </div>
            <div class="form-group">
              <label>政治面貌</label>
              <select v-model="resumeData.politicalStatus" class="input-field">
                <option value="群众">群众</option>
                <option value="共青团员">共青团员</option>
                <option value="中共党员">中共党员</option>
                <option value="中共预备党员">中共预备党员</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 教育经历模块 -->
      <div class="form-section">
        <h3 class="section-title">教育经历</h3>
        <div class="form-card">
          <div class="form-row">
            <div class="form-group">
              <label>入学时间</label>
              <input v-model="resumeData.educationStartDate" type="date" class="input-field" />
            </div>
            <div class="form-group">
              <label>毕业时间</label>
              <input v-model="resumeData.educationEndDate" type="date" class="input-field" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>学校名称</label>
              <input v-model="resumeData.schoolName" type="text" placeholder="请输入学校名称" class="input-field" />
            </div>
            <div class="form-group">
              <label>专业名称</label>
              <input v-model="resumeData.majorName" type="text" placeholder="请输入专业名称" class="input-field" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>学历</label>
              <select v-model="resumeData.educationLevel" class="input-field">
                <option value="高中">高中</option>
                <option value="中专">中专</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
            <div class="form-group">
              <!-- 空白占位，保持布局对齐 -->
            </div>
          </div>
          
          <div class="form-group">
            <label>详细描述</label>
            <textarea v-model="resumeData.educationDescription" 
                      placeholder="请描述您的教育经历，如主要课程、获得荣誉、参与活动等..." 
                      class="textarea-field"></textarea>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">求职意向</h3>
        <div class="form-card">
          <div class="form-group">
            <label>期望岗位</label>
            <input v-model="resumeData.expectedPosition" type="text" placeholder="请输入期望岗位" class="input-field" />
          </div>
          <div class="form-group">
            <label>期望城市</label>
            <input v-model="resumeData.expectedCity" type="text" placeholder="请输入期望城市" class="input-field" />
          </div>
          <div class="form-group">
            <label>期望薪资</label>
            <input v-model="resumeData.expectedSalary" type="text" placeholder="请输入期望薪资" class="input-field" />
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">职业技能</h3>
        <div class="form-card">
          <textarea v-model="resumeData.skills" placeholder="请输入精通的职业技能" class="textarea-field"></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">项目经历</h3>
        <div class="form-card">
          <textarea v-model="resumeData.projectExperience" placeholder="请输入您的项目经历" class="textarea-field"></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">工作经历</h3>
        <div class="form-card">
          <textarea v-model="resumeData.workExperience" placeholder="请输入您的项目经历" class="textarea-field"></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h3 class="section-title">奖项荣誉</h3>
        <div class="form-card">
          <textarea v-model="resumeData.awards" placeholder="请输入您的奖项荣誉" class="textarea-field"></textarea>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="reset-btn" @click="resetForm">重置</button>
        <button class="save-btn" @click="saveForm">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FillResume1',
  data() {
    return {
      currentResumeId: null,
      currentResumeTitle: '简历1',
      loading: false,
      resumeData: {
        name: '',
        gender: '男',
        phone: '',
        birthDate: '',
        email: '',
        politicalStatus: '群众',
        // 教育经历字段
        educationStartDate: '',
        educationEndDate: '',
        schoolName: '',
        majorName: '',
        educationLevel: '本科',
        educationDescription: '',
        // 其他字段
        expectedPosition: '',
        expectedCity: '',
        expectedSalary: '',
        skills: '',
        projectExperience: '',
        workExperience: '',
        awards: ''
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    nextStep() {
      this.saveForm()
      this.$router.push('/my-resume')
    },
    
    async resetForm() {
      // 重置表单数据
      if (confirm('确定要重置所有数据吗？此操作不可恢复。')) {
        // 重置前端表单数据
        this.resumeData = {
          name: '',
          gender: '男',
          phone: '',
          birthDate: '',
          email: '',
          politicalStatus: '群众',
          // 教育经历字段
          educationStartDate: '',
          educationEndDate: '',
          schoolName: '',
          majorName: '',
          educationLevel: '本科',
          educationDescription: '',
          // 其他字段
          expectedPosition: '',
          expectedCity: '',
          expectedSalary: '',
          skills: '',
          projectExperience: '',
          workExperience: '',
          awards: ''
        }
        
        // 立即保存重置后的状态到数据库，确保状态永存
        try {
          this.loading = true
          await this.saveResetDataToDatabase()
          console.log('✅ 重置状态已保存到数据库')
          alert('重置成功！')
        } catch (error) {
          console.error('❌ 保存重置状态失败:', error)
          alert('重置失败：' + error.message)
        } finally {
          this.loading = false
        }
      }
    },
    
    // 保存重置后的数据到数据库
    async saveResetDataToDatabase() {
      if (!this.currentResumeId) {
        throw new Error('简历ID不存在，无法保存')
      }
      
      const { resumeAPI } = await import('@/services/api')
      
      // 将重置后的空数据转换为数据库格式
      const resetData = {
        personalInfo: {
          name: '',
          gender: '男',
          phone: '',
          birthDate: '',
          email: '',
          politicalStatus: '群众',
          age: ''
        },
        jobIntention: {
          position: '',
          city: '',
          salary: '',
          jobType: '全职'
        },
        education: [],
        skills: [],
        projects: [],
        workExperience: [],
        certificates: []
      }
      
      const response = await resumeAPI.updateResume(this.currentResumeId, resetData)
      
      if (!response.success) {
        throw new Error(response.message || '保存重置状态失败')
      }
    },
    
    async saveForm() {
      if (!this.currentResumeId) {
        alert('简历ID不存在，无法保存')
        return
      }
      
      try {
        this.loading = true
        const { resumeAPI } = await import('@/services/api')
        
        // 将表单数据转换为数据库格式
        const updateData = {
          personalInfo: {
            name: this.resumeData.name,
            gender: this.resumeData.gender,
            phone: this.resumeData.phone,
            birthDate: this.resumeData.birthDate,
            email: this.resumeData.email,
            politicalStatus: this.resumeData.politicalStatus,
            age: this.calculateAge(this.resumeData.birthDate)
          },
          jobIntention: {
            position: this.resumeData.expectedPosition,
            city: this.resumeData.expectedCity,
            salary: this.resumeData.expectedSalary,
            jobType: '全职'
          },
          education: [{
            degree: this.resumeData.educationLevel,
            school: this.resumeData.schoolName,
            major: this.resumeData.majorName,
            startDate: this.formatDateForInput(this.resumeData.educationStartDate),
            endDate: this.formatDateForInput(this.resumeData.educationEndDate),
            description: this.resumeData.educationDescription
          }],
          skills: this.resumeData.skills ? this.resumeData.skills.split('\n').filter(s => s.trim()).map(skill => ({
            name: skill.trim(),
            level: 80
          })) : [],
          projects: this.resumeData.projectExperience ? [{
            name: '项目经历',
            description: this.resumeData.projectExperience,
            role: '参与者',
            startDate: '',
            endDate: '',
            technologies: []
          }] : [],
          workExperience: this.resumeData.workExperience ? [{
            company: '工作经历',
            position: '',
            startDate: '',
            endDate: '',
            description: this.resumeData.workExperience
          }] : [],
          certificates: this.resumeData.awards ? [{
            name: '奖项荣誉',
            issuer: '',
            date: '',
            description: this.resumeData.awards
          }] : []
        }
        
        const response = await resumeAPI.updateResume(this.currentResumeId, updateData)
        
        if (response.success) {
          alert('保存成功！')
        } else {
          throw new Error(response.message || '保存失败')
        }
        
      } catch (error) {
        console.error('❌ 保存简历失败:', error)
        alert('保存失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    // 格式化日期为 YYYY-MM-DD 格式（适用于日期选择器）
    formatDateForInput(dateStr) {
      if (!dateStr) return ''
      
      try {
        // 处理各种可能的日期格式
        let date
        if (dateStr.includes('/')) {
          // YYYY/MM/DD 或 MM/DD/YYYY 格式
          const parts = dateStr.split('/')
          if (parts[0].length === 4) {
            // YYYY/MM/DD
            date = new Date(dateStr.replace(/\//g, '-'))
          } else {
            // MM/DD/YYYY
            date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`)
          }
        } else {
          // 已经是 YYYY-MM-DD 或其他格式
          date = new Date(dateStr)
        }
        
        if (isNaN(date.getTime())) return ''
        
        // 转换为 YYYY-MM-DD 格式
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        return `${year}-${month}-${day}`
      } catch (error) {
        return ''
      }
    },

    // 计算年龄
    calculateAge(birthDate) {
      if (!birthDate) return ''
      
      try {
        const birth = new Date(birthDate.replace(/\//g, '-'))
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--
        }
        
        return age > 0 ? age : ''
      } catch (error) {
        return ''
      }
    },
    
    // 加载简历数据
    async loadResumeData() {
      if (!this.currentResumeId) return
      
      try {
        this.loading = true
        const { resumeAPI } = await import('@/services/api')
        const response = await resumeAPI.getResume(this.currentResumeId)
        
        if (response.success) {
          const resume = response.data
          
          // 将数据库格式转换为表单格式
          this.resumeData = {
            name: resume.personalInfo?.name || '',
            gender: resume.personalInfo?.gender || '男',
            phone: resume.personalInfo?.phone || '',
            birthDate: this.formatDateForInput(resume.personalInfo?.birthDate || ''),
            email: resume.personalInfo?.email || '',
            politicalStatus: resume.personalInfo?.politicalStatus || '群众',
            // 教育经历字段
            educationStartDate: this.formatDateForInput(resume.education?.[0]?.startDate || ''),
            educationEndDate: this.formatDateForInput(resume.education?.[0]?.endDate || ''),
            schoolName: resume.education?.[0]?.school || '',
            majorName: resume.education?.[0]?.major || '',
            educationLevel: resume.education?.[0]?.degree || '本科',
            educationDescription: resume.education?.[0]?.description || '',
            // 其他字段
            expectedPosition: resume.jobIntention?.position || '',
            expectedCity: resume.jobIntention?.city || '',
            expectedSalary: resume.jobIntention?.salary || '',
            skills: resume.skills?.map(s => s.name).join('\n') || '',
            projectExperience: resume.projects?.[0]?.description || '',
            workExperience: resume.workExperience?.[0]?.description || '',
            awards: resume.certificates?.[0]?.description || ''
          }
          
          this.currentResumeTitle = resume.title
        } else {
          throw new Error(response.message || '加载简历失败')
        }
        
      } catch (error) {
        console.error('❌ 加载简历失败:', error)
        // 如果加载失败，保持空白状态
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    // 获取URL参数中的简历ID
    const urlParams = new URLSearchParams(window.location.search)
    const resumeId = urlParams.get('id')
    
    if (resumeId) {
      this.currentResumeId = resumeId
      await this.loadResumeData()
    } else {
      // 如果没有ID，跳转回简历列表
      this.$router.push('/my-resume')
    }
  }
}
</script>

<style scoped>
.fill-resume-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding-bottom: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: transparent;
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
  flex: 1;
  text-align: center;
}

.content {
  padding: 20px;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  flex: 1;
  margin-bottom: 16px;
}

.form-row .form-group {
  margin-bottom: 0;
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
  background: #fff;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 日期选择器特殊样式 */
input[type="date"].input-field {
  position: relative;
  cursor: pointer;
}

input[type="date"].input-field::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

input[type="date"].input-field::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

.textarea-field {
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}

.textarea-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding: 0 20px;
}

.reset-btn, .save-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
}

.save-btn {
  background: #4A90E2;
  color: white;
}

.save-btn:hover {
  background: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-row .form-group {
    margin-bottom: 16px;
  }
  
  .form-row .form-group:last-child {
    margin-bottom: 0;
  }
  
  .action-buttons {
    padding: 0 12px;
    margin-top: 24px;
  }
}
</style>



