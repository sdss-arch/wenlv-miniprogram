const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { id } = event
  
  if (!id) {
    return {
      success: false,
      message: '参数不完整：id 为必填项'
    }
  }
  
  try {
    await db.collection('travel_guides').doc(id).update({
      data: {
        viewCount: _.inc(1)
      }
    })
    
    return {
      success: true
    }
  } catch (err) {
    console.error('增加浏览量失败:', err)
    return {
      success: false,
      message: '增加浏览量失败',
      error: err.message
    }
  }
}
