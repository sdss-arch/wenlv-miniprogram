const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city } = event
  
  if (!city) {
    return {
      success: false,
      message: '城市参数不能为空'
    }
  }
  
  try {
    const celebrityCollection = db.collection('celebrities')
    
    const { data } = await celebrityCollection
      .where({
        city: city
      })
      .orderBy('sort', 'asc')
      .get()
    
    return {
      success: true,
      data: data
    }
  } catch (err) {
    console.error('获取名人列表失败', err)
    return {
      success: false,
      message: '获取名人列表失败',
      error: err.message
    }
  }
}