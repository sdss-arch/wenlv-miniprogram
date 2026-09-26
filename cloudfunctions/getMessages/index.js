const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, page = 1, pageSize = 20 } = event
  
  if (!city) {
    return {
      success: false,
      message: '参数不完整：city 为必填项'
    }
  }
  
  try {
    const collection = db.collection('messages')
    
    // 查询条件
    const whereCondition = {
      city: city
    }
    
    // 查询总数
    const countResult = await collection.where(whereCondition).count()
    const total = countResult.total
    
    // 分页查询（按时间倒序）
    const { data } = await collection
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    // 反转数据，让最新的在底部
    const reversedData = data.reverse()
    
    return {
      success: true,
      data: reversedData || [],
      total: total,
      page: page,
      pageSize: pageSize,
      hasMore: total > page * pageSize
    }
  } catch (err) {
    console.error('获取留言失败:', err)
    return {
      success: false,
      message: '获取留言失败',
      error: err.message
    }
  }
}
