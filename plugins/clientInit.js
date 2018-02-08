//浏览器端初始化文件
import VueTk from 'vue-tk'
import config from 'assets/js/config'
import util from 'assets/js/util'

let time = null
function resumeApp () {
  let resumeTime = new Date().getTime()
  if (resumeTime >= time) {
    window.plus.runtime.restart()
  }
}
function pauseApp () {
  let NowTime = new Date().getTime()
  time = NowTime + 21600000
}
const init = function (store, data) {
  if (!instance) {
    store.watch(state => state.init, () => {
      if (instance) return
      instance = true
      VueTk.tkAjax.post('/api/init/app', data).then(({data}) => {
        if (data.data.force_update) {
          store.commit('setForceUpdate')
        }
        if (data.data.update) {
          store.commit('setUpdate', true)
        }
        store.commit('setUpdateMessage', data.data.update_message)
        store.commit('setUpdateUrl', data.data.update_url)
        store.commit('setQrCode', data.data.qr_code.app_download_android)
        store.commit('setiosQr', data.data.qr_code.app_download_ios)
        store.commit('setWeChatQr', data.data.qr_code.wechat_public)
        store.commit('setIsWeChat', data.data.ua_detection.is_wechat)
        store.commit('setIsRobot', data.data.ua_detection.is_robot)
        store.commit('setHomeTitle', data.data.meta.title)
        store.commit('setHomeImage', data.data.meta.image)
        store.commit('setHomeDesc', data.data.meta.description)
        store.commit('setHomeShareUrl', data.data.meta.url)
        store.commit('setPlatForm', data.data.ua_detection.platform)
      })
    })
  }
}
let instance = false
export default ({store}) => {
  let UA = store.state.useragent
  var packageId = ''
  if ((/Html5Plus/g).test(UA) && (/iPhone/g).test(UA)) {
    packageId = config.package_id_for_ios
  } else if ((/Html5Plus/g).test(UA) && (/Android/g).test(UA)) {
    packageId = config.package_id_for_andorid
  }
  let data = {
    'app_version': config['app_version'],
    'ua_string': UA,
    'client_ip': store.state.clientIp,
    'science': config['science']
  }
  if (packageId) {
    data['package_id'] = packageId
  }
  if (!store.state.settingBool) {
    init(store, data)
  } else {
    document.onselectstart = new Function('event.returnValue=false')
    util.plusReady(() => {
      plus.runtime.getProperty(plus.runtime.appid, res => {
        data.version = res.version
        data.push_info = plus.push.getClientInfo()
        init(store, data)
      })
      if (store.state.isIOS) {
        document.addEventListener('plusready', function () {
          document.addEventListener('resume', resumeApp, false)
          document.addEventListener('pause', pauseApp, false)
        }, false)
        plus.runtime.setBadgeNumber(0)
        let GeTuiSdk = plus.ios.importClass('GeTuiSdk')
        GeTuiSdk.setBadge(0)
      }
    })
  }
}

