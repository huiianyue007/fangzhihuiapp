module.exports = {
  router: {
    base: '/site/'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '房智汇',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0' },
      { hid: 'description', name: 'description', content: '房智汇' },
      {'http-equiv': 'cache-control', content: 'max-age=0'},
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { 'http-equiv': 'expires', content: '0' },
      { 'http-equiv': 'expires', content: 'Tue, 01 Jan 1980 1:00:00 GMT' },
      { 'http-equiv': 'pragma', content: 'no-cache' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/LOGO1.ico' }
    ],
    script: [
      { src: 'html5plus://ready' }, {src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
    ]
  },
  /*
  ** Global CSS
  */
  css: [{ src: 'assets/scss/main.scss', lang: 'scss' }, 'swiper/dist/css/swiper.css', 'vue-tk/dist/vue-tk.css', 'mint-ui/lib/style.css', 'vue-tkui/dist/vue-tkui.css'],
  /*
  ** Customize the progress-bar color
  */
  // loading: { color: '#3B8070' },
  loading: '~/components/loading.vue',
  plugins: [{
    src: 'plugins/init.js'
  }, {
    src: 'plugins/vuexStorage.js'
  }, {
    src: 'plugins/getAccess.js'
  }, {
    src: 'plugins/clientInit.js',
    ssr: false
  }, {
    src: 'plugins/history.js',
    ssr: false
  }, {
    src: 'plugins/woopra.js',
    ssr: false
  }, {
    src: 'plugins/wxConfig.js',
    ssr: false
  }, {
    src: 'plugins/i18n.js'
  }],
  build: {
    vendor: ['vue-tk', 'vue2-google-maps', 'vue-tkui', 'echarts']
  },
  env: {
    config: process.env.npm_config_config || null
  }
}
