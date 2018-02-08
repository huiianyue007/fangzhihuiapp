<template>
  <tk-container class="container container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t("index.setUser")}}</span>
      </tk-flex>
    </tkui-header>
    <!--主体部分-->
    <tkui-list class = 'small'>
      <!--注册的手机号-->
      <tkui-list-item class = 'border'>
        <div slot = 'left'>{{$t("user.registeredPhoneNumber")}}</div>
        <div class="user_info" slot = 'right'>{{userInfo ? userInfo.phonenumber : ''}}</div>
      </tkui-list-item>
      <!--注册时间-->
      <tkui-list-item class = 'border'>
        <div slot = 'left'>{{$t("user.registeredOn")}}</div>
        <div class="user_info" slot = 'right'>{{createOn}}</div>
      </tkui-list-item>
      <!--更改邮箱-->
      <tkui-list-item class = 'border' @click.native="toChangeEmail">
        <div slot = 'left'>{{$t("user.Email")}}</div>
        <div class="user_info" slot = 'right'>{{userInfo ? userInfo.email : ''}}</div>
      </tkui-list-item>
      <!--修改密码-->
      <tkui-list-item class = 'border' @click.native="toChangePass">
        <div slot = 'left'>{{$t('user.changePass')}}</div>
      </tkui-list-item>
    </tkui-list>
    <!--退出登录按钮-->
    <div class="gutter">
      <tkui-button class="block primary raised" @click.native = 'loginOut'>{{$t('user.signOut')}}</tkui-button>
    </div>
  </tk-container>
</template>
<script>
  export default {
    data () {
      return {
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    computed: {
      //用户信息
      userInfo () {
        return this.$store.state.userInfo
      },
      //注册时间
      createOn () {
        return this.$store.getters.getCreate
      }
    },
    methods: {
      //发送退出登录请求
      loginOut () {
        this.$tkAjax.post('/api/auth/user/signout',{}).then(res => {
          this.$store.commit('setAuth', '')
          this.$store.commit('setUserInfo', null)
          this.$store.commit('setUserId', null)
          this.$store.commit('setCreaton', null)
          this.tkBack()
        }).catch(() => {})
      },
      toChangeEmail () {
        this.tkPush('/mine/changeEmail')
      },
      toChangePass () {
        this.tkPush('/mine/passChange')
      }
    },
    head () {
      return {
        title: this.$t('navigation.setUser')
      }
    }
  }
</script>
<style scoped lang = 'scss'>
.container{
  background: #f5f5f5;
  position:fixed;
  height:100%;
    width:100%;
  .list{
    background: #fff;
      margin-top:1px;
      line-height:50px;
      padding:0 15px;
    .title{
      color: #666;
    }
    .icon{
      color: #999;
    }
    .user_info{
      color:#999;
    }
  }
  .gutter {
    margin-top: 40px;
  }
}
</style>