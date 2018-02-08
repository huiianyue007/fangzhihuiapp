<template>
  <div class="m-introduce" id="main-box1-height">
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="rongqi">
            <img v-show = "$store.getters.lang === 'zh'" src="linshiimg/Forecast.png" alt="" width="353px" height="367px">
            <img v-show = "$store.getters.lang === 'en'" src="../../assets/img/EN-Forecast.png" alt="" width="353px" height="367px">
            <div class="content">
              <h2>{{$t("bootPage.nearbyPrediction")}}</h2>
              <p>{{$t("bootPage.findEstimation")}}</p>
            </div>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="rongqi">
            <img v-show = "$store.getters.lang === 'zh'" src="linshiimg/Assessment.png" alt="" width="315px" height="334px" class="page2">
            <img v-show = "$store.getters.lang === 'en'" src="../../assets/img/EN-Assessment.png" alt="" width="315px" height="334px" class="page2">
            <div class="content">
              <h2>{{$t("bootPage.growthAnalysis")}}</h2>
              <p style="padding-left: 15px; padding-right: 15px;">{{$t("bootPage.Monitor")}}</p>
            </div>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="rongqi">
            <img v-show = "$store.getters.lang === 'zh'" class="othoer-img" src="linshiimg/Return.png" alt="" width="306px" height="314px">
            <img v-show = "$store.getters.lang === 'en'" class="othoer-img" src="../../assets/img/EN-Return.png" alt="" width="306px" height="314px">
            <div class="content content1 ">
              <h2>{{$t("bootPage.rentalReturn")}}</h2>
              <p>{{$t("bootPage.figure")}}</p>
              <button @click="back">{{$t("bootPage.startHere")}}</button>
            </div>
          </div>
        </div>
      </div>
      <div id="jieshaoswiper" class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>

<script>
  import config from 'assets/js/config'
  export default {
    data () {
      return {
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true
        }
      }
    },
    methods: {
      back () {
        this.tkPush('/')
      }
    },
    mounted () {
      this.$store.commit('guildReaded', config.guildId)
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  @media (min-width: 768px) {
    #main-box1-height {
      height: 100%;
    }
  }
  @media (max-height: 600px) {
    #main-box1-height {
      img {
        margin-top: 6%;
      }
      .page2 {
        margin-top: 15%;
      }
      .content1, .content {
        margin-top: 3%;
        button {
          margin-top: 3%;
        }
      }
      .swiper-pagination {
        bottom: 20px;
      }
    }
  }
  .m-introduce {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    .swiper-container {
      height: 100%;
      width: 100%;
      display: flex;
      .swiper-slide {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction:column;
        align-items:center;
        background-color: white;
      }
    }
    .rongqi {
      width: 100%;
      display: flex;
      flex-direction:column;
      align-items:center;
      img {
        margin-top: 60px
      }
      .page2 {
        margin-top: 93px;
      }
      .othoer-img {
        margin-top: 50px;
      }
      .content {
        width: 100%;
        margin-top: 60px;
        h2 {
          font-size: 28px;
          color: #28a3b3;
          text-align: center;
          font-weight: normal;
        }
        p {
          font-size: $font-size;
          padding-top: 9px;
          color: #28a3b3;
          text-align: center;
        }
      }
      .content1 {
        margin-top: 45px;
        padding: 0 $gutter;
        box-sizing: border-box;
        text-align: center;
        width: 100%;
        button {
          display: inline-block;
          margin-top: 30px;
          width: 180px;
          height: 42px;
          border: 1px solid #28a3b3;
          border-radius: 3px;
          font-size: $font-size;
          color: #28a3b3;
        }
      }
    }
  }
</style>
