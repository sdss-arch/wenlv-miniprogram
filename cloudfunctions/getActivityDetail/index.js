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
    const { data } = await db.collection('activities').doc(id).get()
    
    if (!data) {
      return {
        success: false,
        message: '活动不存在'
      }
    }
    
    // 增加浏览量
    await db.collection('activities').doc(id).update({
      data: {
        viewCount: db.command.inc(1)
      }
    })
    
    return {
      success: true,
      data: data
    }
  } catch (err) {
    console.error('获取活动详情失败:', err)
    return {
      success: false,
      message: '获取活动详情失败',
      error: err.message
    }
  }
}
