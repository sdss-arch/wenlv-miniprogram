const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, type, shopName, category, satisfaction, reason, images } = event
  const { OPENID } = cloud.getWXContext()
  
  // 参数验证
  if (!city || !type || !shopName || !category || satisfaction === undefined || !reason) {
    return {
      success: false,
      message: '参数不完整'
    }
  }
  
  // 验证类型
  if (!['red', 'black'].includes(type)) {
    return {
      success: false,
      message: '榜单类型错误'
    }
  }
  
  // 验证满意度范围
  const satisfactionNum = parseFloat(satisfaction)
  if (isNaN(satisfactionNum) || satisfactionNum < 0 || satisfactionNum > 100) {
    return {
      success: false,
      message: '满意度必须在0-100之间'
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
      }
    }
    
    // 构建红黑榜数据
    const rankingData = {
      city: city,
      type: type, // red 或 black
      shopName: shopName,
      category: category,
      satisfaction: satisfactionNum,
      reason: reason,
      images: images || [],
      _openid: OPENID || '',
      publisherName: publisherName,
      publisherAvatar: publisherAvatar,
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      status: 'active',
      viewCount: 0,
      likeCount: 0
    }
    
    // 添加到数据库
    const result = await db.collection('rankings').add({
      data: rankingData
    })
    
    return {
      success: true,
      message: '发布成功',
      data: {
        _id: result._id
      }
    }
  } catch (err) {
    console.error('发布红黑榜失败:', err)
    return {
      success: false,
      message: '发布失败',
      error: err.message
    }
  }
}
