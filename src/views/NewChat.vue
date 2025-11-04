<template>
  <div class="chat-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">新对话</h1>
    </div>
    
    <div class="content">
      <div class="chat-area">
        <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
          <div class="message-content">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>
      </div>
      
      <div class="input-area">
        <input 
          v-model="inputText" 
          type="text" 
          placeholder="请输入您的问题..."
          class="chat-input"
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewChat',
  data() {
    return {
      inputText: '',
      messages: [
        {
          id: 1,
          type: 'bot',
          content: '您好！我是您的求职助手，有什么可以帮助您的吗？',
          time: new Date()
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    sendMessage() {
      if (!this.inputText.trim()) return
      
      // 添加用户消息
      this.messages.push({
        id: Date.now(),
        type: 'user',
        content: this.inputText,
        time: new Date()
      })
      
      const userMessage = this.inputText
      this.inputText = ''
      
      // 模拟机器人回复
      setTimeout(() => {
        this.messages.push({
          id: Date.now() + 1,
          type: 'bot',
          content: '谢谢您的问题，我正在为您分析...',
          time: new Date()
        })
      }, 1000)
    },
    formatTime(time) {
      return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
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
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.bot {
  align-items: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 16px;
  line-height: 1.4;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.bot .message-content {
  background: white;
  color: #333;
  border: 1px solid #e9ecef;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  padding: 0 8px;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e9ecef;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  margin-right: 12px;
}

.chat-input:focus {
  border-color: #667eea;
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>



