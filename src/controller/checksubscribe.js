// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()
// 微信工具
let wechatUtil = require(__dirname + '/../util/wechatutil.js')

router.get('/check', async (ctx, next) => {
    let gw = ctx.request.query.gw
    let openid = ctx.request.query.openid
    let isSubscribe = await wechatUtil.checkIsSubscribe(openid)
    if(isSubscribe){
        log.info('用户已订阅')
        ctx.body = 'Y'
    }else{
        log.info('用户未订阅')
        ctx.body = 'N'
    }
})

module.exports = router;