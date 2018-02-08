import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { tkAjaxGlobal } from 'vue-tk'
Vue.use(VueI18n)
export default ({app, store, req}) => {
  //双语言
  let locale = store.getters.lang
  if (store.state.locales.indexOf(store.state.localeForce) === -1) {
    store.commit('setLocaleForce', null)
  }
  if (req) {
    let getQueryString = function (field) {
      let href = req.url
      let reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i')
      let string = reg.exec(href)
      return string ? string[1] : null
    }
    let lang = getQueryString('lang')
    let reqLanguage = req.headers['accept-language']
    if (store.state.locales.indexOf(locale) === -1 || !locale) {
      if (store.state.locales.indexOf(lang) !== -1 && lang) {
        store.commit('setLocale', lang)
      } else if (reqLanguage) {
        locale = /zh/.test(reqLanguage) ? 'zh' : 'en'
        store.commit('setLocale', locale)
      }
    }
  }
  if (!tkAjaxGlobal.data) {
    tkAjaxGlobal.data = {}
  }
  tkAjaxGlobal.data.lang = locale === 'zh' ? 'zh_CN' : 'en_US'
  if (!store.state.countrycode) {
    if (locale === 'zh') {
      store.commit('setCountryCode', '+86')
    } else {
      store.commit('setCountryCode', '+1')
    }
  }
  app.i18n = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: {
      'zh': require('~/locales/zh.json'),
      'en': require('~/locales/en.json')
    }
  })

  store.subscribe(function (mutation, state) {
    let locale = state.localeForce || state.locale
    app.i18n.locale = locale
    tkAjaxGlobal.data.lang = locale === 'zh' ? 'zh_CN' : 'en_US'
    if (!store.state.countrycode) {
      if (locale === 'zh') {
        store.commit('setCountryCode', '+86')
      } else {
        store.commit('setCountryCode', '+1')
      }
    }
  })
}
