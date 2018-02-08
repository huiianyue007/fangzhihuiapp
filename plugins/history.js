import util from 'assets/js/util'
import {Toast} from 'mint-ui'
import vue from 'vue'

//导航缓存及处理
//请勿修改该文件
function cloneRoute (to, from) {
  let clone = {
    name: to.name,
    path: to.path,
    hash: to.hash,
    query: to.query,
    params: to.params,
    fullPath: decodeURIComponent(to.fullPath),
    meta: to.meta
  }
  if (from) {
    clone.from = cloneRoute(from)
  }
  return clone
}

function checkExist (history, fullPath) {
  let rt = false
  fullPath = decodeURIComponent(fullPath)
  for (let i in history) {
    let item = history[i]
    if (item.fullPath === fullPath) {
      rt = i
      break
    }
  }
  return rt
}

export default ({app, store, route}) => {
  let router = app.router
  app.active = function () {
    let redirect = store.state.routerHistory.redirect
    if (redirect.type !== 'back') {
      return null
    } else {
      let historyIndex = checkExist(store.state.routerHistory.history, redirect.route.fullPath)
      if (historyIndex !== false && store.state.routerHistory.history[historyIndex].data) {
        return store.state.routerHistory.history[historyIndex].data
      } else {
        return null
      }
    }
  }
  const tkPush = function (to) {
    const {route} = router.resolve(to, router.currentRoute)
    let redirect = {
      type: 'push',
      route: cloneRoute(route)
    }
    store.commit('routerHistory/setRedirect', redirect)
    router.push(to)
  }
  const tkReplace = function (to) {
    const {route} = router.resolve(to, router.currentRoute)
    let redirect = {
      type: 'replace',
      route: cloneRoute(route)
    }
    store.commit('routerHistory/setRedirect', redirect)
    router.replace(to)
  }
  const tkBack = function (to) {
    let historyPosition
    let type = 'back'
    let route
    if (to && to.target) {
      to = null
    }
    if (store.state.routerHistory.history.length === 1 && !to) {
      to = {
        path: '/'
      }
      tkBack(to)
      return
    }
    if (to) {
      route = router.resolve(to, router.currentRoute).route
      let routeIndex = checkExist(store.state.routerHistory.history, route.fullPath)
      historyPosition = routeIndex - store.state.routerHistory.history.length + 1
    } else {
      historyPosition = -1
    }
    let redirect = {
      type: type,
      route: route ? cloneRoute(route) : null
    }
    store.commit('routerHistory/setRedirect', redirect)
    if (historyPosition) {
      router.go(historyPosition)
    } else {
      router.replace(to)
    }
  }
  const mixin = {
    methods: {
      tkPush,
      tkReplace,
      tkBack
    }
  }
  vue.mixin(mixin)
  const history = []
  const redirect = {
    type: null,
    route: null
  }
  store.registerModule('routerHistory', {
    namespaced: true,
    state: {
      history,
      redirect
    },
    getters: {},
    mutations: {
      setRedirect (state, redirect) {
        state.redirect = redirect
      },
      deleteHistory (state, fullpath) {
        if (fullpath) {
          fullpath = decodeURIComponent(fullpath)
          let history = state.history
          for (let i in history) {
            if (history[i].fullPath === fullpath) {
              history.splice(i - 0 + 1)
              break
            }
          }
          state.history = history
        }
      },
      pushHistory (state, to) {
        state.history.push(state.redirect.route)
      },
      replaceHistory (state, to) {
        state.history.pop()
        state.history.push(state.redirect.route)
      },
      removeHistoryRedirect (state) {
        let re = {
          type: null,
          route: null
        }
        state.redirect = re
      },
      setData (state, payload) {
        let historyExist = checkExist(state.history, payload.path)
        if (historyExist) {
          state.history[historyExist].data = payload.data
        }
      }
    },
    actions: {
      historyBack (context, to) {
        let fullpath = to.fullPath
        let historyExist = checkExist(context.state.history, fullpath)
        if (historyExist) {
          context.commit('deleteHistory', fullpath)
        } else {
          context.commit('replaceHistory', to)
        }
      },
      pushHistory (context, to) {
        context.commit('pushHistory', to)
      },
      replaceHistory (context, to) {
        context.commit('replaceHistory', to)
      }
    }
  })
  router.beforeEach(function (to, from, next) {
    to = cloneRoute(to)
    if (!store.state.routerHistory.redirect.type) {
      let historyPosition = checkExist(store.state.routerHistory.history, to.fullPath)
      if (historyPosition) {
        let redirect = {
          type: 'back',
          route: cloneRoute(to, from)
        }
        store.commit('routerHistory/setRedirect', redirect)
      } else {
        let redirect = {
          type: 'push',
          route: cloneRoute(to, from)
        }
        store.commit('routerHistory/setRedirect', redirect)
      }
    } else if (store.state.routerHistory.redirect.type === 'back' && !store.state.routerHistory.redirect.route) {
      let redirect = {
        type: 'back',
        route: cloneRoute(to, from)
      }
      store.commit('routerHistory/setRedirect', redirect)
    }
    if (store.state.routerHistory.redirect.type !== 'back' && from.matched.length > 0) {
      store.commit('routerHistory/setData', {
        data: Object.assign({}, from.matched[0].instances.default.$data),
        path: from.fullPath
      })
    }
    next()
  })

  router.afterEach(function (to, from) {
    to = cloneRoute(to)
    if (store.state.routerHistory.redirect && store.state.routerHistory.redirect.route && store.state.routerHistory.redirect.route.fullPath === to.fullPath) {
      if (store.state.routerHistory.redirect.type === 'back') {
        store.dispatch('routerHistory/historyBack', to)
      } else if (store.state.routerHistory.redirect.type === 'push') {
        store.dispatch('routerHistory/pushHistory', to)
      } else {
        store.dispatch('routerHistory/replaceHistory', to)
      }
    }
    store.commit('routerHistory/removeHistoryRedirect')
  })
  let waitClose = false
  function backButtonHandler () {
    if (router.currentRoute.path === '/') {
      if (waitClose) {
        window.plus.runtime.quit()
      } else {
        Toast({
          message: '再按一次退出应用',
          position: 'bottom'
        })
        waitClose = true
        window.setTimeout(function () {
          waitClose = false
        }, 2000)
      }
    } else {
      tkBack()
    }
  }
  util.plusReady(function () {
    plus.key.addEventListener('backbutton', backButtonHandler, false)
  })
}
