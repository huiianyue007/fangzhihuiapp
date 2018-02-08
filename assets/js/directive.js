export const focus = {
  // 当绑定元素插入到 DOM 中。
  inserted (el) {
    // 聚焦元素
    el.focus()
  }
}
