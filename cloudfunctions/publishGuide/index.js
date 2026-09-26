const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, title, category, sortOrder, coverImage, introduction, content } = event
  const { OPENID } = cloud.getWXContext()
  
  // 参数验证
  if (!city || !title || !category || !coverImage || !introduction || !content) {
    return {
      success: false,
      message: '参数不完整'
    }
  }
  
  try {
    let publisherName = '匿名用户'
    let publisherAvatar = ''
    
    // 如果有 OPENID，尝试获取用户信息
    if (OPENID) {
      try {
        const userResult = await db.collection('users').where({
          _openid: OPENID
        }).get()
        
        if (userResult.data && userResult.data.length > 0) {
          const user = userResult.data[0]
          publisherName = user.nickName || publisherName
          publisherAvatar = user.avatarUrl || publisherAvatar
        }
      } catch (userErr) {
        console.log('获取用户信息失败:', userErr)
        // 获取用户信息失败不影响发布
      }
    }
    
    // 构建攻略数据
    const guideData = {
      city: city,
      title: title,
      category: category,
      sortOrder: sortOrder || 9999,
      coverImage: coverImage,
      introduction: introduction,
      content: content,
      _openid: OPENID || '',
      publisherName: publisherName,
      publisherAvatar: publisherAvatar,
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      status: 'active',
      viewCount: 0
    }
    
    // 添加到数据库
    const result = await db.collection('travel_guides').add({
      data: guideData
    })
    
    return {
      success: true,
      message: '发布成功',
      data: {
        _id: result._id
      }
    }
  } catch (err) {
    console.error('发布攻略失败:', err)
    return {
      success: false,
      message: '发布失败',
      error: err.message
    }
  }
}
