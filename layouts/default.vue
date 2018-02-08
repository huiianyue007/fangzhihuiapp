<template>
    <tk-flex class="main tkui" column center :style="settingBool ? noSelectStyle : null">
      <div class="phone-header"></div>
      <div class="box">
        <nuxt></nuxt>
        <tk-cover transition :color = 'color' :show="show" :hideOnClick = 'false'>
          <tk-flex class="con_con" column>
            <tk-flex middle column class="message">
              <div class="desc">{{message}}</div>
            </tk-flex>
            <tk-flex middle average class = 'footer'>
              <div class="button submit active cursor" @click="hidden">OK</div>
            </tk-flex>
          </tk-flex>
        </tk-cover>
      </div>
      <!--桌面版二维码-->
      <div class="load">
        <div class="erweima" v-if="num == 1 && $store.getters.lang === 'zh'">
          <img :src="weChat" alt="" class="bgimg">
          <p>微信扫描图中二维码</p>
          <p>关注微信公众号</p>
        </div>
        <div class="erweima" v-else-if="num == 2">
          <img :src="iosQr" alt="" class="bgimg">
          <p>{{$t('index.main')}}</p>
          <p>{{$t('index.IOS')}}</p>
        </div>
        <div class="erweima" v-else="num == 3">
          <img :src="qrCode" alt="" class="bgimg">
          <p>{{$t('index.main')}}</p>
          <p>{{$t('index.Android')}}</p>
        </div>
        <div class="btn">
          <div class="cursor weixin" @click="changenum(1)" :class="{active : num === 1}" v-show=" $store.getters.lang === 'zh'">
            <tk-icon type="custom" class="icon">weixin</tk-icon>
          </div>
          <div class="cursor weixin" @click="changenum(2)" :class="{active : num === 2}">
            <tk-icon type="custom" class="icon">ios</tk-icon>
          </div>
          <div class="cursor weixin" @click="changenum(3)" :class="{active : num === 3}">
            <tk-icon type="custom" class="icon">android</tk-icon>
          </div>
        </div>
      </div>
    </tk-flex>
</template>

<script>
export default {
  data () {
    return {
      num: this.$store.getters.lang ? 1 : 2,
      color: 'rgba(0, 0, 0, .4)',
      noSelectStyle: {
        'user-select': 'none'
      }
    }
  },
  methods: {
    changenum (num) {
      this.num = num
    },
    hidden () {
      this.$store.commit('setGlobalAlert', false)
    }
  },
  computed: {
    qrCode () {
      return this.$store.getters.getQrCode
    },
    weChat () {
      return this.$store.getters.getWechatQr
    },
    iosQr () {
      return this.$store.state.iosQrCode
    },
    show () {
      return this.$store.state.globalAlert
    },
    message () {
      return this.$store.state.globalMessage
    },
    settingBool () {
      return this.$store.getters.getSetting
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../assets/scss/main';
  .main{
    height: 100%;
    width: 100%;
    .box{
      flex: 1;
      overflow-y: hidden;
      .con_con{
        background-color:#fff;
        width:290px;
        min-height:140px;
        border-radius: 4px;
        postion:relative;
        .message{
          flex:1;
          margin-top:15px;
          width:100%;
          text-align:center;
          .title {
            font-size: 18px;
            font-weight: bold;
            line-height: 1.11;
            text-align: center;
            color: #333;
          }
          .desc{
            font-size: 16px;
            width:210px;
            line-height: 1.64;
            text-align: center;
            color: #8f8f8f;
            margin:10px auto;
          }
        }
        .footer{
          postion:absolute;
          bottom:0;
          left:0;
          text-align:center;
          width:100%;
          border-top: 1px solid #f5f5f5;
          .button{
            line-height:47px;
            color: #666;
            &.active{
              color: #298998;
            }
            &.submit{
              border-left: 1px solid #f5f5f5;
            }
          }
        }
      }
    }
  }
  .load, .phone-header{
    display: none;
  }
  @media (min-width: 1270px) {
    .load{
      display: block;
    }
  }
  @media (max-width: 769px) {
    .main {
      width: 100%;
      .box {
        width: 100%;
        height:100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
  @media (min-width: 769px) {
    .main {
      background: url("../assets/img/beijn.png") no-repeat;
      background-size: cover;
      .phone-header{
        display: block;
        width: 650px;
        height: 52px;
        background: url("../assets/img/shoujikuan-.png");
        background-size: cover;
      }
      .box {
        width: 650px;
        background: #fff;
        transform: translate3d(0,0,0);
      }
      .load {
        position: absolute;
        top: 132px;
        right: 13%;
        .erweima {
          padding: 10px;
          background: #fff;
          .bgimg {
            width: 201px;
            height: 199px;
          }
          p {
            font-size: 20px;
            color: #28a3b3;
            text-align: center;
          }
        }
        .btn {
          position: absolute;
          top: 0;
          right: -48px;
          .weixin {
            width: 48px;
            height: 48px;
            background: #fff;
            text-align: center;
            line-height: 48px;
            .icon {
              width: 24px;
              height: 28px;
              color: #999;
            }
          }
          .active {
            background: #28a3b3;
            .icon {
              color: $white;
            }
          }
        }
      }
    }
  }
  @media (max-width: 1600px) {
    .main {
      .load {
        right: 80px;
      }
    }
  }
</style>
