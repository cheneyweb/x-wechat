// 配置文件环境变量
process.env.NODE_CONFIG_DIR = __dirname + '/config'
const port = require('config').get('server').port

// 应用服务相关
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router/router.js')
const staticServer = require('koa-static')
const mount = require('koa-mount')

// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })

// 初始化应用服务
const app = new Koa()
// 中间件配置
app.use(mount('/xwechat/',staticServer(__dirname+'/../static')))
app.use(bodyParser())
app
	.use(router.routes())
	.use(router.allowedMethods())

// 启动应用服务
app.listen(port)
log.info(`应用已启动,执行环境:${process.env.NODE_ENV},端口:${port}...`)