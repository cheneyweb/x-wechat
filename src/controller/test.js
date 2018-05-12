const axios = require('axios')
const fs = require('fs')
// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()

router.get('/test', function (ctx, next) {
    // log.info(ctx.request.query)
    /*
    axios.get('https://dev.genwoshua.com//alpha/api/shopapp/shopcounts/1698')
        .then(function (response) {
            console.log(response.data)
            // console.log(response.status)
            // console.log(response.statusText)
            // console.log(response.headers)
            // console.log(response.config)
        })
        .catch(function (error) {
            console.log(error)
        })
    let postData = {
        shopId: '1698',
        content: 'test1234'
    }

    axios.post('https://dev.genwoshua.com//alpha/api/shopapp/getQrCodeUrl', postData)
        .then(function (response) {
            console.log(response.data)
            // console.log(response.status)
            // console.log(response.statusText)
            // console.log(response.headers)
            // console.log(response.config)
        })
        .catch(function (error) {
            console.log(error)
        })
    */
    let options = {
        responseType: 'stream'
    }
    axios.get('http://cdn.genwoshua.com/o_1bchoj5501bvq64619envidp396t.jpg',options)
        .then(function (response) {
            response.data.pipe(fs.createWriteStream('./ada_lovelace.jpg'))
        })
        .catch(function (error) {
            console.log(error)
        })
    ctx.body = 'Y'
})

module.exports = router