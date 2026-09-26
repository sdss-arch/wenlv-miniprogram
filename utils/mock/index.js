/**
 * 模拟云服务拦截器（云后台到期期间临时使用）
 *
 * 工作原理：
 * - 安装后接管 wx.cloud.callFunction，按“云函数名”路由到本地数据处理；
 * - 接管 wx.cloud.uploadFile，上传不再走云存储，直接回传本地临时路径用于预览；
 * - 查询类处理（筛选/搜索/分页/排序）严格对齐 cloudfunctions 中各云函数的行为；
 * - 写入类处理（发布/报名/留言）会写入内存数据集并返回与云函数一致的结构，
 *   因此演示时“发布内容、报名活动、发送留言”都能立即在列表中看到；
 * - 每次返回均做深拷贝，页面侧对数据的格式化不会污染原始数据集。
 *
 * 开关在 app.js 中（USE_MOCK），云后台恢复后关闭开关即可恢复真实云调用，
 * 页面代码无需任何改动。
 */

var DB = require('./data.js')

// 模拟当前登录用户（与 login 云函数返回保持一致）
var MOCK_OPENID = 'mock-openid-demo-001'
var MOCK_USER = {
  _id: 'mock_user_001',
  openid: MOCK_OPENID,
  nickname: '快乐的旅行者2026',
  avatarUrl: '/images/avatar/默认头像1.jpg',
  selectedCity: null
}

/* ------------------------------ 工具函数 ------------------------------ */

// 深拷贝（页面会就地修改 item.startTime 等字段，避免污染源数据）
function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function genId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 100000)
}

// 不区分大小写的包含匹配（对应云函数 db.RegExp 模糊搜索）
function contains(field, keyword) {
  if (!keyword) return true
  return String(field == null ? '' : field).toLowerCase().indexOf(String(keyword).toLowerCase()) !== -1
}

// ISO 时间字符串比较（对应 orderBy createTime）
function timeDesc(a, b) {
  return new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime()
}

// 通用分页返回（结构对齐各列表云函数）
function paginate(list, event) {
  var page = event.page || 1
  var pageSize = event.pageSize || event.limit || 10
  var start = (page - 1) * pageSize
  var rows = list.slice(start, start + pageSize)
  return {
    data: clone(rows),
    total: list.length,
    page: page,
    pageSize: pageSize,
    hasMore: list.length > page * pageSize
  }
}

// 复刻 getScenics 云函数的星级生成逻辑
function buildRatingStars(rating) {
  var fullStars = Math.floor(rating || 0)
  var stars = ''
  for (var i = 0; i < 5; i++) {
    stars += i < fullStars ? '★' : '☆'
  }
  return stars
}

// 取当前登录用户资料（发布类云函数会带出发布人信息）
function currentUser() {
  var u = {}
  try {
    u = wx.getStorageSync('userInfo') || {}
  } catch (e) {
    u = {}
  }
  return {
    nickname: u.nickname || '匿名用户',
    avatarUrl: u.avatarUrl || ''
  }
}

// 内存报名记录（对应 activity_joins 集合）
var joinedMap = {}

/* ------------------------------ 云函数处理 ------------------------------ */

var handlers = {

  /* ===== 用户 / 城市 ===== */

  login: function () {
    return {
      success: true,
      openid: MOCK_OPENID,
      userInfo: clone(MOCK_USER)
    }
  },

  updateUserCity: function (event) {
    if (!event.city || !event.city.city) {
      return { success: false, message: '城市信息不完整' }
    }
    return { success: true, message: '城市更新成功' }
  },

  /* ===== 活动 ===== */

  getActivities: function (event) {
    if (!event.city) return { success: false, message: '参数不完整：city 为必填项' }

    var list = DB.activities.filter(function (item) {
      if (item.city !== event.city) return false
      if (event.category && item.category !== event.category) return false
      if (event.keyword && !contains(item.title, event.keyword)) return false
      return true
    }).sort(timeDesc)

    var result = paginate(list, event)
    result.success = true
    return result
  },

  getActivityDetail: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    var item = null
    for (var i = 0; i < DB.activities.length; i++) {
      if (DB.activities[i]._id === event.id) { item = DB.activities[i]; break }
    }
    if (!item) return { success: false, message: '活动不存在' }
    // 对齐云函数：浏览量 +1
    item.viewCount = (item.viewCount || 0) + 1
    return { success: true, data: clone(item) }
  },

  joinActivity: function (event) {
    if (!event.activityId) return { success: false, message: '参数不完整：activityId 为必填项' }

    var activity = null
    for (var i = 0; i < DB.activities.length; i++) {
      if (DB.activities[i]._id === event.activityId) { activity = DB.activities[i]; break }
    }
    if (!activity) return { success: false, message: '活动不存在' }
    if (activity.status !== 'ongoing') return { success: false, message: '活动已结束或已满员' }

    var key = MOCK_OPENID + '@' + event.activityId
    if (joinedMap[key]) return { success: false, message: '您已报名该活动' }
    if ((activity.joinCount || 0) >= activity.maxCount) {
      activity.status = 'full'
      activity.statusText = '已满员'
      return { success: false, message: '活动人数已满' }
    }

    joinedMap[key] = true
    activity.joinCount = (activity.joinCount || 0) + 1
    activity.joinUsers = activity.joinUsers || []
    activity.joinUsers.push({ avatar: MOCK_USER.avatarUrl })
    return { success: true, message: '报名成功' }
  },

  publishActivity: function (event) {
    if (!event.city || !event.title || !event.category || !event.startTime) {
      return { success: false, message: '参数不完整' }
    }
    var user = currentUser()
    var feeNum = parseFloat(event.cost)
    var now = new Date().toISOString()
    var record = {
      _id: genId('act'),
      city: event.city,
      title: event.title,
      category: event.category,
      sort: event.sort || 9999,
      maxCount: event.maxCount || 0,
      startTime: event.startTime,
      endTime: event.endTime,
      deadline: event.deadline,
      location: event.location,
      latitude: event.latitude || null,
      longitude: event.longitude || null,
      duration: event.duration,
      cost: event.cost,
      fee: isNaN(feeNum) ? 0 : feeNum,
      content: event.content || '',
      coverImage: (event.coverImages && event.coverImages[0]) || '',
      coverImages: event.coverImages || [],
      joinCount: 0,
      joinUsers: [],
      status: 'ongoing',
      statusText: '报名中',
      auditRule: '报名后无需审核',
      cancelRule: '报名随时可取消',
      commentCount: 0,
      viewCount: 0,
      contactName: event.contactName || '',
      contactPhone: event.contactPhone || '',
      publisherName: user.nickname,
      publisherAvatar: user.avatarUrl,
      _openid: MOCK_OPENID,
      createTime: now,
      updateTime: now
    }
    DB.activities.unshift(record)
    return { success: true, message: '发布成功', data: { id: record._id, _id: record._id } }
  },

  /* ===== 旅游攻略 ===== */

  getTravelGuides: function (event) {
    if (!event.city) return { success: false, message: '参数不完整：city 为必填项' }

    var list = DB.guides.filter(function (item) {
      if (item.city !== event.city) return false
      if (event.category && item.category !== event.category) return false
      if (event.keyword && !contains(item.title, event.keyword)) return false
      return true
    }).sort(timeDesc)

    var result = paginate(list, event)
    result.success = true
    return result
  },

  getGuideDetail: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    var item = null
    for (var i = 0; i < DB.guides.length; i++) {
      if (DB.guides[i]._id === event.id) { item = DB.guides[i]; break }
    }
    if (!item) return { success: false, message: '攻略不存在' }
    return { success: true, data: clone(item) }
  },

  incrementViewCount: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    for (var i = 0; i < DB.guides.length; i++) {
      if (DB.guides[i]._id === event.id) {
        DB.guides[i].viewCount = (DB.guides[i].viewCount || 0) + 1
        break
      }
    }
    return { success: true }
  },

  publishGuide: function (event) {
    if (!event.city || !event.title || !event.category || !event.coverImage) {
      return { success: false, message: '参数不完整' }
    }
    var user = currentUser()
    var now = new Date().toISOString()
    var record = {
      _id: genId('guide'),
      city: event.city,
      title: event.title,
      category: event.category,
      sortOrder: event.sortOrder || 9999,
      coverImage: event.coverImage,
      introduction: event.introduction || '',
      content: event.content || '',
      images: event.images || [],
      viewCount: 0,
      publisherName: user.nickname,
      publisherAvatar: user.avatarUrl,
      status: 'active',
      _openid: MOCK_OPENID,
      createTime: now,
      updateTime: now
    }
    DB.guides.unshift(record)
    return { success: true, message: '发布成功', data: { id: record._id, _id: record._id } }
  },

  /* ===== 景点 ===== */

  getScenics: function (event) {
    if (!event.city) return { success: false, message: '城市参数不能为空' }

    var list = DB.scenics.filter(function (item) {
      return item.city === event.city
    }).sort(function (a, b) {
      return (a.sort || 9999) - (b.sort || 9999)
    }).map(function (item) {
      var copy = clone(item)
      // 与 getScenics 云函数一致：服务端输出 ratingStars
      copy.ratingStars = buildRatingStars(copy.rating)
      return copy
    })

    return { success: true, data: list }
  },

  getScenicDetail: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    var item = null
    for (var i = 0; i < DB.scenics.length; i++) {
      if (DB.scenics[i]._id === event.id) { item = DB.scenics[i]; break }
    }
    if (!item) return { success: false, message: '景点不存在' }
    return { success: true, data: clone(item) }
  },

  publishScenic: function (event) {
    if (!event.city || !event.name || !event.image || !event.brief || !event.description) {
      return { success: false, message: '请填写完整信息' }
    }
    var user = currentUser()
    var now = new Date().toISOString()
    var priceNum = parseFloat(event.ticketPrice)
    var record = {
      _id: genId('scenic'),
      _openid: MOCK_OPENID,
      city: event.city,
      name: event.name,
      image: event.image,
      images: event.images || [event.image],
      brief: event.brief,
      description: event.description,
      category: event.category || '其他',
      rating: event.rating || 5,
      ratingStars: buildRatingStars(event.rating || 5),
      tags: event.tags || [],
      openTime: event.openTime || '',
      ticketPrice: event.ticketPrice || '',
      price: isNaN(priceNum) ? 0 : priceNum,
      address: event.address || '',
      phone: event.phone || '',
      publisherName: user.nickname,
      publisherAvatar: user.avatarUrl,
      status: 1,
      sort: 9999,
      viewCount: 0,
      createTime: now,
      updateTime: now
    }
    DB.scenics.push(record)
    return { success: true, message: '发布成功', data: { id: record._id, _id: record._id } }
  },

  /* ===== 名人堂（烈士 / 名人） ===== */

  getHallOfFame: function (event) {
    if (!event.city || !event.type) {
      return { success: false, message: '参数不完整：city 和 type 为必填项' }
    }
    if (['martyr', 'celebrity'].indexOf(event.type) === -1) {
      return { success: false, message: 'type 参数错误，只能是 martyr 或 celebrity' }
    }
    var list = DB.hallOfFame.filter(function (item) {
      return item.city === event.city && item.type === event.type
    }).sort(function (a, b) {
      return (a.sort || 9999) - (b.sort || 9999)
    })
    return { success: true, data: clone(list) }
  },

  getPersonDetail: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    var item = null
    for (var i = 0; i < DB.hallOfFame.length; i++) {
      if (DB.hallOfFame[i]._id === event.id) { item = DB.hallOfFame[i]; break }
    }
    if (!item) return { success: false, message: '人物不存在' }
    return { success: true, data: clone(item) }
  },

  publishPerson: function (event) {
    if (!event.city || !event.type || !event.photo || !event.name || !event.introduction || !event.experience) {
      return { success: false, message: '参数不完整' }
    }
    if (['martyr', 'celebrity'].indexOf(event.type) === -1) {
      return { success: false, message: '类型参数错误' }
    }
    var user = currentUser()
    var now = new Date().toISOString()
    var maxSort = 0
    DB.hallOfFame.forEach(function (p) {
      if (p.city === event.city && (p.sort || 0) > maxSort) maxSort = p.sort
    })
    var record = {
      _id: genId('person'),
      city: event.city,
      type: event.type,
      photo: event.photo,
      name: event.name,
      introduction: event.introduction,
      experience: event.experience,
      sort: maxSort + 1,
      viewCount: 0,
      publisherName: user.nickname,
      publisherAvatar: user.avatarUrl,
      status: 'active',
      _openid: MOCK_OPENID,
      createTime: now,
      updateTime: now
    }
    DB.hallOfFame.push(record)
    return { success: true, message: '发布成功', data: { id: record._id, _id: record._id } }
  },

  /* ===== 英烈（独立集合） ===== */

  getHeroes: function (event) {
    if (!event.city) return { success: false, message: '城市参数不能为空' }
    var list = DB.heroes.filter(function (item) {
      return item.city === event.city
    }).sort(function (a, b) {
      return (a.sort || 9999) - (b.sort || 9999)
    })
    return { success: true, data: clone(list) }
  },

  /* ===== 文创 ===== */

  getCreatives: function (event) {
    if (!event.city) return { success: false, message: '城市参数不能为空' }
    var list = DB.creatives.filter(function (item) {
      return item.city === event.city
    }).sort(function (a, b) {
      return (a.sort || 9999) - (b.sort || 9999)
    })
    return { success: true, data: clone(list) }
  },

  getCreativeDetail: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    var item = null
    for (var i = 0; i < DB.creatives.length; i++) {
      if (DB.creatives[i]._id === event.id) { item = DB.creatives[i]; break }
    }
    if (!item) return { success: false, message: '文创产品不存在' }
    return { success: true, data: clone(item) }
  },

  /* ===== 推荐 ===== */

  getRecommends: function (event) {
    if (!event.city) return { success: false, message: '城市参数不能为空' }
    var list = DB.recommends.filter(function (item) {
      return item.city === event.city
    }).sort(function (a, b) {
      return (a.sort || 9999) - (b.sort || 9999)
    })
    return { success: true, data: clone(list) }
  },

  getRecommendDetail: function (event) {
    if (!event.id) return { success: false, message: '参数不完整：id 为必填项' }
    var item = null
    for (var i = 0; i < DB.recommends.length; i++) {
      if (DB.recommends[i]._id === event.id) { item = DB.recommends[i]; break }
    }
    if (!item) return { success: false, message: '推荐不存在' }
    return { success: true, data: clone(item) }
  },

  /* ===== 红黑榜 ===== */

  getRankingList: function (event) {
    if (!event.city || !event.type) {
      return { success: false, message: '参数不完整：city 和 type 为必填项' }
    }

    var list = DB.rankings.filter(function (item) {
      if (item.city !== event.city || item.type !== event.type) return false
      if (event.category && item.category !== event.category) return false
      if (event.keyword) {
        if (!contains(item.shopName, event.keyword) && !contains(item.reason, event.keyword)) return false
      }
      return true
    })

    // 与云函数一致：红榜满意度倒序，黑榜满意度升序
    list.sort(function (a, b) {
      return event.type === 'red'
        ? (b.satisfaction || 0) - (a.satisfaction || 0)
        : (a.satisfaction || 0) - (b.satisfaction || 0)
    })

    var result = paginate(list, event)
    result.success = true
    return result
  },

  publishRanking: function (event) {
    if (!event.city || !event.type || !event.shopName || !event.category ||
      event.satisfaction === undefined || !event.reason) {
      return { success: false, message: '参数不完整' }
    }
    if (['red', 'black'].indexOf(event.type) === -1) {
      return { success: false, message: '榜单类型错误' }
    }
    var satisfactionNum = parseFloat(event.satisfaction)
    if (isNaN(satisfactionNum) || satisfactionNum < 0 || satisfactionNum > 100) {
      return { success: false, message: '满意度必须在0-100之间' }
    }
    var user = currentUser()
    var now = new Date().toISOString()
    var record = {
      _id: genId('rank'),
      city: event.city,
      type: event.type,
      shopName: event.shopName,
      category: event.category,
      satisfaction: satisfactionNum,
      reason: event.reason,
      images: event.images || [],
      viewCount: 0,
      likeCount: 0,
      publisherName: user.nickname,
      publisherAvatar: user.avatarUrl,
      status: 'active',
      _openid: MOCK_OPENID,
      createTime: now,
      updateTime: now
    }
    DB.rankings.unshift(record)
    return { success: true, message: '发布成功', data: { id: record._id, _id: record._id } }
  },

  /* ===== 方言 ===== */

  getDialects: function (event) {
    if (!event.city) return { success: false, message: '城市参数不能为空' }

    var list = DB.dialects.filter(function (item) {
      if (item.city !== event.city || item.status !== 'active') return false
      if (event.keyword) {
        var kw = String(event.keyword).toLowerCase()
        return contains(item.phrase, kw) || contains(item.meaning, kw) || contains(item.example, kw)
      }
      return true
    }).sort(function (a, b) {
      return (a.sort || 9999) - (b.sort || 9999)
    })

    var page = event.page || 1
    var pageSize = event.pageSize || 20
    var start = (page - 1) * pageSize
    var rows = list.slice(start, start + pageSize)

    return { success: true, data: clone(rows), page: page, pageSize: pageSize }
  },

  publishDialect: function (event) {
    if (!event.city) return { success: false, message: '城市不能为空' }
    if (!event.phrase || !event.meaning) return { success: false, message: '方言和释义不能为空' }

    var exists = DB.dialects.some(function (item) {
      return item.city === event.city && item.phrase === event.phrase.trim() && item.status === 'active'
    })
    if (exists) return { success: false, message: '该方言已存在' }

    var maxSort = 0
    DB.dialects.forEach(function (d) {
      if (d.city === event.city && (d.sort || 0) > maxSort) maxSort = d.sort
    })
    var now = new Date().toISOString()
    var record = {
      _id: genId('dial'),
      city: event.city,
      phrase: event.phrase.trim(),
      meaning: event.meaning.trim(),
      example: event.example ? String(event.example).trim() : '',
      tags: event.tags || [],
      audioUrl: event.audioUrl || '',
      sort: maxSort + 1,
      status: 'active',
      _openid: MOCK_OPENID,
      createTime: now,
      updateTime: now
    }
    DB.dialects.push(record)
    return { success: true, message: '发布成功', data: { id: record._id, _id: record._id } }
  },

  /* ===== 留言板 ===== */

  getMessages: function (event) {
    if (!event.city) return { success: false, message: '参数不完整：city 为必填项' }

    var page = event.page || 1
    var pageSize = event.pageSize || 20

    var list = DB.messages.filter(function (item) {
      return item.city === event.city
    }).sort(function (a, b) {
      // 先按时间正序（旧 -> 新），对应云函数 desc 查询后 reverse 的结果
      return new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()
    })

    var total = list.length
    var start = (page - 1) * pageSize
    var rows = list.slice(start, start + pageSize)

    return {
      success: true,
      data: clone(rows),
      total: total,
      page: page,
      pageSize: pageSize,
      hasMore: total > page * pageSize
    }
  },

  sendMessage: function (event) {
    if (!event.city || !event.type) {
      return { success: false, message: '参数不完整：city 和 type 为必填项' }
    }
    if (event.type === 'text' && !event.content) {
      return { success: false, message: '文字留言内容不能为空' }
    }
    if (event.type === 'voice' && (!event.voiceUrl || !event.duration)) {
      return { success: false, message: '语音留言需要语音文件和时长' }
    }

    var record = {
      _id: genId('msg'),
      city: event.city,
      type: event.type,
      _openid: MOCK_OPENID,
      userName: MOCK_USER.nickname,
      userAvatar: MOCK_USER.avatarUrl,
      createTime: new Date().toISOString()
    }
    if (event.type === 'text') {
      record.content = event.content
    } else {
      record.voiceUrl = event.voiceUrl
      record.duration = event.duration
    }
    DB.messages.push(record)
    return { success: true, message: '发送成功', data: { _id: record._id } }
  },

  // 兼容旧版留言云函数（当前页面未直接调用）
  addMessage: function (event) {
    if (!event.city || !event.content) return { success: false, message: '参数不完整' }
    return this.sendMessage({
      city: event.city,
      type: 'text',
      content: event.content
    })
  },

  /* ===== 未使用 / 兜底 ===== */

  // 旧版名人列表云函数（名人页实际使用 getHallOfFame），保留兼容
  getCelebrities: function (event) {
    return this.getHallOfFame({ city: event.city, type: 'celebrity' })
  }

}

// 未实现的云函数统一返回空数据成功，避免演示时页面报错
function dispatch(name, data) {
  var handler = handlers[name]
  if (handler) return handler(data || {})
  console.warn('[mock] 未配置的云函数，返回空数据：', name)
  return { success: true, data: [], message: 'mock empty' }
}

/* ------------------------------ 安装拦截器 ------------------------------ */

function install() {
  if (!wx.cloud) {
    console.warn('[mock] 当前基础库不支持 wx.cloud，模拟数据未安装')
    return
  }

  // 避免重复安装
  if (wx.cloud.__mockInstalled) return
  wx.cloud.__mockInstalled = true

  // 首页可能缓存了真实云数据，清除后保证演示数据结构一致
  try {
    wx.removeStorageSync('homeData')
  } catch (e) {}

  // 接管云函数调用：同时兼容 success/fail/complete 回调与 Promise 两种写法
  wx.cloud.callFunction = function (options) {
    options = options || {}
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var result
        try {
          result = dispatch(options.name, options.data)
        } catch (err) {
          console.error('[mock] 云函数模拟处理异常：', options.name, err)
          result = { success: false, message: '模拟数据服务异常：' + err.message }
        }

        var response = {
          result: result,
          errMsg: 'cloud.callFunction:ok [mock mode]'
        }

        // 业务失败（result.success === false）在真实环境中同样走 success 回调
        if (typeof options.success === 'function') {
          options.success(response)
        }
        if (typeof options.complete === 'function') {
          options.complete(response)
        }
        resolve(response)
      }, 60)
    })
  }

  // 接管云存储上传：直接回传本地临时文件路径（image / audio 均可直接使用）
  wx.cloud.uploadFile = function (options) {
    options = options || {}
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fileID = options.filePath || ('mock-file-' + Date.now())
        var response = {
          fileID: fileID,
          statusCode: 200,
          errMsg: 'cloud.uploadFile:ok [mock mode]'
        }
        if (typeof options.success === 'function') {
          options.success(response)
        }
        if (typeof options.complete === 'function') {
          options.complete(response)
        }
        resolve(response)
      }, 200)
    })
  }

  console.info('%c[mock] 模拟云服务已启用：所有云函数/云存储调用均由本地数据接管',
    'color:#AD683A;font-weight:bold')
}

module.exports = {
  install: install
}
