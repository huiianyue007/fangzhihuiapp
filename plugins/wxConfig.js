import sha1 from 'sha1'
import config from 'assets/js/config'
import {tkAjax} from 'vue-tk'
let timestamp = parseInt(new Date().getTime() / 1000)
let noncestr = 'fangzhihui'
function createSignature (url, ticket) {
  let str1 = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url
  let signature = sha1(str1)
  return signature
}
let instance = false
export default ({store, app}) => {
  if (!instance) {
    store.watch(state => state.init, () => {
      if (instance) return
      instance = true
      tkAjax.post('/api/init/wechatmp/jsapi_ticket', {}).then((res) => {
        let url = window.location.href.split('#')[0]
        let signature1 = createSignature(url, res.data.data.jsapi_ticket)
        wx.config({
          debug: false,
          appId: config.AppID,
          timestamp: timestamp,
          nonceStr: noncestr,
          signature: signature1,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        })
        store.commit('setTicket', res.data.data.jsapi_ticket)
      })
    })
  }
  let router = app.router
  router.afterEach((to, from) => {
    if (store && store.state.jsapi_ticket) {
      let ticket1 = store.state.jsapi_ticket
      let url = window.location.href.split('#')[0]
      let signature1 = createSignature(url, ticket1)
      wx.config({
        debug: false,
        appId: config.AppID,
        timestamp: timestamp,
        nonceStr: noncestr,
        signature: signature1,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
      })
    }
  })
}
