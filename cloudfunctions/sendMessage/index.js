const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, type, content, voiceUrl, duration } = event
  const { OPENID } = cloud.getWXContext()
  
  if (!city || !type) {
    return {
      success: false,
      message: '参数不完整：city 和 type 为必填项'
    }
  }
  
  // 文字留言需要内容
  if (type === 'text' && !content) {
    return {
      success: false,
      message: '文字留言内容不能为空'
    }
  }
  
  // 语音留言需要语音URL和时长
  if (type === 'voice' && (!voiceUrl || !duration)) {
    return {
      success: false,
      message: '语音留言需要语音文件和时长'
    }
  }
  
  try {
    // 获取用户信息
    const userResult = await db.collection('users').where({
      _openid: OPENID
    }).get()
    
    let userName = '游客'
    let userAvatar = 'https://picsum.photos/100/100?random=0'
    
    if (userResult.data && userResult.data.length > 0) {
      const user = userResult.data[0]
      userName = user.nickName || userName
      userAvatar = user.avatarUrl || userAvatar
    }
    
    // 构建留言数据
    const messageData = {
      city: city,
      type: type,
      _openid: OPENID,
      userName: userName,
      userAvatar: userAvatar,
      createTime: db.serverDate()
    }
    
    if (type === 'text') {
      messageData.content = content
    } else if (type === 'voice') {
      messageData.voiceUrl = voiceUrl
      messageData.duration = duration
    }
    
    // 添加留言
    const result = await db.collection('messages').add({
      data: messageData
    })
    
    return {
      success: true,
      message: '发送成功',
      data: {
        _id: result._id
      }
    }
  } catch (err) {
    console.error('发送留言失败:', err)
    return {
      success: false,
      message: '发送留言失败',
      error: err.message
    }
  }
}
