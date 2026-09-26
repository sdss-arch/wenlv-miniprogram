const app = getApp()

Page({
  data: {
    title: '',
    category: '',
    categoryIndex: 0,
    categories: ['线路', '吃喝', '住宿', '购物', '其他'],

    coverImage: '',
    introduction: '',
    content: '',
    contentBlocks: [], // 内容块数组
    showPreview: false,
    submitting: false,
    canSubmit: false
  },

  onLoad: function() {
    this.checkCity()
    // 初始化一个空文本块
    this.setData({
      contentBlocks: [{ type: 'text', content: '' }]
    })
  },

  // 检查城市选择
  checkCity: function() {
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
    }
  },

  // 标题输入
  onTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    })
    this.checkCanSubmit()
  },

  // 分类选择（picker方式）
  onCategoryChange: function(e) {
    const { categories } = this.data
    const index = e.detail.value
    this.setData({
      categoryIndex: index,
      category: categories[index]
    }, () => {
      this.checkCanSubmit()
    })
  },

  // 预览封面图片
  previewCoverImage: function() {
    const { coverImage } = this.data
    if (coverImage) {
      wx.previewImage({
        urls: [coverImage],
        current: coverImage
      })
    }
  },

  // 删除封面图片
  deleteCoverImage: function() {
    wx.showModal({
      title: '提示',
      content: '确定删除封面图片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            coverImage: ''
          }, () => {
            this.checkCanSubmit()
          })
        }
      }
    })
  },



  // 选择封面图片
  chooseCoverImage: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadCoverImage(tempFilePath)
      }
    })
  },

  // 上传封面图片
  uploadCoverImage: function(filePath) {
    wx.showLoading({ title: '上传中...' })

    const cloudPath = `guides/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        this.setData({
          coverImage: res.fileID
        })
        this.checkCanSubmit()
        wx.hideLoading()
      },
      fail: err => {
        console.error('上传失败:', err)
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
  },

  // 简介输入
  onIntroInput: function(e) {
    this.setData({
      introduction: e.detail.value
    })
    this.checkCanSubmit()
  },

  // ========== 图文编辑器功能 ==========

  // 添加第一个文本块
  addFirstTextBlock: function() {
    this.setData({
      contentBlocks: [{ type: 'text', content: '' }]
    })
  },

  // 内容块输入
  onContentBlockInput: function(e) {
    const index = e.currentTarget.dataset.index
    const value = e.detail.value
    
    const blocks = this.data.contentBlocks
    blocks[index].content = value
    
    this.setData({ contentBlocks: blocks })
    this.updateContentFromBlocks()
  },

  // 插入图片到内容
  insertImageToContent: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadContentImage(tempFilePath)
      }
    })
  },

  // 上传内容图片
  uploadContentImage: function(filePath) {
    wx.showLoading({ title: '上传中...' })

    const cloudPath = `guide-content/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        const blocks = this.data.contentBlocks
        // 添加图片块
        blocks.push({ type: 'image', content: res.fileID })
        // 图片后自动添加文本块方便继续输入
        blocks.push({ type: 'text', content: '' })
        
        this.setData({ contentBlocks: blocks })
        this.updateContentFromBlocks()
        wx.hideLoading()
      },
      fail: err => {
        console.error('上传失败:', err)
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
  },

  // 删除内容块
  deleteContentBlock: function(e) {
    const index = e.currentTarget.dataset.index
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          const blocks = this.data.contentBlocks
          blocks.splice(index, 1)
          
          // 如果删除后没有内容，添加一个空文本块
          if (blocks.length === 0) {
            blocks.push({ type: 'text', content: '' })
          }
          
          this.setData({ contentBlocks: blocks })
          this.updateContentFromBlocks()
        }
      }
    })
  },

  // 预览图片
  previewBlockImage: function(e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({ urls: [src], current: src })
  },

  // 预览内容
  previewContent: function() {
    this.setData({ showPreview: true })
  },

  // 关闭预览
  closePreview: function() {
    this.setData({ showPreview: false })
  },

  // 阻止事件冒泡
  stopPropagation: function() {},

  // 将内容块转换为HTML
  updateContentFromBlocks: function() {
    let htmlContent = ''
    
    this.data.contentBlocks.forEach(block => {
      if (block.type === 'text' && block.content.trim()) {
        htmlContent += `<p>${block.content.trim()}</p>\n`
      } else if (block.type === 'image') {
        htmlContent += `<img src="${block.content}" style="max-width:100%;" />\n`
      }
    })
    
    this.setData({ content: htmlContent })
    this.checkCanSubmit()
  },

  // ========== 提交功能 ==========

  // 检查是否可以提交
  checkCanSubmit: function() {
    const { title, category, coverImage, introduction, content } = this.data
    const canSubmit = title.trim() && category && coverImage && introduction.trim() && content.trim()
    this.setData({ canSubmit: canSubmit })
  },

  // 提交表单
  submitForm: function() {
    if (!this.data.canSubmit || this.data.submitting) return

    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) {
      wx.showToast({ title: '请先选择城市', icon: 'none' })
      return
    }

    this.setData({ submitting: true })

    const { title, category, sortOrder, coverImage, introduction, content } = this.data

    wx.cloud.callFunction({
      name: 'publishGuide',
      data: {
        city: selectedCity.city,
        title: title.trim(),
        category: category,
  
        coverImage: coverImage,
        introduction: introduction.trim(),
        content: content.trim()
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            complete: () => {
              setTimeout(() => wx.navigateBack(), 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.result?.message || '发布失败',
            icon: 'none'
          })
          this.setData({ submitting: false })
        }
      },
      fail: err => {
        console.error('发布失败:', err)
        wx.showToast({ title: '网络错误', icon: 'none' })
        this.setData({ submitting: false })
      }
    })
  }
})
