const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, type, category, keyword, page = 1, pageSize = 10 } = event
  
  if (!city || !type) {
    return {
      success: false,
      message: '参数不完整：city 和 type 为必填项'
    }
  }
  
  try {
    const collection = db.collection('rankings')
    
    // 构建查询条件
    let whereCondition = {
      city: city,
      type: type
    }
    
    // 分类筛选
    if (category) {
      whereCondition.category = category
    }
    
    // 关键词搜索（店名或理由）
    if (keyword) {
      whereCondition = db.command.or([
        {
          shopName: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        },
        {
          reason: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        }
      ])
      whereCondition.city = city
      whereCondition.type = type
      if (category) {
        whereCondition.category = category
      }
    }
    
    // 查询总数
    const countResult = await collection.where(whereCondition).count()
    const total = countResult.total
    
    // 分页查询（按满意度排序）
    const { data } = await collection
      .where(whereCondition)
      .orderBy('satisfaction', type === 'red' ? 'desc' : 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: data || [],
      total: total,
      page: page,
      pageSize: pageSize,
      hasMore: total > page * pageSize
    }
  } catch (err) {
    console.error('获取榜单失败:', err)
    return {
      success: false,
      message: '获取榜单失败',
      error: err.message
    }
  }
}
