<template>
  <tk-container class="container" :statusBar="statusBar">
    <div class="main-shadow" v-show = 'showCityList || showCommList' @click="shadowHidden"></div>
    <div class="main-top" slot="header">
      <tkui-header center>
        <tk-flex middle center>
          <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
          <span>{{$t("quotation.title")}}</span>
        </tk-flex>
        <tkui-button class="small marginhide" slot = 'right-menu' v-if = 'setting' @click.native = 'share'>
          <tk-icon type = 'custom'>share</tk-icon>
          {{$t('common.share')}}
        </tkui-button>
      </tkui-header>
      <div class="trand-box">
        <tk-flex class="trand-box-top" center middle>
          <!--城市按钮-->
          <tk-flex middle between class="left" :class="{buttonactive: showCommList}" @click.native.stop="showCityList = !showCityList;showCommList = false">
            <div class="city">{{filter_active.municipality_name}}</div>
            <tk-icon type="custom" class="icon">{{showCityList ? 'pull' : 'dropdown'}}</tk-icon>
            <!--城市下拉主内容区域-->
            <div class="show-city-box" v-show="showCityList">
              <!--城市区域列表-->
              <ul class="diqu">
                <li class="item" :class="{itemactive: index === filterAreaActive, itemSelect: index === filter_active.municipality_area_display_index}" v-for="(item,index) in result.municipality_filter" @click.stop="changeCityIndex(index)" >
                  {{item.title}}
                </li>
              </ul>
              <!--右侧对应区域包涵的城市-->
              <div class="anycity" @click.stop>
                <!--根据索引判断显示哪个区域的城市-->
                <ul v-for="(item,index) in result.municipality_filter" v-show="index === filterAreaActive">
                  <li :class="{itemactive: item2.id === filter_active.municipality_name, itemSelect: item2.id === filter_active.municipality_name}" v-for="(item2, key) in item.list" @click.stop="paramsCity(item2.id)" class="item">
                    {{item2.Name}}
                    <tk-icon type="custom" class="icon">mpx_choice</tk-icon>
                  </li>
                </ul>
              </div>
            </div>
          </tk-flex>
          <!--中间线，打开下拉时会发生改变-->
          <div class="middle-bar" :class="{midactive: showCityList || showCommList}"></div>
          <!--社区选择按钮-->
          <tk-flex middle between class="right" :class="{buttonactive: showCityList}" @click.native.stop="showCommunityBox">
            <div class="city">{{filter_active.community_name}}</div>
            <tk-icon type="custom" class="icon">{{showCommList ? 'pull' : 'dropdown'}}</tk-icon>
            <div class="show-community-box" v-show="showCommList">
              <ul>
                <li class="item" :class="{itemactive: index === filter_active.community_display_index}" v-for="(item,index) in result.community_filter" @click.stop="changeCommunity(item.id)">
                  {{item.name}}
                  <tk-icon type="custom" class="icon">mpx_choice</tk-icon>
                </li>
              </ul>
            </div>
          </tk-flex>
        </tk-flex>
        <tk-flex class="house-type">
          <button v-for="(item, index) in result.housetype_filter" @click.stop="changeHouseType(item.id)" :class="{active: item.id === filter_active.house_type}">
            {{item.name}}
          </button>
        </tk-flex>
      </div>
    </div>
    <tk-flex class="msg" middle center column v-show = 'result.chart.length === 0'>
      <tk-icon class="icon" type = 'custom'>noattention</tk-icon>
      <div class="nothing">{{$t('quotation.noData')}}</div>
    </tk-flex>
    <div class="main-bottom" v-show="result.chart.length">
      <div class="top">
        <h5 class="title">
          {{ filter_active.municipality_name }}
        </h5>
        <p class="title2">
          {{ filter_active.community_name }}
        </p>
        <tk-flex class="curr-box">
          <tk-flex middle center column class="item tk-grid-4">
            <div class="pingjun">{{result.current.period_name}}</div>
            <div class="MedianPrice">{{$t("quotation.MedianPrice")}}</div>
            <div class="price">
              ${{ result.current.price_sold}}
            </div>
          </tk-flex>
          <tk-flex middle center column stretch class="item tk-grid-4">
            <div class="pingjun">{{result.current.period_name}}</div>
            <div class="pingjun">{{$t("quotation.Median-Price")}}</div>
            <div class="change">
              <tk-flex column center>
                <tk-flex middle between class="up tk-grid-10" :class="{down: result.current.price_sold_change_year < 0}">
                  <tk-flex middle>
                    {{$t('quotation.year')}}<span class="sanjiao" v-if="result.current.price_sold_change_year > 0"></span><span class="daosanjiao" v-else></span>
                  </tk-flex>
                  <div>
                    {{result.current.price_sold_change_year}}%
                  </div>
                </tk-flex>
                <tk-flex middle between class="up tk-grid-10" :class="{down: result.current.price_sold_change_month < 0}">
                  <tk-flex middle>
                    {{$t('quotation.month')}}<span class="sanjiao" v-if="result.current.price_sold_change_month > 0"></span><span class="daosanjiao" v-else></span>
                  </tk-flex>
                  <div>
                    {{result.current.price_sold_change_month}}%
                  </div>
                </tk-flex>
              </tk-flex>
            </div>
          </tk-flex>
          <tk-flex column middle center class="item tk-grid-4">
            <div class="pingjun">{{result.current.period_name}}</div>
            <div class="MedianPrice">{{$t("quotation.NewListing")}}</div>
            <div class="price">{{result.current.list_new}}</div>
          </tk-flex>
        </tk-flex>
        <tk-flex right class="echartstitle" gutter="15">
          <tk-flex middle>
            <span class="box bg1"></span>
            <span class="font">{{$t("common.sells")}}</span>
          </tk-flex>
          <tk-flex middle>
            <span class="box bg2"></span>
            <span class="font">{{$t("common.new-listing")}}</span>
          </tk-flex>
        </tk-flex>
      </div>
      <div id="echarts1" ref="chart1" style="width: 100%;height: 282px"></div>
      <p class="move"><--- {{$t('index.moveCharts')}} ----></p>
      <div class="main-line"></div>
      <tk-flex right class="echartstitle" gutter="15">
        <tk-flex middle>
          <span class="box bg2"></span>
          <span class="font">{{$t("quotation.MedianPrice")}}</span>
        </tk-flex>
        <tk-flex middle>
          <span class="box bg1"></span>
          <span class="font">{{$t("common.average-dom")}}</span>
        </tk-flex>
      </tk-flex>
      <div id="echarts2" ref="chart2" style="width: 100%;height: 280px"></div>
      <p class="move"><--- {{$t('index.moveCharts')}} ----></p>
    </div>
    <my-footer slot="footer"></my-footer>
    <loadding ref = 'loadding'></loadding>
  </tk-container>
</template>
<script>
  import {tkAjax} from 'vue-tk'
  import echarts from 'echarts'
  import loadding from '~/components/loading'
  import myFooter from '~/components/Footer'
  import util from 'assets/js/util'
  let OneChart = null
  let TwoChart = null
  const defaultQuery = {
    municipality: 'Toronto',
    community: 'all',
    'house_type': 'all'
  }
  export default {
    async asyncData ({query, error, app}) {
      if (app.active && app.active()) {
        return app.active()
      } else {
        let data = Object.assign({}, defaultQuery)
        if (query) {
          data = Object.assign(data, query)
        }
        let results = await tkAjax.request({
          url: '/api/stats/trend',
          method: 'post',
          data: data
        }).catch(e => {
          error({statusCode: 408, message: '请求超时'})
        })
        return {
          result: results.data.data
        }
      }
    },
    data () {
      return {
//        城市改变时的状态参数
        city_change: false,
        showCityList: false,
        showCommList: false,
//        第一个图表对象
        show: false,
        statusBar: {
          show: true
        },
        activeArea: null,
        shares: []
      }
    },
    watch: {
      result () {
        this.$nextTick(() => {
          this.init()
        })
      },
      show (val) {
        this.$nextTick(() => {
          if (val) {
            this.$refs.loadding.$emit('show')
          } else {
            this.$refs.loadding.$emit('hidden')
          }
        })
      }
    },
    components: {
      loadding,
      myFooter
    },
    computed: {
      filterAreaActive () {
        return this.activeArea === null ? this.filter_active.municipality_area_display_index : this.activeArea
      },
      filter_active () {
        return this.result.filter_active
      },
      'xeachrslength': function () {
        return this.result.chart.length - 1
      },
      // echarts  横轴数据
      dataAxis () {
        let list = this.result.chart
        return list.map(item => {
          let arr = item.period.split('-')
          return arr[1] + '-' + '\n' + arr[0]
        })
      },
//      挂牌量
      trendDataList () {
        let arr = []
        var item
        for (item of this.result.chart) {
          arr.push(item.list_count)
        }
        return arr
      },
//      成交量
      trendDataDel () {
        let arr = []
        var item
        for (item of this.result.chart) {
          arr.push(item.sold_count)
        }
        return arr
      },
//      成交价
      trendPrice () {
        let arr = []
        var item
        for (item of this.result.chart) {
          arr.push(item.price_sold)
        }
        return arr
      },
//      平均挂牌天数
      trendDays () {
        let arr = []
        var item
        for (item of this.result.chart) {
          arr.push(item.list_days)
        }
        return arr
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init () {
        this.drawPie1()
        this.drawPie2()
        util.plusReady(() => {
          plus.share.getServices((s) => {
            for (let i in s) {
              let t = s[i]
              this.shares[t.id] = t
            }
          })
        })
        let self = this
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: self.result.meta.title,
            link: window.location.href.split('#')[0],
            imgUrl: self.result.meta.image
          })
          wx.onMenuShareAppMessage({
            title: self.result.meta.title, // 分享标题
            desc: self.result.meta.description, // 分享描述
            link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: self.result.meta.image // 分享图标
          })
          wx.onMenuShareQQ({
            title: self.result.meta.title, // 分享标题
            desc: self.result.meta.description, // 分享描述
            link: window.location.href.split('#')[0], // 分享链接
            imgUrl: self.result.meta.image // 分享图标
          })
          wx.onMenuShareQZone({
            title: self.result.meta.title, // 分享标题
            desc: self.result.meta.description, // 分享描述
            link: window.location.href.split('#')[0], // 分享链接
            imgUrl: self.result.meta.image// 分享图标
          })
          wx.onMenuShareWeibo({
            title: self.result.meta.title, // 分享标题
            desc: self.result.meta.description, // 分享描述
            link: window.location.href.split('#')[0], // 分享链接
            imgUrl: self.result.meta.image // 分享图标
          })
        })
        if (window.innerWidth > 768) {
          OneChart.setOption({
            dataZoom: [
              {
                type: 'inside',
                startValue: this.xeachrslength - 9,
                endValue: this.xeachrslength
              }
            ]
          })
          TwoChart.setOption({
            dataZoom: [
              {
                type: 'inside',
                startValue: this.xeachrslength - 9,
                endValue: this.xeachrslength
              }
            ]
          })
        }
      },
      shareSystemNativeJS () {
        console.log('分享成功')
      },
      shareSystem () {
        let self = this
        let msg = {content: self.result.meta.title + '(' + window.location.href.split('#')[0] + ')'}
        plus.share.sendWithSystem ? plus.share.sendWithSystem(msg, function () {
          console.log('Success')
        }, function (e) {
          console.log('Failed: ' + JSON.stringify(e))
        }) : this.shareSystemNativeJS()
      },
      shareOne (shareTip, shareText) {
        let Context = plus.android.importClass('android.content.Intent')
        let Main = plus.android.runtimeMainActivity()
        let shareIntent = new Context(Context.ACTION_SEND)
        shareIntent.setType('text/plain')
        shareIntent.putExtra(Context.EXTRA_TEXT, shareText)
        Main.startActivity(Context.createChooser(shareIntent, shareTip))
      },
      changeCityIndex (num) {
        this.activeArea = num
      },
      paramsCity (mainCity) {
        this.showCityList = false
        this.mainGetJson(mainCity, 'all', this.filter_active.house_type, 1)
      },
      changeCommunity (id) {
        this.showCommList = false
        this.mainGetJson(this.filter_active.municipality_name, id, this.filter_active.house_type)
      },
//      根据城市请求是否显示社区菜单选项
      showCommunityBox () {
//        if (!this.city_change) {
        this.showCommList = !this.showCommList
        this.showCityList = false
//        }
      },
      changeHouseType (value) {
        this.mainGetJson(this.filter_active.municipality_name, this.filter_active.community, value)
      },
      mainGetJson (city, cmt, type) {
        let query = {
          municipality: city,
          community: cmt,
          'house_type': type
        }
        this.tkReplace({path: '../home/quotation', query: query})
      },
      shadowHidden () {
        this.activeArea = null
        this.showCityList = false
        this.showCommList = false
      },
      //分享的社交平台
      share () {
        let self = this
        if (this.setting) {
          if (plus.os.name === 'Android') {
            let bool = plus.runtime.isApplicationExist({pname: 'com.tencent.mm'})
            if (bool) {
              let shareBts = []
              // 更新分享列表
              let ss = this.shares['weixin']
              ss && ss.nativeClient && (shareBts.push({title: '微信朋友圈', s: ss, x: 'WXSceneTimeline'}),
                shareBts.push({title: '微信好友', s: ss, x: 'WXSceneSession'}))
              // 弹出分享列表
              shareBts.length > 0 ? plus.nativeUI.actionSheet({title: '分享链接', cancel: '取消', buttons: shareBts}, (e) => {
                (e.index > 0) && this.shareAction(shareBts[e.index - 1], true)
              }) : plus.nativeUI.alert('当前环境无法支持分享链接操作!')
            } else {
              this.shareOne('', self.result.meta.title + '(' + window.location.href.split('#')[0] + ')')
            }
          } else {
            let boolIOS = plus.runtime.isApplicationExist({action: 'weixin://RnUbAwvEilb1rU9g9yBU'})
            if (boolIOS) {
              let shareBts = []
              // 更新分享列表
              let ss = this.shares['weixin']
              ss && ss.nativeClient && (shareBts.push({title: '微信朋友圈', s: ss, x: 'WXSceneTimeline'}),
                shareBts.push({title: '微信好友', s: ss, x: 'WXSceneSession'}))
              // 弹出分享列表
              shareBts.length > 0 ? plus.nativeUI.actionSheet({title: '分享链接', cancel: '取消', buttons: shareBts}, (e) => {
                (e.index > 0) && this.shareAction(shareBts[e.index - 1], true)
              }) : plus.nativeUI.alert('当前环境无法支持分享链接操作!')
            } else {
              this.shareSystem()
            }
          }
        }
      },
      //设置分享的参数
      shareAction (sb, bh) {
        let msg = {content: '123', extra: {scene: sb.x}}
        if (bh) {
          msg.href = window.location.href.split('#')[0]
          msg.title = this.result.meta.title
          msg.content = this.result.meta.description
          msg.thumbs = [this.result.meta.image]
        }
        // 发送分享
        if (sb.s.authenticated) {
          this.shareMessage(msg, sb.s)
        } else {
          sb.s.authorize(() => {
            this.shareMessage(msg, sb.s)
          }, (e) => {})
        }
      },
      //发送分享
      shareMessage (msg, s) {
        s.send(msg, () => {
          this.toast('分享成功')
        }, (e) => {
        })
      },
      drawPie1 () {
        echarts.dispose(this.$refs.chart1)
        OneChart = echarts.init(this.$refs.chart1)
        OneChart.setOption({
          grid: {
            left: '55px',
            right: '15px'
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
          yAxis: [
            {
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
                textStyle: {
                  color: '#298998',
                  fontWeight: 'bolder'
                }
              }
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              startValue: this.xeachrslength - 5,
              endValue: this.xeachrslength,
              minSpan: 100,
              zoomOnMouseWheel: 'ctrl',
              moveOnMouseMove: true,
              preventDefaultMouseMove: false
            }
          ],
          series: [
            {
              type: 'bar',
              name: this.$t('common.sells'),
              barWidth: '18px',
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
              z: 9
            },
            {
              name: this.$t('common.new-listing'),
              type: 'bar',
              smooth: true,
              barWidth: '18px',
              barGap: '0',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#69c6d5'},
                      {offset: 0.6, color: '#9FDBE5'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#298998'},
                      {offset: 0.6, color: '#9FDBE5'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              },
              data: this.trendDataList,
              z: 6
            }
          ],
          tooltip: {
            trigger: 'axis',
            triggerOn: 'click',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            }
          }
        })
      },
      drawPie2 () {
        echarts.dispose(this.$refs.chart2)
        TwoChart = echarts.init(this.$refs.chart2)
        TwoChart.setOption({
          grid: {
            left: '55px',
            right: '15px',
            top: '30px'
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
                fontWeight: 'bolder'
              }
            }
          }, {show: false, max: 50}
          ],
          dataZoom: [
            {
              type: 'inside',
              startValue: this.xeachrslength - 5,
              endValue: this.xeachrslength,
              minSpan: 100,
              zoomOnMouseWheel: 'ctrl',
              moveOnMouseMove: true,
              preventDefaultMouseMove: false
            }
          ],
          series: [
            {
              name: this.$t('quotation.MedianPrice'),
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
              data: this.trendPrice,
              z: 6
            },
            {
              type: 'bar',
              name: this.$t('quotation.dom'),
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
              data: this.trendDays,
              z: 9
            }
          ],
          tooltip: {
            trigger: 'axis',
            triggerOn: 'click',
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
    head () {
      return {
        title: this.$t('quotation.title'),
        meta: [{
          property: 'og:type',
          content: 'website'
        }, {
          property: 'og:title',
          content: this.result.meta.title
        }, {
          property: 'og:description',
          content: this.result.meta.description
        }, {
          property: 'og:image',
          content: this.result.meta.image
        }],
        script: [{
          src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
        }]
      }
    }
  }
</script>
<style lang = "scss" scoped>
  @import 'assets/scss/_variables.scss';
  .container {
    background: $white;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    .msg{
      .icon{
        width:101px;
        height:111px;
        display:block;
        margin-top:135px;
      }
      .nothing{
        margin-top:20px;
        font-size: 16px;
        font-weight: 500;
        color: #999999;
      }
    }
    .main-shadow{
      position:fixed;
      top:0;
      left:0;
      height:100%;
      width: 100%;
      background:rgba(0, 0, 0, .5);
      z-index: 104;
    }
    .main-top {
      flex: 0 0 132px;
      background: $white;
      position: relative;
      z-index: 109;
      .header {
        .button{
          padding: 0 15px;
          line-height: 44px;
          text-align:center;
        }
      }
      .trand-box {
        .trand-box-top {
          position: relative;
          .middle-bar {
            display: inline-block;
            flex: 0 0 1px;
            height: 21px;
            background: #ebebeb;
            transition: all 0.5s;
          }
          .midactive {
            height: 44px;
          }
          .left , .right{
            height: 44px;
            line-height: 44px;
            float: left;
            width: 50%;
            border-bottom: 1px solid $white;
            cursor: pointer;
            .city {
              font-size: $font-size;
              color: $black;
              padding-left: 13%;
              flex: 1;
              max-height: 44px;
              text-overflow:ellipsis;
              white-space: nowrap;
              overflow: hidden;
              padding-right: 15px;
            }
            .icon {
              width: 14px;
              height: 14px;
              color: #a9acbd;
              margin-right: 12%;
            }
            .show-city-box {
              overflow: hidden;
            }
            .show-community-box {
              ul {
                height: 220px;
                overflow-y: scroll;
              }
              ul::-webkit-scrollbar {
                display: block;
                width: 4px;
                background-color: #F5F5F5;
              }
              ul::-webkit-scrollbar-thumb{
                border-radius: 2px; /* 滚动条滑块圆角 */
                /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); !* 滚动条滑块阴影 *!*/
                background-color: #999; /* 滚动条滑块颜色 */
              }
            }
            .show-city-box ,.show-community-box{
              background: $white;
              position: absolute;
              width: 100%;
              top:44px;
              left: 0;
              .diqu {
                float: left;
                width: 50%;
                height: 220px;
                background: $white;
              }
              .anycity {
                float: right;
                width: 50%;
                background: #f5f5f5;
                height: 220px;
                overflow-y: scroll;
                .item {
                  border: 0;
                }
              }
              .item {
                font-size: 14px;
                color: $black;
                padding-left: 9%;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #ebebeb;
                text-overflow:ellipsis;
                white-space: nowrap;
                overflow: hidden;
                .icon {
                  display: none;
                }
              }
              .itemactive {
                background: #f5f5f5;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .icon {
                  display: block;
                  color: #28a3b3;
                }
              }
              .itemSelect {
                color: #28a3b3;
                .icon {
                  display: block;
                  color: #28a3b3;
                }
              }
            }
          }
          /*选择列表出现的时候左右按钮的底部边框*/
          .buttonactive {
            border-bottom: 1px solid #ebebeb;
          }
          .right {
            float: right;
          }
          &:after {
            content: '';
            display: block;
            clear: both;
            zoom: 1;
          }
        }
        .house-type::-webkit-scrollbar {
          display:none
        }
        .house-type {
          background: #f5f5f5;
          overflow: auto;
          button {
            height: 44px;
            font-size: 14px;
            color: #a9acbd;
            letter-spacing: 0.7px;
            border-bottom: 2px solid #f5f5f5;
            padding: 0 15px;
            white-space: nowrap;
            /*overflow: hidden;*/
          }
          .active {
            color: $black;
            font-size: $font-size;
            border-bottom: 2px solid #298998;
          }
        }
      }
    }
    .main-bottom {
      flex: 1;
      .echartstitle {
        overflow: hidden;
        padding-top: 22px;
        padding-right: 15px;
        .box {
          display: inline-block;
          width: 20px;
          height: 13px;
          margin-right: 5px;
        }
        .bg1 {
          background: #ff9d80;
        }
        .bg2 {
          background: #69c6d5;
        }
        .font {
          font-size: $AuxiliaryfontSize;
          color: #666;
          white-space: nowrap;
        }
      }
      .move{
        text-align: center;
        padding: 0px 0px 15px;
        font-size: 14px;
        color: #666;
      }
      .top {
        .title {
          text-align: center;
          font-size: $title-font-size;
          font-weight: normal;
          padding-top: 25px;
          letter-spacing: 1px;
        }
        .title2 {
          padding-top: 4px;
          color: #666;
          font-size: $font-size;
          text-align: center;
          letter-spacing: 0.8px;
        }
        .curr-box {
          padding-top: 28px;
          .item {
            ~ .item {
              border-left: 1px solid #ebebeb;
            }
            .pingjun {
              text-align: center;
              color: #666;
              font-size: $AuxiliaryfontSize;
            }
            .MedianPrice{
              text-align: center;
              color: #666;
              font-size: $AuxiliaryfontSize;
            }
            .change {
              padding-top: 8px;
              font-size: 18px;
              .up {
                color: #298998;
              }
              .down {
                color: #ff5b29;
              }
              .sanjiao {
                display: inline-block;
                width: 0;
                height: 0;
                border-bottom: 8px solid #28a3b3;
                border-top: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                max-height: 8px;
                margin-right: 4px;
              }
              .daosanjiao {
                display: inline-block;
                width: 0;
                height: 0;
                border-bottom: 0;
                border-top: 8px solid #ff5b29;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                max-height: 8px;
                margin-right: 4px;
              }
            }
            .price {
              font-size: $title-font-size;
              font-weight: bold;
              padding-top: 5px;
            }
          }
        }
      }
    }
    .main-line {
      padding: 0 15px;
      &:before {
        content: '';
        display: block;
        height: 1px;
        background-color: #e0e0e0;
      }
    }
  }
  @media (min-width: 768px) {
    .container {
      height: 100%;
    }
  }
</style>