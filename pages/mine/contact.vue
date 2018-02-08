<template>
  <tk-container class="container container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center>
      <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack()'>
        <tk-icon type = 'custom'>return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span> {{$t('common.contact-house-sigma')}}</span>
      </tk-flex>
    </tkui-header>
    <!--logo-->
    <img :src="$store.getters.lang === 'zh' ? 'http://hk.housesigma.com/html/logo_green_zh_384.png' : 'http://hk.housesigma.com/html/logo_green_en_384.png'" alt="" :class = "$store.getters.lang === 'zh' ? 'zh' : 'en'">
    <!--公司介绍-->
    <div class="container-padding con">
      <div class="desc">
        {{$t('index.desc')}}
      </div>
      <div class="list">{{$t('index.phoneNumber')}}：{{phone}}</div>
      <div class="list">{{$t('index.weChat')}}：{{weChatName}}</div>
      <div class="list">{{$t('index.email')}}：{{mediaConcat}}</div>
    </div>
  </tk-container>
</template>
<script>
  import config from 'assets/js/config'
  export default {
    data () {
      return {
        //公司电话
        phone: config.phoneNumber,
        weChatName: config.weChatName,
        mediaConcat: config.mediaConcat,
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    head () {
      return {
        title: this.$t('navigation.contact')
      }
    }
  }
</script>
<style lang = 'scss' scoped>
  @import 'assets/scss/_variables.scss';
  .container{
    position:fixed;
    height:100%;
    width:100%;
    .zh{
      display:block;
      height:90px;
      width:auto;
      margin:40px auto 32px;
    }
    .en{
      display:block;
      height:100px;
      width:auto;
      margin:40px auto 20px;
    }
    .con{
      font-size: 16px;
      text-align: left;
      color: #666666;
      line-height:2em;
      .desc{
        margin-bottom:33px;
        text-indent:2em;
      }
    }
    .footer{
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      overflow:hidden;
      padding: $gutter;
      box-shadow: 0px -1px 0 0 #dddddd;
    }
  }
</style>