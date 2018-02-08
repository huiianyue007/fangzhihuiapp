import vue from 'vue'

(function(){
  var t,i,e,n=window,o=document,a=arguments,s="script",r=["config","track","identify","visit","push","call","trackForm","trackClick"],c=function(){var t,i=this;for(i._e=[],t=0;r.length>t;t++)(function(t){i[t]=function(){return i._e.push([t].concat(Array.prototype.slice.call(arguments,0))),i}})(r[t])};for(n._w=n._w||{},t=0;a.length>t;t++)n._w[a[t]]=n[a[t]]=n[a[t]]||new c;i=o.createElement(s),i.async=1,i.src="//static.woopra.com/js/w.js",e=o.getElementsByTagName(s)[0],e.parentNode.insertBefore(i,e)
})('woopra')
window.woopra.config({
  domain: 'housesigma.com'
})

export default ({app, store, isServer}) => {
  let router = app.router
  router.afterEach(function (to, from) {
    //流量监控,去除微信,机器人
    let weChat = store.state.is_weChat
    let robot = store.state.is_robot
    if (!isServer) {
      setTimeout(function () {
        window.woopra.track('pv', {
          url: window.location.pathname,
          title: document.title
        })
      }, 500)
      if (store && store.state.userInfo) {
        window.woopra.identify({
          email: store.state.userInfo.email,
          name: store.state.userInfo.phonenumber,
          is_wechat: weChat,
          is_robot: robot
        })
      } else {
        window.woopra.identify({
          is_wechat: weChat,
          is_robot: robot
        })
      }
    }
    const woopraEvent = (val, obj) => {
      window.woopra.track(val, obj)
    }
    const mixin = {
      methods: {
        woopraEvent
      }
    }
    vue.mixin(mixin)
  })
}
