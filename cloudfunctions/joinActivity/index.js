const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { activityId } = event
  const { OPENID } = cloud.getWXContext()
  
  if (!activityId) {
    return {
      success: false,
      message: '参数不完整：activityId 为必填项'
    }
  }
  
  try {
    // 获取活动信息
    const { data: activity } = await db.collection('activities').doc(activityId).get()
    
    if (!activity) {
      return {
        success: false,
        message: '活动不存在'
      }
    }
    
    // 检查活动状态
    if (activity.status !== 'ongoing') {
      return {
        success: false,
        message: '活动已结束或已满员'
      }
    }
    
    // 检查是否已报名
    const joinRecord = await db.collection('activity_joins').where({
      activityId: activityId,
      _openid: OPENID
    }).get()
    
    if (joinRecord.data && joinRecord.data.length > 0) {
      return {
        success: false,
        message: '您已报名该活动'
      }
    }
    
    // 检查人数是否已满
    if (activity.joinCount >= activity.maxCount) {
      // 更新活动状态为已满
      await db.collection('activities').doc(activityId).update({
        data: {
          status: 'full',
          statusText: '已满员'
        }
      })
      return {
        success: false,
        message: '活动人数已满'
      }
    }
    
    // 创建报名记录
    await db.collection('activity_joins').add({
      data: {
        activityId: activityId,
        _openid: OPENID,
        joinTime: db.serverDate(),
        status: 'joined'
      }
    })
    
    // 更新活动报名人数
    await db.collection('activities').doc(activityId).update({
      data: {
        joinCount: db.command.inc(1)
      }
    })
    
    return {
      success: true,
      message: '报名成功'
    }
  } catch (err) {
    console.error('报名失败:', err)
    return {
      success: false,
      message: '报名失败',
      error: err.message
    }
  }
}
