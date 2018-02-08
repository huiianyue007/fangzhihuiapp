import { tkAjax } from 'vue-tk'
export const state = () => ({
  // 判断是否首次登录
  guildReaded: 0,
  // 模糊搜索存储记录
  mainsearchhistory: [],
  // 智能推荐城市列表
  recommendCity: [],
  countrycode: '',
  recommendCityList: [],
  // 是否继续弹更新提示窗口
  showUpdataAlery: false,
  //判断语言
  locale: null,
  localeForce: null,
  locales: ['en', 'zh'],
  //用户ID
  userId: '',
  access_token: '',
  auth_token: '',
  userInfo: null,
  //全部需求
  weighting: {
    school: '0', growth: '0', rentalreturn: '0', lotsize: '0'
  },
  list: [],
  useragent: '',
  bool: false,
  pathList: [],
  hold: null,
  settingBool: false,
  attentionBool: false,
  //注册时间
  createOn: null,
  init: false,
  //下载二维码
  qrCode: null,
  //wechat二维码
  weChatQr: null,
  update_url: null,
  force_update: false,
  update: false,
  is_weChat: null,
  is_robot: null,
  //访问用户ip
  clientIp: null,
  iosQrCode: null,
  meta: null,
  homeShareTitle: null,
  homeShareImage: null,
  homeShareDesc: null,
  homeShareUrl: null,
  update_message: '',
  jsapi_ticket: null,
  platForm: null,
  isIOS: false,
  isAndorid: false,
  globalAlert: false,
  globalMessage: 'fhdsahfjsdhajk'
})

export const getters = {
  lang: state => state.localeForce || state.locale,
  getAccess: state => state.access_token,
  getPage: state => state.page,
  userId: state => state.userId,
  getUserInfo: state => state.userInfo,
  getCreate: state => state.createOn,
  getAuth: state => state.auth_token,
  getBool: state => state.bool,
  getPath: state => state.pathList,
  getHold: state => state.hold,
  getSetting: state => state.settingBool,
  getAttentionBool: state => state.attentionBool,
  getQrCode: state => state.qrCode,
  getWechatQr: state => state.weChatQr
}
export const mutations = {
  guildReaded (state, id) {
    state.guildReaded = id
  },
  setInit (state) {
    state.init = true
  },
  setUserAgent (state, opt) {
    state.useragent = opt
  },
  setIOS (state, opt) {
    state.isIOS = opt
  },
  // 增加搜索记录
  PUSHSEARCH_HISTORY (state, payload) {
    state.mainsearchhistory.unshift(payload)
  },
  // 是否显示更新提示弹窗
  SHOWUPDATA_ALERT (state) {
    state.showUpdataAlery = !state.showUpdataAlery
  },
  // 清空搜索记录
  CLEARSEARCH_HISTORY (state) {
    state.mainsearchhistory = []
  },
  // 增加推荐城市
  ADD_RECOMMENDCITYLIST (state, payload) {
    state.recommendCityList.push(payload)
  },
    // 删除推荐城市
  DELETE_RECOMMENDCITYLIST (state, payload) {
    state.recommendCityList.splice(state.recommendCity.indexOf(payload), 1)
  },
  setRecommendCity (state, opt) {
    state.recommendCity = opt
  },
  setAccess (state, opt) {
    state.access_token = opt
  },
  setPage (state, opt) {
    state.page = opt
  },
  setAuth (state, opt) {
    state.auth_token = opt
  },
  setUserId (state, opt) {
    state.userId = opt
  },
  setCountryCode (state, opt) {
    state.countrycode = opt
  },
  setCreaton (state, opt) {
    state.createOn = opt
  },
  setUserInfo (state, opt) {
    state.userInfo = opt
  },
  setEmail (state, opt) {
    state.userInfo.email = opt
  },
  setLocale (state, opt) {
    state.locale = state.locales.indexOf(opt) > -1 ? opt : 'zh'
  },
  setLocaleForce (state, opt) {
    if (opt === null) {
      state.localeForce = null
    } else {
      state.localeForce = state.locales.indexOf(opt) > -1 ? opt : 'zh'
    }
  },
  setWeightSchool (state, opt) {
    state.weighting.school = opt
  },
  setWeightGrowth (state, opt) {
    state.weighting.growth = opt
  },
  setWeightRent (state, opt) {
    state.weighting.rentalreturn = opt
  },
  setWeightLotsize (state, opt) {
    state.weighting.lotsize = opt
  },
  setBool (state, opt) {
    state.bool = opt
  },
  setPath (state, opt) {
    state.pathList.push(opt)
  },
  setSetting (state, opt) {
    state.settingBool = opt
  },
  setHold (state, opt) {
    state.hold = opt
  },
  emptyPath (state) {
    state.pathList.pop()
  },
  setAttentionBool (state) {
    state.attentionBool = !state.attentionBool
  },
  setWeChat (state, opt) {
    state.weChat = opt
  },
  setQrCode (state, opt) {
    state.qrCode = opt
  },
  setWeChatQr (state, opt) {
    state.weChatQr = opt
  },
  setUpdateUrl (state, opt) {
    state.update_url = opt
  },
  setForceUpdate (state) {
    state.force_update = true
  },
  setUpdate (state, opt) {
    state.update = opt
  },
  setIsWeChat (state, opt) {
    state.is_weChat = opt
  },
  setIsRobot (state, opt) {
    state.is_robot = opt
  },
  setClientIp (state, ip) {
    state.clientIp = ip
  },
  setiosQr (state, opt) {
    state.iosQrCode = opt
  },
  setMeta (state, opt) {
    state.meta = opt
  },
  setHomeTitle (state, opt) {
    state.homeShareTitle = opt
  },
  setHomeImage (state, opt) {
    state.homeShareImage = opt
  },
  setHomeDesc (state, opt) {
    state.homeShareDesc = opt
  },
  setUpdateMessage (state, opt) {
    state.update_message = opt
  },
  setTicket (state, opt) {
    state.jsapi_ticket = opt
  },
  setPlatForm (state, opt) {
    state.platForm = opt
  },
  setAndorid (state, opt) {
    state.isAndorid = opt
  },
  setGlobalAlert (state, opt) {
    state.globalAlert = opt
  },
  setGlobalMessage (state, opt) {
    state.globalMessage = opt
  },
  setEmptyList (state) {
    state.list = []
  },
  setDouList (state, opt) {
    state.list.splice(opt, 1)
  },
  setList (state, opt) {
    state.list.push(opt)
  },
  setAllList (state) {
    state.list = ['D.', 'S.', 'A.', 'C.']
  },
  setHomeShareUrl (state, opt) {
    state.homeShareUrl = opt
  },
  initFromStorage (state, opt) {
    for (let i in opt) {
      state[i] = opt[i]
    }
  }
}
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    commit('setUserAgent', req.headers['user-agent'])
  },
  getUserId ({getters, state, commit}) {
    let Auth = getters.getAuth
    let AccessToken = getters.getAccess
    if (!Auth || !AccessToken) return Promise.reject()
    return tkAjax.post('/api/auth/user/verifytoken', {
      'authtoken': Auth
    }).then(res => {
      if (res.data.status) {
        commit('setUserId', res.data.data.user.user_id)
        commit('setUserInfo', res.data.data.user)
        commit('setCreaton', res.data.data.user.create_date)
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.data.error.message)
      }
    }).catch()
  },
  getAccessToken ({ commit, state }) {
    commit('setAccess', '')
    return tkAjax.post('/api/init/accesstoken/new').then(function (res) {
      commit('setAccess', res.data.data.access_token)
      return Promise.resolve(res.data.data.access_token)
    })
  },
  alertToggle ({commit}, mes) {
    commit('setGlobalAlert', true)
    commit('setGlobalMessage', mes)
  }
}
