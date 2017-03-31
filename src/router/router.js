// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })

const router = new Router()

router.get('/', function (ctx, next) {
	ctx.body = '欢迎使用XWechat服务'
})

router.get('/xwechat/scanlogin_cb', function (ctx, next) {
	log.info(ctx.request.query)
	ctx.body = 'Y'
})

module.exports = router;
