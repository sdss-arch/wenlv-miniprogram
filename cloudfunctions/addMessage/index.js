const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  if (!openid) {
    return {
      success: false,
      message: '用户未登录'
    }
  }
  
  const { city, content } = event
  
  if (!city) {
    return {
      success: false,
      message: '城市参数不能为空'
    }
  }
  
  if (!content || content.trim() === '') {
    return {
      success: false,
      message: '留言内容不能为空'
    }
  }
  
  if (content.length > 500) {
    return {
      success: false,
      message: '留言内容不能超过500字'
    }
  }
  
  try {
    const userCollection = db.collection('users')
    const { data: users } = await userCollection.where({
      _openid: openid
    }).get()
    
    let userName = '匿名用户'
    let userAvatar = ''
    
    if (users && users.length > 0) {
      userName = users[0].nickname || userName
      userAvatar = users[0].avatarUrl || userAvatar
    }
    
    const messageCollection = db.collection('messages')
    
    await messageCollection.add({
      data: {
        city: city,
        content: content.trim(),
        userName: userName,
        userAvatar: userAvatar,
        _openid: openid,
        createTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      message: '留言成功'
    }
  } catch (err) {
    console.error('添加留言失败', err)
    return {
      success: false,
      message: '添加留言失败',
      error: err.message
    }
  }
}