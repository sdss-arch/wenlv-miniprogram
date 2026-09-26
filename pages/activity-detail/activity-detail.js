const app = getApp()

Page({
  data: {
    activityId: '',
    activity: {},
    isFavorited: false,
    isJoined: false,
    commentCount: 0,
    loading: true
  },

  onLoad: function(options) {
    const { id } = options
    if (!id) {
      wx.showToast({
        title: '活动ID不能为空',
        icon: 'none',
        complete: () => {
          wx.navigateBack()
        }
      })
      return
    }

    this.setData({
      activityId: id
    })

    this.loadActivityDetail()
    this.checkFavoriteStatus()
    this.checkJoinStatus()
  },

  // 加载活动详情
  loadActivityDetail: function() {
    const { activityId } = this.data

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getActivityDetail',
      data: {
        id: activityId
      },
      success: res => {
        if (res.result && res.result.success) {
          const activity = res.result.data || {}
          
          // 格式化时间
          if (activity.startTime) {
            const startDate = new Date(activity.startTime)
            activity.startTime = `${String(startDate.getMonth() + 1).padStart(2, '0')}月${String(startDate.getDate()).padStart(2, '0')}日 ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
          }
          
          if (activity.endTime) {
            const endDate = new Date(activity.endTime)
            activity.endTime = `${String(endDate.getMonth() + 1).padStart(2, '0')}月${String(endDate.getDate()).padStart(2, '0')}日 ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
          }
          
          if (activity.deadline) {
            const deadlineDate = new Date(activity.deadline)
            activity.deadline = `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth() + 1).padStart(2, '0')}-${String(deadlineDate.getDate()).padStart(2, '0')} ${String(deadlineDate.getHours()).padStart(2, '0')}:${String(deadlineDate.getMinutes()).padStart(2, '0')}`
          }

          // 处理报名用户头像
          if (activity.joinUsers && activity.joinUsers.length > 0) {
            activity.joinUsers = activity.joinUsers.slice(0, 5)
          } else {
            activity.joinUsers = []
          }

          this.setData({
            activity: activity,
            commentCount: activity.commentCount || 0
          })
        } else {
          wx.showToast({
            title: res.result?.message || '获取活动详情失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('获取活动详情失败:', err)
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

  // 检查收藏状态
  checkFavoriteStatus: function() {
    const { activityId } = this.data
    const favorites = wx.getStorageSync('favoriteActivities') || []
    this.setData({
      isFavorited: favorites.includes(activityId)
    })
  },

  // 检查报名状态
  checkJoinStatus: function() {
    const { activityId } = this.data
    const joinedActivities = wx.getStorageSync('joinedActivities') || []
    this.setData({
      isJoined: joinedActivities.includes(activityId)
    })
  },

  // 切换收藏
  toggleFavorite: function() {
    const { activityId, isFavorited } = this.data
    let favorites = wx.getStorageSync('favoriteActivities') || []

    if (isFavorited) {
      favorites = favorites.filter(id => id !== activityId)
      wx.showToast({
        title: '取消收藏',
        icon: 'success'
      })
    } else {
      favorites.push(activityId)
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }

    wx.setStorageSync('favoriteActivities', favorites)
    this.setData({
      isFavorited: !isFavorited
    })
  },

  // 分享活动
  shareActivity: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 查看报名名单
  viewJoinList: function() {
    const { activityId } = this.data
    wx.navigateTo({
      url: `/pages/join-list/join-list?id=${activityId}`
    })
  },

  // 打开地图
  openLocation: function() {
    const { activity } = this.data
    if (!activity.latitude || !activity.longitude) {
      wx.showToast({
        title: '暂无位置信息',
        icon: 'none'
      })
      return
    }

    wx.openLocation({
      latitude: activity.latitude,
      longitude: activity.longitude,
      name: activity.location,
      address: activity.location
    })
  },

  // 显示评论
  showComments: function() {
    const { activityId } = this.data
    wx.navigateTo({
      url: `/pages/comments/comments?type=activity&id=${activityId}`
    })
  },

  // 报名活动
  joinActivity: function() {
    const { activityId, activity, isJoined } = this.data

    if (isJoined) {
      wx.showToast({
        title: '您已报名',
        icon: 'none'
      })
      return
    }

    if (activity.status !== 'ongoing') {
      wx.showToast({
        title: '活动已结束或已满员',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认报名',
      content: `确定要报名"${activity.title}"吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'joinActivity',
            data: {
              activityId: activityId
            },
            success: res => {
              if (res.result && res.result.success) {
                // 保存报名记录
                let joinedActivities = wx.getStorageSync('joinedActivities') || []
                joinedActivities.push(activityId)
                wx.setStorageSync('joinedActivities', joinedActivities)

                this.setData({
                  isJoined: true,
                  'activity.joinCount': (activity.joinCount || 0) + 1
                })

                wx.showToast({
                  title: '报名成功',
                  icon: 'success'
                })
              } else {
                wx.showToast({
                  title: res.result?.message || '报名失败',
                  icon: 'none'
                })
              }
            },
            fail: err => {
              console.error('报名失败:', err)
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  // 分享给朋友
  onShareAppMessage: function() {
    const { activity } = this.data
    return {
      title: activity.title,
      path: `/pages/activity-detail/activity-detail?id=${activity._id}`,
      imageUrl: activity.coverImage
    }
  },

  // 分享到朋友圈
  onShareTimeline: function() {
    const { activity } = this.data
    return {
      title: activity.title,
      query: `id=${activity._id}`,
      imageUrl: activity.coverImage
    }
  }
})
