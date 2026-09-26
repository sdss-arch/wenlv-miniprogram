const app = getApp()

Page({
  data: {
    cityName: '',
    form: {
      phrase: '',
      meaning: '',
      example: '',
      tags: [],
      audioUrl: ''
    },
    tagInput: '',
    submitting: false,
    isPlaying: false,
    audioContext: null,
    canSubmit: false,
    isRecording: false,
    recordTime: 0
  },

  recorderManager: null,
  recordTimer: null,

  onLoad: function() {
    this.loadCityData()
  },

  onUnload: function() {
    if (this.data.audioContext) {
      this.data.audioContext.stop()
      this.data.audioContext.destroy()
    }
  },

  // 加载城市数据
  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({ cityName: selectedCity.city })
    } else {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    }
  },

  // 输入处理
  onInput: function(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [`form.${field}`]: value
    }, () => {
      this.checkCanSubmit()
    })
  },

  // 检查是否可以提交
  checkCanSubmit: function() {
    const { form } = this.data
    const canSubmit = form.phrase.trim() && form.meaning.trim()
    this.setData({ canSubmit })
  },

  // 标签输入
  onTagInput: function(e) {
    this.setData({ tagInput: e.detail.value })
  },

  // 添加标签
  addTag: function() {
    const { tagInput, form } = this.data
    const tag = tagInput.trim()
    
    if (!tag) {
      wx.showToast({ title: '请输入标签', icon: 'none' })
      return
    }
    
    if (form.tags.includes(tag)) {
      wx.showToast({ title: '标签已存在', icon: 'none' })
      return
    }
    
    if (form.tags.length >= 5) {
      wx.showToast({ title: '最多添加5个标签', icon: 'none' })
      return
    }
    
    this.setData({
      'form.tags': [...form.tags, tag],
      tagInput: ''
    })
  },

  // 删除标签
  removeTag: function(e) {
    const { index } = e.currentTarget.dataset
    const { tags } = this.data.form
    tags.splice(index, 1)
    this.setData({ 'form.tags': tags })
  },

  // 开始录音（长按触发）
  startRecord: function() {
    // 初始化录音管理器
    this.recorderManager = wx.getRecorderManager()
    
    this.recorderManager.onStart(() => {
      console.log('录音开始')
      this.setData({ 
        isRecording: true,
        recordTime: 0
      })
      // 开始计时
      this.recordTimer = setInterval(() => {
        this.setData({
          recordTime: this.data.recordTime + 1
        })
        // 最多录音60秒
        if (this.data.recordTime >= 60) {
          this.stopRecord()
        }
      }, 1000)
    })
    
    this.recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.handleRecordStop(res.tempFilePath)
    })
    
    this.recorderManager.onError((err) => {
      console.error('录音失败', err)
      wx.showToast({ title: '录音失败', icon: 'none' })
      this.resetRecordState()
    })
    
    // 开始录音
    this.recorderManager.start({
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  // 停止录音（松开触发）
  stopRecord: function() {
    if (!this.data.isRecording || !this.recorderManager) {
      return
    }
    
    // 录音时间太短（少于1秒）则取消
    if (this.data.recordTime < 1) {
      this.recorderManager.stop()
      wx.showToast({ title: '录音时间太短', icon: 'none' })
      this.resetRecordState()
      return
    }
    
    this.recorderManager.stop()
  },

  // 处理录音结束
  handleRecordStop: function(tempFilePath) {
    this.resetRecordState()
    this.uploadAudio(tempFilePath)
  },

  // 重置录音状态
  resetRecordState: function() {
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    this.setData({
      isRecording: false,
      recordTime: 0
    })
  },

  // 上传音频
  uploadAudio: function(filePath) {
    wx.showLoading({ title: '上传中...' })
    
    const cloudPath = `dialect-audio/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.mp3`
    
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        this.setData({
          'form.audioUrl': res.fileID
        })
        wx.showToast({ title: '上传成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('上传失败:', err)
        wx.showToast({ title: '上传失败', icon: 'none' })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 播放音频
  playAudio: function() {
    const { form, isPlaying, audioContext: currentAudio } = this.data
    const audioUrl = form.audioUrl
    
    if (isPlaying) {
      if (currentAudio) {
        currentAudio.stop()
      }
      this.setData({ isPlaying: false })
      return
    }
    
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = audioUrl
    
    audioContext.onPlay(() => {
      this.setData({ isPlaying: true })
    })
    
    audioContext.onEnded(() => {
      this.setData({ isPlaying: false })
    })
    
    audioContext.onError(() => {
      wx.showToast({ title: '播放失败', icon: 'none' })
      this.setData({ isPlaying: false })
    })
    
    audioContext.play()
    this.setData({ audioContext })
  },

  // 删除音频
  deleteAudio: function() {
    wx.showModal({
      title: '提示',
      content: '确定删除音频吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            'form.audioUrl': '',
            isPlaying: false
          })
          if (this.data.audioContext) {
            this.data.audioContext.stop()
            this.data.audioContext.destroy()
          }
        }
      }
    })
  },

  // 提交表单
  submitForm: function() {
    const { form, cityName } = this.data
    
    if (!form.phrase.trim()) {
      wx.showToast({ title: '请输入方言', icon: 'none' })
      return
    }
    
    if (!form.meaning.trim()) {
      wx.showToast({ title: '请输入释义', icon: 'none' })
      return
    }
    
    this.setData({ submitting: true })
    
    wx.cloud.callFunction({
      name: 'publishDialect',
      data: {
        city: cityName,
        phrase: form.phrase.trim(),
        meaning: form.meaning.trim(),
        example: form.example.trim(),
        tags: form.tags,
        audioUrl: form.audioUrl
      },
      success: (res) => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            complete: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.result?.message || '发布失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('发布失败:', err)
        wx.showToast({ title: '发布失败', icon: 'none' })
      },
      complete: () => {
        this.setData({ submitting: false })
      }
    })
  }
})
