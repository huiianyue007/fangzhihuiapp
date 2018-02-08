var Koa = require('koa')
var app = new Koa()
var Nuxt = require('nuxt')

var config = require('./nuxt.config.js')
config.dev = !(app.env === 'production')

var nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}
app.use(function * () {
  this.status = 200 // koa defaults to 404 when it sees that status is unset
  yield nuxt.render(this.req, this.res)
})

var port = process.env.npm_config_port || 3000
app.listen(port)
