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
    const collection = db.collection('recommends')
    
    const { data } = await collection.doc(id).get()
    
    if (!data) {
      return {
        success: false,
        message: '推荐不存在'
      }
    }
    
    return {
      success: true,
      data: data
    }
  } catch (err) {
    console.error('获取推荐详情失败:', err)
    return {
      success: false,
      message: '获取推荐详情失败',
      error: err.message
    }
  }
}
