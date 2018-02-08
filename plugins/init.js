import Vue from 'vue'
import VueTk from 'vue-tk'
import config from 'assets/js/config'
import global from 'assets/js/global'
import * as filters from 'assets/js/filter'
import * as directive from 'assets/js/directive'
import MintUI from 'mint-ui'
import VueTkUi from 'vue-tkui'
import * as VueGoogleMaps from 'vue2-google-maps/dist/vue-google-maps-stubbed'
import tkLink from '~/components/tkLink.vue'
import iconfont from 'assets/json/icon.json'
// import Config from 'assets/js/config'
// import axios from 'axios'
Vue.component('tk-link', tkLink)
Vue.use(VueGoogleMaps)
//设置谷歌地图参数
VueGoogleMaps.load(config.googleMapsKey, null, null, true)
export default ({app, store, req, isClient}) => {
  if (req && req.headers['x-real-ip']) {
    store.commit('setClientIp', req.headers['x-real-ip'])
  }
  //初始化第三方库
  Vue.use(MintUI)
  Vue.mixin(global)
  Vue.use(VueTk)
  Vue.use(VueTkUi)
  for (let name in filters) {
    Vue.filter(name, filters[name])
  }
  for (let name in directive) {
    Vue.directive(name, directive[name])
  }
  if (req) {
    let UA = req.headers['user-agent']
    store.commit('setSetting', (/Html5Plus/g).test(UA))
    store.commit('setIOS', (/iPhone/g).test(UA))
    store.commit('setAndorid', (/Android/g).test(UA))
  }

  //初始化图标配置
  Vue.prototype.$tkIcon.set({
    custom: {
      code: 298254,
      type: 'private',
      useClassAsName: true,
      data: iconfont
    }
  })

  VueTk.tkAjaxGlobal.baseURL = config.baseUrl
  //ajax全局错误处理
  VueTk.tkAjaxGlobal.errorHandler = {
    910: function (err) {
      app.router.push({path: '../error/error', query: {statusCode: err.error.code, message: err.error.message}})
      return Promise.reject(err)
    },
    400: function (res) {
      if (res.data.error.message) {
        store.dispatch('alertToggle', res.data.error.message)
      } else {
        store.dispatch('alertToggle', '未知错误')
      }
      return Promise.reject(res)
    }
  }
  VueTk.tkAjaxGlobal.midwares = [
    async (res, next) => {
      if (res.data.error.code === 900) {
        let AccessToken = await store.dispatch('getAccessToken')
        VueTk.tkAjaxGlobal.headers = {
          'Authorization': `Bearer ${AccessToken}`
        }
        if (store.state.userId) {
          await store.dispatch('getUserId').catch(() => {})
        }
        res.config.headers['Authorization'] = `Bearer ${AccessToken}`
        res = await VueTk.tkAjax.request(res.config).catch(error => {
          next(error)
        })
      }
      next(res)
    },
    (res, next) => {
      if (!res.data.status && res.status === 200) {
        res.status = 400
      }
      next(res)
    }
  ]
  if (process.browser) {
    const VueAwesomeSwiper = require('vue-awesome-swiper/ssr')
    Vue.use(VueAwesomeSwiper)
  }
  //设置状态栏颜色
  Vue.prototype.$tkStatusBar.setColor('#16727e')
  //禁止ios下body的弹性效果
  Vue.prototype.$tkContainer.disableBodyOverScroll()
  //判断是否为APP
}

