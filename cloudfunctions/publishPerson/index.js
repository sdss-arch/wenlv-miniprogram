const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, type, photo, name, introduction, experience } = event
  const { OPENID } = cloud.getWXContext()
  
  // 参数验证
  if (!city || !type || !photo || !name || !introduction || !experience) {
    return {
      success: false,
      message: '参数不完整'
    }
  }
  
  // 验证类型
  if (!['martyr', 'celebrity'].includes(type)) {
    return {
      success: false,
      message: '类型参数错误'
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
    
    // 构建人物数据
    const personData = {
      city: city,
      type: type,
      photo: photo,
      name: name,
      introduction: introduction,
      experience: experience,
      _openid: OPENID || '',
      publisherName: publisherName,
      publisherAvatar: publisherAvatar,
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      status: 'active',
      viewCount: 0
    }
    
    // 添加到数据库
    const result = await db.collection('hall_of_fame').add({
      data: personData
    })
    
    return {
      success: true,
      message: '发布成功',
      data: {
        _id: result._id
      }
    }
  } catch (err) {
    console.error('发布人物失败:', err)
    return {
      success: false,
      message: '发布失败',
      error: err.message
    }
  }
}
