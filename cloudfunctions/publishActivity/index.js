const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { 
    city, title, category, sort, maxCount, 
    startTime, endTime, deadline, location, latitude, longitude,
    duration, cost, content, coverImages 
  } = event
  const { OPENID } = cloud.getWXContext()
  
  // 参数校验
  if (!city) {
    return { success: false, message: '城市不能为空' }
  }
  if (!title || !title.trim()) {
    return { success: false, message: '标题不能为空' }
  }
  if (!category) {
    return { success: false, message: '分类不能为空' }
  }
  if (!startTime) {
    return { success: false, message: '活动开始时间不能为空' }
  }
  if (!endTime) {
    return { success: false, message: '活动结束时间不能为空' }
  }
  if (!deadline) {
    return { success: false, message: '报名截止时间不能为空' }
  }
  if (!location || !location.trim()) {
    return { success: false, message: '活动地点不能为空' }
  }
  if (!duration) {
    return { success: false, message: '预计时长不能为空' }
  }
  if (!cost) {
    return { success: false, message: '活动费用不能为空' }
  }
  if (!content) {
    return { success: false, message: '活动内容不能为空' }
  }
  if (!coverImages || coverImages.length === 0) {
    return { success: false, message: '请上传活动封面' }
  }
  
  try {
    const activityCollection = db.collection('activities')
    
    // 插入数据
    const result = await activityCollection.add({
      data: {
        city: city,
        title: title.trim(),
        category: category,
        sort: sort || 9999,
        maxCount: maxCount || 0,
        startTime: startTime,
        endTime: endTime,
        deadline: deadline,
        location: location.trim(),
        latitude: latitude || null,
        longitude: longitude || null,
        duration: duration,
        cost: cost,
        content: content,
        coverImage: coverImages[0],
        coverImages: coverImages,
        joinCount: 0,
        joinUsers: [],
        status: 'active',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        _openid: OPENID
      }
    })
    
    return {
      success: true,
      message: '发布成功',
      data: {
        id: result._id
      }
    }
  } catch (err) {
    console.error('发布活动失败:', err)
    return {
      success: false,
      message: '发布失败',
      error: err.message
    }
  }
}
