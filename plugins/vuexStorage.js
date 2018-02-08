import tkVuexStorage from 'vue-tk/dist/utils/tkVuexStorage'
import config from 'assets/js/config'

//同步store中的数据到localStorage中
export default ({store, req, isServer}) => {
  tkVuexStorage.init(store, config.vuexStorageKeys, config.vuexCookieKeys)
  let cookie = null
  if (isServer) {
    if (req.headers.cookie && config.vuexCookieKeys) {
      cookie = req.headers.cookie
    }
  }
  let cookieStore = tkVuexStorage.restoreCookie(cookie)
  store.commit('initFromStorage', cookieStore)
  let storageStore = tkVuexStorage.restoreStorage()
  store.commit('initFromStorage', storageStore)
}
