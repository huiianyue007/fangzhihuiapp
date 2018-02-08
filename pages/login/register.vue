<template>
    <!--顶部组件myUser-->
    <my-user>
        <div class="container">
            <!--填写手机号-->
            <tk-flex left middle class="layer">
                <!--图标-->
                <tk-icon class = "icon" type = 'custom'>mobile_phone</tk-icon>
                <!--区号-->
                <tk-flex class="input fill" middle>
                    <div class = 'desc' @click = 'change'>
                        {{areaCode}}
                    </div>
                    <!--手机号-->
                    <input type="text" v-model = 'phonenumber' class = 'fill' :placeholder="$t('Login.enterPhone')" maxlength="11">
                    <div class="cursor code" @click = 'sendCode' :class = '{"disable": num < 250 && num > 0}' style="margin: 4px 0;">{{num < 250 && num > 0 ? (Math.floor(num/10)) + 's' + $t('user.resend') : result}}</div>
                </tk-flex>
            </tk-flex>
            <!--区号列表-->
            <transition name = 'fade'>
                <tkui-list class="area_code small" :class = '{"active": flag}' v-if = 'flag'>
                    <tkui-list-item class="border" v-for = '(item, key) in areaList' @click.native = 'select(item.code)' :key = 'key'>
                        <div slot = 'left'>{{item.code}}</div>
                        {{item.text}}
                    </tkui-list-item>
                </tkui-list>
            </transition>
            <!--验证码-->
            <tk-flex left middle class="layer">
                <tk-icon class = "icon" type = 'custom'>verification</tk-icon>
                <input type="text" class = "fill" v-model = 'code' :placeholder="$t('Register.enterCode')">
            </tk-flex>
            <!--密码-->
            <tk-flex left middle class="layer">
                <tk-icon class = "icon" type = 'custom'>password</tk-icon>
                <input type="text" v-model = 'password' class = 'fill' :placeholder="$t('Login.enterPassword')" v-if = 'type'>
                <input type="text" v-model = 'password' class = 'fill' :placeholder="$t('Login.enterPassword')" v-if = '!type'>
                <tk-icon class = "icon active" type = 'custom' v-if = 'code' @click.native = 'showPassWord'>look</tk-icon>
            </tk-flex>
            <!--注册按钮-->
            <tkui-button class = 'block rounded button raised' :class = '[phonenumber && password ? "primary" : "disabled"]' @click.native = 'register'>{{$t('Register.immediately')}}</tkui-button>
            <loadding ref = 'loadding'></loadding>
        </div>
    </my-user>
</template>
<script>
  import loadding from '~/components/loading'
  import myUser from '~/components/userPageHeader'
  import TkuiButton from "../../node_modules/vue-tkui/src/components/button/button";
  export default {
    data () {
      return {
        //手机号
        phonenumber: '',
        //密码
        password: '',
        type: true,
        //验证码
        code: '',
        //验证码已发送
        result: this.$t('user.validate'),
        //loading
        show: false,
        //倒计时
        num: 250,
        //区号
        areaCode: '+ 1',
        flag: false
      }
    },
    computed: {
      //用户信息
      userInfo () {
        return this.$store.state.userInfo
      },
      phoneVerify () {
        return this.verifytoken(this.phonenumber)
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
    components: {
      TkuiButton,
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
      },
      num (val) {
        if (val <= 0) {
          clearInterval(this.time)
          this.num = 250
        }
      }
    },
    mounted () {
      if (this.locale === 'zh') {
        this.areaCode = '+86'
      } else {
        this.areaCode = '+1'
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
      showPassWord () {
        this.type = !this.type
      },
      //发送验证码
      sendCode () {
        if (this.num !== 250) return false
        if (this.time) {
          clearInterval(this.time)
        }
        this.time = setInterval(() => {
          this.num--
        }, 100)
        this.result = this.$t('user.resend1')
        this.$tkAjax.post('/api/auth/user/sendcode', {
          'countrycode': this.areaCode,
          'phonenumber': this.phonenumber
        }).then(res => {
          if (res.data.status) {
            this.alert({
              alert: false,
              submitText: 'OK',
              message: res.data.data.message
            })
          }
        }).catch(() => {
          clearInterval(this.time)
          this.num = 250
          this.result = this.$t('user.validate')
          this.phonenumber = ''
        })
      },
      //发送注册请求
      register () {
        this.show = true
        this.$tkAjax.post('/api/auth/user/signup', {
          'countrycode': this.areaCode,
          'code': this.code,
          'phonenumber': this.phonenumber,
          'pass': this.password
        }).then(res => {
          return new Promise((resolve, reject) => {
            if (res.data.status) {
              this.$store.commit('setCreaton', res.data.data.user.create_date)
              this.$store.commit('setAuth', res.data.data.authtoken)
              resolve(res)
            } else {
              reject(res.data.error.message)
            }
          })
        }).then(res => {
          return this.getUserId()
        }).then(() => {
          this.show = false
          if (this.userInfo.email) {
            this.tkBack()
          } else {
            //填写邮箱
            this.tkReplace({
              path: '/login/email',
              query: {
                from: 'register'
              }
            })
          }
        }).catch(error => {
          this.show = false
          this.alert({
            alert: false,
            submitText: 'OK',
            message: error
          })
        })
      }
    },
    head () {
      return {
        title: this.$t('navigation.register')
      }
    }
  }
</script>
<style scoped lang = 'scss'>
.container{
  text-align:center;
  padding: 0 25px;
  padding-top: 15px;
  font-size: 16px;
  .layer {
    height: 60px;
    box-shadow: 0px 1px 0 0 #f5f5f5;
    color: #333;
    .icon{
      flex: 0 0 auto;
      width: 20px;
      height:20px;
      &.active {
        color: #298998;
      }
    }
    input{
      color: #000;
      text-indent: 1em;
    }
    .input {
      .desc{
        color:#333;
        padding:0 12px;
        line-height: 16px;
        display:block;
        border-right: 1px solid #999;
        font-size: 16px;
        text-align: left;
      }
      input{
        overflow:hidden;
        color: #000;
        text-overflow:ellipsis;
        width:50%;
      }
      .code{
          padding: 10px 6px;
          border: 1px solid #28a3b3;
        &.disable {
          color:#999;
            border:1px solid #f4f4f4;
        }
        color: #298998;
        font-size:14px;
      }
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
}
</style>