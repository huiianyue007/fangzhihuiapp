export default function ({ app, store, route, params, error, redirect, hotReload }) {
  if (hotReload) return
  const locale = store.getters.lang || 'zh'
  if (store.state.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  store.commit('setLocale', locale)
  app.i18n.locale = locale
}
