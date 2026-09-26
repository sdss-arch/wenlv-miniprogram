const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, category, keyword, page = 1, pageSize = 10 } = event
  
  if (!city) {
    return {
      success: false,
      message: '参数不完整：city 为必填项'
    }
  }
  
  try {
    const collection = db.collection('travel_guides')
    
    // 构建查询条件
    let whereCondition = {
      city: city
    }
    
    // 分类筛选
    if (category) {
      whereCondition.category = category
    }
    
    // 关键词搜索
    if (keyword) {
      whereCondition.title = db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    }
    
    // 查询总数
    const countResult = await collection.where(whereCondition).count()
    const total = countResult.total
    
    // 分页查询，只返回必要字段
    const { data } = await collection
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .field({
        _id: true,
        title: true,
        coverImage: true,
        city: true,
        category: true,
        viewCount: true
      })
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
    console.error('获取攻略列表失败:', err)
    return {
      success: false,
      message: '获取攻略列表失败',
      error: err.message
    }
  }
}
