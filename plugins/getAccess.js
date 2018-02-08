import { tkAjax, tkAjaxGlobal } from 'vue-tk'
let instance = false
export default ({ store }) => {
  if (instance) return false
  instance = true
  if (store.state.access_token) {
    tkAjaxGlobal.headers = {
      'Authorization': `Bearer ${store.state.access_token}`
    }
    tkAjax.post('/api/init/accesstoken/debug', {}, {
      headers: {
        'Authorization': `Bearer ${store.state.access_token}`
      }
    }).then(({ data }) => {
      if (data.status) {
        tkAjaxGlobal.headers = {
          'Authorization': `Bearer ${store.state.access_token}`
        }
        store.commit('setInit')
        store.dispatch('getUserId').catch(() => {})
      }
    }).catch(error => {
      if (error) {
        store.dispatch('getAccessToken').then(() => {
          tkAjaxGlobal.headers = {
            'Authorization': `Bearer ${store.state.access_token}`
          }
          store.commit('setInit')
          store.dispatch('getUserId').catch(() => {})
        })
      }
    })
  } else {
    store.dispatch('getAccessToken').then(() => {
      tkAjaxGlobal.headers = {
        'Authorization': `Bearer ${store.state.access_token}`
      }
      store.commit('setInit')
      store.dispatch('getUserId').catch(() => {})
    }).catch(() => {})
  }
}
