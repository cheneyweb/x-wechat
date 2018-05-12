// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()
// 微信工具
const fetch = require('node-fetch')
const config = require('config')
let wechatUtil = require(__dirname + '/../util/wechatutil.js')
var nodebatis = require(__dirname + '/../nodebatis/nodebatis.js')

router.get('/rec', async (ctx, next) => {
    // 微信TOKEN校验
    if (ctx.request.query.echostr) {
        ctx.body = ctx.request.query.echostr
    } else {
        ctx.body = 'Y'
    }
})

router.post('/rec', async (ctx, next) => {
    // 微信TOKEN校验
    if (ctx.request.query.echostr) {
        ctx.body = ctx.request.query.echostr
    } else {
        ctx.body = 'Y'
    }
    let msg = ctx.request.body
    // 接收到订阅事件
    if (msg.xml.MsgType[0] == 'event' && msg.xml.Event[0] == 'subscribe') {
        let openid = msg.xml.FromUserName[0]
        let result = await nodebatis.execute('gw.findClientAuthByOpenid', { openid: openid })
        // 根据openid查询到了等待认证的用户，则进行放行
        if (result != null && result.length > 0 && result[0].authed != 1) {
            let clientAuth = result[0]
            let gw = clientAuth.gw
            let mac = clientAuth.mac
            let ip = clientAuth.ip
            // 请求认证服务器放行
            fetch(`http://${config.get('wechat').domain}/router/allow?gw=${gw}&mac=${mac}&ip=${ip}`)
                .then((res)=>{
                    nodebatis.execute('gw.editClientAuth', { openid: openid })
                })
                .catch((err) => {
                    log.error(`请求认证服务器放行出错：${err}`)
                    reject(err)
                })
        }
    }
})

module.exports = router;