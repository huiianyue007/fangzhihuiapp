import config from 'assets/js/config'
export default function ({ store, redirect, req }) {
  if (req) {
    let ua = req.headers['user-agent']
    if (store.state.guildReaded < config.guildId && (/Html5Plus/g).test(ua)) {
      redirect('/introduce/')
    }
  }
}
