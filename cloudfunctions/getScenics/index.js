const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { city } = event
  
  if (!city) {
    return {
      success: false,
      message: '城市参数不能为空'
    }
  }
  
  try {
    const scenicCollection = db.collection('scenics')
    
    const { data } = await scenicCollection
      .where({
        city: city
      })
      .orderBy('sort', 'asc')
      .field({
        _id: true,
        name: true,
        image: true,
        city: true,
        rating: true,
        sort: true
      })
      .get()
    
    const formattedData = data.map(item => {
      const fullStars = Math.floor(item.rating || 0)
      let stars = ''
      for (let i = 0; i < 5; i++) {
        stars += i < fullStars ? '★' : '☆'
      }
      
      return {
        ...item,
        ratingStars: stars
      }
    })
    
    return {
      success: true,
      data: formattedData
    }
  } catch (err) {
    console.error('获取景点列表失败', err)
    return {
      success: false,
      message: '获取景点列表失败',
      error: err.message
    }
  }
}