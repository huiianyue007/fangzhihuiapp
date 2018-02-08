<template>
  <div class="main-box">
    <div class="main-bottom">
      <div class="left">
        <div class="guanzhu" @click="gologin">
          <tk-icon type="custom" class="icon">attention1</tk-icon>
          <span>关注</span>
        </div>
        <div class="share">
          <tk-icon type="custom" class="icon">share</tk-icon>
          <span>分享</span>
        </div>
      </div>
      <button class="btn" @click="showImg">
        立即咨询
      </button>
    </div>
    <tk-cover class="photo-list" :show="cover.show" :transition="cover.transition" middle center @change="hideImg" color='rgba(0,0,0,0.5)'>
      <div class="house-phone" @click.stop>
        <h5>提示</h5>
        <p>确认拨打：1289 469 5060</p>
        <div class="bottom">
          <button class="left" @click="cover.show = !cover.show">取消</button>
          <a href="tel:12894695060" class="right">拨打</a>
        </div>
      </div>
    </tk-cover>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        cover: {
          show: false, transition: true, changeCover: false
        }
      }
    },
    methods: {
      gologin () {
        this.tkPush('/login/')
      },
      hideImg (opt) {
        this.cover.show = opt
      },
      showImg () {
        this.cover.show = true
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../assets/scss/main';
  .main-bottom {
    display: flex;
    padding-left: 15px;
    justify-content:space-between;
    align-items: center;
    border-top: 1px solid #e0e0e0;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: $white;
    .left {
      display: flex;
      .icon {
        width: 23px;
        height: 23px;
        margin-right: 5px;
      }
      span {
        font-size: $AuxiliaryfontSize;
        color: #666;
      }
      .guanzhu, .share {
        flex: 1;
        margin-right: 24px;
      }
    }
    .btn {
      width: 145px;
      height: 49px;
      background: #3e8b97;
      color: $white;
      font-size: $font-size;
    }
  }
  .house-phone {
    background: $white;
    border-radius: 9px;
    width: 290px;
    h5 {
      padding-top: 20px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    p {
      padding-top: 15px;
      color: #444;
      font-size: $font-size;
      text-align: center;
    }
    .bottom {
      margin-top: 25px;
      border-top: 1px solid #ddd;
      display: flex;
      .left, .right {
        width: 50%;
        height: 47px;
      }
      .left {
        border-right: 1px solid #ddd;
      }
      .right {
        text-align: center;
        line-height: 47px;
        color: #298998;
      }
    }
  }
</style>
