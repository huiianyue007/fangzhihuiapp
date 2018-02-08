export default {
  //H5+ 初始化事件
  plusReady: function (handler) {
    if (window) {
      if (window.plus) {
        handler()
      } else {
        document.addEventListener('plusready', function () {
          handler()
        })
      }
    }
  }
}
