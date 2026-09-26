const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { id } = event
  
  if (!id) {
    return {
      success: false,
      message: '参数不完整：id 为必填项'
    }
  }
  
  try {
    const result = await db.collection('travel_guides').doc(id).get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    console.error('获取攻略详情失败:', err)
    return {
      success: false,
      message: '获取攻略详情失败',
      error: err.message
    }
  }
}
