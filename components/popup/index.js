import popup from './popup'
import Vue from 'vue'
let PopupInstance = Vue.extend(popup)
let instance = null
const getInstance = function () {
  if (!instance) {
    instance = new PopupInstance({
      el: document.createElement('div')
    })
  }
  return instance
}
let messageBox = option => {
  let messageInstance = getInstance()
  for (let name in option) {
    messageInstance[name] = option[name]
  }
  Vue.nextTick(() => {
    messageInstance.show = true
    document.body.appendChild(messageInstance.$el)
  })
  return new Promise((resolve, reject) => {
    if (option.disbaleClick) {
      messageInstance.$on('submit', () => {
        resolve()
      })
    } else {
      messageInstance.$once('submit', () => {
        resolve()
      })
    }
    if (!option.alert) {
      messageInstance.$once('cancel', () => {
        reject()
      })
    }
  })
}
export default messageBox
