const app = getApp()

Page({
  data: {
    cityName: '',
    searchKeyword: '',
    dialectList: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 20,
    playingId: null, // 当前播放的音频ID
    audioContext: null
  },

  onLoad: function() {
    this.loadCityData()
    this.loadDialectData(true)
  },

  onUnload: function() {
    // 页面卸载时停止音频播放
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
            wx.navigateTo({ url: '/pages/city-select/city-select' })
          }, 1500)
        }
      })
    }
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  // 执行搜索
  onSearch: function() {
    this.setData({ page: 1, hasMore: true })
    this.loadDialectData(true)
  },

  // 清空搜索
  clearSearch: function() {
    this.setData({ searchKeyword: '', page: 1, hasMore: true })
    this.loadDialectData(true)
  },

  // 加载方言数据
  loadDialectData: function(refresh = false) {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    const { page, pageSize, searchKeyword } = this.data
    const currentPage = refresh ? 1 : page

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getDialects',
      data: {
        city: selectedCity.city,
        keyword: searchKeyword,
        page: currentPage,
        pageSize: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const newList = res.result.data || []
          
          this.setData({
            dialectList: refresh ? newList : [...this.data.dialectList, ...newList],
            hasMore: newList.length === pageSize,
            page: currentPage + 1
          })
        } else {
          wx.showToast({
            title: res.result?.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('获取方言列表失败:', err)
        wx.showToast({ title: '网络错误', icon: 'none' })
      },
      complete: () => {
        this.setData({ loading: false })
        if (refresh) wx.stopPullDownRefresh()
      }
    })
  },

  // 播放音频
  playAudio: function(e) {
    const { id, audioUrl } = e.currentTarget.dataset
    
    if (!audioUrl) {
      wx.showToast({ title: '暂无音频', icon: 'none' })
      return
    }

    // 如果点击的是当前正在播放的音频，则暂停
    if (this.data.playingId === id && this.data.audioContext) {
      this.data.audioContext.pause()
      this.setData({ playingId: null })
      return
    }

    // 停止之前的音频
    if (this.data.audioContext) {
      this.data.audioContext.stop()
      this.data.audioContext.destroy()
    }

    // 创建新的音频上下文
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = audioUrl
    
    audioContext.onPlay(() => {
      this.setData({ playingId: id })
    })

    audioContext.onEnded(() => {
      this.setData({ playingId: null })
    })

    audioContext.onError((err) => {
      console.error('音频播放错误:', err)
      wx.showToast({ title: '播放失败', icon: 'none' })
      this.setData({ playingId: null })
    })

    audioContext.play()
    this.setData({ audioContext })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({ page: 1, hasMore: true })
    this.loadDialectData(true)
  },

  // 上拉加载更多
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadDialectData(false)
    }
  },

  // 跳转到发布方言页面
  goToPublishDialect: function() {
    wx.navigateTo({
      url: '/pages/publish-dialect/publish-dialect'
    })
  }
})
