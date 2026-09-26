/**
 * 模拟数据集（云后台到期期间临时演示使用）
 *
 * 说明：
 * 1. 所有字段严格对齐云数据库集合结构与各页面 wxml 的实际消费字段；
 * 2. 覆盖城市：邯郸市、石家庄市（与 city-picker 可选城市一致）；
 * 3. 封面/配图均为项目本地的真实景点、文物、人物照片（images/mock 目录），
 *    离线即可显示，不依赖网络；照片原始比例各不相同；
 * 4. 头像使用项目内置本地头像；
 * 5. 时间统一使用 ISO 字符串（如 2026-10-01T09:00:00），页面 new Date() 可直接解析。
 */

// 本地真实图片（统一在此维护，页面/拦截器无需关心路径）
const I = {
  // 邯郸景点
  congtai: '/images/mock/scenic/congtai.jpg',
  guangfu: '/images/mock/scenic/guangfu.jpg',
  guangfuNight: '/images/mock/scenic/guangfu-night.jpg',
  xiangtang: '/images/mock/scenic/xiangtang.jpg',
  wahuang: '/images/mock/scenic/wahuang.jpg',
  xuebu: '/images/mock/scenic/xuebu.jpg',
  s129: '/images/mock/scenic/129shi.jpg',
  // 石家庄景点
  zhaozhou: '/images/mock/scenic/zhaozhou.jpg',
  longxing: '/images/mock/scenic/longxing.jpg',
  rongguo: '/images/mock/scenic/rongguo.jpg',
  xibaipo: '/images/mock/scenic/xibaipo.jpg',
  baodu: '/images/mock/scenic/baodu.jpg',
  museum: '/images/mock/scenic/museum.jpg',
  yanghe: '/images/mock/scenic/yanghe.jpg',
  hanfu: '/images/mock/scenic/hanfu.jpg',
  taiji: '/images/mock/scenic/taiji.jpg',
  nightrun: '/images/mock/scenic/nightrun.jpg',
  // 文物 / 文创 / 场景
  gongdeng: '/images/mock/creative/gongdeng.jpg',
  cizhou: '/images/mock/creative/cizhou.jpg',
  taoyi: '/images/mock/creative/taoyi.jpg',
  xiangnang: '/images/mock/creative/xiangnang.jpg',
  bookmark: '/images/mock/creative/bookmark.jpg',
  bookstore: '/images/mock/creative/bookstore.jpg',
  // 美食
  shaoji: '/images/mock/food/shaoji.jpg',
  zhuaimian: '/images/mock/food/zhuaimian.jpg',
  shuijiao: '/images/mock/food/shuijiao.jpg',
  banmian: '/images/mock/food/banmian.jpg',
  badatawan: '/images/mock/food/badatawan.jpg',
  paigu: '/images/mock/food/paigu.jpg',
  xuehuali: '/images/mock/food/xuehuali.jpg',
  majiluji: '/images/mock/food/majiluji.jpg',
  // 人物肖像
  xunzi: '/images/mock/person/xunzi.jpg',
  wuling: '/images/mock/person/wuling.jpg',
  lianpo: '/images/mock/person/lianpo.jpg',
  linxiangru: '/images/mock/person/linxiangru.jpg',
  yangluchan: '/images/mock/person/yangluchan.jpg',
  zhaoyun: '/images/mock/person/zhaoyun.jpg',
  yueyi: '/images/mock/person/yueyi.jpg',
  weizheng: '/images/mock/person/weizheng.jpg',
  baipu: '/images/mock/person/baipu.jpg',
  zuoquan: '/images/mock/person/zuoquan.jpg',
  fanzixia: '/images/mock/person/fanzixia.jpg',
  heyun: '/images/mock/person/heyun.jpg',
  gaokeqian: '/images/mock/person/gaokeqian.jpg',
  lihunzi: '/images/mock/person/lihunzi.jpg',
  rongguanxiu: '/images/mock/person/rongguanxiu.jpg',
  zhangzhaofeng: '/images/mock/person/zhangzhaofeng.jpg'
}

// 本地默认头像
function avatar(n) {
  return '/images/avatar/默认头像' + n + '.jpg'
}

// 相对今天的时间，保证任何日期演示留言都显示为“今天/昨天”
function todayAt(hh, mm) {
  const d = new Date()
  d.setHours(hh, mm || 0, 0, 0)
  return d.toISOString()
}
function daysAgoAt(days, hh, mm) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hh, mm || 0, 0, 0)
  return d.toISOString()
}

/* ============================ 活动 activities ============================ */
const activities = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'act_hd_1',
    city: '邯郸市',
    title: '“成语之都”邯郸成语文化节',
    category: '文旅活动',
    coverImage: I.congtai,
    coverImages: [
      I.congtai,
      I.xuebu
    ],
    poeticText: '千年成语一座城，\n邯郸秋色正当时',
    startTime: '2026-10-01T09:00:00',
    endTime: '2026-10-01T17:00:00',
    deadline: '2026-09-30T18:00:00',
    location: '邯郸市丛台公园主广场',
    latitude: 36.6215,
    longitude: 114.4937,
    duration: '8h',
    cost: '0',
    fee: 0,
    content: '<h3>活动介绍</h3><p>国庆首日，丛台公园举办“成语之都”文化节，现场设置邯郸学步、负荆请罪、胡服骑射等成语主题打卡点，更有成语接龙、汉服巡游与传统礼乐表演。</p><h3>活动安排</h3><p>09:00 开园迎宾、汉服巡游；10:30 成语典故情景剧；14:00 亲子成语闯关；16:00 传统礼乐展演。</p><p><strong>温馨提示：</strong>活动免费，建议绿色出行，可自带水杯。</p>',
    joinCount: 26,
    maxCount: 50,
    joinUsers: [{ avatar: avatar(1) }, { avatar: avatar(3) }, { avatar: avatar(5) }, { avatar: avatar(7) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '活动开始前可随时取消',
    commentCount: 8,
    viewCount: 326,
    createTime: daysAgoAt(6, 10, 20)
  },
  {
    _id: 'act_hd_2',
    city: '邯郸市',
    title: '广府古城太极拳晨练体验',
    category: '文旅活动',
    coverImage: I.taiji,
    coverImages: [
      I.taiji,
      I.guangfu
    ],
    poeticText: '一城太极风，\n半步广府秋',
    startTime: '2026-10-02T06:30:00',
    endTime: '2026-10-02T08:30:00',
    deadline: '2026-10-01T20:00:00',
    location: '永年区广府古城南门外广场',
    latitude: 36.7012,
    longitude: 114.7268,
    duration: '2h',
    cost: '19.9',
    fee: 19.9,
    content: '<h3>活动介绍</h3><p>广府古城是杨式、武式太极拳发源地。清晨跟随本地拳师在古城墙下学练太极基本功，结束后可自由游览古城与湿地芦苇荡。</p><p><strong>费用包含：</strong>拳师教学、简易太极体验服租借。</p><p><strong>适合人群：</strong>零基础游客、传统文化爱好者。</p>',
    joinCount: 18,
    maxCount: 30,
    joinUsers: [{ avatar: avatar(2) }, { avatar: avatar(4) }, { avatar: avatar(6) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '报名随时可取消',
    commentCount: 5,
    viewCount: 208,
    createTime: daysAgoAt(5, 15, 10)
  },
  {
    _id: 'act_hd_3',
    city: '邯郸市',
    title: '响堂山石窟秋日徒步搭子',
    category: '旅行搭子',
    coverImage: I.xiangtang,
    coverImages: [
      I.xiangtang
    ],
    poeticText: '踩着北齐的月光，\n去看一山的造像',
    startTime: '2026-10-03T08:00:00',
    endTime: '2026-10-03T16:00:00',
    deadline: '2026-10-02T22:00:00',
    location: '峰峰矿区响堂山景区游客中心集合',
    latitude: 36.5332,
    longitude: 114.1835,
    duration: '8h',
    cost: 'AA',
    fee: 60,
    content: '<h3>行程安排</h3><p>08:00 景区游客中心集合；08:30 徒步上山，沿途参观南北响堂石窟群；12:00 山顶简餐（AA）；14:00 专业讲解北齐造像艺术；16:00 返程。</p><p><strong>搭子要求：</strong>有一定徒步经验，守时合群，门票与餐饮 AA。</p>',
    joinCount: 9,
    maxCount: 12,
    joinUsers: [{ avatar: avatar(8) }, { avatar: avatar(9) }, { avatar: avatar(1) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后需发起人确认',
    cancelRule: '出发前12小时可取消',
    commentCount: 3,
    viewCount: 154,
    createTime: daysAgoAt(4, 20, 0)
  },
  {
    _id: 'act_hd_4',
    city: '邯郸市',
    title: '涉县红色研学亲子一日游',
    category: '亲子活动',
    coverImage: I.s129,
    coverImages: [
      I.s129
    ],
    poeticText: '给孩子讲一讲，\n赤岸村的灯火',
    startTime: '2026-10-05T08:30:00',
    endTime: '2026-10-05T17:30:00',
    deadline: '2026-10-04T18:00:00',
    location: '涉县河南店镇赤岸村129师司令部旧址',
    latitude: 36.5726,
    longitude: 113.6821,
    duration: '9h',
    cost: '98',
    fee: 98,
    content: '<h3>活动亮点</h3><p>走进八路军129师司令部旧址，通过任务卡、情景剧和研学导师讲解，让孩子在真实场景中了解太行军民的抗战岁月。</p><p><strong>费用包含：</strong>往返大巴、研学手册、导师讲解、保险、午餐。</p><p><strong>建议年龄：</strong>6-14 岁亲子家庭。</p>',
    joinCount: 31,
    maxCount: 40,
    joinUsers: [{ avatar: avatar(2) }, { avatar: avatar(5) }, { avatar: avatar(7) }, { avatar: avatar(9) }, { avatar: avatar(3) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '活动开始前24小时可取消',
    commentCount: 12,
    viewCount: 412,
    createTime: daysAgoAt(3, 9, 45)
  },
  {
    _id: 'act_hd_5',
    city: '邯郸市',
    title: '丛台读书会：赵文化主题分享',
    category: '读书活动',
    coverImage: I.bookstore,
    coverImages: [
      I.bookstore
    ],
    poeticText: '胡服骑射的风，\n吹过翻开的书页',
    startTime: '2026-10-11T14:30:00',
    endTime: '2026-10-11T16:30:00',
    deadline: '2026-10-11T12:00:00',
    location: '邯郸市图书馆二楼报告厅',
    latitude: 36.6204,
    longitude: 114.5431,
    duration: '2h',
    cost: '0',
    fee: 0,
    content: '<h3>本期主题</h3><p>从《史记·赵世家》到本地学者通俗读本，共读赵武灵王胡服骑射、完璧归赵、毛遂自荐等发生在邯郸的故事，欢迎带一本与赵文化相关的书到场分享。</p><p>活动免费，名额有限，先到先得。</p>',
    joinCount: 14,
    maxCount: 25,
    joinUsers: [{ avatar: avatar(4) }, { avatar: avatar(6) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '报名随时可取消',
    commentCount: 2,
    viewCount: 96,
    createTime: daysAgoAt(2, 19, 30)
  },
  {
    _id: 'act_hd_6',
    city: '邯郸市',
    title: '环沁河夜跑组队（5公里休闲组）',
    category: '体育活动',
    coverImage: I.nightrun,
    coverImages: [
      I.nightrun
    ],
    poeticText: '用五公里汗水，\n换一整晚好眠',
    startTime: '2026-10-06T19:30:00',
    endTime: '2026-10-06T21:00:00',
    deadline: '2026-10-06T18:00:00',
    location: '邯郸市沁河郊野公园主入口',
    latitude: 36.6108,
    longitude: 114.4802,
    duration: '1.5h',
    cost: '0',
    fee: 0,
    content: '<h3>活动介绍</h3><p>沁河郊野公园夜跑，5 公里休闲配速（6-7 分/公里），适合初跑者。集合后集体热身，沿途有领队与收尾，结束后一起拉伸合影。</p><p><strong>自备装备：</strong>跑鞋、运动服、饮用水；建议佩戴反光臂带。</p>',
    joinCount: 22,
    maxCount: 30,
    joinUsers: [{ avatar: avatar(1) }, { avatar: avatar(8) }, { avatar: avatar(2) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '报名随时可取消',
    commentCount: 4,
    viewCount: 132,
    createTime: daysAgoAt(1, 21, 15)
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'act_sjz_1',
    city: '石家庄市',
    title: '正定古城汉服文化游园会',
    category: '文旅活动',
    coverImage: I.hanfu,
    coverImages: [
      I.hanfu,
      I.longxing
    ],
    poeticText: '穿上汉服，\n做一日正定古城的归人',
    startTime: '2026-10-01T15:00:00',
    endTime: '2026-10-01T20:30:00',
    deadline: '2026-09-30T20:00:00',
    location: '正定县阳和楼至南城门街区',
    latitude: 38.1416,
    longitude: 114.5727,
    duration: '5.5h',
    cost: '39',
    fee: 39,
    content: '<h3>活动介绍</h3><p>国庆限定汉服游园：阳和楼集合妆造，沿燕赵南大街游隆兴寺、荣国府外围，傍晚提灯逛南关古镇夜市，含集体合影与古风小游戏。</p><p><strong>费用包含：</strong>汉服租借 3 小时、手提花灯、活动组织。妆造可现场加购。</p>',
    joinCount: 45,
    maxCount: 60,
    joinUsers: [{ avatar: avatar(1) }, { avatar: avatar(3) }, { avatar: avatar(5) }, { avatar: avatar(7) }, { avatar: avatar(9) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '活动开始前可随时取消',
    commentCount: 16,
    viewCount: 528,
    createTime: daysAgoAt(6, 11, 0)
  },
  {
    _id: 'act_sjz_2',
    city: '石家庄市',
    title: '赵州桥畔骑行搭子招募',
    category: '旅行搭子',
    coverImage: I.zhaozhou,
    coverImages: [
      I.zhaozhou
    ],
    poeticText: '骑过一千年的桥，\n秋风正好',
    startTime: '2026-10-02T08:30:00',
    endTime: '2026-10-02T15:00:00',
    deadline: '2026-10-01T22:00:00',
    location: '石家庄市南焦客运站集合出发',
    latitude: 37.9986,
    longitude: 114.5324,
    duration: '6.5h',
    cost: 'AA',
    fee: 50,
    content: '<h3>路线安排</h3><p>市区集合出发，沿洨河骑行约 30 公里至赵州桥，参观隋代赵州桥与桥史馆，午餐品尝赵县驴肉，下午休闲骑行返程（可选择坐大巴返回）。</p><p><strong>搭子要求：</strong>自带公路车/山地车，佩戴头盔，费用 AA。</p>',
    joinCount: 7,
    maxCount: 10,
    joinUsers: [{ avatar: avatar(2) }, { avatar: avatar(4) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后需发起人确认',
    cancelRule: '出发前12小时可取消',
    commentCount: 1,
    viewCount: 88,
    createTime: daysAgoAt(4, 18, 20)
  },
  {
    _id: 'act_sjz_3',
    city: '石家庄市',
    title: '西柏坡亲子红色研学之旅',
    category: '亲子活动',
    coverImage: I.xibaipo,
    coverImages: [
      I.xibaipo
    ],
    poeticText: '新中国从这里走来，\n带孩子来听答案',
    startTime: '2026-10-04T08:00:00',
    endTime: '2026-10-04T17:00:00',
    deadline: '2026-10-03T18:00:00',
    location: '平山县西柏坡纪念馆游客中心',
    latitude: 38.3356,
    longitude: 113.8832,
    duration: '9h',
    cost: '108',
    fee: 108,
    content: '<h3>活动亮点</h3><p>走进西柏坡纪念馆与中共中央旧址，通过研学手册、电报解码任务和实景讲解，理解“两个务必”与七届二中全会的历史意义。</p><p><strong>费用包含：</strong>往返大巴、导师讲解、研学手册、保险、午餐。</p>',
    joinCount: 35,
    maxCount: 45,
    joinUsers: [{ avatar: avatar(6) }, { avatar: avatar(8) }, { avatar: avatar(1) }, { avatar: avatar(3) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '活动开始前24小时可取消',
    commentCount: 9,
    viewCount: 367,
    createTime: daysAgoAt(3, 10, 10)
  },
  {
    _id: 'act_sjz_4',
    city: '石家庄市',
    title: '河北博物院志愿讲解服务行',
    category: '文旅活动',
    coverImage: I.museum,
    coverImages: [
      I.museum,
      I.gongdeng
    ],
    poeticText: '一盏长信宫灯，\n照亮两千年',
    startTime: '2026-10-03T09:30:00',
    endTime: '2026-10-03T11:30:00',
    deadline: '2026-10-02T18:00:00',
    location: '河北博物院南区服务台集合',
    latitude: 38.0392,
    longitude: 114.5264,
    duration: '2h',
    cost: '0',
    fee: 0,
    content: '<h3>活动介绍</h3><p>跟随持证志愿讲解员，深度参观“大汉绝唱——满城汉墓”“战国雄风——古中山国”两大常设展，近距离了解长信宫灯、金缕玉衣、错金博山炉等国宝。</p><p>博物院免费开放，需提前在官方公众号预约，活动免费。</p>',
    joinCount: 19,
    maxCount: 20,
    joinUsers: [{ avatar: avatar(5) }, { avatar: avatar(7) }, { avatar: avatar(9) }],
    status: 'full',
    statusText: '已满员',
    auditRule: '报名后无需审核',
    cancelRule: '报名随时可取消',
    commentCount: 7,
    viewCount: 245,
    createTime: daysAgoAt(5, 9, 0)
  },
  {
    _id: 'act_sjz_5',
    city: '石家庄市',
    title: '滹沱河生态走廊半马拉练',
    category: '体育活动',
    coverImage: I.nightrun,
    coverImages: [
      I.nightrun
    ],
    poeticText: '21.0975公里，\n与滹沱河一起奔跑',
    startTime: '2026-10-10T07:00:00',
    endTime: '2026-10-10T10:00:00',
    deadline: '2026-10-09T20:00:00',
    location: '滹沱河生态公园明曦湖入口',
    latitude: 38.1202,
    longitude: 114.5612,
    duration: '3h',
    cost: '0',
    fee: 0,
    content: '<h3>活动介绍</h3><p>半程马拉松拉练，沿滹沱河生态走廊环线一圈约 21 公里，设 3 个补给点，配速分组（500/530/600）。</p><p><strong>报名要求：</strong>近三个月有 10 公里以上跑步记录，自备能量胶与饮水。</p>',
    joinCount: 16,
    maxCount: 40,
    joinUsers: [{ avatar: avatar(2) }, { avatar: avatar(8) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后需发起人确认',
    cancelRule: '活动开始前可取消',
    commentCount: 5,
    viewCount: 173,
    createTime: daysAgoAt(2, 8, 30)
  },
  {
    _id: 'act_sjz_6',
    city: '石家庄市',
    title: '城市书房读书分享会：秋日读城',
    category: '读书活动',
    coverImage: I.bookstore,
    coverImages: [
      I.bookstore
    ],
    poeticText: '在一座城，\n读一本书，\n遇见一些人',
    startTime: '2026-10-17T19:00:00',
    endTime: '2026-10-17T21:00:00',
    deadline: '2026-10-17T18:00:00',
    location: '长安区呈明书店二楼阅读区',
    latitude: 38.0422,
    longitude: 114.5128,
    duration: '2h',
    cost: '29',
    fee: 29,
    content: '<h3>本期主题</h3><p>“秋日读城”：带一本描写城市的书——历史、建筑、美食或旅行文学均可，每人 8 分钟分享，书店提供手冲咖啡一杯与定制书签。</p>',
    joinCount: 11,
    maxCount: 20,
    joinUsers: [{ avatar: avatar(4) }, { avatar: avatar(6) }],
    status: 'ongoing',
    statusText: '报名中',
    auditRule: '报名后无需审核',
    cancelRule: '报名随时可取消',
    commentCount: 0,
    viewCount: 74,
    createTime: daysAgoAt(1, 17, 40)
  }
]

/* ============================ 旅游攻略 travel_guides ============================ */
const guides = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'guide_hd_1',
    city: '邯郸市',
    title: '两日逛遍邯郸：成语典故打卡线路',
    category: '线路',
    coverImage: I.congtai,
    introduction: '两天一夜，把“成语之都”的经典典故一次走遍，附交通与餐饮建议。',
    content: '<h3>行程概览</h3><p><strong>D1：</strong>丛台公园 → 回车巷历史文化街区 → 学步桥 → 邯郸市博物馆，晚上逛美乐城周边夜市。</p><p><strong>D2：</strong>永年广府古城（城墙、杨露禅故居、湿地芦苇荡）一日游，傍晚返程。</p><h3>实用提示</h3><p>市区景点集中，打车基本 15 元以内；广府古城距市区约 25 公里，可在汽车西站坐班车。广府古城进城免费，府衙、故居等单点收费，也可买联票。</p><p>餐饮别错过二毛烧鸡、驴肉卷饼和拽面。</p>',
    images: [
      I.xuebu,
      I.guangfu
    ],
    viewCount: 688,
    publisherName: '行走的赵都',
    publisherAvatar: avatar(3),
    status: 'active',
    createTime: daysAgoAt(12, 14, 0)
  },
  {
    _id: 'guide_hd_2',
    city: '邯郸市',
    title: '邯郸本地人私藏的5家老味道',
    category: '吃喝',
    coverImage: I.shaoji,
    introduction: '不踩雷的本地味：烧鸡、拽面、驴肉、缯肘、大锅菜，人均与位置都标好了。',
    content: '<h3>1. 二毛烧鸡</h3><p>大名传过来的百年卤味，鸡肉酥烂离骨，推荐买半只现场吃，再抽真空带走。</p><h3>2. 老槐树拽面</h3><p>手工拽出来的宽面筋道，大锅番茄鸡蛋卤最经典，饭点要拼桌。</p><h3>3. 一篓油水饺</h3><p>邯郸老字号，一篓油水饺咬开有汤汁，配一碗小米粥最舒服。</p><h3>4. 临漳大锅菜</h3><p>五花肉、白菜、粉条、豆腐一锅炖，馒头蘸菜汤是灵魂吃法。</p><h3>5. 永年驴肉</h3><p>逛广府古城必吃，驴肉香肠拼一盘，配酥鱼是本地宴席标配。</p>',
    images: [
      I.shaoji,
      I.zhuaimian
    ],
    viewCount: 902,
    publisherName: '吃货在邯郸',
    publisherAvatar: avatar(5),
    status: 'active',
    createTime: daysAgoAt(10, 12, 30)
  },
  {
    _id: 'guide_hd_3',
    city: '邯郸市',
    title: '广府古城周边民宿怎么选',
    category: '住宿',
    coverImage: I.guangfuNight,
    introduction: '古城内、城墙外、湿地边三类住法对比，含价格区间与预订建议。',
    content: '<h3>古城内民宿</h3><p>优点是早晚逛古城人少、出片；多为老宅改造，隔音一般，节假日 200-350 元。</p><h3>城墙外酒店</h3><p>南门外连锁酒店多，停车方便、性价比高，150-260 元，适合自驾。</p><h3>湿地边小院</h3><p>适合带娃和喜欢安静的人，推开窗就是芦苇荡，价格略高但含早餐。</p><p><strong>建议：</strong>国庆等节假日提前两周预订，认准可免费取消的房源。</p>',
    images: [
      I.guangfu
    ],
    viewCount: 233,
    publisherName: '广府小住',
    publisherAvatar: avatar(2),
    status: 'active',
    createTime: daysAgoAt(8, 16, 0)
  },
  {
    _id: 'guide_hd_4',
    city: '邯郸市',
    title: '磁州窑伴手礼购买指南',
    category: '购物',
    coverImage: I.cizhou,
    introduction: '磁州窑怎么挑、去哪买、什么价位合理，一篇讲清楚。',
    content: '<h3>了解磁州窑</h3><p>磁州窑是北方民窑代表，峰峰矿区彭城一带为核心产区，以白地黑花、铁锈花装饰见长。</p><h3>推荐入手</h3><p>百元内：黑白釉茶杯、成语纹样冰箱贴；200-500 元：手工梅瓶、茶盏套装；收藏向可到工坊看师傅拉坯再下手。</p><h3>购买地点</h3><p>磁州窑文化创意街区选择多、可讲价；富田遗址附近工坊能买到孤次品。记得检查釉面与底款，陶瓷务必让店家加固包装。</p>',
    images: [
      I.cizhou,
      I.taoyi
    ],
    viewCount: 178,
    publisherName: '窑火笔记',
    publisherAvatar: avatar(7),
    status: 'active',
    createTime: daysAgoAt(7, 11, 15)
  },
  {
    _id: 'guide_hd_5',
    city: '邯郸市',
    title: '第一次去响堂山石窟的注意事项',
    category: '其他',
    coverImage: I.xiangtang,
    introduction: '交通、讲解、穿着、避坑，第一次看石窟照着做就行。',
    content: '<h3>讲解一定请</h3><p>没有讲解只能看“石头洞”。景区官方讲解约 150 元/批，拼团人均很划算，能讲懂北齐造像的样式与被盗文物的历史。</p><h3>穿着与时间</h3><p>山不高但台阶多，穿防滑运动鞋；建议上午进窟，光线更适合看雕刻。全程 2.5-3 小时。</p><h3>避坑提示</h3><p>景区门口“免费带路”不要信；北响堂规模最大，时间紧张优先北响堂。</p>',
    images: [
      I.xiangtang
    ],
    viewCount: 311,
    publisherName: '造像观察者',
    publisherAvatar: avatar(9),
    status: 'active',
    createTime: daysAgoAt(6, 9, 50)
  },
  {
    _id: 'guide_hd_6',
    city: '邯郸市',
    title: '涉县红色景点一日串联',
    category: '线路',
    coverImage: I.s129,
    introduction: '129师司令部旧址、将军岭、陈列馆怎么串，自驾与跟团都适用。',
    content: '<h3>推荐路线</h3><p>上午：八路军129师司令部旧址（赤岸村）→ 中午赤岸村农家菜 → 下午：将军岭 → 129师陈列馆。</p><h3>贴士</h3><p>旧址与陈列馆均免费开放，凭身份证入馆；各点之间相距不远但有坡，自驾最方便。带孩子的家庭可以在游客中心领取研学任务卡。</p>',
    images: [
      I.s129
    ],
    viewCount: 264,
    publisherName: '太行行者',
    publisherAvatar: avatar(4),
    status: 'active',
    createTime: daysAgoAt(4, 13, 20)
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'guide_sjz_1',
    city: '石家庄市',
    title: '正定古城一日 Citywalk 最全路线',
    category: '线路',
    coverImage: I.yanghe,
    introduction: '九楼四塔八大寺，一日走完正定精华，附免费景点与夜景时间表。',
    content: '<h3>路线（步行+共享电单车）</h3><p>隆兴寺（上午 2.5 小时，必看千手千眼观音）→ 广惠寺华塔（外观拍照）→ 临济寺澄灵塔 → 开元寺须弥塔与钟楼 → 荣国府（87 版红楼梦取景）→ 傍晚南城门登城墙看日落 → 晚上燕赵大街夜景与小吃。</p><h3>贴士</h3><p>正定所有停车场对游客免费，这是真的；隆兴寺门票 50 元最值，荣国府 40 元，多处古塔外观免费。夜景亮灯一般在日落后半小时。</p>',
    images: [
      I.longxing,
      I.rongguo
    ],
    viewCount: 1204,
    publisherName: '常山闲逛指南',
    publisherAvatar: avatar(1),
    status: 'active',
    createTime: daysAgoAt(11, 10, 0)
  },
  {
    _id: 'guide_sjz_2',
    city: '石家庄市',
    title: '石家庄本地小吃地图：板面之外还有这些',
    category: '吃喝',
    coverImage: I.banmian,
    introduction: '牛肉板面、缸炉烧饼、正定马家鸡、宋记八大碗，本地人带路不踩雷。',
    content: '<h3>牛肉板面</h3><p>石家庄人的“城市图腾”，小区门口生意最好的那家通常就对了，加豆皮、卤蛋、宽面。</p><h3>缸炉烧饼</h3><p>外酥里软带芝麻，夹个焖子或肉就是一顿早饭，认准现出炉的摊位。</p><h3>正定马家卤鸡与郝家排骨</h3><p>逛正定必吃，卤鸡整只买了现场拆，排骨软烂入味，两家相距不远可连着打卡。</p><h3>正定八大碗</h3><p>扣肘、酥肉、丸子层层蒸碗，适合三人以上点半套。</p><p>另可选赵县石塔烧饼与薛家烧饼，路过值得带。</p>',
    images: [
      I.banmian,
      I.badatawan
    ],
    viewCount: 1567,
    publisherName: '国际庄饭友',
    publisherAvatar: avatar(6),
    status: 'active',
    createTime: daysAgoAt(9, 18, 40)
  },
  {
    _id: 'guide_sjz_3',
    city: '石家庄市',
    title: '西柏坡研学：交通住宿与预约全攻略',
    category: '住宿',
    coverImage: I.xibaipo,
    introduction: '自驾/直通车怎么去、附近住哪里、如何预约，带娃家庭必看。',
    content: '<h3>怎么去</h3><p>自驾石家庄市区出发约 1.5 小时；石家庄汽车北站有直达西柏坡的直通车，旺季建议早班走。</p><h3>住哪里</h3><p>想轻松玩可住西柏坡镇民宿，150-300 元，晚上安静；当天往返则建议早上 7 点前出发避堵。</p><h3>预约与参观</h3><p>纪念馆免费，凭身份证在官方公众号提前预约；中共中央旧址在对面山坡，两处合计预留 3 小时以上。</p>',
    images: [
      I.xibaipo
    ],
    viewCount: 358,
    publisherName: '研学老父亲',
    publisherAvatar: avatar(8),
    status: 'active',
    createTime: daysAgoAt(5, 20, 0)
  },
  {
    _id: 'guide_sjz_4',
    city: '石家庄市',
    title: '河北博物院周边：逛吃买一条龙',
    category: '购物',
    coverImage: I.museum,
    introduction: '看完国宝去哪吃、文创在哪买、停车怎么解决。',
    content: '<h3>参观顺序建议</h3><p>先冲二楼满城汉墓（长信宫灯、金缕玉衣），再看古中山国的错金银器，掐点听免费志愿讲解。</p><h3>文创购买</h3><p>南区出口文创店的长信宫灯冰箱贴、“长信宫主”书签最热门，常设展还有限定印章可盖。</p><h3>周边吃喝</h3><p>步行可达北国商城、勒泰中心，连锁餐饮与本地小吃都有；周末建议地铁 1 号线直达，周边车位紧张。</p>',
    images: [
      I.gongdeng
    ],
    viewCount: 421,
    publisherName: '博物馆重度患者',
    publisherAvatar: avatar(2),
    status: 'active',
    createTime: daysAgoAt(4, 15, 30)
  },
  {
    _id: 'guide_sjz_5',
    city: '石家庄市',
    title: '秋天抱犊寨登山看日出指南',
    category: '其他',
    coverImage: I.baodu,
    introduction: '夜爬时间、索道班次、穿衣与补给，看一次抱犊寨日出。',
    content: '<h3>两种上山方式</h3><p>徒步上山约 2 小时，台阶 3000 级，建议携带头灯走夜路；索道早上 8 点左右运营，赶日出只能夜爬。</p><h3>时间与穿着</h3><p>查好当日日出时间，提前 2.5 小时从山脚出发；山顶比市区低 5-8℃，备防风外套。</p><h3>贴士</h3><p>山顶南天门、环山长城步道视野最好；带够水和巧克力，山上物价较高；门票加索道套票更划算。</p>',
    images: [
      I.baodu
    ],
    viewCount: 287,
    publisherName: '追日出的人',
    publisherAvatar: avatar(4),
    status: 'active',
    createTime: daysAgoAt(3, 21, 10)
  },
  {
    _id: 'guide_sjz_6',
    city: '石家庄市',
    title: '赵县赵州桥+雪花梨采摘一日线路',
    category: '线路',
    coverImage: I.zhaozhou,
    introduction: '上午看千年古桥，下午进梨园采摘，适合亲子与自驾。',
    content: '<h3>行程安排</h3><p>上午：赵州桥景区（古桥、桥史馆、李春塑像）约 2 小时；中午：县城吃驴肉+石塔烧饼；下午：周边梨园采摘雪花梨（9 月底至 10 月中最佳），按斤计费。</p><h3>交通</h3><p>自驾市区出发约 1 小时；南焦客运站有班车到赵县，下车打车 10 分钟到景区。</p>',
    images: [
      I.xuehuali
    ],
    viewCount: 196,
    publisherName: '赵州半日闲',
    publisherAvatar: avatar(9),
    status: 'active',
    createTime: daysAgoAt(2, 14, 45)
  }
]

/* ============================ 景点 scenics ============================ */
const scenics = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'scenic_hd_1',
    city: '邯郸市',
    name: '丛台公园',
    image: I.congtai,
    images: [
      I.congtai
    ],
    category: '人文古迹',
    brief: '赵武灵王阅兵观台，成语之都的城市地标。',
    description: '丛台始建于战国赵武灵王时期，是赵王检阅军队与观赏歌舞之地，“胡服骑射”的典故便发生于此。现存丛台为明清修葺，台上有武灵丛台门楼、回澜亭等建筑，公园内还有七贤祠、碑林与人工湖，是了解赵文化的第一站。',
    rating: 5,
    tags: ['赵文化', '城市地标', '免费', '亲子'],
    openTime: '08:00-18:00',
    ticketPrice: '免费',
    price: 0,
    address: '邯郸市丛台区中华北大街 87 号',
    phone: '0310-3026418',
    sort: 1,
    viewCount: 856,
    createTime: daysAgoAt(20, 10, 0)
  },
  {
    _id: 'scenic_hd_2',
    city: '邯郸市',
    name: '广府古城',
    image: I.guangfu,
    images: [
      I.guangfu,
      I.guangfuNight
    ],
    category: '人文古迹',
    brief: '古城、水城、太极城三位一体，杨武式太极拳发源地。',
    description: '广府古城有 2600 多年历史，城墙保存完整，四面环水、芦苇荡连片，是北方罕见的旱地水城。这里是杨式、武式太极拳发源地，城内有杨露禅故居、武禹襄故居、府署旧址，城墙上可骑行环游，湿地可乘船赏荷观鸟。',
    rating: 5,
    tags: ['5A景区', '太极之乡', '古城墙', '湿地'],
    openTime: '08:30-17:30',
    ticketPrice: '进城免费，景点联票 70 元',
    price: 70,
    address: '邯郸市永年区广府镇',
    phone: '0310-6622666',
    sort: 2,
    viewCount: 1102,
    createTime: daysAgoAt(19, 10, 0)
  },
  {
    _id: 'scenic_hd_3',
    city: '邯郸市',
    name: '响堂山石窟',
    image: I.xiangtang,
    images: [
      I.xiangtang
    ],
    category: '人文古迹',
    brief: '北齐皇家石窟，中国三大石窟之外的北方造像瑰宝。',
    description: '响堂山石窟始凿于北齐，现存石窟 16 座、造像 4300 余尊，分南北两处。大佛洞窟形宏伟、造像敦厚优美，代表了北齐雕刻艺术的最高水平。石窟博物馆还展陈有流失海外造像的数字回归成果，建议请讲解参观。',
    rating: 5,
    tags: ['国保单位', '北齐造像', '登山', '研学'],
    openTime: '08:00-17:00',
    ticketPrice: '60 元',
    price: 60,
    address: '邯郸市峰峰矿区和村镇',
    phone: '0310-5016628',
    sort: 3,
    viewCount: 489,
    createTime: daysAgoAt(18, 10, 0)
  },
  {
    _id: 'scenic_hd_4',
    city: '邯郸市',
    name: '娲皇宫',
    image: I.wahuang,
    images: [
      I.wahuang
    ],
    category: '人文古迹',
    brief: '华夏祖庙，依山而建的“活楼吊庙”，藏天下第一壁经。',
    description: '娲皇宫位于涉县中皇山上，传说为女娲抟土造人、炼石补天之处。主体阁楼依山崖凌空而建，以铁索系于峭壁，人称“活楼”“吊庙”。山下北齐摩崖刻经面积达 165 平方米，被誉为“天下第一壁经”，是书法与佛教艺术的珍品。',
    rating: 5,
    tags: ['5A景区', '女娲文化', '摩崖刻经', '登山'],
    openTime: '08:00-17:00',
    ticketPrice: '60 元',
    price: 60,
    address: '邯郸市涉县索堡镇中皇山',
    phone: '0310-3922111',
    sort: 4,
    viewCount: 633,
    createTime: daysAgoAt(17, 10, 0)
  },
  {
    _id: 'scenic_hd_5',
    city: '邯郸市',
    name: '学步桥',
    image: I.xuebu,
    images: [
      I.xuebu
    ],
    category: '人文古迹',
    brief: '“邯郸学步”典故发生地，明代石拱桥。',
    description: '学步桥原为木桥，明代万历年间改建为五孔石拱桥，桥栏板上雕刻有成语故事与瑞兽图案。《庄子·秋水》中燕国少年到邯郸学步的故事就发生在这里，桥头立有“邯郸学步”石雕，沿河已建成历史文化休闲街区。',
    rating: 4,
    tags: ['成语典故', '免费', '城市漫步'],
    openTime: '全天开放',
    ticketPrice: '免费',
    price: 0,
    address: '邯郸市丛台区北关街沁河之上',
    phone: '0310-3012301',
    sort: 5,
    viewCount: 342,
    createTime: daysAgoAt(16, 10, 0)
  },
  {
    _id: 'scenic_hd_6',
    city: '邯郸市',
    name: '八路军129师司令部旧址',
    image: I.s129,
    images: [
      I.s129
    ],
    category: '其他',
    brief: '“刘邓大军”战斗过的地方，太行山红色地标。',
    description: '旧址位于涉县赤岸村，由司令部、作战室、刘伯承邓小平旧居等青砖院落组成。抗战时期，129 师在此运筹太行、决胜千里。相邻的将军岭上安息着多位老一辈革命家，陈列馆用大量实物与照片再现了晋冀鲁豫边区的峥嵘岁月。',
    rating: 5,
    tags: ['红色教育', '免费', '研学', '国保单位'],
    openTime: '09:00-17:00（16:30停止入馆）',
    ticketPrice: '免费（凭身份证）',
    price: 0,
    address: '邯郸市涉县河南店镇赤岸村',
    phone: '0310-3832211',
    sort: 6,
    viewCount: 721,
    createTime: daysAgoAt(15, 10, 0)
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'scenic_sjz_1',
    city: '石家庄市',
    name: '赵州桥',
    image: I.zhaozhou,
    images: [
      I.zhaozhou
    ],
    category: '人文古迹',
    brief: '天下第一桥，隋代李春设计，世界桥梁史上的奇迹。',
    description: '赵州桥又名安济桥，建于隋代开皇年间，由工匠李春主持建造，是世界上现存年代最久、跨度最大、保存最完整的单孔坦弧敞肩石拱桥。其“敞肩拱”设计比欧洲早了约 1200 年。景区内有桥史博物馆、李春塑像与古桥科技馆，可系统了解中国古桥技艺。',
    rating: 5,
    tags: ['国保单位', '隋代古桥', '研学', '世界遗产预备名录'],
    openTime: '08:30-17:30',
    ticketPrice: '40 元',
    price: 40,
    address: '石家庄市赵县赵州镇大石桥村',
    phone: '0311-84902618',
    sort: 1,
    viewCount: 1432,
    createTime: daysAgoAt(20, 9, 0)
  },
  {
    _id: 'scenic_sjz_2',
    city: '石家庄市',
    name: '隆兴寺',
    image: I.longxing,
    images: [
      I.longxing
    ],
    category: '人文古迹',
    brief: '京外名刹之首，一座隆兴寺，半部唐宋建筑史。',
    description: '隆兴寺始建于隋，是国内现存规模较大、保存完整的佛教寺院之一。大悲阁内 21.3 米高的千手千眼铜铸观音为世界古代铜铸佛像之最；寺内另有隋碑《龙藏寺碑》、宋代转轮藏、被鲁迅誉为“东方美神”的倒坐观音等六处文物“全国之最”。',
    rating: 5,
    tags: ['千年古刹', '国保单位', '铜佛', '古建艺术'],
    openTime: '08:30-17:00',
    ticketPrice: '50 元',
    price: 50,
    address: '石家庄市正定县中山东路 109 号',
    phone: '0311-88786362',
    sort: 2,
    viewCount: 1287,
    createTime: daysAgoAt(19, 9, 0)
  },
  {
    _id: 'scenic_sjz_3',
    city: '石家庄市',
    name: '正定荣国府',
    image: I.rongguo,
    images: [
      I.rongguo
    ],
    category: '人文古迹',
    brief: '87 版《红楼梦》主要取景地，一座复刻的荣国府。',
    description: '荣国府是为拍摄 1987 版电视剧《红楼梦》依清代建筑规制设计建造的仿古建筑群，分荣国府和宁荣街两部分。府内亭台楼阁、厅堂轩馆俱全，有红楼文化陈列与蜡像场景，红学爱好者可在此找到剧中名场面，夜间灯光与实景演出也值得一看。',
    rating: 4,
    tags: ['红楼梦', '影视取景', '古装拍照'],
    openTime: '08:00-17:30',
    ticketPrice: '40 元',
    price: 40,
    address: '石家庄市正定县兴荣路 51 号',
    phone: '0311-88786107',
    sort: 3,
    viewCount: 965,
    createTime: daysAgoAt(18, 9, 0)
  },
  {
    _id: 'scenic_sjz_4',
    city: '石家庄市',
    name: '西柏坡纪念馆',
    image: I.xibaipo,
    images: [
      I.xibaipo
    ],
    category: '人文古迹',
    brief: '新中国从这里走来，七届二中全会召开地。',
    description: '西柏坡是中共中央进驻北平、解放全中国前的最后一个农村指挥所。纪念馆与中共中央旧址复原了毛泽东、刘少奇、朱德、周恩来、任弼时等同志的旧居及七届二中全会会址。这里诞生了“两个务必”和著名的“赶考”命题，是全国著名的爱国主义教育基地。',
    rating: 5,
    tags: ['红色教育', '免费', '研学', '5A景区'],
    openTime: '09:00-17:00（周一闭馆）',
    ticketPrice: '免费（需预约）',
    price: 0,
    address: '石家庄市平山县西柏坡镇',
    phone: '0311-82851366',
    sort: 4,
    viewCount: 1890,
    createTime: daysAgoAt(17, 9, 0)
  },
  {
    _id: 'scenic_sjz_5',
    city: '石家庄市',
    name: '抱犊寨',
    image: I.baodu,
    images: [
      I.baodu
    ],
    category: '自然风光',
    brief: '山顶有园林，山形似卧佛，登南天门览太行余脉。',
    description: '抱犊寨位于鹿泉区，海拔 580 米，四周悬崖绝壁，山顶却是平旷沃土，有“天下奇寨”之誉。沿 3000 级台阶或乘索道登顶，可见环山长城、南天门、韩信祠与金阙宫，晴日可远眺石家庄城区。日出云海与秋日红叶是两大看点。',
    rating: 4,
    tags: ['登山', '索道', '日出', '4A景区'],
    openTime: '08:00-17:00',
    ticketPrice: '门票 65 元（含索道往返）',
    price: 65,
    address: '石家庄市鹿泉区太平河北路',
    phone: '0311-82013800',
    sort: 5,
    viewCount: 744,
    createTime: daysAgoAt(16, 9, 0)
  },
  {
    _id: 'scenic_sjz_6',
    city: '石家庄市',
    name: '河北博物院',
    image: I.museum,
    images: [
      I.gongdeng,
      I.museum
    ],
    category: '博物馆',
    brief: '长信宫灯、金缕玉衣镇馆，读懂燕赵中山与大汉绝唱。',
    description: '河北博物院是国家一级博物馆，常设“大汉绝唱——满城汉墓”“战国雄风——古中山国”“河北商代文明”等九大展览。长信宫灯、金缕玉衣、错金博山炉、透雕龙凤纹铜铺首等国宝级文物集中亮相，免费开放但需提前预约，建议预留半天并跟随志愿讲解。',
    rating: 5,
    tags: ['国家一级博物馆', '免费', '长信宫灯', '亲子研学'],
    openTime: '09:00-17:00（周一闭馆）',
    ticketPrice: '免费（公众号预约）',
    price: 0,
    address: '石家庄市长安区东大街 4 号',
    phone: '0311-86049842',
    sort: 6,
    viewCount: 2103,
    createTime: daysAgoAt(14, 9, 0)
  }
]

/* ==================== 名人堂 hall_of_fame（烈士+名人） ==================== */
const hallOfFame = [
  // ---------------- 邯郸·革命烈士 ----------------
  {
    _id: 'person_hd_m_1',
    city: '邯郸市',
    type: 'martyr',
    photo: I.zuoquan,
    name: '左权',
    introduction: '八路军高级将领，1942年牺牲于太行抗日战场，将军陵墓安放在邯郸晋冀鲁豫烈士陵园。',
    experience: '左权（1905—1942），湖南醴陵人，黄埔一期毕业，曾赴苏联留学。抗战时期任八路军副参谋长，协助彭德怀指挥百团大战，威震敌后。1942 年 5 月在十字岭突围战斗中壮烈殉国，是抗战中八路军牺牲的最高级别将领。1950 年，左权将军灵柩移葬邯郸晋冀鲁豫烈士陵园，园内建有左权将军纪念馆。',
    sort: 1,
    viewCount: 986
  },
  {
    _id: 'person_hd_m_2',
    city: '邯郸市',
    type: 'martyr',
    photo: I.fanzixia,
    name: '范子侠',
    introduction: '八路军129师新编10旅旅长，长眠于邯郸晋冀鲁豫烈士陵园。',
    experience: '范子侠（1908—1942），江苏丰县人，早年从军，全面抗战爆发后率部参加八路军，任129师新编第10旅旅长，在冀南、太行一带屡建战功。1942 年2月在沙河县反“扫荡”战斗中身中数弹牺牲，年仅 34 岁，后安葬于邯郸晋冀鲁豫烈士陵园。',
    sort: 2,
    viewCount: 421
  },
  {
    _id: 'person_hd_m_3',
    city: '邯郸市',
    type: 'martyr',
    photo: I.heyun,
    name: '何云',
    introduction: '《新华日报》华北版社长兼总编辑，太行山上的新闻战士。',
    experience: '何云（1905—1942），浙江上虞人，早年留学日本，归国后投身革命新闻事业，创办《新华日报》华北版，在太行山区以笔为枪，把党的声音传向敌后。1942 年5月反“扫荡”中在山西辽县突围时牺牲，后安葬于邯郸晋冀鲁豫烈士陵园。',
    sort: 3,
    viewCount: 305
  },
  // ---------------- 邯郸·历史名人 ----------------
  {
    _id: 'person_hd_c_1',
    city: '邯郸市',
    type: 'celebrity',
    photo: I.xunzi,
    name: '荀子',
    introduction: '战国末期赵国人，思想家、教育家，先秦诸子集大成者，韩非、李斯皆出其门下。',
    experience: '荀子（约前313—前238），名况，时人尊号“卿”，赵国人。曾三任齐国稷下学宫祭酒，后任楚国兰陵令。他主张“制天命而用之”，提出“性恶论”，强调礼法并用与后天学习，著有《劝学》《天论》等名篇。相传晚年在邯郸、兰陵一带讲学，韩非、李斯、毛亨均为其弟子。',
    sort: 1,
    viewCount: 874
  },
  {
    _id: 'person_hd_c_2',
    city: '邯郸市',
    type: 'celebrity',
    photo: I.wuling,
    name: '赵武灵王',
    introduction: '赵国第六代君主，推行“胡服骑射”，使赵国一跃成为战国军事强国。',
    experience: '赵武灵王（约前340—前295），名雍，赵国邯郸人。他力排众议推行“胡服骑射”改革，改穿胡服、建立骑兵，攻灭中山、拓地千里，使赵国成为能与秦国抗衡的强国。晚年在继承人问题上处置失当，困死于沙丘宫。邯郸丛台相传即为其阅兵观武之所。',
    sort: 2,
    viewCount: 1023
  },
  {
    _id: 'person_hd_c_3',
    city: '邯郸市',
    type: 'celebrity',
    photo: I.lianpo,
    name: '廉颇',
    introduction: '战国四大名将之一，赵国人，“负荆请罪”“将相和”的主人公。',
    experience: '廉颇（前327—前243），赵国名将，攻取阳晋、固守长平，以勇气闻于诸侯。因位居蔺相如之下而不服，得知相如以国事为重后，袒露上身背负荆条登门请罪，留下“将相和”的千古佳话。晚年遭排挤出走，仍言“我思用赵人”，“廉颇老矣，尚能饭否”成为忠而见弃的千年一叹。',
    sort: 3,
    viewCount: 1156
  },
  {
    _id: 'person_hd_c_4',
    city: '邯郸市',
    type: 'celebrity',
    photo: I.linxiangru,
    name: '蔺相如',
    introduction: '赵国上卿，完璧归赵、渑池之会智斗强秦，以国事为先感动廉颇。',
    experience: '蔺相如，生卒年不详，赵国邯郸人。原为缪贤门客，携和氏璧出使秦国，廷斥秦王、完璧归赵；渑池之会上以智勇维护赵国尊严，被拜为上卿。面对廉颇挑衅，他以“先国家之急而后私仇”一再退让，终使廉颇负荆请罪，将相和而赵国强。',
    sort: 4,
    viewCount: 1098
  },
  {
    _id: 'person_hd_c_5',
    city: '邯郸市',
    type: 'celebrity',
    photo: I.yangluchan,
    name: '杨露禅',
    introduction: '永年广府人，杨式太极拳创始人，将太极拳从乡野带向京城。',
    experience: '杨露禅（1799—1872），名福魁，直隶永年（今邯郸永年区广府镇）人。他三下河南陈家沟学拳，融诸家之长创编成柔缓圆活、老少皆宜的杨式太极拳。后赴京城教拳，曾在瑞王府授艺，出手必胜而不伤人性命，人称“杨无敌”。广府古城现存杨露禅故居，海内外杨式太极拳传人皆以此为圣地。',
    sort: 5,
    viewCount: 765
  },
  // ---------------- 石家庄·革命烈士 ----------------
  {
    _id: 'person_sjz_m_1',
    city: '石家庄市',
    type: 'martyr',
    photo: I.gaokeqian,
    name: '高克谦',
    introduction: '正定人，正太铁路工人运动领袖，1925年英勇就义，年仅19岁。',
    experience: '高克谦（1906—1925），直隶无极人（今属石家庄），在正定求学时接受革命思想，1924 年加入中国共产党，在正太铁路工人中开展宣传组织工作，参与领导石家庄工人运动。1925 年9月被军阀逮捕，受尽酷刑坚贞不屈，在石家庄东里村从容就义。新中国成立后，其灵柩移葬华北军区烈士陵园，正定建有纪念亭。',
    sort: 1,
    viewCount: 358
  },
  {
    _id: 'person_sjz_m_2',
    city: '石家庄市',
    type: 'martyr',
    photo: I.lihunzi,
    name: '李混子',
    introduction: '新乐人，晋察冀边区“爆炸英雄”，用地雷战威震敌胆的民兵英雄。',
    experience: '李混子（1924—1946），直隶新乐人，抗战时期任村民兵爆炸组组长，刻苦研制地雷，率队在平汉铁路沿线炸火车、袭据点，先后炸死炸伤大量日伪军，被晋察冀边区授予“爆炸英雄”称号。1946 年12月在阻击国民党军进攻时，因地雷意外爆炸壮烈牺牲，年仅 22 岁。',
    sort: 2,
    viewCount: 289
  },
  {
    _id: 'person_sjz_m_3',
    city: '石家庄市',
    type: 'martyr',
    photo: I.rongguanxiu,
    name: '戎冠秀',
    introduction: '平山人，“子弟兵的母亲”，拥军模范的一面旗帜。',
    experience: '戎冠秀（1896—1989），直隶平山人，1938 年加入中国共产党，任村妇救会主任。她带领妇女做军鞋、送军粮、救护伤员，曾用自己的棉衣和身体温暖重伤战士，被晋察冀边区授予“子弟兵的母亲”光荣称号。1949 年出席开国大典，终身保持劳动人民本色，是平山和西柏坡红色记忆中的杰出代表。',
    sort: 3,
    viewCount: 512
  },
  // ---------------- 石家庄·历史名人 ----------------
  {
    _id: 'person_sjz_c_1',
    city: '石家庄市',
    type: 'celebrity',
    photo: I.zhaoyun,
    name: '赵云',
    introduction: '常山真定（今正定）人，三国蜀汉名将，“一身是胆”的常山赵子龙。',
    experience: '赵云（？—229），字子龙，常山真定（今石家庄正定）人。先从公孙瓒，后追随刘备，长坂坡单骑救阿斗、截江夺斗、汉水空营退曹军，被刘备赞为“子龙一身都是胆也”。他有识有谋，力主归还田宅、谏阻东征，官至镇东将军，封永昌亭侯，卒谥顺平侯。正定至今留存赵云庙，“常山赵子龙”成为这片土地最响亮的名片。',
    sort: 1,
    viewCount: 2015
  },
  {
    _id: 'person_sjz_c_2',
    city: '石家庄市',
    type: 'celebrity',
    photo: I.yueyi,
    name: '乐毅',
    introduction: '中山灵寿（今灵寿）人，统帅五国联军伐齐连下七十余城的战国名将。',
    experience: '乐毅，生卒年不详，中山灵寿（今石家庄灵寿）人，魏将乐羊后裔。燕昭王筑黄金台招贤，乐毅入燕被拜为亚卿、上将军。公元前 284 年，他统率燕、赵、楚、韩、魏五国联军伐齐，连下七十余城，唯莒与即墨未克，创造了以弱胜强的经典战例。后遭田单反间计被迫奔赵，诸葛亮曾自比“管乐”，“乐”即乐毅。',
    sort: 2,
    viewCount: 643
  },
  {
    _id: 'person_sjz_c_3',
    city: '石家庄市',
    type: 'celebrity',
    photo: I.weizheng,
    name: '魏征',
    introduction: '巨鹿下曲阳（今晋州）人，唐初名相，以直言敢谏流芳青史。',
    experience: '魏征（580—643），字玄成，巨鹿下曲阳（今石家庄晋州）人。早年参加瓦岗军，归唐后辅佐太子李建成，玄武门之变后被唐太宗李世民重用，官至侍中，封郑国公。他前后陈谏二百余事，主张“兼听则明，偏信则暗”“水能载舟，亦能覆舟”。去世后唐太宗感叹“以人为镜，可以明得失”，被誉为“一代名相”。',
    sort: 3,
    viewCount: 1387
  },
  {
    _id: 'person_sjz_c_4',
    city: '石家庄市',
    type: 'celebrity',
    photo: I.baipu,
    name: '白朴',
    introduction: '真定（今正定）人，“元曲四大家”之一，《墙头马上》传诵至今。',
    experience: '白朴（1226—约1306），字太素，号兰谷，祖籍隩州，后随父定居真定（今石家庄正定）。时值真定杂剧繁荣，他与关汉卿、马致远、郑光祖并称“元曲四大家”。代表作《裴少俊墙头马上》与《唐明皇秋夜梧桐雨》，一写儿女真情，一写家国兴亡，语言清丽、结构谨严，是元杂剧文采派的代表。',
    sort: 4,
    viewCount: 576
  }
]

/* ============================ 英烈 heroes ============================ */
const heroes = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'hero_hd_1',
    city: '邯郸市',
    image: I.zuoquan,
    name: '左权',
    title: '八路军副参谋长',
    brief: '十字岭突围殉国，抗战中八路军牺牲的最高级别将领，长眠邯郸。',
    sort: 1
  },
  {
    _id: 'hero_hd_2',
    city: '邯郸市',
    image: I.fanzixia,
    name: '范子侠',
    title: '129师新10旅旅长',
    brief: '冀南抗日屡建奇功，1942年反“扫荡”中牺牲，年仅34岁。',
    sort: 2
  },
  {
    _id: 'hero_hd_3',
    city: '邯郸市',
    image: I.heyun,
    name: '何云',
    title: '《新华日报》华北版社长',
    brief: '以笔为枪办报太行，1942年反“扫荡”中殉职的新闻战士。',
    sort: 3
  },
  {
    _id: 'hero_hd_4',
    city: '邯郸市',
    image: I.zhangzhaofeng,
    name: '张兆丰',
    title: '北方局军委书记',
    brief: '磁县籍早期共产党员，在兵运工作中被捕，1930年英勇就义。',
    sort: 4
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'hero_sjz_1',
    city: '石家庄市',
    image: I.gaokeqian,
    name: '高克谦',
    title: '正太铁路工运领袖',
    brief: '19岁组织领导石家庄工人运动，1925年慷慨就义。',
    sort: 1
  },
  {
    _id: 'hero_sjz_2',
    city: '石家庄市',
    image: I.lihunzi,
    name: '李混子',
    title: '晋察冀“爆炸英雄”',
    brief: '新乐民兵爆破组长，巧布地雷阵炸敌列车，22岁壮烈牺牲。',
    sort: 2
  },
  {
    _id: 'hero_sjz_3',
    city: '石家庄市',
    image: I.rongguanxiu,
    name: '戎冠秀',
    title: '“子弟兵的母亲”',
    brief: '平山妇救会主任，一生拥军，出席开国大典的劳动英雄。',
    sort: 3
  }
]

/* ============================ 文创 creatives ============================ */
const creatives = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'creative_hd_1',
    city: '邯郸市',
    name: '磁州窑白地黑花梅瓶摆件',
    image: I.cizhou,
    images: [
      I.cizhou
    ],
    description: '以峰峰矿区磁州窑传统白地黑花工艺手绘，梅瓶造型取自宋元经典器型，缠枝莲纹样寓意吉祥，手工拉坯、柴烧釉色，每只纹理独一无二，适合玄关与博古架陈设。',
    price: 268,
    shopName: '磁州窑文创体验店（彭城店）',
    address: '邯郸市峰峰矿区磁州窑文化创意街区 12 号',
    phone: '0310-5023168',
    sort: 1
  },
  {
    _id: 'creative_hd_2',
    city: '邯郸市',
    name: '成语典故金属书签套装',
    image: I.bookmark,
    images: [
      I.bookmark
    ],
    description: '一套六枚黄铜镂空书签，精选“邯郸学步、负荆请罪、胡服骑射、完璧归赵、黄粱一梦、毛遂自荐”六个发生在邯郸的成语典故，配礼盒与成语小卡，是最具“成语之都”特色的伴手礼。',
    price: 59,
    shopName: '丛台有礼文创店',
    address: '邯郸市丛台区回车巷历史文化街区入口',
    phone: '0310-3012899',
    sort: 2
  },
  {
    _id: 'creative_hd_3',
    city: '邯郸市',
    name: '广府太极禅修服',
    image: I.taiji,
    images: [
      I.taiji
    ],
    description: '永年广府本地裁缝手工制作，天然棉麻面料透气垂顺，立领盘扣、宽松舒适，晨练太极与日常禅意穿搭两相宜，附送杨氏太极入门图解一张。',
    price: 199,
    shopName: '广府太极文化馆',
    address: '邯郸市永年区广府古城东大街 8 号',
    phone: '0310-6625188',
    sort: 3
  },
  {
    _id: 'creative_hd_4',
    city: '邯郸市',
    name: '娲皇宫祈福香囊',
    image: I.xiangnang,
    images: [
      I.xiangnang
    ],
    description: '以娲皇宫民俗文化为灵感，选用绸缎面料手工刺绣祥云与锦鲤，内填艾草、薰衣草与苍术，安神驱蚊，可挂于车内、包袋与床头，赠亲朋以寄“平安纳福”之意。',
    price: 29,
    shopName: '中皇山风物集',
    address: '邯郸市涉县娲皇宫景区游客服务中心',
    phone: '0310-3922118',
    sort: 4
  },
  {
    _id: 'creative_hd_5',
    city: '邯郸市',
    name: '响堂山石窟佛像冰箱贴',
    image: I.xiangtang,
    images: [
      I.xiangtang
    ],
    description: '以响堂山大佛洞北齐坐佛为原型 3D 建模复刻，树脂材质还原砂岩质感，一套两枚（坐佛+飞天），附赠造像艺术小册，把石窟之美带回家。',
    price: 39,
    shopName: '响堂山文创商店',
    address: '邯郸市峰峰矿区响堂山景区出口商业街',
    phone: '0310-5016699',
    sort: 5
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'creative_sjz_1',
    city: '石家庄市',
    name: '长信宫灯立体冰箱贴',
    image: I.gongdeng,
    images: [
      I.gongdeng
    ],
    description: '镇馆之宝长信宫灯官方授权文创，锌合金镀金工艺还原跪坐宫女持灯造型，灯罩可转动。长信宫灯被誉为“中华第一灯”，两千年前的环保设计（虹管吸油烟）至今令人惊叹。',
    price: 49,
    shopName: '河北博物院文创旗舰店',
    address: '石家庄市长安区河北博物院南区一层',
    phone: '0311-86051206',
    sort: 1
  },
  {
    _id: 'creative_sjz_2',
    city: '石家庄市',
    name: '隆兴寺古建筑拼装积木',
    image: I.longxing,
    images: [
      I.longxing
    ],
    description: '以正定隆兴寺大悲阁为原型的榫卯拼装模型，316 个零件复刻宋代建筑斗拱飞檐，无需胶水，拼搭中理解中国古建力学，适合 8 岁以上亲子与古建爱好者。',
    price: 168,
    shopName: '正定古建文创社',
    address: '石家庄市正定县燕赵南大街 203 号',
    phone: '0311-88782299',
    sort: 2
  },
  {
    _id: 'creative_sjz_3',
    city: '石家庄市',
    name: '常山赵子龙主题盲盒',
    image: I.zhaoyun,
    images: [
      I.zhaoyun
    ],
    description: '“常山赵子龙”正定城市 IP 盲盒，全套六款（含隐藏款龙胆亮银枪）：长坂坡、截江夺斗、空营退曹等经典场景 Q 版化，PVC 高约 8 厘米，拆盒有惊喜。',
    price: 69,
    shopName: '赵云庙文创铺',
    address: '石家庄市正定县赵云路赵云庙景区内',
    phone: '0311-88780066',
    sort: 3
  },
  {
    _id: 'creative_sjz_4',
    city: '石家庄市',
    name: '赵州桥榫卯结构模型',
    image: I.zhaozhou,
    images: [
      I.zhaozhou
    ],
    description: '1:500 比例还原赵州桥敞肩拱结构，218 片实木榫卯拼插，不用一钉一胶，拼完可承重演示。附李春与中国古桥知识图册，是桥梁迷与学生研学的绝佳礼物。',
    price: 128,
    shopName: '赵州桥文创体验中心',
    address: '石家庄市赵县赵州桥景区出口处',
    phone: '0311-84902700',
    sort: 4
  },
  {
    _id: 'creative_sjz_5',
    city: '石家庄市',
    name: '西柏坡红色记忆帆布包',
    image: I.xibaipo,
    images: [
      I.xibaipo
    ],
    description: '重磅米白棉帆布，印有“新中国从这里走来”主题插画与“赶考”字样，内袋分区、可装 14 寸电脑，同系列还有笔记本与金属徽章，研学纪念与日常通勤皆宜。',
    price: 45,
    shopName: '西柏坡红色文创店',
    address: '石家庄市平山县西柏坡纪念馆游客中心',
    phone: '0311-82851399',
    sort: 5
  }
]

/* ============================ 推荐 recommends ============================ */
const recommends = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'rec_hd_1',
    city: '邯郸市',
    title: '一篓油水饺（中华北大街店）',
    name: '一篓油水饺（中华北大街店）',
    image: I.shuijiao,
    images: [
      I.shuijiao
    ],
    type: '美食',
    brief: '邯郸人从小吃到大的老字号，饺子咬开有汤汁。',
    reason: '开了几十年的本地名店，招牌一篓油水饺皮薄馅嫩，咬开先喝汤，猪肉大葱与素三鲜点击率最高。分量实在、价格亲民，配小米粥和凉拌菜就是舒服的一顿，服务是老国营风格的爽快。',
    tags: ['老字号', '饺子', '人均40', '本地味道'],
    address: '邯郸市丛台区中华北大街与联纺路交叉口南行 100 米',
    price: 40,
    sort: 1
  },
  {
    _id: 'rec_hd_2',
    city: '邯郸市',
    title: '二毛烧鸡（大名总店）',
    name: '二毛烧鸡（大名总店）',
    image: I.shaoji,
    images: [
      I.shaoji
    ],
    type: '美食',
    brief: '大名府传下来的百年卤味，酥烂离骨、咸香入骨。',
    reason: '始创于清代的老字号卤味，老汤慢炖的烧鸡色泽红亮、肉烂脱骨而形不散，冷吃热吃都香。现场买半只最解馋，走亲访友可抽真空盒装，店员会帮你切块装袋。',
    tags: ['百年老字号', '卤味', '伴手礼', '人均80'],
    address: '邯郸市大名县府西街老字号一条街',
    price: 80,
    sort: 2
  },
  {
    _id: 'rec_hd_3',
    city: '邯郸市',
    title: '磁州窑文化创意街区',
    name: '磁州窑文化创意街区',
    image: I.taoyi,
    images: [
      I.taoyi
    ],
    type: '打卡',
    brief: '老窑厂改的文艺街区，能逛能玩还能亲手拉坯。',
    reason: '由老陶瓷厂区改造，烟囱、窑炉与现代涂鸦结合，拍照出片。街区里有陶艺工作室可体验拉坯彩绘（约 68 元/人，作品可烧制邮寄），咖啡馆和窑烤面包店品质在线，周末常有市集。',
    tags: ['文艺街区', '手作体验', '免费', '拍照'],
    address: '邯郸市峰峰矿区彭城镇磁州窑文化创意街区',
    price: 0,
    sort: 3
  },
  {
    _id: 'rec_hd_4',
    city: '邯郸市',
    title: '广府古城夜游灯光秀',
    name: '广府古城夜游灯光秀',
    image: I.guangfuNight,
    images: [
      I.guangfuNight
    ],
    type: '体验',
    brief: '城墙亮灯+护城河水秀，夜色里的太极古城别有韵味。',
    reason: '每晚日落后南城墙与角楼依次亮灯，护城河水幕灯光秀约 20 分钟一场（旺季 19:30、20:30），可乘夜游船从水面看城。夜场人少风凉，逛完夜市小吃刚好收尾。',
    tags: ['夜景', '灯光秀', '游船', '亲子'],
    address: '邯郸市永年区广府古城南门外码头',
    price: 60,
    sort: 4
  },
  {
    _id: 'rec_hd_5',
    city: '邯郸市',
    title: '临漳邺城博物馆',
    name: '临漳邺城博物馆',
    image: I.xiangtang,
    images: [
      I.xiangtang
    ],
    type: '打卡',
    brief: '曹魏古都与北朝佛都的地下往事，佛造像展厅极震撼。',
    reason: '邺城曾为曹魏、后赵、东魏、北齐六朝都城。博物馆免费开放，建筑本身仿邺城南城门，馆内北朝佛造像窖藏展厅数量庞大、艺术水准极高，历史爱好者可以安静看一下午，游客很少、体验极佳。',
    tags: ['博物馆', '免费', '北朝造像', '人少'],
    address: '邯郸市临漳县香菜营乡邺镇村',
    price: 0,
    sort: 5
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'rec_sjz_1',
    city: '石家庄市',
    title: '正定马家卤鸡（总店）',
    name: '正定马家卤鸡（总店）',
    image: I.majiluji,
    images: [
      I.majiluji
    ],
    type: '美食',
    brief: '正定三宝之一，百年清真老汤卤鸡，啃完手指都香。',
    reason: '始创于清代的马家卤鸡是正定招牌，用老汤与二十余味香料慢卤，鸡皮琥珀透亮、肉质紧实不柴。按斤称、现捞现切，配缸炉烧饼是本地吃法；逛古城顺路买半只，趁热吃最满足。',
    tags: ['百年老字号', '清真', '正定三宝', '人均50'],
    address: '石家庄市正定县大十字街历史文化街',
    price: 50,
    sort: 1
  },
  {
    _id: 'rec_sjz_2',
    city: '石家庄市',
    title: '郝家排骨（正定老店）',
    name: '郝家排骨（正定老店）',
    image: I.paigu,
    images: [
      I.paigu
    ],
    type: '美食',
    brief: '酱排骨软烂脱骨，逛正定必啃的硬菜。',
    reason: '开了二十多年的本地名店，招牌酱骨用老汤酱到肉烂离骨，戴上手套直接啃最过瘾；排骨小锅两人份分量足，配自制凉菜和贴饼子刚好解腻。饭点排队，建议错峰。',
    tags: ['酱骨头', '本地名店', '人均70', '需排队'],
    address: '石家庄市正定县常山东路近火车站',
    price: 70,
    sort: 2
  },
  {
    _id: 'rec_sjz_3',
    city: '石家庄市',
    title: '正定阳和楼夜色打卡',
    name: '正定阳和楼夜色打卡',
    image: I.yanghe,
    images: [
      I.yanghe
    ],
    type: '打卡',
    brief: '“畿南名楼”灯光复现，古街夜景的最佳机位。',
    reason: '阳和楼曾被梁思成誉为“庄严尤过于罗马君士坦丁凯旋门”，复建后成为正定夜景 C 位。每晚亮灯后金瓦朱栏尽显元楼气象，楼前广场是拍人像与古建全景的黄金机位，向南走就是南关古镇夜市。',
    tags: ['夜景', '古建', '免费', '拍照机位'],
    address: '石家庄市正定县燕赵南大街与中山西路交叉口',
    price: 0,
    sort: 3
  },
  {
    _id: 'rec_sjz_4',
    city: '石家庄市',
    title: '呈明书店',
    name: '呈明书店',
    image: I.bookstore,
    images: [
      I.bookstore
    ],
    type: '体验',
    brief: '24 小时不打烊的城市书房，深夜也能安放自己。',
    reason: '石家庄文艺地标，弧形书墙直通穹顶，选书偏人文社科与艺术，二层有咖啡区和落地窗边座。常年办读书会与作者分享，夜里 11 点后依然有人安静阅读，是快节奏城市里的一处温柔。',
    tags: ['24小时书店', '咖啡', '读书活动', '安静'],
    address: '石家庄市长安区建设北大街与健康路交口',
    price: 30,
    sort: 4
  },
  {
    _id: 'rec_sjz_5',
    city: '石家庄市',
    title: '赵县雪花梨采摘园',
    name: '赵县雪花梨采摘园',
    image: I.xuehuali,
    images: [
      I.xuehuali
    ],
    type: '体验',
    brief: '千年御梨园里摘一颗“大如拳、甜如蜜”的雪花梨。',
    reason: '赵县雪花梨自古为贡梨，果大皮薄、肉白如雪。9 月底到 10 月中旬是最佳采摘季，园主会教你认树龄、挑好梨，按斤计费价格公道；梨园多在赵州桥回市区沿线，上午看桥、下午摘梨顺路不绕。',
    tags: ['亲子采摘', '应季', '秋季限定', '人均20'],
    address: '石家庄市赵县谢庄乡梨园片区（赵州桥景区东 8 公里）',
    price: 20,
    sort: 5
  }
]

/* ============================ 红黑榜 rankings ============================ */
// 注：红黑榜为口碑帖，配图非必需，演示数据统一不附图（页面原生支持无图样式）
const rankings = [
  // ---------------- 邯郸·红榜 ----------------
  {
    _id: 'rank_hd_r_1',
    city: '邯郸市',
    type: 'red',
    shopName: '老槐树拽面馆（城南店）',
    category: '餐饮',
    satisfaction: 96,
    reason: '开了二十多年的本地老店，手工拽面筋道，大锅卤给得足，价格多年不涨，老板记性好，老顾客坐下就知道吃啥。',
    images: [],
    publisherName: '吃面不加蒜',
    publisherAvatar: avatar(2),
    viewCount: 432,
    likeCount: 58,
    status: 'active',
    createTime: daysAgoAt(9, 12, 0),
    updateTime: daysAgoAt(9, 12, 0)
  },
  {
    _id: 'rank_hd_r_2',
    city: '邯郸市',
    type: 'red',
    shopName: '丛台公园志愿服务讲解岗',
    category: '景点',
    satisfaction: 97,
    reason: '免费讲解每天两场，志愿者老师对赵文化如数家珍，看丛台不听讲解等于白来，结束还会主动推荐市区其他典故路线。',
    images: [],
    publisherName: '带娃走河北',
    publisherAvatar: avatar(4),
    viewCount: 501,
    likeCount: 72,
    status: 'active',
    createTime: daysAgoAt(8, 10, 30),
    updateTime: daysAgoAt(8, 10, 30)
  },
  {
    _id: 'rank_hd_r_3',
    city: '邯郸市',
    type: 'red',
    shopName: '广府古城南门外舒心民宿',
    category: '住宿',
    satisfaction: 94,
    reason: '自驾停车免费，房间干净、隔音比古城内好，老板免费给手绘逛城路线，晚上还能接送到城墙看灯，性价比高。',
    images: [],
    publisherName: '广府小住',
    publisherAvatar: avatar(6),
    viewCount: 267,
    likeCount: 31,
    status: 'active',
    createTime: daysAgoAt(7, 16, 0),
    updateTime: daysAgoAt(7, 16, 0)
  },
  {
    _id: 'rank_hd_r_4',
    city: '邯郸市',
    type: 'red',
    shopName: '磁州窑手作工坊（街区12号）',
    category: '购物',
    satisfaction: 93,
    reason: '拉坯体验老师手把手教，不催不推销，成品烧制包邮，收到的杯子和店里样品一样规整，送朋友很有面子。',
    images: [],
    publisherName: '窑火笔记',
    publisherAvatar: avatar(8),
    viewCount: 198,
    likeCount: 24,
    status: 'active',
    createTime: daysAgoAt(6, 14, 0),
    updateTime: daysAgoAt(6, 14, 0)
  },
  // ---------------- 邯郸·黑榜 ----------------
  {
    _id: 'rank_hd_b_1',
    city: '邯郸市',
    type: 'black',
    shopName: '某“邯郸一日游”站前揽客点',
    category: '其他',
    satisfaction: 22,
    reason: '汽车站门口喊“丛台+广府低价一日游”，上车后强制加收讲解费和游船费，广府只在城外拍照十分钟，全车人投诉后退费无门，自由行不香吗。',
    images: [],
    publisherName: '避坑小能手',
    publisherAvatar: avatar(3),
    viewCount: 1560,
    likeCount: 210,
    status: 'active',
    createTime: daysAgoAt(10, 19, 0),
    updateTime: daysAgoAt(10, 19, 0)
  },
  {
    _id: 'rank_hd_b_2',
    city: '邯郸市',
    type: 'black',
    shopName: '古城门口流动烧鸡摊（无招牌）',
    category: '购物',
    satisfaction: 31,
    reason: '看着是老字号颜色，回家一吃又咸又柴，称重时还疑似压秤，包装上没有任何门店信息。买卤味一定进店、留小票。',
    images: [],
    publisherName: '吃货在邯郸',
    publisherAvatar: avatar(5),
    viewCount: 890,
    likeCount: 102,
    status: 'active',
    createTime: daysAgoAt(8, 20, 0),
    updateTime: daysAgoAt(8, 20, 0)
  },
  {
    _id: 'rank_hd_b_3',
    city: '邯郸市',
    type: 'black',
    shopName: '某景区门口“免费拍照”摊位',
    category: '景点',
    satisfaction: 28,
    reason: '热情招呼免费拍照，取照片时变成“洗照片 30 元一张、相框另算”，不给钱不让走，带老人小孩的特别容易被缠上。',
    images: [],
    publisherName: '太行行者',
    publisherAvatar: avatar(7),
    viewCount: 720,
    likeCount: 88,
    status: 'active',
    createTime: daysAgoAt(5, 11, 0),
    updateTime: daysAgoAt(5, 11, 0)
  },
  // ---------------- 石家庄·红榜 ----------------
  {
    _id: 'rank_sjz_r_1',
    city: '石家庄市',
    type: 'red',
    shopName: '正定南城门游客服务中心',
    category: '景点',
    satisfaction: 98,
    reason: '停车场免费且指引清楚，工作人员主动给古城步行地图，洗手间干净，寄存行李不收费，这才是旅游城市该有的样子。',
    images: [],
    publisherName: '常山闲逛指南',
    publisherAvatar: avatar(1),
    viewCount: 678,
    likeCount: 95,
    status: 'active',
    createTime: daysAgoAt(11, 15, 0),
    updateTime: daysAgoAt(11, 15, 0)
  },
  {
    _id: 'rank_sjz_r_2',
    city: '石家庄市',
    type: 'red',
    shopName: '马家卤鸡（大十字街店）',
    category: '餐饮',
    satisfaction: 96,
    reason: '百年老字号明码标价，老汤卤鸡热乎出锅，店员手脚麻利、切得均匀，问怎么吃也不嫌烦，真空包装另收一块钱很良心。',
    images: [],
    publisherName: '国际庄饭友',
    publisherAvatar: avatar(9),
    viewCount: 540,
    likeCount: 66,
    status: 'active',
    createTime: daysAgoAt(9, 12, 30),
    updateTime: daysAgoAt(9, 12, 30)
  },
  {
    _id: 'rank_sjz_r_3',
    city: '石家庄市',
    type: 'red',
    shopName: '河北博物院志愿服务讲解团',
    category: '景点',
    satisfaction: 97,
    reason: '固定时段免费讲解满城汉墓，老师讲长信宫灯的环保设计和金缕玉衣的编缀工艺特别生动，孩子们全程没走神，馆内空调和母婴室也好评。',
    images: [],
    publisherName: '博物馆重度患者',
    publisherAvatar: avatar(2),
    viewCount: 612,
    likeCount: 84,
    status: 'active',
    createTime: daysAgoAt(7, 11, 0),
    updateTime: daysAgoAt(7, 11, 0)
  },
  {
    _id: 'rank_sjz_r_4',
    city: '石家庄市',
    type: 'red',
    shopName: '西柏坡映山红农家院',
    category: '住宿',
    satisfaction: 92,
    reason: '离纪念馆车程五分钟，大锅菜和贴饼子味道正，房间被褥有阳光味，老板帮忙约讲解、联系直通车，带老人孩子住得省心。',
    images: [],
    publisherName: '研学老父亲',
    publisherAvatar: avatar(8),
    viewCount: 233,
    likeCount: 27,
    status: 'active',
    createTime: daysAgoAt(4, 18, 0),
    updateTime: daysAgoAt(4, 18, 0)
  },
  // ---------------- 石家庄·黑榜 ----------------
  {
    _id: 'rank_sjz_b_1',
    city: '石家庄市',
    type: 'black',
    shopName: '某“板面刺客”景区周边店',
    category: '餐饮',
    satisfaction: 26,
    reason: '菜单只写板面 12 元，结账时卤蛋、豆皮、“特色汤底”逐项加钱到 48，问老板还说一直这价。吃板面认准居民区明码标价的店。',
    images: [],
    publisherName: '避坑小能手',
    publisherAvatar: avatar(3),
    viewCount: 1340,
    likeCount: 176,
    status: 'active',
    createTime: daysAgoAt(9, 21, 0),
    updateTime: daysAgoAt(9, 21, 0)
  },
  {
    _id: 'rank_sjz_b_2',
    city: '石家庄市',
    type: 'black',
    shopName: '车站附近“赵州桥专线”拉客面包',
    category: '其他',
    satisfaction: 24,
    reason: '声称直达赵州桥，实际要凑满一车才走，半路加价说“门票含讲解”，到了景区门口还不让自己买票。南焦客运站正规班车十几元直达。',
    images: [],
    publisherName: '赵州半日闲',
    publisherAvatar: avatar(5),
    viewCount: 980,
    likeCount: 121,
    status: 'active',
    createTime: daysAgoAt(6, 17, 0),
    updateTime: daysAgoAt(6, 17, 0)
  },
  {
    _id: 'rank_sjz_b_3',
    city: '石家庄市',
    type: 'black',
    shopName: '某古城周边无证“停车场”',
    category: '景点',
    satisfaction: 30,
    reason: '正定官方停车场都免费，路边有人挥旗引进自空地，出来要 30 元“看车费”还不给票。看到“P”字正规指示牌再停，多绕 200 米的事。',
    images: [],
    publisherName: '常山闲逛指南',
    publisherAvatar: avatar(1),
    viewCount: 1120,
    likeCount: 145,
    status: 'active',
    createTime: daysAgoAt(3, 19, 30),
    updateTime: daysAgoAt(3, 19, 30)
  }
]

/* ============================ 方言 dialects ============================ */
const dialects = [
  // ---------------- 邯郸市（冀南/晋语边缘片） ----------------
  { _id: 'dial_hd_1', city: '邯郸市', phrase: '夜个儿', meaning: '昨天', example: '夜个儿俺去丛台公园转了一圈。', tags: ['时间', '高频'], audioUrl: '', sort: 1, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_2', city: '邯郸市', phrase: '黑介', meaning: '晚上、夜晚', example: '今儿黑介广府城有灯光秀，咱去看不？', tags: ['时间', '高频'], audioUrl: '', sort: 2, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_3', city: '邯郸市', phrase: '沾', meaning: '行、可以、好', example: '“明儿一早走沾不沾？”“沾！”', tags: ['应答', '高频'], audioUrl: '', sort: 3, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_4', city: '邯郸市', phrase: '股就（股蹲）', meaning: '蹲下', example: '你股就那儿系鞋带，挡着道了。', tags: ['动作'], audioUrl: '', sort: 4, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_5', city: '邯郸市', phrase: '使类慌', meaning: '累得慌、很累', example: '爬了趟响堂山，真使类慌。', tags: ['感受', '高频'], audioUrl: '', sort: 5, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_6', city: '邯郸市', phrase: '前晌儿 / 后晌儿', meaning: '上午 / 下午', example: '前晌儿逛隆兴寺，后晌儿回来吃饭。', tags: ['时间'], audioUrl: '', sort: 6, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_7', city: '邯郸市', phrase: '膈应人', meaning: '让人讨厌、恶心、不舒服', example: '他说话办事真膈应人。', tags: ['情绪', '高频'], audioUrl: '', sort: 7, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_8', city: '邯郸市', phrase: '坷垃', meaning: '土块、泥块', example: '地里坷垃太多，得耙耙再种。', tags: ['农事'], audioUrl: '', sort: 8, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_9', city: '邯郸市', phrase: '拾掇', meaning: '收拾、整理、修理', example: '把屋子拾掇拾掇，明儿来客。', tags: ['动作', '高频'], audioUrl: '', sort: 9, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_hd_10', city: '邯郸市', phrase: '姑堆', meaning: '蹲（与“股就”同义，部分县区说法）', example: '别姑堆在门槛上吃饭。', tags: ['动作'], audioUrl: '', sort: 10, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  // ---------------- 石家庄市（冀中片） ----------------
  { _id: 'dial_sjz_1', city: '石家庄市', phrase: '干哕（gān yue）', meaning: '恶心、想呕吐', example: '坐车绕盘山路绕得我直干哕。', tags: ['感受', '高频'], audioUrl: '', sort: 1, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_2', city: '石家庄市', phrase: '嘎咕', meaning: '东西质量差；也指人调皮、不靠谱', example: '这手表刚买两天就坏，真嘎咕。', tags: ['形容', '高频'], audioUrl: '', sort: 2, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_3', city: '石家庄市', phrase: '揍饭', meaning: '做饭', example: '晌午了，俺回家揍饭去。', tags: ['生活', '高频'], audioUrl: '', sort: 3, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_4', city: '石家庄市', phrase: '待见', meaning: '喜欢、愿意搭理（多用于否定）', example: '这孩子嘴甜，谁不待见啊。', tags: ['人际', '高频'], audioUrl: '', sort: 4, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_5', city: '石家庄市', phrase: '旮旯儿', meaning: '角落、偏僻的地方', example: '扫帚在门旮旯儿放着呢。', tags: ['方位', '高频'], audioUrl: '', sort: 5, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_6', city: '石家庄市', phrase: '今儿个 / 明儿个', meaning: '今天 / 明天', example: '今儿个去正定，明儿个逛博物院。', tags: ['时间', '高频'], audioUrl: '', sort: 6, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_7', city: '石家庄市', phrase: '糊弄', meaning: '敷衍、凑合、欺骗', example: '作业好好写，别糊弄事儿。', tags: ['态度', '高频'], audioUrl: '', sort: 7, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_8', city: '石家庄市', phrase: '估摸', meaning: '估计、大概', example: '这到西柏坡估摸还得一个钟头。', tags: ['推测', '高频'], audioUrl: '', sort: 8, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_9', city: '石家庄市', phrase: '唠嗑', meaning: '聊天、闲谈', example: '大爷们蹲墙根儿唠嗑呢。', tags: ['社交', '高频'], audioUrl: '', sort: 9, status: 'active', createTime: daysAgoAt(20, 9, 0) },
  { _id: 'dial_sjz_10', city: '石家庄市', phrase: '晒暖儿', meaning: '晒太阳取暖', example: '冬天老汉们最爱在南墙根晒暖儿。', tags: ['生活'], audioUrl: '', sort: 10, status: 'active', createTime: daysAgoAt(20, 9, 0) }
]

/* ============================ 留言 messages ============================ */
const messages = [
  // ---------------- 邯郸市 ----------------
  {
    _id: 'msg_hd_1', city: '邯郸市', type: 'text', _openid: 'mock-user-001',
    userName: '热情的背包客128', userAvatar: avatar(1),
    content: '刚从广府古城回来，城墙骑行太舒服了，强烈建议早上八点前进城，人少光好！',
    createTime: daysAgoAt(2, 9, 12)
  },
  {
    _id: 'msg_hd_2', city: '邯郸市', type: 'text', _openid: 'mock-user-002',
    userName: '阳光的行者66', userAvatar: avatar(3),
    content: '请问娲皇宫爬到顶大概多久？带老人的话能走吗？',
    createTime: daysAgoAt(1, 10, 35)
  },
  {
    _id: 'msg_hd_3', city: '邯郸市', type: 'text', _openid: 'mock-user-003',
    userName: '友善的观光客307', userAvatar: avatar(5),
    content: '回复楼上：正常一个半小时，有一段台阶比较陡，老人可以走到中层阁楼看看，也很震撼。',
    createTime: daysAgoAt(1, 11, 2)
  },
  {
    _id: 'msg_hd_4', city: '邯郸市', type: 'text', _openid: 'mock-user-004',
    userName: '快乐的旅行者520', userAvatar: avatar(7),
    content: '邯郸的成语浓度真的绝了，学步桥、回车巷、黄粱梦……走着走着就撞上一个典故哈哈哈',
    createTime: daysAgoAt(1, 15, 48)
  },
  {
    _id: 'msg_hd_5', city: '邯郸市', type: 'text', _openid: 'mock-user-005',
    userName: '勇敢的探险家99', userAvatar: avatar(9),
    content: '亲测老槐树拽面，大碗 10 块钱，加卤不要钱，老板太实在了。',
    createTime: daysAgoAt(0, 9, 5)
  },
  {
    _id: 'msg_hd_6', city: '邯郸市', type: 'text', _openid: 'mock-user-006',
    userName: '诚实的驴友23', userAvatar: avatar(2),
    content: '提醒大家：响堂山石窟一定要请讲解，不然真的就是看石头洞，拼团人均才二十多。',
    createTime: daysAgoAt(0, 10, 40)
  },
  {
    _id: 'msg_hd_7', city: '邯郸市', type: 'text', _openid: 'mock-user-007',
    userName: '可爱的游人88', userAvatar: avatar(4),
    content: '国庆有一起去成语文化节的搭子吗？丛台公园集合，俺带相机！',
    createTime: todayAt(8, 20)
  },
  {
    _id: 'msg_hd_8', city: '邯郸市', type: 'text', _openid: 'mock-user-008',
    userName: '聪明的行者15', userAvatar: avatar(6),
    content: '涉县的红色研学做得真好，孩子回来主动把历史课本翻了一遍，值了。',
    createTime: todayAt(9, 55)
  },
  // ---------------- 石家庄市 ----------------
  {
    _id: 'msg_sjz_1', city: '石家庄市', type: 'text', _openid: 'mock-user-101',
    userName: '阳光的驴友77', userAvatar: avatar(8),
    content: '正定古城免费停车是真的！南城门停车场车位充足，为国际庄点赞。',
    createTime: daysAgoAt(2, 14, 22)
  },
  {
    _id: 'msg_sjz_2', city: '石家庄市', type: 'text', _openid: 'mock-user-102',
    userName: '快乐的背包客61', userAvatar: avatar(1),
    content: '河北博物院的长信宫灯必看，记得提前一天公众号预约，周一闭馆别跑空。',
    createTime: daysAgoAt(1, 9, 18)
  },
  {
    _id: 'msg_sjz_3', city: '石家庄市', type: 'text', _openid: 'mock-user-103',
    userName: '热情的游客204', userAvatar: avatar(3),
    content: '隆兴寺的倒坐观音被鲁迅先生称为东方美神，亲眼看到确实挪不开眼。',
    createTime: daysAgoAt(1, 16, 30)
  },
  {
    _id: 'msg_sjz_4', city: '石家庄市', type: 'text', _openid: 'mock-user-104',
    userName: '友善的行者92', userAvatar: avatar(5),
    content: '求问抱犊寨夜爬的话，索道几点停？打算国庆去看日出。',
    createTime: daysAgoAt(0, 8, 40)
  },
  {
    _id: 'msg_sjz_5', city: '石家庄市', type: 'text', _openid: 'mock-user-105',
    userName: '勇敢的行者58', userAvatar: avatar(7),
    content: '回复：夜爬赶不上午索道的，只能徒步，提前两半小时上山，带件厚衣服，山顶风大！',
    createTime: daysAgoAt(0, 9, 2)
  },
  {
    _id: 'msg_sjz_6', city: '石家庄市', type: 'text', _openid: 'mock-user-106',
    userName: '聪明的观光客73', userAvatar: avatar(9),
    content: '正定一日 walk 亲测可行：隆兴寺→四塔→荣国府→南城门夜景，步数 1.8 万，电单车省力气。',
    createTime: daysAgoAt(0, 13, 15)
  },
  {
    _id: 'msg_sjz_7', city: '石家庄市', type: 'text', _openid: 'mock-user-107',
    userName: '诚实的背包客46', userAvatar: avatar(2),
    content: '板面要在小区门口找，别在景区周边吃，懂得都懂（详见黑榜哈哈）。',
    createTime: todayAt(9, 10)
  },
  {
    _id: 'msg_sjz_8', city: '石家庄市', type: 'text', _openid: 'mock-user-108',
    userName: '可爱的旅行者19', userAvatar: avatar(4),
    content: '西柏坡研学回来，孩子在作文里写“两个务必”，老母亲热泪盈眶，推荐！',
    createTime: todayAt(10, 25)
  }
]

module.exports = {
  I: I,
  avatar: avatar,
  todayAt: todayAt,
  daysAgoAt: daysAgoAt,
  activities: activities,
  guides: guides,
  scenics: scenics,
  hallOfFame: hallOfFame,
  heroes: heroes,
  creatives: creatives,
  recommends: recommends,
  rankings: rankings,
  dialects: dialects,
  messages: messages
}
