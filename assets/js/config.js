
const defaultConfig = {
  //api 根域名
  baseUrl: 'http://hk.dev.housesigma.com/bkv2',
  //联系电话
  phoneNumber: '+1 289-469 5060',
  //分享
  shareHref: 'http://housesigma.com/site/',
  shareTitle: '房智汇',
  shareContent: '房智汇是专属加拿大的房地产数据智能平台，利用的大数据采集，自主研发的机器学习算法，平台提供物业附近类似成交分析，智能估成交价，物业出租收入分析等等。房智汇的宗旨是成为海外华人在加拿大房产投资的最强助手。',
  shareThumbs: ['http://imgsrc.baidu.com/imgad/pic/item/caef76094b36acaf0accebde76d98d1001e99ce7.jpg'],
  sharePictures: ['http://imgsrc.baidu.com/imgad/pic/item/caef76094b36acaf0accebde76d98d1001e99ce7.jpg'],
  // 包名
  package_id_for_andorid: 'com.housesigma.android',
  package_id_for_ios: 'com.housesigma.ios',
  //微信号
  weChatName: 'fangintel',
  //媒体联系方式
  mediaConcat: 'info@housesigma.com',
  // app版本
  app_version: '1.1.15',
  //公众号ID
  AppID: 'wx4f758be5007633ef',
  //保存在localstorage中的store键名
  vuexStorageKeys: [
    'mainsearchhistory',
    'countrycode'
  ],
  //保存在cookie中的store键名
  vuexCookieKeys: [
    'guildReaded',
    'auth_token',
    'access_token',
    'localeForce',
    'userId'
  ],
  //谷歌地图key
  googleMapsKey: 'AIzaSyCKiQgNaerPrhRZ37AvbhRKgOr28r2AIrE',
  //引导页id
  guildId: 1,
  science: 'nuxt'
}

var localConfig = process.env.config ? require('./configs/' + process.env.config) : {}
export default Object.assign(defaultConfig, localConfig.default)
