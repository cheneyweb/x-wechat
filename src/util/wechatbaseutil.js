const fetch = require('node-fetch')
const redisClient = require(__dirname + '/redis.js')
const config = require('config')
const log = require('tracer').colorConsole({ level: config.get('log').level })

const orderAppId = config.wechat.orderAppId
const orderAppKey = config.wechat.orderAppKey
const redisAccessTokenKey = `ACCESS_TOKEN_${config.wechat.orderAppId}`
/**
 * 微信基础工具类
 */
let wechatUtil = {
    /**
     * 使用APPID和KEY去获取ACCESS_TOKEN
     */
    getAccessToken() {
        let _this = this
        let needRefresh = true
        return new Promise((resolve) => {
            redisClient.get(redisAccessTokenKey, (err, value) => {
                // 1，从缓存读取到ACCESS_TOKEN,并判断缓存是否过期
                if (!err && value) {
                    let accessToken = JSON.parse(value)
                    let now = new Date()
                    if (now.getTime() < accessToken.expires_time) {
                        needRefresh = false                                                         // 不需要重新获取ACCESS_TOKEN
                        resolve(accessToken.access_token)                                           // 通过resolve返回ACCESS_TOKEN
                    }
                }
                // 2，重新获取ACCESS_TOKEN
                if (needRefresh) {
                    fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${orderAppId}&secret=${orderAppKey}`)
                        .then((res) => {
                            return res.json()
                        })
                        .then((accessToken) => {
                            accessToken.expires_time = _this.getExpireTime(accessToken.expires_in)  // 获取过期时间
                            redisClient.set(redisAccessTokenKey, JSON.stringify(accessToken))       // 设置ACCESS_TOKEN
                            resolve(accessToken.access_token)                                       // 通过resolve返回ACCESS_TOKEN
                        })
                        .catch((err) => {
                            log.error(`获取ACCESS_TOKEN出错：${err}`)
                        })
                }

            })
        })
    },
    /**
     * 获取过期时间
     * @param {*} expiresIn 
     */
    getExpireTime(expiresIn) {
        let now = new Date()
        let timestamp = now.getTime()
        let expiresTime = new Date()
        expiresTime.setTime(timestamp + 1000 * expiresIn)
        return expiresTime.getTime()
    }
}

module.exports = wechatUtil