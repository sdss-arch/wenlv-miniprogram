const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, type } = event
  
  // 参数校验
  if (!city || !type) {
    return {
      success: false,
      message: '参数不完整：city 和 type 为必填项'
    }
  }
  
  // 校验 type 参数
  if (!['martyr', 'celebrity'].includes(type)) {
    return {
      success: false,
      message: 'type 参数错误，只能是 martyr 或 celebrity'
    }
  }
  
  try {
    const collection = db.collection('hall_of_fame')
    
    const { data } = await collection.where({
      city: city,
      type: type
    }).orderBy('sort', 'asc').get()
    
    return {
      success: true,
      data: data || []
    }
  } catch (err) {
    console.error('获取名人堂数据失败:', err)
    return {
      success: false,
      message: '获取数据失败',
      error: err.message
    }
  }
}
