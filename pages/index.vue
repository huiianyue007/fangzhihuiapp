<template>
  <tk-container class="main-box" :statusBar="statusBar" @scroll = 'scrollTop'>
    <div slot="header"></div>
    <div class="header">
      <tk-flex between class="top">
        <!--标题-->
        <h3 class="title">{{$t("index.location")}}</h3>
        <!--start 双语言切换-->
        <div class="language cursor" @click="langToggle">Language</div>
        <!--end 双语言切换-->
      </tk-flex>
      <!--搜索 start-->
      <div class="middle">
        <h1 class="title" :class = "locale"></h1>
        <div class="main-search text-hidden">
          <tk-link class="search" :to="path('/search/')">
            <tk-icon type="custom" class="icon">search</tk-icon>
            <span class="text">{{$t("index.searchMessage")}}</span>
          </tk-link>
        </div>
      </div>
      <!--搜索 end-->
      <tk-flex middle average class="bottom">
        <tk-link class="cursor item text-hidden" :to="path('/recommend/recommend')">
          <div class="icon-box">
            <tk-icon type="custom" class="icon">recommend</tk-icon>
          </div>
          <p class="text">{{$t("index.recommend")}}</p>
        </tk-link>
        <tk-link class="cursor item text-hidden" :to="path('/map/searchHouse')">
          <div class="icon2 icon-box">
            <tk-icon type="custom" class="icon">map</tk-icon>
          </div>
          <p class="text">{{$t("index.searchHouse")}}</p>
        </tk-link>
        <tk-link class="cursor item text-hidden" :to="path('/map/checkprice')">
          <div class="icon3 icon-box">
            <tk-icon type="custom" class="icon">price</tk-icon>
          </div>
          <p class="text">{{$t("index.checkprice")}}</p>
        </tk-link>
        <tk-link class="cursor item text-hidden" :to="path('/analyze/analyze')">
          <div class="icon4 icon-box">
            <tk-icon type="custom" class="icon">data</tk-icon>
          </div>
          <p class="text">{{$t("index.analyze")}}</p>
        </tk-link>
      </tk-flex>
    </div>
    <div class="indexhangqing">
      <tk-flex class="title">
        <div class="font fill">{{$t("index.chartsTitle")}}</div>
        <div class="right">
          <tk-flex middle average class="box">
            <span class="min-box"></span>
            <span class="text">{{$t("common.averageRrice")}}</span>
          </tk-flex>
          <div class="box">
            <span class="min-box1"></span>
            <span class="text">{{$t("common.sells")}}</span>
          </div>
        </div>
      </tk-flex>
      <div class="caption">({{$t('index.allHouse')}})</div>
      <!--start  echarts图表-->
      <div ref="indexhangqing" style="width: 100%;height: 260px"></div>
      <p class="move"><--- {{$t('index.moveCharts')}} ----></p>
      <!--end echarts图表-->
      <tk-loading type="moon" color="#28a3b3" size="40px" center :complete="echartsloading"></tk-loading>
    </div>
    <!--start 最新推荐-->
      <div class="recommend card-default">
      <h3 class="title">{{$t("index.LatestRecommended")}}</h3>
      <tk-loading :complete = 'complete' type="moon" color="#28a3b3" size="40px" center height = '210px'>
      <div v-swiper:mySwiper="swiperOption" v-if = "result1.list && result1.list.length">
        <div class="swiper-wrapper">
          <tk-link tag='div' class="swiper-slide" v-for="(item,index) in result1.list" :to='"/search/house/" + item.ml_num' :key='index' v-if = "result1">
            <tk-box ratio = '32:21' :style = "{backgroundImage: `url(${item.photo_url})`, backgroundSize: '100% 100%', width: '320px'}" class = 'photo'></tk-box>
            <div class="content">
              <tk-flex middle center class="img-title">
                <div class="text-hidden">{{$t("index.rentalYield")}}</div>:{{item.scores.rent}}/10
              </tk-flex>
              <tk-flex class = 'bottom' middle>
                <div class="fill left">
                  <tk-flex middle>
                    <span class="price">${{item.price}}</span>
                    <span class="houseType">{{item.house_type_name}}</span>
                  </tk-flex>
                  <p class="house">{{item.text.rooms_short}}</p>
                  <p class="nbsm text-hidden">{{item.municipality_name}}-{{item.community_name}}</p>
                </div>
                <div class="right">
                  <p class="time">
                    {{item.text.dom_short}}
                  </p>
                  <myStar :size='item.star' :maxSize='5' iconStyle='width:16px;height:16px;color:#FFC700;margin:0 2px'></myStar>
                </div>
              </tk-flex>
            </div>
          </tk-link>
        </div>
      </div>
      </tk-loading>
      </div>
    <div class="load-app" v-show="!this.setting">
      <tkui-button class="raised big block btn primary" @click.native = 'down'>{{$t("index.downloadApp")}}</tkui-button>
    </div>
    <div class = 'copy text-center copy_title'>U.S. Patent Pending # 62428661</div>
    <div class = 'copy text-center copy_desc'>Partnered With Nu Stream Realty Inc.</div>
    <!--end 最新推荐-->
    <my-footer slot="footer"></my-footer>
  </tk-container>
</template>

<script>
  import echarts from 'echarts'
  import { tkAjax } from 'vue-tk'
  import myStar from '~/components/star'
  import TkLink from '~/components/tkLink'
  import myFooter from '~/components/Footer'
  let chartIntance = null
  export default {
//    asyncData ({app}) {
//      if (app.active && app.active()) {
//        return app.active()
//      }
//    },
    data () {
      return {
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          spaceBetween: 15
        },
        complete: false,
        statusBar: {
          immersion: true,
          show: false
        },
        result: {},
        result1: {},
        echartsloading: false
      }
    },
    middleware: 'visits',
    components: {
      myStar,
      TkLink,
      myFooter
    },
    mounted () {
      let self = this
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: self.$store.state.homeShareTitle,
          link: window.location.href.split('#')[0],
          imgUrl: self.$store.state.homeShareImage
        })
        wx.onMenuShareAppMessage({
          title: self.$store.state.homeShareTitle, // 分享标题
          desc: self.$store.state.homeShareDesc, // 分享描述
          link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.$store.state.homeShareImage // 分享图标
        })
        wx.onMenuShareQQ({
          title: self.$store.state.homeShareTitle, // 分享标题
          desc: self.$store.state.homeShareDesc, // 分享描述
          link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.$store.state.homeShareImage // 分享图标
        })
        wx.onMenuShareQZone({
          title: self.$store.state.homeShareTitle, // 分享标题
          desc: self.$store.state.homeShareDesc, // 分享描述
          link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.$store.state.homeShareImage // 分享图标
        })
        wx.onMenuShareWeibo({
          title: self.$store.state.homeShareTitle, // 分享标题
          desc: self.$store.state.homeShareDesc, // 分享描述
          link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.$store.state.homeShareImage // 分享图标
        })
      })
      if (this.$store.state.init) {
        if (Object.keys(this.result).length === 0) {
          this.getEcharts()
        } else {
          this.drawPie('indexhangqing')
          this.echartsloading = true
        }
        if (Object.keys(this.result1).length === 0) {
          this.getRecommend()
        }
      } else {
        this.$store.watch(state => state.init, () => {
          this.getEcharts()
          this.getRecommend()
        })
      }
    },
    watch: {
      locale () {
        this.$nextTick(() => {
          if (chartIntance) {
            this.drawPie('indexhangqing')
            this.echartsloading = true
          }
        })
      },
      update (val) {
        if (val && !this.forceUpdate && this.setting && !this.$store.state.isIOS) {
          this.alert({message: this.$store.state.update_message, cancelText: '稍后更新', submitText: '更新'}).then(() => {
            this.downApp()
          }).catch(() => {
            this.$store.commit('SHOWUPDATA_ALERT')
          })
        }
      }
    },
    computed: {
      // echarts  横轴数据
      update () {
        if (this.$store.state.update && !this.forceUpdate && this.setting && !this.$store.state.isIOS) {
          this.alert({message: this.$store.state.update_message, cancelText: '稍后更新', submitText: '更新'}).then(() => {
            this.downApp()
          }).catch(() => {
            this.$store.commit('setUpdate', false)
            this.$store.commit('SHOWUPDATA_ALERT')
          })
        }
        return this.$store.state.update
      },
      forceUpdate () {
        if (this.$store.state.force_update && this.setting && !this.$store.state.isIOS) {
          this.alert({
            alert: false,
            message: this.$store.state.update_message,
            submitText: '更新'
          }).then(() => {
            this.downApp()
          })
        }
        return this.$store.state.force_update
      },
      dataAxis () {
        let list = this.result.chart
        return list.map(item => {
          let arr = item.period.split('-')
          return arr[1] + '-' + '\n' + arr[0]
        })
      },
//      纵轴数据 中间价
      trendDataMiddle () {
        return this.result.chart.map(item => {
          return item.price_sold
        })
      },
      trendDataDel () {
        let arr = []
        var item
        for (item of this.result.chart) {
          arr.push(item.sold_count)
        }
        return arr
      },
      url () {
        return this.$store.state.update_url
      }
    },
    methods: {
      down () {
        if (!this.url) {
          return false
        }
        window.location.href = this.url
      },
      downApp () {
        if (!this.url) {
          return false
        }
        plus.runtime.openURL(this.url, () => {
          this.toast('打开浏览器失败')
        })
      },
      langToggle () {
        this.tkPush('/mine/lang')
      },
      /* start 获取图标数据*/
      getEcharts () {
        tkAjax.post('/api/stats/homepage', {}).then(response => {
          this.result = response.data.data
          this.$nextTick(() => {
            this.drawPie('indexhangqing')
            this.echartsloading = true
          })
          if (window.innerWidth > 768 && chartIntance) {
            chartIntance.setOption({
              dataZoom: [
                {
                  startValue: this.result.chart.length - 10,
                  endValue: this.result.chart.length - 1
                }
              ]
            })
          }
        })
      },
      getRecommend () {
        tkAjax.post('/api/search/homepage/recommend', {}).then(({ data }) => {
          this.complete = true
          this.result1 = data.data
        }).catch(() => {
        })
      },
      /* end 获取图标数据*/
      price (opt) {
        if (typeof opt !== 'string') {
          opt = JSON.stringify(opt)
        }
        var ar = []
        for (let i = 0; opt.length > 0; i++) {
          if (opt.length >= 3) {
            ar[i] = opt.substring(opt.length - 3, opt.length)
            opt = opt.substring(0, opt.length - 3)
          } else {
            ar[i] = opt
            opt = ''
          }
        }
        return ar.reverse().join(',')
      },
      /*start 状态栏显示与隐藏*/
      scrollTop (top) {
        if (top > 0) {
          this.statusBar.show = true
        } else {
          this.statusBar.show = false
        }
      },
      /*end 状态栏显示与隐藏*/
      /*绘制echarts图表*/
      drawPie (id) {
        if (!this.$refs[id]) return false
        if (chartIntance) {
          echarts.dispose(this.$refs[id])
        }
        chartIntance = echarts.init(this.$refs[id])
        chartIntance.setOption({
          grid: {
            left: '55px',
            right: '15px',
            top: '10px',
            bottom: '50px'
          },
          xAxis: {
            data: this.dataAxis,
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#298998'
              },
              rotate: 45
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 8
          },
          animation: false,
          yAxis: [{
            show: true,
            axisLine: {show: false},
            splitLine: {
              interval: 1,
              lineStyle: {
                color: '#298998',
                type: 'dashed',
                opacity: 0.3
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 10,
              formatter (value, index) {
                if (index) {
                  return '$' + Math.ceil(value / 100000) + '00k'
                } else {
                  return '0'
                }
              },
              textStyle: {
                color: '#298998',
                fontStyle: 'italic',
                fontWeight: 'bolder'
              }
            }
          },
            {show: false, max: 35000}
          ],
          dataZoom: [
            {
              type: 'inside',
              startValue: this.result.chart.length - 7,
              endValue: this.result.chart.length - 1,
              minSpan: 100,
              zoomOnMouseWheel: 'ctrl',
              moveOnMouseMove: true,
              preventDefaultMouseMove: false
            }
          ],
          series: [
            {
              name: this.$t('common.averageRrice'),
              type: 'line',
              yAxisIndex: 0,
              smooth: true,
              symbolSize: 14,
              sampling: 'average',
              lineStyle: {
                normal: {
                  color: '#69c6d5'
                },
                emphasis: {
                  color: '#69c6d5'
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#E7F9F7',
                  borderWidth: 3,
                  color: '#69c6d5'
                },
                emphasis: {
                  borderWidth: 3,
                  borderColor: '#69c6d5'
                }
              },
              stack: 'a',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#69c6d5'
                  }, {
                    offset: 1,
                    color: '#fff'
                  }])
                }
              },
              data: this.trendDataMiddle,
              z: 6
            },
            {
              type: 'bar',
              name: this.$t('common.sells'),
              barWidth: '28px',
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#ff9d80'},
                      {offset: 0.6, color: '#FFD4C7'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#ff5b29'},
                      {offset: 0.6, color: '#FFD4C7'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              },
              data: this.trendDataDel,
              legendHoverLink: true,
              z: 9
            }
          ],
          tooltip: {
            triggerOn: 'click',
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            }
          }
        })
      }
    },
    fetch ({ store }) {
      return tkAjax.post('/api/init/app').then(({data}) => {
        store.commit('setMeta', data.data.meta)
      })
    },
    head () {
      if (this.$store.state.meta) {
        return {
          title: this.$t('index.home'),
          meta: [{
            property: 'og:type',
            content: 'website'
          }, {
            property: 'og:title',
            content: this.$store.state.meta.title
          }, {
            property: 'og:description',
            content: this.$store.state.meta.description
          }, {
            property: 'og:image',
            content: this.$store.state.meta.image
          }],
          script: [{
            src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
          }]
        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  body {
    -webkit-overflow-scrolling:touch;
  }
  .main-box {
    background-color: #f4f4f4;
    overflow: hidden;
    .header {
      padding: 32px 14px 14px;
      background: url("../assets/img/Background-map.png") no-repeat;
      background-size: 100% 275px;
      .top {
        .title {
          font-size: 16px;
          color: $white;
          font-weight: normal;
        }
        .language {
          padding: 0 5px;
          font-size: 16px;
          height: (50px/2);
          border: solid 1px $white;
          color: #fefefe;
          line-height: 25px;
        }
      }
      .middle {
        padding-top: 18px;
        .title {
          &.zh{
            background-image: url("../assets/img/first-wenzi.png");
          }
          &.en{
            background-image: url("../assets/img/wenzi1.png");
          }
          width: (552px/2);
          height: (74px/2);
          background-size: contain;
          background-position:center center;
          margin: 0 auto;
        }
        .main-search {
          width: 83%;
          margin: 0 auto;
          margin-top: 10px;
          background-color: $white;
          border-radius: 5px;
          /*text-align: center;*/
          padding: 10px;
          .search {
            display: inline-block;
            .text {
              font-size: 16px;
              color: #989696;
            }
            .icon {
              width: 17px;
              height: 17px;
              color: #b2b1b1;
              margin-top: -2px;
              margin-right: 5px;
            }
          }
        }
      }
      .bottom {
        margin-top: 42px;
        height: 126px;
        padding: 0 10px;
        border-radius: 6px;
        /*border:1px solid #000;*/
        background-color: $white;
        .item {
          flex: 1;
          padding-top: 24px;
          padding-bottom: 26px;
          .text {
            font-size: 16px;
            text-align: center;
            color: #666;
            padding-top: 10px;
          }
        }
        .icon-box {
          width: 48px;
          height: 48px;
          background-color: #28a3b3;
          border-radius: 50%;
          text-align: center;
          line-height: 44px;
          margin: 0 auto;
          .icon {
            width: 26px;
            height: 26px;
            color: #fff;
          }
        }
        .icon2 {
          background-color: #f0ac42;
        }
        .icon3 {
          background-color: #519eec;
          .icon {
            width: 28px;
            height: 28px;
          }
        }
        .icon4 {
          background-color: #3fc389;
        }
      }
    }
    .indexhangqing {
      width: 100%;
      position: relative;
      min-height: 300px;
      background-color: #fff;
      padding: 10px 0;
      .caption{
        padding: 5px 15px;
        font-size:16px;
      }
      .move{
        text-align: center;
        padding: 5px 15px;
        font-size: 14px;
        color: #666;
      }
      .title {
        align-items: baseline;
        overflow: hidden;
        width: 100%;
        .font {
          float: left;
          font-size: 20px;
          padding-left: 15px;
          color: #333;
          letter-spacing: 1px;
        }
        .right {
          float: right;
          margin-top: 4px;
          .box {
            display: inline-block;
            margin-right: 10px;
            .min-box {
              display: inline-block;
              width: 20px;
              height: 13px;
              background: $seafoam-blue;
              margin-right: 5px;
            }
            .min-box1 {
              display: inline-block;
              width: 20px;
              height: 13px;
              background: #ff9d80;
              margin-right: 5px;
            }
            .text {
              font-size: 14px;
              color: #666;
              margin-top: -4px;
              /*vertical-align: top;*/
            }
          }

        }
      }
    }
    .recommend {
      margin-top: 15px;
      background: #fff;
      padding-right: 0;
      padding-bottom: 15px;
      overflow: hidden;
      .title {
        font-size: 20px;
        color: $black;
        letter-spacing: 1px;
        font-weight: normal;
        padding-bottom: 15px;
      }
      .swiper-box{
        position: relative;
        width: auto;
        height: 210px;
      }
      .swiper-wrapper {
        width: auto;
        height: 210px;
        .swiper-slide {
          width: auto;
          height: 210px;
          position: relative;
          .content {
            position: absolute;
            top: 0px;
            width: 100%;
            left: 0;
            height: 100%;
            .img-title {
              width: 132px;
              height: 32px;
              margin-top: 16px;
              float: right;
              background: #28a3b3;
              color: $white;
              position: relative;
              line-height: 32px;
              &:before {
                content: '';
                position: absolute;
                top: 0;
                left: -15px;
                width: 0;
                height: 0;
                z-index: 9;
                border-bottom: 16px solid transparent;
                border-top: 16px solid transparent;
                border-left: 0 none;
                border-right: 15px solid #28a3b3;
              }
            }
            .bottom {
              position: absolute;
              bottom: 0;
              width: 100%;
              background: linear-gradient(180deg,transparent,rgba(0,0,0,.7),rgba(0,0,0,.8));
              padding-top: 20px;
              .left {
                float: left;
                padding-left: 12px;
                .price {
                  font-size: 20px;
                  font-weight: bold;
                  color: $white;
                  padding-right: 9px;
                }
                .houseType {
                  font-size: 16px;
                  color: $white;
                }
                .house {
                  font-size: 14px;
                  color: $white;
                }
                .nbsm {
                  width: 200px;
                  font-size: 14px;
                  color: #f0f0f0;
                  padding-bottom: 10px;
                }
              }
              .right {
                float: right;
                padding-right: 11px;
                .time {
                  font-size: 14px;
                  color: #ccc;
                  text-align: right;
                }
              }
            }
          }
        }
      }
    }
    .load-app {
      padding: 15px;
      .btn {
        margin: 0;
      }
    }
    .copy{
      font-size: 14px;
      &.copy_title{
        color:#333;
        margin-top: 15px;
      }
      &.copy_desc{
        margin:5px 0;
        color:#999;
      }
    }
  }
</style>
