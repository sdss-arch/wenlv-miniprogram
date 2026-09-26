const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city, phrase, meaning, example, tags, audioUrl } = event
  const { OPENID } = cloud.getWXContext()
  
  // 参数校验
  if (!city) {
    return {
      success: false,
      message: '城市不能为空'
    }
  }
  
  if (!phrase || !phrase.trim()) {
    return {
      success: false,
      message: '方言不能为空'
    }
  }
  
  if (!meaning || !meaning.trim()) {
    return {
      success: false,
      message: '释义不能为空'
    }
  }
  
  try {
    const dialectCollection = db.collection('dialects')
    
    // 检查是否已存在相同的方言
    const existing = await dialectCollection.where({
      city: city,
      phrase: phrase.trim(),
      status: 'active'
    }).get()
    
    if (existing.data.length > 0) {
      return {
        success: false,
        message: '该方言已存在'
      }
    }
    
    // 获取当前最大的 sort 值
    const maxSortResult = await dialectCollection
      .where({ city: city })
      .orderBy('sort', 'desc')
      .limit(1)
      .get()
    
    const maxSort = maxSortResult.data.length > 0 ? maxSortResult.data[0].sort : 0
    
    // 插入数据
    const result = await dialectCollection.add({
      data: {
        city: city,
        phrase: phrase.trim(),
        meaning: meaning.trim(),
        example: example ? example.trim() : '',
        tags: tags || [],
        audioUrl: audioUrl || '',
        sort: maxSort + 1,
        status: 'active',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        _openid: OPENID
      }
    })
    
    return {
      success: true,
      message: '发布成功',
      data: {
        id: result._id
      }
    }
  } catch (err) {
    console.error('发布方言失败:', err)
    return {
      success: false,
      message: '发布失败',
      error: err.message
    }
  }
}
