const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 本地头像路径（9个默认头像）
const defaultAvatars = [
  '/images/avatar/默认头像1.jpg',
  '/images/avatar/默认头像2.jpg',
  '/images/avatar/默认头像3.jpg',
  '/images/avatar/默认头像4.jpg',
  '/images/avatar/默认头像5.jpg',
  '/images/avatar/默认头像6.jpg',
  '/images/avatar/默认头像7.jpg',
  '/images/avatar/默认头像8.jpg',
  '/images/avatar/默认头像9.jpg'
]

const adjectives = ['快乐的', '阳光的', '勇敢的', '聪明的', '友善的', '热情的', '诚实的', '可爱的']
const nouns = ['旅行者', '探险家', '游客', '行者', '游人', '背包客', '观光客', '驴友']

function generateRandomNickname() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 1000)
  return `${adj}${noun}${num}`
}

function getRandomAvatar() {
  return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  if (!openid) {
    return {
      success: false,
      message: '获取用户openid失败'
    }
  }
  
  try {
    const userCollection = db.collection('users')
    
    const { data: existingUsers } = await userCollection.where({
      _openid: openid
    }).get()
    
    let userInfo
    
    if (existingUsers && existingUsers.length > 0) {
      userInfo = existingUsers[0]
    } else {
      const newUser = {
        _openid: openid,
        nickname: generateRandomNickname(),
        avatarUrl: getRandomAvatar(),
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        selectedCity: null
      }
      
      const { _id } = await userCollection.add({
        data: newUser
      })
      
      userInfo = {
        _id,
        ...newUser
      }
    }
    
    return {
      success: true,
      openid: openid,
      userInfo: {
        _id: userInfo._id,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl,
        selectedCity: userInfo.selectedCity
      }
    }
  } catch (err) {
    console.error('登录处理失败', err)
    return {
      success: false,
      message: '登录处理失败',
      error: err.message
    }
  }
}