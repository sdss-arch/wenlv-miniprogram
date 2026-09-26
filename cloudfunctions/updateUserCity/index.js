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
  
  const { city } = event
  
  if (!city || !city.city) {
    return {
      success: false,
      message: '城市信息不完整'
    }
  }
  
  try {
    const userCollection = db.collection('users')
    
    const { data: users } = await userCollection.where({
      _openid: openid
    }).get()
    
    if (users && users.length > 0) {
      await userCollection.doc(users[0]._id).update({
        data: {
          selectedCity: city,
          updateTime: db.serverDate()
        }
      })
    }
    
    return {
      success: true,
      message: '城市更新成功'
    }
  } catch (err) {
    console.error('更新城市失败', err)
    return {
      success: false,
      message: '更新城市失败',
      error: err.message
    }
  }
}