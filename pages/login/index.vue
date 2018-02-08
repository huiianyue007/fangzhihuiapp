<template>
  <!--顶部组件myUser-->
  <my-user>
      <div class="container">
        <!--手机号填写-->
        <tk-flex left middle class="layer">
          <!--图标-->
          <tk-icon class = "icon" type = 'custom'>mobile_phone</tk-icon>
          <!--区号-->
          <div class = 'desc' @click = 'change'>
            {{areaCode}}
          </div>
          <!--手机号-->
          <div class="input fill">
            <input type="text" v-model = 'phonenumber' :placeholder="$t('Login.enterPhone')">
          </div>
        </tk-flex>
        <!--区号的选择-->
        <transition name = 'fade'>
          <tkui-list class="area_code small" :class = '{"active": flag}' v-if = 'flag'>
            <tkui-list-item  class="border" v-for = '(item, key) in areaList' @click.native = 'select(item.code)' :key = 'key'>
              <div slot = 'left'>{{item.code}}</div>
              {{item.text}}
            </tkui-list-item>
          </tkui-list>
        </transition>
        <!--填写密码-->
        <tk-flex left middle class="layer">
          <tk-icon class = "icon" type = 'custom'>password</tk-icon>
          <input type="text" v-model = 'password' :placeholder="$t('Login.enterPassword')">
        </tk-flex>
        <!--登录按钮-->
        <tkui-button class = 'block rounded raised button' :class = '[phonenumber && password ? "primary" : "disabled"]' @click.native = 'login'>{{$t('Login.immediately')}}</tkui-button>
        <!--忘记密码-->
        <tk-link tag = 'div' :to = "path('/login/resend')" class="forget">{{$t('Login.ForgetPassword')}}</tk-link>
        <loadding ref = 'loadding'></loadding>
      </div>
  </my-user>
</template>
<script>
  import loadding from '~/components/loading'
  import myUser from '~/components/userPageHeader'
  export default {
    asyncData ({params}) {
      return {
        params
      }
    },
    data () {
      return {
        //手机号
        phonenumber: '',
        //密码
        password: '',
        show: false,
        //区号
        areaCode: '+ 1',
        //选择区号
        flag: false
      }
    },
    components: {
      loadding,
      myUser
    },
    watch: {
      show (val) {
        if (val) {
          this.$refs.loadding.$emit('show')
        } else {
          this.$refs.loadding.$emit('hidden')
        }
      },
      locale (val) {
        if (val === 'zh') {
          this.areaCode = '+86'
        } else {
          this.areaCode = '+1'
        }
      }
    },
    mounted () {
      if (this.locale === 'zh') {
        this.areaCode = '+86'
        this.$store.commit('setCountryCode', '+86')
      } else {
        this.areaCode = '+1'
        this.$store.commit('setCountryCode', '+1')
      }
    },
    computed: {
      url () {
        return this.$store.getters.getPage
      },
      //用户信息
      userInfo () {
        return this.$store.state.userInfo
      },
      //区号列表
      areaList () {
        if (this.locale === 'zh') {
          return [{
            code: '+86',
            text: '中国'
          }, {
            code: '+1',
            text: '加拿大'
          }, {
            code: '+1',
            text: '美国'
          }]
        } else {
          return [{
            code: '+1',
            text: 'Canada'
          }, {
            code: '+1',
            text: 'U.S'
          }]
        }
      }
    },
    methods: {
      select (opt) {
        this.flag = false
        this.areaCode = opt
      },
      change () {
        this.flag = !this.flag
      },
      //登录
      login () {
        this.show = true
        this.$tkAjax.post('/api/auth/user/signin', {
          'countrycode': this.areaCode,
          'phonenumber': this.phonenumber,
          'pass': this.password
        }).then(res => {
          if (res.data.status) {
            let authtoken = res.data.data.authtoken
            this.$store.commit('setAuth', authtoken)
            this.$store.commit('setUserId', res.data.data.user.user_id)
            this.$store.commit('setUserInfo', res.data.data.user)
            this.$store.commit('setCreaton', res.data.data.user.create_date)
            return Promise.resolve(res)
          } else {
            return Promise.reject(res.data.error.message)
          }
        }).then(res => {
          this.show = false
          if (!this.userInfo.email) {
            this.tkReplace({
              path: '/login/email',
              query: {from: 'login'}
            })
          } else {
            if (this.params.url) {
              this.tkReplace(this.params.url)
              return
            }
            this.tkBack()
          }
        }).catch(() => {
          this.show = false
        })
      }
    },
    head () {
      return {
        title: this.$t('navigation.login')
      }
    }
  }
</script>
<style scoped lang = 'scss'>
  .container{
    text-align:center;
    padding: 0 25px;
    padding-top: 15px;
    font-size:16px;
    .layer {
      height: 60px;
      box-shadow: 0px 1px 0 0 #f5f5f5;
      color: #999;
      .icon{
        width: 20px;
        height:20px;
      }
      .desc{
        padding: 0 12px;
        line-height: 16px;
        color:#333;
        float:left;
        position:relative;
        border-right: 1px solid #999;
        font-size: 16px;
        text-align: left;
      }
      .input {
        input{
          color:#000;
          width:100%;
        }
      }
      input{
        color:#000;
        text-indent:1em;
      }
    }
      .area_code{
          width: 100%;
          color:#333;
          .list{
              line-height: 2em;
              text-align:center;
              border-bottom:1px solid #fff;
              &:last-child{
                  border:none;
              }
          }
          transform:translateY(-100%);
          &.active{
              transform:translateY(0px);
          }
      }
    .button {
      margin-top:25px;
    }
    .forget{
      text-align:center;
      line-height: 16px;
      margin-top:24px;
      font-size: 16px;
      color: #298998;
    }
    .btn-small {
      display:flex;
      align-items: center;
      justify-content: center;
      border-radius: 48px;
      width: 134px;
      margin:11% auto 3%;
      line-height:40px;
      height:40px;
      font-size: 12px;
      text-align: center;
      border:1px solid #029e44;
      color: #029e44;
      .icon{
          width: 19.2px;
          display:inline-block;
          margin-right:8px;
          height: 15.7px;
      }
    }
  }
</style>