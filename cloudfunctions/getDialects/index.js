const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { city, keyword, page = 1, pageSize = 20 } = event
  
  if (!city) {
    return {
      success: false,
      message: '城市参数不能为空'
    }
  }
  
  try {
    const dialectCollection = db.collection('dialects')
    
    // 构建查询条件
    let whereCondition = {
      city: city,
      status: 'active'
    }
    
    // 如果有搜索关键词，添加模糊搜索
    if (keyword && keyword.trim()) {
      const searchRegex = keyword.trim()
      whereCondition = _.and([
        { city: city },
        { status: 'active' },
        _.or([
          { phrase: db.RegExp({ regexp: searchRegex, options: 'i' }) },
          { meaning: db.RegExp({ regexp: searchRegex, options: 'i' }) },
          { example: db.RegExp({ regexp: searchRegex, options: 'i' }) }
        ])
      ])
    }
    
    // 查询数据
    const { data } = await dialectCollection
      .where(whereCondition)
      .orderBy('sort', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: data,
      page: page,
      pageSize: pageSize
    }
  } catch (err) {
    console.error('获取方言列表失败', err)
    return {
      success: false,
      message: '获取方言列表失败',
      error: err.message
    }
  }
}
