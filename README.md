# 文旅小程序

> 基于微信原生框架 + 微信云开发的城市文旅综合服务小程序，提供名人堂、红黑榜、方言库、文创展示、旅游攻略、活动报名、留言互动等一站式文化旅游服务。

![License](https://img.shields.io/badge/license-MIT-green) ![Platform](https://img.shields.io/badge/platform-WeChat%20MiniProgram-07c160) ![Cloud](https://img.shields.io/badge/backend-%E5%BE%AE%E4%BF%A1%E4%BA%91%E5%BC%80%E5%8F%91-blue)

## 功能特性

- **静默登录**：无需授权弹窗，自动注册并获取用户信息
- **多城市支持**：省市二级城市选择，全量数据按城市隔离，互不干扰
- **8 大业务模块**：英烈名人堂、红黑榜、方言库、景点、文创、活动、旅游攻略、留言板
- **UGC 内容生态**：支持发布活动/攻略/方言/人物/景点/榜单，含报名、留言、浏览量统计等互动能力
- **离线演示模式**：内置 Mock 数据层，无需云环境即可完整演示全部功能（一键切换）
- **统一数据契约**：Mock 层与云函数实现同一接口契约，页面代码零改动切换数据源

## 技术栈

| 层级 | 技术 |
| ---- | ---- |
| 前端 | 微信原生小程序（WXML / WXSS / JS） |
| 后端 | 微信云开发（云函数 + 云数据库 + 云存储） |
| 数据层 | 本地 Mock 拦截器（与云函数同契约，可切换） |

## 项目结构

```
├── app.js                  # 小程序入口（环境配置、登录、Mock 开关）
├── app.json                # 全局配置（页面路由、TabBar、窗口）
├── app.wxss                # 全局样式
├── config/
│   ├── env.example.js      # 环境配置模板（提交到仓库）
│   └── env.js              # 真实环境配置（已 gitignore，本地创建）
├── pages/                  # 25 个页面（首页/活动/攻略/我的 等）
├── components/             # 公共组件
├── cloudfunctions/         # 33 个云函数
├── utils/
│   └── mock/               # 本地 Mock 数据层（云函数拦截器）
├── images/                 # 静态图片资源
└── sitemap.json            # 站点地图
```

## 快速开始

### 环境要求

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（稳定版）
- 基础库 2.2.3+（云能力依赖）
- 已注册微信小程序账号并开通云开发（演示模式可跳过）

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/sdss-arch/wenlv-miniprogram.git

# 2. 创建本地环境配置（真实值不入库）
cp config/env.example.js config/env.js
# 编辑 config/env.js，填入你的云开发环境 ID

# 3. 微信开发者工具导入项目根目录
```

### 云端初始化（使用真实云开发时）

1. 开发者工具中开通云开发环境，将环境 ID 填入 `config/env.js`
2. 在 `project.config.json` 中填入你的 AppID（或使用体验模式）
3. 右键 `cloudfunctions/` 下各云函数目录 → **创建并部署：云端安装依赖**
4. 云开发控制台 → 数据库，创建下方「数据库集合」中列出的集合

### 演示模式（Mock）

未配置云环境时，项目默认启用本地 Mock 数据层，可离线体验全部功能：

```js
// config/env.js
module.exports = {
  CLOUD_ENV_ID: 'your-cloud-env-id',
  USE_MOCK: true   // false = 走真实云开发
}
```

也可在开发者工具 **Storage 面板** 设置 `mockEnabled: '1' / '0'` 运行时切换，无需改代码。

## 云函数一览

| 分类 | 云函数 |
| ---- | ---- |
| 用户 | `login` `city` `updateUserCity` |
| 活动 | `getActivities` `getActivityDetail` `joinActivity` `publishActivity` |
| 攻略 | `getTravelGuides` `getGuideDetail` `getTravelNotes` `publishGuide` `incrementViewCount` |
| 名人堂 | `getHallOfFame` `getPersonDetail` `getHeroes` `getCelebrities` `publishPerson` |
| 红黑榜 | `getRankingList` `getRecommends` `getRecommendDetail` `getAvoids` `publishRanking` |
| 景点/文创 | `getScenics` `getScenicDetail` `publishScenic` `getCreatives` `getCreativeDetail` |
| 方言 | `getDialects` `getDialectList` `publishDialect` |
| 留言 | `getMessages` `sendMessage` `addMessage` |

## 数据库集合

| 集合 | 说明 |
| ---- | ---- |
| `users` | 用户信息（含所选城市） |
| `activities` / `activity_joins` | 活动及报名记录 |
| `travel_guides` | 旅游攻略 |
| `hall_of_fame` | 名人堂（英烈/名人） |
| `rankings` | 红黑榜 |
| `recommends` / `avoids` | 推荐与避雷 |
| `scenics` / `creatives` | 景点与文创 |
| `dialects` | 方言库 |
| `messages` | 留言板 |

> 所有业务数据均携带城市字段，由云函数按城市过滤，实现多城市数据隔离。

## 开发规范

- 分支：`main` 为稳定分支，功能开发请使用 `feature/*` 分支
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)（`feat:` / `fix:` / `docs:` / `refactor:`）
- 敏感配置（AppID、云环境 ID）一律放 `config/env.js` 或 `project.private.config.json`，**严禁提交**

## 安全说明

- 仓库不含任何真实 AppID、云环境 ID 及密钥
- 真实配置通过 gitignore 的本地文件注入，模板见 `config/env.example.js`
- 若发现安全问题，请通过 Issue 联系维护者

## 常见问题

**Q: 打开项目提示 AppID 无效？**
A: 仓库默认使用体验模式 AppID（`touristappid`）。请在本地的 `project.config.json` 中填入你自己的 AppID（该文件改动不要提交）。

**Q: 云函数调用失败？**
A: 确认已部署云函数、`config/env.js` 中环境 ID 正确；或临时将 `USE_MOCK` 设为 `true` 走本地演示。

**Q: 数据库查询无结果？**
A: 确认已创建对应集合，且数据的城市字段与当前选择城市一致。

**Q: 出现 `__route__ is not defined` 错误？**
A: 微信开发者工具内部错误，清除缓存或重启开发者工具即可。

## License

[MIT](./LICENSE)
