<template>
  <div class="network-diagnostics">
    <div class="diagnostics-header">
      <h3>网络连接诊断</h3>
      <button @click="runDiagnostics" :disabled="testing" class="test-btn">
        <span v-if="testing">诊断中...</span>
        <span v-else>开始诊断</span>
      </button>
    </div>
    
    <div v-if="results" class="diagnostics-results">
      <div class="result-item">
        <div class="result-label">平台信息</div>
        <div class="result-value">{{ results.platform }}</div>
      </div>
      
      <div class="result-item">
        <div class="result-label">API地址</div>
        <div class="result-value">{{ results.apiUrl }}</div>
      </div>
      
      <div class="result-item">
        <div class="result-label">互联网连接</div>
        <div class="result-value" :class="results.internetConnection ? 'success' : 'error'">
          {{ results.internetConnection ? '✅ 正常' : '❌ 失败' }}
        </div>
      </div>
      
      <div class="result-item">
        <div class="result-label">API服务器</div>
        <div class="result-value" :class="results.apiServer ? 'success' : 'error'">
          {{ results.apiServer ? '✅ 连接成功' : '❌ 连接失败' }}
        </div>
      </div>
      
      <div v-if="results.details && results.details.suggestion" class="suggestion">
        <div class="suggestion-title">💡 解决建议</div>
        <div class="suggestion-text">{{ results.details.suggestion }}</div>
      </div>
      
      <div v-if="report" class="diagnostics-report">
        <div class="report-title">诊断报告</div>
        <pre class="report-content">{{ report }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { showNetworkDiagnostics } from '@/utils/network-test.js'

export default {
  name: 'NetworkDiagnostics',
  data() {
    return {
      testing: false,
      results: null,
      report: null
    }
  },
  
  methods: {
    async runDiagnostics() {
      this.testing = true
      this.results = null
      this.report = null
      
      try {
        const { diagnostics, report } = await showNetworkDiagnostics()
        this.results = diagnostics
        this.report = report
      } catch (error) {
        console.error('诊断失败:', error)
        this.results = {
          error: true,
          message: error.message
        }
      } finally {
        this.testing = false
      }
    }
  }
}
</script>

<style scoped>
.network-diagnostics {
  padding: 20px;
  background: white;
  border-radius: 12px;
  margin: 20px;
}

.diagnostics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.diagnostics-header h3 {
  margin: 0;
  color: #333;
}

.test-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.diagnostics-results {
  space-y: 12px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.result-label {
  font-weight: 500;
  color: #666;
}

.result-value {
  font-weight: 600;
}

.result-value.success {
  color: #28a745;
}

.result-value.error {
  color: #dc3545;
}

.suggestion {
  margin-top: 16px;
  padding: 16px;
  background: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.suggestion-title {
  font-weight: 600;
  color: #856404;
  margin-bottom: 8px;
}

.suggestion-text {
  color: #856404;
  line-height: 1.5;
  white-space: pre-line;
}

.diagnostics-report {
  margin-top: 20px;
}

.report-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.report-content {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-line;
  overflow-x: auto;
}
</style>