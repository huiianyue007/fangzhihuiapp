<template>
  <tk-container class="main-box1" id="main-box1-height" :statusBar="statusBar" ref = 'box'>
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button slot="left-menu" class="small icon" @click.native="back">
        <tk-icon>return</tk-icon>
      </tkui-button>
      <tk-flex center middle>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t('houseDetail.title')}}</span>
      </tk-flex>
      <tkui-button class="small border marginhide" slot = 'right-menu' @click.native = 'langToggle'>Language</tkui-button>
    </tkui-header>
    <div class="item-main" :class="{'filter-cover': coverBool}">
      <div class="main-img">
        <img :src="result.house.photo_url" alt="" width="100%" style="height: 37vh">
        <div class="all cursor" @click="showImg">
          {{$t('houseDetail.All')}}
        </div>
        </div>
      <div class="house-information container-padding">
        <!--标题-->
        <div class="title">
          {{result.house.address}}
        </div>
        <!--城市名称-->
        <tk-flex middle between class="city">
          <span>{{result.house.community_name}}-{{result.house.municipality_name}}</span>
          <span class="houseType">{{result.house.house_type_name}}</span>
        </tk-flex>
        <div class="money">
          <tk-flex between class="price">
            <tk-flex middle>
              <span :class="result.house.list_status.sold ? 'lineThough' : ''">${{result.house.price}}</span>
              <span class="tag" v-if="result.house.price_tag">[{{result.house.price_tag}}]</span>
            </tk-flex>
            <span class="time">{{result.house.text.dom_short}}</span>
          </tk-flex>
          <!--查询售价按钮-->
          <div class="search-price" v-if="result.house.list_status.sold">
            <button class="btn" @click="queryPrice(result.house.ml_num)">{{$t('houseDetail.Check')}}</button>
          </div>
          <!--房智汇估-->
          <tk-flex middle class="valuation" v-if="result.house.list_status.live === 1 && result.analytics.estimate_price">
            <span style="padding-right: 10px;font-size: 18px">{{$t('houseDetail.estimated')}}: ${{result.analytics.estimate_price}}</span>
            <span class="sanjiao1" v-if="!highToggle && result.analytics.estimate_price"></span>
            <span class="sanjiao2" v-else></span>
            <span style="font-size: 18px" v-if="result.analytics.estimate_price">{{result.analytics.price_diff}}%</span>
          </tk-flex>
        </div>
        <!--卧室,卫生间,车库-->
        <tk-flex average middle center class="statistics">
          <div class="item">
            <tk-icon type="custom" class="icon">bedroom</tk-icon>
            <p>{{result.house.bedroom_string}} {{result.house.bedroom === 1 || locale === 'zh' || result.house.bedroom === 0 ? $t("common.bd") : $t("common.bds")}}</p>
          </div>
          <div class="item">
            <tk-icon type="custom" class="icon">bathroom</tk-icon>
            <p>{{result.house.washroom}} {{result.house.washroom === 1 || locale === 'zh' || result.house.washroom === 0 ? $t("common.ba") : $t("common.bas")}}</p>
          </div>
          <div class="item">
            <tk-icon type="custom" class="icon">garage</tk-icon>
            <p>{{result.house.parking.total}} {{result.house.parking.total === 1 || locale === 'zh' || result.house.parking.total === 0 ? $t("common.gr") : $t("common.grs")}}</p>
          </div>
        </tk-flex>
        <!--附近-->
        <tk-flex middle center between class="near">
          <!--附近成交-->
          <tkui-button class="raised primary marginhide nearBtn" @click.native="nearselled(result.house.ml_num)">
            <tk-icon type="custom" class="small">deal</tk-icon> {{$t('houseDetail.Nearby')}}
          </tkui-button>
          <!--附近出租-->
          <tkui-button class="raised primary marginhide nearBtn" @click.native="nearrent(result.house.ml_num)">
            <tk-icon type="custom" class="small">home</tk-icon> {{$t('houseDetail.nearbyRent')}}
          </tkui-button>
          <!--升值分析-->
          <tkui-button class="raised primary marginhide nearBtn" @click.native="gotoshengzhi">
            <tk-icon type="custom" class="icon">appreciation</tk-icon> {{$t('houseDetail.Growth')}}
          </tkui-button>
        </tk-flex>
      </div>
      <!--地图组件-->
      <tk-marker class = 'glmap' :center = '{lat: result.house.map.lat * 1, lng: result.house.map.lon * 1}' :content = 'result.house.address' disableClick @click.native = 'mapShow = true'></tk-marker>
      <!--关键数据-->
      <mytoggle :title="$t('houseDetail.Key')" :show="toggle">
        <div class="mytogglebox">
          <ul>
            <li class="item">
              <span class="left">{{$t('houseDetail.Tax')}}:</span>
              <span class="right" v-if="result.house.tax">${{result.house.tax}}/{{$t('houseDetail.year')}}</span>
              <span class="right" v-else="">业主未提供</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.Type')}}:</span>
              <span class="right">{{result.house.house_type_name}}</span>
            </li>
            <li class="item" v-show="result.house.maintenance">
              <span class="left">{{$t('houseDetail.maintenance')}}:</span>
              <span class="right">{{result.house.maintenance}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.Style')}}:</span>
              <span class="right">{{result.house.house_style}}</span>
            </li>
            <li class="item" v-show="result.house.build_year">
              <span class="left">{{$t('houseDetail.age')}}:</span>
              <span class="right">{{result.house.build_year}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.Size')}}:</span>
              <span class="right">{{result.house.house_area.area}} {{result.house.house_area.unit}} {{result.house.house_area.area_note}}</span>
            </li>
            <li class="item"  v-if="result.house.land">
              <span class="left">{{$t('houseDetail.Lot')}}:</span>
              <span class="right">{{result.house.land.front}} x {{result.house.land.depth}} {{result.house.land.unit}}</span>
            </li>
            <li class="item" v-show="result.house.parking">
              <span class="left">{{$t('houseDetail.parking')}}:</span>
              <span class="right">{{result.house.parking.text}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.MLS')}}:</span>
              <span class="right">{{result.house.ml_num}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.Updated')}}:</span>
              <span class="right">{{result.house.date_update}}</span>
            </li>
          </ul>
        </div>
      </mytoggle>
      <!--大数据评估结果-->
      <mytoggle :title="$t('houseDetail.Sigma')" :show="toggle">
        <div class="mytogglebox">
          <ul>
            <li class="item">
              <span class="left">{{this.$t('houseDetail.intelligent')}}:</span>
              <span class="right" v-if="result.analytics.estimate_price">${{result.analytics.estimate_price}}</span>
              <span class="right" v-else="">{{$t('houseDetail.data')}}</span>
            </li>
            <li class="item">
              <span class="left">{{this.$t('houseDetail.price')}}:</span>
              <span class="right" v-if="result.analytics.estimate_price_range">{{result.analytics.estimate_price_range}}</span>
              <span class="right" v-else="">{{$t('houseDetail.data')}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.EstimatedRent')}}:</span>
              <span class="right" v-if="result.analytics.estimate_rent">${{result.analytics.estimate_rent}}</span>
              <span class="right" v-else="">{{$t('houseDetail.data')}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.EstimatedRentalDOM')}}:</span>
              <span class="right" v-if="result.analytics.estimate_rent_days">{{result.analytics.estimate_rent_days}}</span>
              <span class="right" v-else="">{{$t('houseDetail.data')}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.RentalYield')}}:</span>
              <span class="right" v-if="result.analytics.estimate_rent_yearreturn">${{result.analytics.estimate_rent_yearreturn}}%</span>
              <span class="right" v-else="">{{$t('houseDetail.data')}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.SchoolScore')}}:</span>
              <span class="right">{{$t('houseDetail.highSchool')}} {{result.analytics.school.highschool_score}}/10, {{$t('houseDetail.primary')}} {{result.analytics.school.belowhighschool_score}}/10</span>
            </li>
          </ul>
        </div>
        <!--星星部分-->
        <div class="starliming">
          <ul>
            <li class="item">
              <span class="left">{{$t('common.School')}}:</span>
              <div class="xingji">
                <star :size = 'result.analytics.stars.school' iconStyle = 'width:16px;height:16px;color:#3e8b97;margin:0 2px;' :maxSize = '5'></star>
              </div>
            </li>
            <li class="item">
              <span class="left">{{$t('common.Growth')}}:</span>
              <div class="xingji">
                <star :size = 'result.analytics.stars.growth' iconStyle = 'width:16px;height:16px;color:#3e8b97;margin:0 2px;' :maxSize = '5'></star>
              </div>
            </li>
            <li class="item">
              <span class="left">{{$t('common.Rental')}}:</span>
              <div class="xingji">
                <star :size = 'result.analytics.stars.rent' iconStyle = 'width:16px;height:16px;color:#3e8b97;margin:0 2px;' :maxSize = '5'></star>
              </div>
            </li>
            <li class="item" v-if="result.analytics.stars.land">
              <span class="left">{{$t('common.Land')}}:</span>
              <div class="xingji">
                <star :size = 'result.analytics.stars.land' iconStyle = 'width:16px;height:16px;color:#3e8b97;margin:0 2px;' :maxSize = '5'></star>
              </div>
            </li>
          </ul>
        </div>
      </mytoggle>
      <!--社区评估结果-->
      <mytoggle :title="$t('houseDetail.CommunityStatistics')" ref ="firstanchor" :show="toggle" v-if = 'result'>
        <div class="mytogglebox">
          <ul>
            <li class="item">
              <span class="left">{{$t('name.Community')}}:</span>
              <span class="right">{{result.community.community_name}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('name.City')}}:</span>
              <span class="right">{{result.community.municipality_name}}</span>
            </li>
            <li class="item" v-if="result.community.growth_year">
              <span class="left">{{$t('houseDetail.AnnualGrowth')}}:</span>
              <span class="right">{{result.house.house_type_name}} {{result.community.growth_year}}%</span>
            </li>
            <li class="item" v-if="result.community.rent_ratio">
              <span class="left">{{$t('houseDetail.RentalInvestmentRatio')}}:</span>
              <span class="right">{{result.community.rent_ratio}}%</span>
            </li>
          </ul>
        </div>
        <!--图表-->
        <div id="houseecharts" style="width: 100%;height: 278px"></div>
      </mytoggle>
      <!--房屋详细信息-->
      <mytoggle :title="$t('houseDetail.details')" :show='toggle'>
        <div class="mytogglebox" style="padding-bottom: 0">
          <ul>
            <li class="item">
              <span class="left">{{$t('houseDetail.address')}}:</span>
              <span class="right">{{result.house.address}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.Intersection')}}:</span>
              <span class="right">{{result.house.cross_street}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.Sit')}}:</span>
              <span class="right">{{result.house.front_direction}}</span>
            </li>
            <li class="item" v-if="result.house.parking.garage_type">
              <span class="left">{{$t('houseDetail.GarageType')}}:</span>
              <span class="right">{{result.house.parking.garage_type}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.ACsystem')}}:</span>
              <span class="right">{{result.house.fuel}}</span>
            </li>
            <li class="item">
              <span class="left">{{$t('houseDetail.SwimmingPool')}}:</span>
              <span class="right">{{result.house.pool}}</span>
            </li>
            <li class="item">
              <p style="color:#333; font-size: 16px; font-weight: 600;padding-bottom: 10px;">{{$t('houseDetail.description')}}:</p>
              <p style="font-size: 16px;">{{result.house.description1}}
                <span @click="showmorefont = !showmorefont" v-if="!showmorefont" style="text-align: center;font-size: 14px;color: #28a3b3;cursor: pointer;">
                  ...{{$t('houseDetail.expand')}}
                </span>
                <br/><br/> <span v-if="showmorefont">{{result.house.description2}}
                  <span @click="showmorefont = !showmorefont" v-if="showmorefont" style="text-align: center;font-size: 14px;color: #28a3b3;cursor: pointer;">
                    {{$t('houseDetail.collapse')}}
                  </span>
                </span>
              </p>
            </li>
          </ul>
        </div>
      </mytoggle>
      <div class="house-bottom">
        <tk-flex column class="word">
          <span class="left">
            Listing brokerage:
          </span>
          <span class="right">
            {{result.house.brokerage}}
          </span>
        </tk-flex>
        <h5 class="title">{{$t('houseDetail.Howtobid')}}</h5>
        <span class="title2">{{$t('houseDetail.assistToYou')}}</span>
        <div class="box">
          <div class="left">
            <h5 class="title">{{$t('houseDetail.noGuess')}}</h5>
            <span class="title2">{{$t('houseDetail.dataCentric')}}</span>
          </div>
          <div class="right">
            <tk-icon type="custom" class="icon">mine</tk-icon>
          </div>
        </div>
        <div class="box">
          <div class="left">
            <h5 class="title">{{$t('houseDetail.personalized')}}</h5>
            <span class="title2">{{$t('houseDetail.experts')}}</span>
          </div>
          <div class="right">
            <tk-icon type="custom" class="icon">accurate</tk-icon>
          </div>
        </div>
      </div>
    </div>
    <!--全部图片的swiper-->
    <tk-marker class = 'glmap' :center = '{lat: result.house.map.lat * 1, lng: result.house.map.lon * 1}' :content = 'result.house.address' disableClick @resize = 'resize' :mapInit = 'true' v-if = 'mapShow' slot = 'cover'></tk-marker>
    <tk-cover class="photo-list" :show="cover.show" :transition="cover.transition" middle center @change="hideImg" color='rgba(0,0,0,0.9)' slot = 'cover'>
      <div v-swiper:mySwiper="swiperOption" @click.stop>
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in result.house.photo_list">
            <img :src='item' alt="" width="100%" style="height: 37vh;">
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
      </div>
    </tk-cover>
    <div class="item-bottom" slot="footer">
      <tk-flex stretch middle class="item-bottom1">
        <!--关注按钮-->
        <tkui-button style="font-size: 16px;" class="small marginhide tk-grid-3 fill btn" :class = '{"primary": followBool}' @click.native="gologin">
          <tk-icon type="custom" class="big icon">{{followBool ? 'attention_selecte' : 'attention1'}}</tk-icon>
          {{followBool ? $t('common.followed') : $t('common.follow')}}
        </tkui-button>
        <!--分享按钮-->
        <tkui-button style="font-size: 16px;" class="small marginhide tk-grid-3 fill btn share" @click.native = 'share' v-if = '$store.getters.getSetting'>
          <tk-icon type="custom" class="big icon">share</tk-icon>
          {{$t('common.share')}}
        </tkui-button>
        <tkui-button class="raised primary marginhide tk-grid-6 fill btn1" @click.native.stop="showImg1(0)">{{$t('houseDetail.moreInfo')}}</tkui-button>
      </tk-flex>
      <!--立即咨询表单-->
    </div>
    <tk-cover class="photo-list" :show="cover1.show1" :transition="cover1.transition1" :hideOnClick="false" bottom left center @change="hideImg1" color='rgba(0,0,0,0.5)' slot = 'cover'>
      <div class="house-zixun" @click.stop>
        <tkui-list>
          <tkui-list-item >
            <tk-flex between top class = 'tk-grid-12'>
              <div class="content">
                <div class="title">{{$t('houseDetail.submitRequest')}}</div>
                <div class="desc">{{$t('houseDetail.contactYou')}}</div>
              </div>
              <tkui-button class="marginhide icon raised small" @click.native="cover1.show1 = false"><tk-icon type="custom" >shutdown</tk-icon></tkui-button>
            </tk-flex>
          </tkui-list-item>
        </tkui-list>
        <tkui-list class = 'small'>
          <tkui-list-item class="border">
            <input type="text" class="input" :placeholder="$t('houseDetail.YourName')" v-model="messAge.name">
          </tkui-list-item>
          <tkui-list-item class="border">
            <input type="text" class="input" :placeholder="$t('houseDetail.YourContact')" v-model="messAge.phone">
          </tkui-list-item>
          <tkui-list-item class="border">
            <input type="text" class="input" :placeholder="$t('houseDetail.YourAddress')" v-model="messAge.email">
          </tkui-list-item>
          <tkui-list-item class="border">
            <textarea rows="4" class="input" v-model="messAge.message"></textarea>
          </tkui-list-item>
          <tkui-list-item class="border" style="padding: 7px 15px">
            <!--通过计算属性控制用户填写的信息是否符合条件-->
            <tkui-button class="raised big block primary" :class="{disabled: !messageok}" @click.native="sendmessage">{{$t('houseDetail.send')}}</tkui-button>
          </tkui-list-item>
        </tkui-list>
      </div>
    </tk-cover>
  </tk-container>
</template>

<script>
  import mytoggle from '~/components/togglebox'
  import star from '~/components/star'
  import echarts from 'echarts'
  import {tkAjax} from 'vue-tk'
  import tkMarker from '~/components/maker'
  import util from 'assets/js/util'
  import config from 'assets/js/config'
  let chatList = null
  export default {
    data () {
      return {
        //分享的链接
        shareHref: null,
        //分享的标题
        shareContent: config.shareContent,
        //联系房智汇的号码
        phoneNumber: config.phoneNumber,
        shares: [],
        coverBool: false,
        cover: {
          show: false, transition: true, changeCover: false
        },
        cover1: {
          show1: false, transition1: true, changeCover1: false
        },
        //swiper的配置项
        swiperOption: {
          loop: false,
          pagination: '.swiper-pagination',
          paginationType: 'fraction'
        },
        toggle: true,
        showmorefont: false,
//        通过这个变量，第二个cover 展示不同的内容
        showphonecover: 0,
        style: null,
        statusBar: {
          show: true
        },
        mapShow: false,
        result1: null,
        highToggle: false
      }
    },
    mounted () {
      if (this.result.analytics.price_diff) {
        this.highToggle = /(-)/g.test(this.result.analytics.price_diff)
      }
      if (this.$store.state.init) {
        this.init()
      } else {
        this.$store.watch(state => state.init, () => {
          this.init()
        })
      }
    },
    components: {
      mytoggle,
      tkMarker,
      star
    },
    //异步请求数据
    async asyncData ({params, app, store, error, isClient}) {
      let bianliang = params.housenum
      let follow = false
      if (app.active && app.active()) {
        return app.active()
      } else {
        //关注的所有列表
        if (store.getters.userId) {
          tkAjax.post('/api/user/watch/list', {
            'user_id': store.getters.userId
          }).then((res) => {
            if (res.data.status) {
              res.data.data.houselist.map(item => {
                if (item.ml_num === bianliang) {
                  follow = true
                }
              })
            }
          })
        }
        if (isClient) {
          let {data} = await tkAjax.post('/api/listing/detail/findone', {'ml_num': bianliang}).catch(() => {})
          return {
            result: data.data,
            followBool: follow,
            //用户咨询需要填写的信息
            messAge: {
              name: '', phone: store.state.userInfo ? store.state.userInfo.phonenumber : '', email: store.state.userInfo ? store.state.userInfo.email : null, message: data.data.house.contact_message
            }
          }
        } else {
          let {data} = await tkAjax.post('/api/listing/detail/findonesafe', {'ml_num': bianliang})
          return {
            result: data.data,
            followBool: follow,
            dataBool: true,
            //用户咨询需要填写的信息
            messAge: {
              name: '', phone: store.state.userInfo ? store.state.userInfo.phonenumber : '', email: store.state.userInfo ? store.state.userInfo.email : null, message: data.data.house.contact_message
            }
          }
        }
      }
    },
    computed: {
      // echarts  横轴数据
      dataAxis () {
        let list = this.result1.list
        return list.map(item => {
          let arr = item.period.split('-')
          return arr[1] + '-' + '\n' + arr[0]
        })
      },
//      纵轴数据
      trendData () {
        let arr = []
        var item
        for (item of this.result1.list) {
          arr.push(item.price_sold_median)
        }
        return arr
      },
      anchor () {
        if (!this.$isServer && google) {
          return new google.maps.Point(50, 50)
        }
      },
//      验证用户咨询信息填写是否完全
      messageok () {
        if (this.messAge.name && this.messAge.phone) {
          return true
        }
      }
    },
    methods: {
      async init () {
        let self = this
        if (this.result.house.list_status.public === 0 && !this.userId) {
          this.coverBool = true
          this.alert({
            message: this.$t('index.coverMessage'),
            cancelText: this.$t('index.return'),
            submitText: this.$t('index.coverButton')
          }).then(() => {
            this.tkPush('/login')
          }).catch(() => {
            this.tkBack()
          })
        } else {
          this.coverBool = false
        }
        let {data} = await tkAjax.post('/api/community/soldpricestats', {'community_code': this.result.house.community, 'house_type': this.result.house.house_type}).catch(() => {})
        this.result1 = data.data
        if (self.dataBool) {
          let res = await tkAjax.post('/api/listing/detail/findone', {'ml_num': this.$route.params.housenum}).catch(() => {})
          this.result = res.data.data
        }
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
            imgUrl: self.result.meta.image // 分享图标
          })
          wx.onMenuShareWeibo({
            title: self.result.meta.title, // 分享标题
            desc: self.result.meta.description, // 分享描述
            link: window.location.href.split('#')[0], // 分享链接
            imgUrl: self.result.meta.image // 分享图标
          })
        })
        self.shareHref = window.location.href
        self.drawPie('houseecharts')
        if (window.innerWidth > 768) {
          chatList.setOption({
            dataZoom: [
              {
                startValue: this.result1.list.length - 15,
                endValue: this.result1.list.length - 1
              }
            ]
          })
        }
        util.plusReady(() => {
          plus.share.getServices((s) => {
            for (let i in s) {
              let t = s[i]
              this.shares[t.id] = t
            }
          })
        })
      },
      resize () {
        this.mapShow = false
      },
      langToggle () {
        this.tkPush('/mine/lang')
      },
      //发送关注请求
      gologin () {
        if (!this.$store.getters.userId) {
          this.tkPush('/login')
          return false
        }
        if (!this.followBool) {
          this.followBool = !this.followBool
          this.$tkAjax.post('/api/user/watch/add', {}, {
            params: {
              'ml_num': this.result.house.ml_num
            }
          }).then(res => {}).catch(() => {})
        } else {
          //取消关注
          this.followBool = !this.followBool
          this.$tkAjax.post('/api/user/watch/remove', {}, {
            params: {
              'ml_num': this.result.house.ml_num
            }
          }).then(res => {}).catch(() => {})
        }
      },
//      发送咨询信息
      sendmessage () {
        this.woopraEvent('messageBtn', {
          phone: this.$store.state.userInfo ? this.$store.state.userInfo.phonenumber : null,
          email: this.$store.state.userInfo ? this.$store.state.userInfo.email : null,
          is_weChat: this.$store.state.is_weChat ? this.$store.state.is_weChat : null
        })
        this.$tkAjax.post('/api/user/contact', this.messAge)
          .then((res) => {
            if (res.data.status) {
              this.alert({
                message: res.data.data.message,
                alert: false,
                submitText: 'OK'
              }).then(() => {
                this.cover1.show1 = false
              })
            }
          })
          .catch(() => {})
      },
      hideImg1 (opt) {
        this.cover1.show1 = opt
      },
//      显示第二个cover 并区分内容
      showImg1 (num) {
        if (num === 0 && !this.userId) {
          this.cover1.show1 = true
        } else if (num === 1) {
          this.alert({title: '提示', message: '确认拨打：1289 469 5060', submitText: '拨打', cancelText: '取消'}).then(() => {
            window.location.href = 'tel:12894695060'
          }).catch(() => {})
          this.showphonecover = num
        } else {
          this.cover1.show1 = true
          this.showphonecover = num
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
          msg.href = this.shareHref
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
          }, (e) => {
          })
        }
      },
      //发送分享
      shareMessage (msg, s) {
        s.send(msg, () => {
          this.toast('分享成功')
        }, (e) => {
        })
      },
      back () {
        this.tkBack()
      },
      //跳转到附近已售
      nearselled (num) {
        this.tkPush(this.path('/search/house/nearsold/' + num))
      },
      //跳转到附近出租
      nearrent (num) {
        this.tkPush(this.path('/search/house/nearrent/' + num))
      },
      gotoshengzhi () {
        let scrollTop = this.$refs.firstanchor.$el.offsetTop
        this.$refs.firstanchor.$emit('show')
        this.$refs.box.scrollTo(scrollTop)
      },
      queryPrice (num) {
        let self = this
        this.woopraEvent('CheckSoldPrice', {
          url: window.location.href.split('#')[0],
          title: self.result.meta.title,
          phone: this.$store.state.userInfo ? this.$store.state.userInfo.phonenumber : null,
          email: this.$store.state.userInfo ? this.$store.state.userInfo.email : null
        })
        if (this.userId) {
          this.$tkAjax.post('/api/listing/soldprice/sendemail ', {
            'ml_num': num,
            'user_id': this.userId
          }).then(res => {
            if (res.data.status) {
              this.toast(res.data.data.message)
            } else {
              return Promise.reject(res.data.error.message)
            }
          }).catch(() => {})
        } else {
          this.alert({
            message: '成交价查询仅供注册用户使用,请先注册',
            title: this.$t('common.hint'),
            submitText: this.$t('common.Register'),
            cancelText: this.$t('common.close')
          }).then(() => {
            this.tkPush('/login/register')
          }).catch(() => {})
        }
      },
      showImg () {
        this.flag = true
        this.cover.show = true
      },
      hideImg (opt) {
        this.flag = false
        this.cover.show = opt
      },
      drawPie (id) {
        if (chatList) {
          echarts.dispose(document.getElementById(id))
        }
        chatList = echarts.init(document.getElementById(id))
        chatList.setOption({
          title: {
            text: this.$t('houseDetail.CommunityPrice') + '(' + this.result.house.house_type_name + ')',
            textStyle: {
              color: '#298998',
              fontWeight: 'normal',
              fontSize: '15'
            }
          },
          grid: {
            left: '55px',
            right: '15px'
          },
          xAxis: {
            data: this.dataAxis,
            axisLabel: {
              inside: false,
              interval: 0,
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
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              startValue: this.result1.list.length - 9,
              endValue: this.result1.list.length - 1,
              zoomOnMouseWheel: 'ctrl',
              moveOnMouseMove: true,
              preventDefaultMouseMove: false
            }
          ],
          series: [
            {
              name: this.$t('houseDetail.medianPrice'),
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 9,
              lineStyle: {
                normal: {
                  color: '#69c6d5'
                }
              },
              itemStyle: {
                normal: {
                  color: '#298998'
                },
                emphasis: {
                  color: '#fff',
                  borderWidth: 2,
                  borderColor: '#298998'
                }
              },
              stack: 'a',
              areaStyle: {
                normal: {
                  color: '#cbe9ee'
                }
              },
              data: this.trendData,
              z: 6
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
            },
            extraCssText: 'background: #fff;',
            textStyle: {
              color: '#000'
            }
          }
        })
      }
    },
    //meta标签
    head () {
      return {
        meta: [{
          property: 'og:title',
          content: this.result.house.title
        }, {
          property: 'og:description',
          content: this.result.house.description1
        }, {
          property: 'og:image',
          content: this.result.house.photo_url
        }],
        title: this.result.house.title,
        script: [{
          src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
        }]
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  .tkui-list .tkui-list-item:hover, .tkui-list .tkui-list-item:active{
    background-color: #f5f5f5;
  }
  @media (min-width: 768px) {
    #main-box1-height {
      height: 100%;
    }
  }
  @media (min-width: 768px) {
    .main-box1 {
      .house-information {
        .near {
          .nearBtn {
            width: 150px;
          }
        }
      }
    }
  }
  .marginhide {
    margin: 0;
    padding: 0 2px;
  }
  .main-box1 {
    background: $white;
    overflow: hidden;
    .item-top {
      position: relative;
      .header {
        .title {
          font-size: $font-size;
        }
        .language {
          margin-right: 14px;
          font-size: 16px;
          width: (128px/2);
          height: (50px/2);
          border: solid 1px #666;
          text-align: center;
          color: $black;
          line-height: 25px;
        }
      }
    }
    .item-main {
      /*flex: 1;*/
      &.filter-cover{
        filter: blur(5px);
      }
      overflow-x: hidden;
      .main-img {
        position: relative;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        .all {
          position: absolute;
          bottom: 15px;
          right: 12px;
          width: 105px;
          height: 30px;
          border-radius: 2px;
          background-color: rgba(0,0,0,.5);
          color: $white;
          line-height: 30px;
          text-align: center;
          font-size: $AuxiliaryfontSize;
        }
      }
      .photo-list {
        .swiper-container {
          width: 100%;
          .swiper-pagination-bullets {
            color: $white;
          }
        }
        .swiper-slide {
          width: 100%;
        }
      }
      .house-information {
        .title {
          margin-top: 20px;
          font-size: $headline-font-size;
          color: #444444;
          font-weight: 500;
        }
        .city {
          color: #999999;
          font-size: 16px;
          padding-top: 11px;
          .houseType {
            border: 1px solid #009cff;
            color: #009cff;
            background-color: #e1f3ff;
            font-size: 16px;
            height: 24px;
            line-height: 22px;
            padding: 0 5px;
            text-align: center;
          }
        }
        .money {
          overflow: hidden;
          border-bottom: 1px solid #eeeeee;
          padding-top: 24px;
          padding-bottom: 20px;
          .price {
            color: #ff5b29;
            font-size: 30px;
            .lineThough {
              text-decoration: line-through;
            }
            .tag {
              vertical-align: middle;
              margin-left: 10px;
              color: #298998;
              font-size: $font-size;
            }
            .time {
              font-size: $font-size;
              color: #666;
              padding-top: 8px;
            }
          }
          .search-price {
            clear: both;
            padding-top: 9px;
            .btn {
              padding:0 2px;
              height: 30px;
              border-radius: 4px;
              background-color: #ff5b29;
              font-size: $font-size;
              text-align: center;
              color: $white;
            }
          }
          .valuation {
            padding-top: 10px;
            .sanjiao1 {
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
            .sanjiao2 {
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
        }
        .statistics {
          border-bottom: 1px solid #eeeeee;
          .item {
            text-align: center;
            height: 122px;
            display: flex;
            flex-direction:column;
            align-items: center;
            justify-content: center;
            .icon {
              width: 40px;
              height: 35px;
              color: #444;
            }
            p {
              margin-top: 16px;
              color: #444;
              font-size: $AuxiliaryfontSize;
            }
          }
        }
        .near {
          height: 94px;
        }
      }
      .glmap{
        width:100%;
        height:220px;
      }
      .starliming {
        padding: 0px 15px 30px;
        margin-top: -30px;
        .item {
          overflow: hidden;
          .left {
            float: left;
            font-size: 16px;
          }
          .xingji {
            float: right;
          }
        }
      }
      .house-bottom {
        padding: 30px 15px;
        .word {
          padding-bottom: 15px;
          .left {
            color: #999;
            padding-bottom: 5px;
          }
          .right {
            color: #999;
          }
        }
        .title {
          font-size: $title-font-size;
          color: $black;
          font-weight: normal;
        }
        .title2 {
          padding-top: 9px;
          font-size: 16px;
          color: #666;
        }
        .box {
          padding-top: 24px;
          overflow: hidden;
          display:flex;
          justify-content:space-between;
          align-items: center;
          .right {
            margin-right: 7px;
            .icon {
              width: 25px;
              height: 25px;
            }
          }
        }
      }
    }
    .item-bottom {
      .share{
        border-left:1px solid $border-color;
      }
      .item-bottom1 {
        border-top: 1px solid #f5f5f5;
        height: 50px;
        background: #f5f5f5;
        .btn {
          height: 50px;
          background: #fff;
          ~ .btn {
            margin-left: 1px;
          }
        }

        .btn1 {
          height: 50px;
        }
      }
      /*flex: 0 0 50px;*/
      height: 50px;
      width: 100%;
      .main-bottom {
        display: flex;
        justify-content:space-between;
        align-items: center;
        border-top: 1px solid #e0e0e0;
        width: 100%;
        background: $white;
        .left {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-self: stretch;
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
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .guanzhu {
            border-right: 1px solid #f5f5f5;
          }
        }
        .btn {
          flex: 1;
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
    }
    .house-zixun {
      position: absolute;
      bottom: 0px;
      background: $white;
      width: 100%;
      z-index: 13;
      .content{
        .title{
          color: #444444;
        }
        .desc{
          color:#333;
          margin:10px 0;
        }
      }
      .input {
        width: 100%;
      }
    }
  }
</style>
