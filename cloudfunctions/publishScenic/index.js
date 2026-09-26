const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  const {
    city,
    name,
    image,
    brief,
    description,
    rating,
    tags,
    openTime,
    ticketPrice,
    address
  } = event
  
  // 参数校验
  if (!city || !name || !image || !brief || !description) {
    return {
      success: false,
      message: '请填写完整信息'
    }
  }
  
  try {
    // 获取用户信息
    const userRes = await db.collection('users').where({
      _openid: openid
    }).get()
    
    let userInfo = {}
    if (userRes.data.length > 0) {
      userInfo = userRes.data[0]
    }
    
    // 生成评分星星
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    let ratingStars = ''
    for (let i = 0; i < fullStars; i++) {
      ratingStars += '★'
    }
    if (hasHalfStar) {
      ratingStars += '☆'
    }
    
    // 创建景点数据
    const scenicData = {
      _openid: openid,
      city,
      name: name.trim(),
      image,
      brief: brief.trim(),
      description: description.trim(),
      rating: rating || 5,
      ratingStars,
      tags: tags || [],
      openTime: openTime || '',
      ticketPrice: ticketPrice || '',
      address: address || '',
      publisherName: userInfo.nickName || '匿名用户',
      publisherAvatar: userInfo.avatarUrl || '',
      status: 1, // 1-正常 0-待审核
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      viewCount: 0
    }
    
    // 添加到数据库
    const result = await db.collection('scenics').add({
      data: scenicData
    })
    
    return {
      success: true,
      message: '发布成功',
      data: {
        id: result._id
      }
    }
    
  } catch (err) {
    console.error('发布景点失败:', err)
    return {
      success: false,
      message: '发布失败，请稍后重试'
    }
  }
}
