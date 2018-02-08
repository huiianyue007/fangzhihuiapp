<template>
  <tk-container class="container">
    <!--头部-->
    <tkui-header slot="header">
      <tkui-button class="small icon" @click.native = 'tkBack()' slot = 'left-menu'>
        <tk-icon type = 'custom'>return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t('Login.ForgetPassword')}}</span>
      </tk-flex>
    </tkui-header>
    <!--主体部分-->
    <div class="container-padding">
      <!--填写手机号-->
      <tk-flex left middle class="layer">
        <tk-icon class = "icon" type = 'custom'>mobile_phone</tk-icon>
        <div class = 'desc' @click = 'change'>
          {{areaCode}}
        </div>
        <div class="input fill">
          <input type="text" v-model = 'phonenumber' :placeholder="$t('Login.enterPhone')">
        </div>
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
      <!--获取密码按钮-->
      <tkui-button class = 'block rounded raised button' :class = '[phonenumber ? "primary" : "disabled"]' @click.native = 'resend'>获取密码</tkui-button>
    </div>
  </tk-container>
</template>
<script>
  export default {
    data () {
      return {
        //手机号
        phonenumber: '',
        areaCode: '',
        flag: false
      }
    },
    watch: {
      locale (val) {
        if (val === 'zh') {
          this.areaCode = '+86'
        } else {
          this.areaCode = '+1'
        }
      }
    },
    mounted () {
      //根据语言初始化区号
      if (this.locale === 'zh') {
        this.areaCode = '+86'
      } else {
        this.areaCode = '+1'
      }
    },
    computed: {
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
      //发送密码请求
      resend () {
        this.$tkAjax.post('/api/auth/user/resendpassword', {
          'countrycode': this.areaCode,
          'phonenumber': this.phonenumber
        }).then(res => {
          if (res.data.status) {
            this.toast(res.data.data.message)
          }
        })
      }
    }
  }
</script>
<style lang = 'scss' scoped>
  .container{
    text-align:center;
    font-size:16px;
    background:#fff;
    .layer {
      height: 60px;
      box-shadow: 0px 1px 0 0 #f5f5f5;
      color: #333;
      margin:30px 0 0px;
      .icon{
        width: 20px;
        height:20px;
      }
      .desc{
        padding: 0 12px;
        line-height: 16px;
        float:left;
        color:#333;
        border-right: 1px solid #999;
        font-size: 16px;
        text-align: left;
      }
      .input {
        input{
          width:100%;
          color: #000;
          text-indent:1em;
        }
      }
    }
    .button{
      margin-top:50px;
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
  }
</style>