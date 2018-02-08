<template>
  <tk-container class="container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center middle slot="header">
      <tk-flex center middle>
        <tk-flex middle center>
          <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
          <span>{{$t('user.title')}}</span>
        </tk-flex>
      </tk-flex>
    </tkui-header>
    <!--主体部分-->
    <div class="container ">
      <div class="user_con">
        <!--用户信息-->
        <tk-flex bottom column class="user_info">
          <tk-link :to='userInfo ? path("/mine/setUser"): path("/login")' class="user">
            <tk-flex class="li_title" middle v-show='userInfo'>
              <div class="t_con fill">{{userInfo ? userInfo.phonenumber : ''}}</div>
              <tk-icon type='custom' class='icon'>setup</tk-icon>
            </tk-flex>
            <div class="desc" v-show='userInfo'>{{userInfo ? userInfo.email : ''}}</div>
            <tk-flex class="li_title" middle v-show='!userInfo'>
              <div class="t_con fill">{{$t('user.login')}}</div>
              <tk-icon type='custom' class='icon'>setup</tk-icon>
            </tk-flex>
            <div class="desc" v-show='!userInfo'>{{$t('user.signIn')}}</div>
          </tk-link>
        </tk-flex>
        <tkui-list class='small'>
          <!--我的关注-->
          <tkui-list-item class='border' @click.native="routeTo('/home/follow')">
            <tk-icon class="icon icon_title" slot='left' :style='{color:"#ffc600"}' type='custom'>attention1</tk-icon>
            <div class='li_title'>{{$t('user.myFollow')}}</div>
            <tk-icon class="small icon" type='custom' slot='right'>return_copy</tk-icon>
          </tkui-list-item>
          <!--语言切换-->
          <tkui-list-item class='border' @click.native="routeTo('/mine/lang')">
            <tk-icon class="icon icon_title" type='custom' slot='left' :style='{color:"#0099ff"}'>Switch</tk-icon>
            <tk-flex between class='li_title' style="width: 100%;">
              <span>{{$t('user.switchLanguage')}}</span>
              <span class='lang'>{{locale === 'zh' ? '中文' : $t("name.english")}}</span>
            </tk-flex>
            <tk-icon class="small icon" type='custom' slot='right'>return_copy</tk-icon>
          </tkui-list-item>
          <!--扫描二维码-->
          <tkui-list-item class='border' @click.native="share" v-if="setting">
            <tk-icon class="icon icon_title" type='custom' slot='left' :style='{color:"#26d470"}'>qr_code</tk-icon>
            <div class='li_title'>{{$t('user.RecommendQRCode')}}</div>
            <tk-icon class="small icon" type='custom' slot='right'>return_copy</tk-icon>
          </tkui-list-item>
          <!--联系房智汇-->
          <tkui-list-item class='border' @click.native="routeTo('/mine/contact')">
            <tk-icon class="icon icon_title" type='custom' slot='left' :style='{color:"#24a8bd"}'>contact</tk-icon>
            <div class='li_title'>{{$t('common.contact-house-sigma')}}</div>
            <tk-icon class="small icon" type='custom' slot='right'>return_copy</tk-icon>
          </tkui-list-item>
          <!--更新APP-->
          <tkui-list-item class='border' @click.native='checkUpdate' v-if='setting && !this.$store.state.isIOS'>
            <tk-icon class="icon icon_title" type='custom' slot='left' :style='{color:"#ff5b29"}'>examination</tk-icon>
            <div class='li_title'>{{$t('user.checkForUpdate')}}</div>
            <tk-icon class="small icon" type='custom' slot='right'>return_copy</tk-icon>
          </tkui-list-item>
        </tkui-list>
      </div>
      <loadding ref='loadding'></loadding>
    </div>
    <my-footer slot="footer"></my-footer>
  </tk-container>
</template>
<script>
  import myFooter from '~/components/Footer'
  import util from 'assets/js/util'
  import config from 'assets/js/config'
  import loadding from '~/components/loading'
  export default {
    data () {
      return {
        //状态栏配置项
        statusBar: {
          show: true,
          //沉浸式
          immersion: false
        },
        show: false,
        shares: []
      }
    },
    components: {
      myFooter,
      loadding
    },
    watch: {
      show (val) {
        if (val) {
          this.$refs.loadding.$emit('show')
        } else {
          this.$refs.loadding.$emit('hidden')
        }
      }
    },
    mounted () {
      util.plusReady(() => {
        plus.share.getServices((s) => {
          for (let i in s) {
            let t = s[i]
            this.shares[t.id] = t
          }
        })
      })
    },
    methods: {
      checkUpdate () {
        this.show = true
        util.plusReady(() => {
          plus.runtime.getProperty(plus.runtime.appid, res => {
            let version = res.version
            let UA = window.navigator.userAgent
            var packageId = ''
            if ((/Html5Plus/g).test(UA) && (/iPhone/g).test(UA)) {
              packageId = config.package_id_for_ios
            } else if((/Html5Plus/g).test(UA) && (/Android/g).test(UA)) {
              packageId = config.package_id_for_andorid
            }
            let data = {
              'app_version': config['app_version'],
              'ua_string': UA,
              'client_ip': this.$store.state.clientIp,
              'version': version,
              'science': config['science']
            }
            if(packageId) {
              data['package_id'] = packageId
            }
            this.$tkAjax.post('/api/init/app', data).then(({
              data
            }) => {
              this.show = false
              if (data.data.force_update) {
                this.alert({
                  alert: false,
                  message: data.data.update_message,
                  submitText: '更新'
                }).then(() => {
                  let url = this.$store.state.update_url
                  util.plusReady(() => {
                    plus.runtime.openURL(url, () => {
                      this.toast('打开浏览器失败')
                    })
                  })
                }).catch(() => {
                  this.$store.commit('SHOWUPDATA_ALERT')
                })
                return false
              }
              if (data.data.update) {
                this.alert({
                  message: data.data.update_message,
                  cancelText: '稍后更新',
                  submitText: '更新'
                }).then(() => {
                  let url = this.$store.state.update_url
                  util.plusReady(() => {
                    plus.runtime.openURL(url, () => {
                      this.toast('打开浏览器失败')
                    })
                  })
                }).catch(() => {
                  this.$store.commit('setUpdate', false)
                  this.$store.commit('SHOWUPDATA_ALERT')
                })
              } else {
                this.alert({
                  alert: false,
                  message: '当前已是最新版本',
                  submitText: 'OK'
                })
              }
            })
          })
        })
      },
      //跳转
      routeTo (opt) {
        this.tkPush(this.path(opt))
      },
      shareSystemNativeJS () {
        console.log('分享成功')
      },
      shareSystem () {
        let self = this
        let msg = {content: self.$store.state.homeShareTitle + '(' + self.$store.state.homeShareTitle + ')'}
        plus.share.sendWithSystem ? plus.share.sendWithSystem(msg, function () {
        }, function (e) {
        }) : this.shareSystemNativeJS()
      },
      shareOne (shareTip, shareText) {
        let Context = plus.android.importClass('android.content.Intent')
        let Main = plus.android.runtimeMainActivity()
        let shareIntent = new Context(Context.ACTION_SEND)
        shareIntent.setType('text/plain')
        shareIntent.putExtra(Context.EXTRA_TEXT, shareText)
        Main.startActivity(Context.createChooser(shareIntent, shareTip))
      },
      //分享的社交平台
      share () {
        let self = this
        if (this.setting) {
          if (plus.os.name === 'Android') {
            let bool = plus.runtime.isApplicationExist({pname: 'com.tencent.mm'})
            if (bool) {
              let shareBts = []
              // 更新分享列表
              let ss = this.shares['weixin']
              ss && ss.nativeClient && (shareBts.push({title: '微信朋友圈', s: ss, x: 'WXSceneTimeline'}),
                shareBts.push({title: '微信好友', s: ss, x: 'WXSceneSession'}))
              // 弹出分享列表
              shareBts.length > 0 ? plus.nativeUI.actionSheet({title: '分享链接', cancel: '取消', buttons: shareBts}, (e) => {
                (e.index > 0) && this.shareAction(shareBts[e.index - 1], true)
              }) : plus.nativeUI.alert('当前环境无法支持分享链接操作!')
            } else {
              this.shareOne('', self.$store.state.homeShareTitle + '(' + self.$store.state.homeShareTitle + ')')
            }
          } else {
            let boolIOS = plus.runtime.isApplicationExist({action: 'weixin://RnUbAwvEilb1rU9g9yBU'})
            if (boolIOS) {
              let shareBts = []
              // 更新分享列表
              let ss = this.shares['weixin']
              ss && ss.nativeClient && (shareBts.push({title: '微信朋友圈', s: ss, x: 'WXSceneTimeline'}),
                shareBts.push({title: '微信好友', s: ss, x: 'WXSceneSession'}))
              // 弹出分享列表
              shareBts.length > 0 ? plus.nativeUI.actionSheet({title: '分享链接', cancel: '取消', buttons: shareBts}, (e) => {
                (e.index > 0) && this.shareAction(shareBts[e.index - 1], true)
              }) : plus.nativeUI.alert('当前环境无法支持分享链接操作!')
            } else {
              this.shareSystem()
            }
          }
        }
      },
      //设置分享的参数
      shareAction (sb, bh) {
        let self = this
        let msg = {content: '123', extra: {scene: sb.x}}
        if (bh) {
          msg.href = self.$store.state.homeShareUrl
          msg.title = self.$store.state.homeShareTitle
          msg.content = self.$store.state.homeShareDesc
          msg.thumbs = [self.$store.state.homeShareImage]
        }
        // 发送分享
        if (sb.s.authenticated) {
          this.shareMessage(msg, sb.s)
        } else {
          sb.s.authorize(() => {
            this.shareMessage(msg, sb.s)
          }, (e) => {
          })
        }
      },
      //发送分享
      shareMessage (msg, s) {
        s.send(msg, () => {
          this.toast('分享成功')
        }, (e) => {
        })
      }
    },
    computed: {
      //用户信息
      updateCopy () {
        return this.$store.state.update
      },
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    head () {
      return {
        title: this.$t('navigation.user')
      }
    }
  }
</script>
<style scoped lang='scss'>
  .container-wrap {
    .container {
      height: 100%;
      .user_con {
        width: 100%;
        background: url('../../assets/img/Background-map.png') #f5f5f5 no-repeat;
        background-size: 100% 33%;
        height: 100%;
        .user_info {
          overflow: hidden;
          height: 33%;
          padding: 0 15px;
          .user {
            margin-bottom: 25px;
            height: 95px;
            background: #fff;
            border-radius: 6px;
            padding: 0 15px;
            overflow: hidden;
            box-shadow: 0px 12px 50px 0 rgba(22, 83, 93, 0.12);
            .li_title {
              margin: 23px 0 14px;
              font-size: 23px;
              .t_con {
                text-align: left;
              }
              .icon {
                flex: 0 0 40px;
                width: 20px;
                height: 20px;
                color: #666;
              }
            }
            .desc {
              font-size: 14px;
              color: #999;
            }
          }
        }
        .list {
          font-size: 16px;
          background: #fff;
          text-align: left;
          color: #666666;
          margin-bottom: 1px;
          height: 7%;
          padding: 0 15px;
          &:last-child {
            margin: 15px 0 76px;
          }
          .icon {
            width: 20px;
            height: 23px;
            color: #666;
            &.icon_title {
              margin-right: 20px;
            }
          }
          .li_title {
            flex: 1;
            .lang {
              float: right;
              color: #999;
              font-size: 14px;
            }
          }
        }
      }
      .shadow {
        .con {
          width: 290px;
          border-radius: 9px;
          text-align: center;
          padding: 0 9px;
          background-color: #fff;
          .title {
            font-size: 18px;
            margin-top: 15px;
            font-weight: bold;
            line-height: 1.11;
            text-align: center;
            color: #333;
          }
          .desc {
            margin-top: 10px;
            font-size: 14px;
            line-height: 1.64;
            text-align: center;
            color: #666;
          }
          .footer {
            border-top: 1px solid #ddd;
            margin-top: 13px;
            .list {
              line-height: 47px;
              text-align: center;
              font-size: 16px;
              &.color {
                color: #298998;
              }
              &:first-child {
                border-right: 1px solid #ddd;
              }
            }
          }
        }
      }
    }
  }
</style>