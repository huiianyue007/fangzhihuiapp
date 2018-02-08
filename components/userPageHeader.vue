<template>
  <div class="box">
    <tk-container class="container" :statusBar="statusBar">
      <tk-flex class="header_container" middle center>
      <!--头部-->
      <tkui-header class = 'header' color = "#fff" background = 'transparent' :style="{paddingTop:statusBarHeight}">
        <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack()'>
          <tk-icon type="custom">return</tk-icon>
        </tkui-button>
      </tkui-header>
      <!--根据语言更换logo-->
      <img v-show = "$store.getters.lang === 'zh'" src="http://hk.housesigma.com/html/housesigma_logo_zh.png" :class = "$store.getters.lang === 'zh' ? 'zh' : 'en'">
      <img v-show = "$store.getters.lang === 'en'" src="http://hk.housesigma.com/html/housesigma_logo_en.png" :class = "$store.getters.lang === 'zh' ? 'zh' : 'en'">
        <tk-flex class="bottom" average>
        <tk-link :to = "path('/login')"  class = 'router' :class = "{'active': $route.fullPath === path('/login') || $route.query.from === 'login'}" replace>{{$t("Login.Login")}}</tk-link>
        <tk-link :to = "path('/login/register')" class = 'router' :class = "{'active': $route.fullPath === path('/login/register') || $route.query.from === 'register'}" replace>{{$t("Register.Register")}}</tk-link>
      </tk-flex>
      </tk-flex>
      <slot></slot>
    </tk-container>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        statusBar: {
          show: false,
          immersion: true
        },
        statusBarHeight: null
      }
    },
    mounted () {
      this.statusBarHeight = this.$tkStatusBar.height() + 'px'
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/scss/main';
  @media (min-width: 768px) {
    .box {
      transform: translate3d(0, 0, 0);
      width: 650px;
      height: 100%;
      overflow: hidden;
      background:#fff;
      margin: 0 auto;
    }
  }
  @media (max-width: 1600px) {
    .main {
      .load {
        right: 4%;
      }
    }
  }
  .container{
    width:100%;
    background:#fff;
    .header_container {
      height: 270px;
      color: #fff;
      position: relative;
      background-image: linear-gradient(to right, #298998, #00c4c2);
      .header{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        box-shadow:none;
      }
      .en {
        height: 80px;
        width:auto;
      }
      .zh {
        height:53px;
        width:auto;
      }
      .bottom{
        position:absolute;
        bottom:0;
        width:100%;
        left:0;
        .router{
          &.active:after {
            content: '';
            display:block;
            width: 36px;
            height: 36px;
            background-color: $white;
            position:absolute;
            bottom:-34px;
            left:calc(50% - 18px);
            transform: rotate(45deg);
          }
          position: relative;
          overflow:hidden;
          text-align:center;
          font-size:16px;
          line-height: 49px;
          color: #fff;
        }
      }
    }
  }
</style>