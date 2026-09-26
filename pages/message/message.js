const app = getApp()

Page({
  data: {
    cityName: '',
    messageList: [],
    inputValue: '',
    inputMode: 'text', // text 或 voice
    isRecording: false,
    recordTime: 0,
    playingId: '',
    scrollToMessage: '',
    loading: false,
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  recordTimer: null,
  innerAudioContext: null,

  onLoad: function() {
    this.checkCityAndLoad()
    this.initAudioContext()
  },

  onShow: function() {
    this.checkCityAndLoad()
  },

  onUnload: function() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
    }
  },

  checkCityAndLoad: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        complete: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/city-select/city-select'
            })
          }, 1500)
        }
      })
      return
    }

    this.setData({
      cityName: selectedCity.city
    })

    this.loadMessages(true)
  },

  // 初始化音频播放器
  initAudioContext: function() {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onEnded(() => {
      this.setData({
        playingId: ''
      })
    })
    this.innerAudioContext.onError(() => {
      this.setData({
        playingId: ''
      })
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      })
    })
  },

  // 加载留言列表
  loadMessages: function(refresh = false) {
    if (this.data.loading) return

    const { cityName, page, pageSize } = this.data

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getMessages',
      data: {
        city: cityName,
        page: page,
        pageSize: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const newMessages = res.result.data || []
          const userInfo = wx.getStorageSync('userInfo') || {}
          
          // 格式化数据
          const formattedMessages = newMessages.map(item => {
            // 判断是否是自己发的消息
            item.isMe = item._openid === userInfo.openid
            
            // 格式化时间
            if (item.createTime) {
              const date = new Date(item.createTime)
              const now = new Date()
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
              const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
              
              if (msgDate.getTime() === today.getTime()) {
                item.createTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
              } else {
                item.createTime = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
              }
            }
            
            return item
          })
          
          this.setData({
            messageList: refresh ? formattedMessages : [...formattedMessages, ...this.data.messageList],
            hasMore: newMessages.length === pageSize,
            page: refresh ? 2 : page + 1
          })
          
          // 滚动到底部
          if (refresh && formattedMessages.length > 0) {
            this.scrollToBottom()
          }
        } else {
          wx.showToast({
            title: res.result?.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('获取留言失败:', err)
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  // 滚动到底部
  scrollToBottom: function() {
    const { messageList } = this.data
    if (messageList.length > 0) {
      const lastMsg = messageList[messageList.length - 1]
      this.setData({
        scrollToMessage: `msg-${lastMsg._id}`
      })
    }
  },

  // 切换输入模式
  toggleInputMode: function() {
    const newMode = this.data.inputMode === 'text' ? 'voice' : 'text'
    this.setData({
      inputMode: newMode
    })
  },

  // 输入框内容变化
  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送消息
  sendMessage: function() {
    const { inputValue, cityName } = this.data
    
    if (!inputValue.trim()) {
      return
    }

    const userInfo = wx.getStorageSync('userInfo') || {}
    
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        city: cityName,
        type: 'text',
        content: inputValue.trim()
      },
      success: res => {
        if (res.result && res.result.success) {
          // 清空输入框
          this.setData({
            inputValue: ''
          })
          // 重新加载消息
          this.setData({
            page: 1,
            messageList: []
          })
          this.loadMessages(true)
        } else {
          wx.showToast({
            title: res.result?.message || '发送失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('发送失败:', err)
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },

  // 开始录音
  startRecord: function() {
    const recorderManager = wx.getRecorderManager()
    
    this.setData({
      isRecording: true,
      recordTime: 0
    })
    
    // 开始计时
    this.recordTimer = setInterval(() => {
      this.setData({
        recordTime: this.data.recordTime + 1
      })
      
      // 最长录音60秒
      if (this.data.recordTime >= 60) {
        this.stopRecord()
      }
    }, 1000)
    
    recorderManager.start({
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  // 停止录音
  stopRecord: function() {
    const recorderManager = wx.getRecorderManager()
    
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    
    this.setData({
      isRecording: false
    })
    
    recorderManager.stop()
    
    recorderManager.onStop((res) => {
      const { tempFilePath, duration } = res
      this.uploadVoice(tempFilePath, Math.round(duration / 1000))
    })
  },

  // 取消录音
  cancelRecord: function() {
    const recorderManager = wx.getRecorderManager()
    
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    
    this.setData({
      isRecording: false,
      recordTime: 0
    })
    
    recorderManager.stop()
  },

  // 上传语音文件
  uploadVoice: function(filePath, duration) {
    const { cityName } = this.data
    
    wx.showLoading({
      title: '发送中...'
    })
    
    // 上传文件到云存储
    const cloudPath = `voices/${Date.now()}-${Math.random().toString(36).substr(2)}.mp3`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        // 发送语音消息
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            city: cityName,
            type: 'voice',
            voiceUrl: res.fileID,
            duration: duration
          },
          success: res => {
            wx.hideLoading()
            if (res.result && res.result.success) {
              this.setData({
                page: 1,
                messageList: []
              })
              this.loadMessages(true)
            } else {
              wx.showToast({
                title: res.result?.message || '发送失败',
                icon: 'none'
              })
            }
          },
          fail: err => {
            wx.hideLoading()
            console.error('发送失败:', err)
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            })
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error('上传失败:', err)
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  },

  // 播放语音
  playVoice: function(e) {
    const { url, id } = e.currentTarget.dataset
    
    if (this.data.playingId === id) {
      // 正在播放，停止
      this.innerAudioContext.stop()
      this.setData({
        playingId: ''
      })
    } else {
      // 播放新的
      this.setData({
        playingId: id
      })
      this.innerAudioContext.src = url
      this.innerAudioContext.play()
    }
  },

  // 下拉加载更多
  onPullDownRefresh: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMessages(false)
    }
    wx.stopPullDownRefresh()
  }
})
