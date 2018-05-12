const fetch = require('node-fetch')
const wechatBaseUtil = require(__dirname + '/wechatbaseutil.js')
const log = require('tracer').colorConsole({ level: require('config').get('log').level })

/**
 * 微信工具类
 */
let wechatUtil = {
    // 检查用户是否订阅
    async checkIsSubscribe(openid) {
        let accessToken = await wechatBaseUtil.getAccessToken()
        return new Promise((resolve,reject) =>
            fetch(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openid}&lang=zh_CN`)
                .then((res) => {
                    return res.json()
                })
                .then((json) => {
                    if(!json.errcode && json.subscribe == 1){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                })
                .catch((err) => {
                    log.error(`检查用户订阅出错：${err}`)
                    reject(err)
                })
        )
    }
}

module.exports = wechatUtil