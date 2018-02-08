<template>
  <tk-container class="container container-wrap" disableScroll :statusBar="statusBar">
    <!--头部-->
    <tkui-header center class = 'header' slot="header" ref = 'header'>
      <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack()'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{params === 'searchHouse'? $t("index.searchHouse") : $t("index.checkprice")}}</span>
      </tk-flex>
    </tkui-header>
    <!--筛选条件-->
    <tk-flex middle class = 'select' slot = 'header' ref = 'select'>
    <div class="tk-grid-6 cursor button" :class = '{"active": !ownShow}' @click = 'showOwn()'>{{house.name}}<tk-icon type = 'custom' class = 'icon'>{{ownShow ? 'pull_list' : 'dropdown_list'}}</tk-icon></div>
      <div class="slit" :class = "{'active': daysShow || ownShow}"></div>
      <div class="tk-grid-6 cursor button" :class = '{"active": !daysShow}' @click = 'showDays()' v-show="days.name !== '全部'">{{days.name}} <tk-icon type = 'custom' class = 'icon'>{{daysShow ? 'pull_list' : 'dropdown_list'}}</tk-icon></div>
      <div class="list" v-show = 'daysShow'>
          <tk-flex between class="li" v-for = '(item, key) in days_filter' :key = 'key' @click.native = 'selectDays(item)' middle :class = '{"active": days.id === item.id}'>
              <div>{{item.name}}</div>
              <tk-icon type = 'custom' class = 'icon' v-show="days.id === item.id">mpx_choice</tk-icon>
          </tk-flex>
      </div>
      <div class="list" v-show = 'ownShow'>
        <tk-flex between class="li" v-for = '(item, key) in housetype_filter' :key = 'key' @click.native = 'selectOwn(item)' middle :class = '{"active": house.id === item.id}'>
          <div>{{item.name}}</div>
          <tk-icon type = 'custom' class = 'icon' v-show="house.id === item.id">mpx_choice</tk-icon>
        </tk-flex>
      </div>
    </tk-flex>
    <loadding ref = 'loadding'></loadding>
    <!--地图组件-->
    <tk-map class = 'map' :center = 'center' :mapOption = 'mapOption' @zoomChanged = 'zoomChanged' :markers = 'houseList' :label = 'true' :labelOrigin = '[22, 22]' @idle = 'idle' @drag="removeTimeId" @select="select" ref="map"></tk-map>
    <tk-cover :show = 'flag' :hideOnClick="false" transition bottom left through :color="color">
      <!--单个房源信息-->
      <div class="footer">
        <div class="f_con">
          <div v-if = 'houseInfo'>
            <!--顶部标题-->
            <tk-flex middle class = 'title'>
              <div class="fill">{{houseInfo ? houseInfo.house_type_name : ''}} {{houseInfo ? houseInfo.text.rooms_short : ''}}</div>
              <!--关闭按钮-->
              <tkui-button class = 'icon small marginhide button' @click.native = 'hideFooter'>
                <tk-icon type = 'custom'>shutdown</tk-icon>
              </tkui-button>
            </tk-flex>
            <!--房源主体部分-->
            <tk-flex class="body" top stretch @click.native = "tkPush('/search/house/'+ houseId)">
              <!--图片-->
              <tk-box ratio="1:1" class = 'logo' :style = "{backgroundImage: `url(${houseInfo ? houseInfo.photo_url: ''})`}">
              </tk-box>
              <!--右侧信息-->
              <div class="info fill">
                <div class="info_price">{{$t("houseDetail.ListingPrice")}}: ${{houseInfo ? houseInfo.price : ''}}</div>
                <div class="info_time">[{{$t("common.Listedfor")}} {{houseInfo ? houseInfo.list_days : ''}} {{$t("common.days")}}]</div>
                <div class="info_time">{{$t('Recommend.address')}}: {{houseInfo ? houseInfo.address : ''}}</div>
                <tk-flex middle wrap v-show = 'params === "searchHouse"'>
                  <div class="btn-info">{{$t("common.School")}}: {{stars ? stars.school : ''}}/10</div>
                  <div class="btn-info">{{$t("common.Rental")}}: {{stars ? stars.rent : ''}}/10</div>
                  <div class="btn-info">{{$t("common.Growth")}}: {{stars ? stars.growth: ''}}/10</div>
                  <div class="btn-info">{{$t("common.Land")}}: {{stars ? stars.land : ''}}/10</div>
                </tk-flex>
                <!--查询成交价按钮  只在查售价页面显示-->
                <div class="button" v-show = 'params === "checkprice"' @click.stop = 'sendEmail'>{{$t('houseDetail.checkSold')}}</div>
              </div>
            </tk-flex>
          </div>
        </div>
        <!--底部-->
        <tk-flex middle class="f_footer">
          <!--上一套按钮-->
          <tk-flex middle class="prev tk-grid-3" @click.native = 'selectHousesIndex--' v-if = 'selectHousesIndex > 0'>
            <tk-icon class="icon" type = 'custom'>return</tk-icon>
            <span>{{$t("map.Previous")}}</span>
          </tk-flex>
          <!--当前位置共几套房源-->
          <div class="tk-grid-6 text-center" :class="{'tk-grid-offset-3': selectHousesIndex === 0}">{{locale === "zh" ? "当前位置共" : ""}}{{selectHouses.length}}{{$t("map.listingsintotal")}}</div>
          <!--下一套按钮-->
          <tk-flex middle right class="next tk-grid-3" @click.native = 'selectHousesIndex++' v-if = 'selectHousesIndex < selectHouses.length -1'>
            <span>{{$t("map.Next")}}</span>
            <tk-icon class="icon" type = 'custom'>return_copy</tk-icon>
          </tk-flex>
        </tk-flex>
      </div>
    </tk-cover>
    <div class="shadow" v-show = 'daysShow || ownShow' @click = 'hidden'></div>
  </tk-container>
</template>
<script>
  import tkMap from '~/components/map'
  import loadding from '~/components/loading'
  import { tkAjax } from 'vue-tk'
  export default {
    //异步请求数据
    async asyncData ({params, app}) {
      //记住当前信息
      if (app.active && app.active()) {
        return {
          //坐标中心点
          lat1: app.active().selectHouses[0].lat,
          lng1: app.active().selectHouses[0].lng,
          params: params.map,
          mapOption: app.active().mapOption,
          house: app.active().house,
          days: app.active().days
        }
      } else {
        let res = null
        if (params.map === 'searchHouse') {
          res = await tkAjax.post('/api/search/mapsearch/listingfilter', {})
        } else {
          res = await tkAjax.post('/api/search/mapsearch/soldfilter', {})
        }
        return {
          //链接地址
          days_filter: res.data.data.days_filter,
          housetype_filter: res.data.data.housetype_filter,
          params: params.map,
          days: res.data.data.default_filter.days,
          house: res.data.data.default_filter.housetype,
          //地图配置项
          mapOption: {
            clickableIcons: false,
//          disableDefaultUI: true,
            uiZoomControls: true,
            fullscreenControl: false,
            streetViewControl: false,
            gestureHandling: 'greedy',
            maxZoom: 19,
            minZoom: 8,
            zoom: 11
          }
        }
      }
    },
    data () {
      return {
        //状态栏配置项
        statusBar: {
          show: true
        },
        //遮罩的颜色
        color: 'rgba(0,0,0,0)',
        houseInfoList: {},
        daysShow: false,
        ownShow: false,
        //初始化中心点
        center: {
          lat: 43.6532,
          lng: -79.3832
        },
        flag: false,
        params: {},
        days: {},
        //初始化房源筛选条件
        house: {},
        show: false,
        houseList: [],
        indexList: [],
        boundsRound: null,
        idleTimeId: null,
        pointer: null,
        markerList: [],
        houseInfo: null,
        stars: null,
        houseId: null,
        selectHouses: [],
        selectHousesIndex: 0
      }
    },
    //记录中心点
    beforeMount () {
      if (this.lat1 && this.lng1) {
        this.center.lat = this.lat1
        this.center.lng = this.lng1
      }
    },
    watch: {
      show (val) {
        this.$nextTick(() => {
          if (val) {
            this.$refs.loadding.$emit('show')
          } else {
            this.$refs.loadding.$emit('hidden')
          }
        })
      },
      house () {
        this.show = true
        this.indexList = []
        this.houseList = []
        this.houseInfo = null
        this.search()
      },
      days () {
        this.show = true
        this.indexList = []
        this.houseList = []
        this.houseInfo = null
        this.search()
      },
      boundsRound (val) {
        this.search()
      },
      selectHousesIndex () {
        this.houseId = this.selectHouses[this.selectHousesIndex]['ml_num']
        this.houseInfo = null
      },
      houseId () {
        if (!this.houseId || !this.selectHouses) return
        if (this.houseInfoList[this.houseId]) {
          this.houseInfo = this.houseInfoList[this.houseId].house
          this.stars = this.houseInfoList[this.houseId].stars
          this.show = false
          this.flag = true
          return
        }
        let self = this
        this.show = true
        this.$tkAjax.post('/api/listing/detail/findone', {
          'ml_num': self.houseId
        }).then(res => {
          self.show = false
          if (res.data.status) {
            self.houseInfoList[self.houseId] = {
              house: res.data.data.house,
              stars: res.data.data.analytics.scores
            }
            self.houseInfo = res.data.data.house
            self.stars = res.data.data.analytics.scores
            self.flag = true
          } else {
            return Promise.reject(res.data.error.message)
          }
        }).catch(error => {
          this.show = false
          this.toast(error)
        })
      },
      flag () {
        if (!this.flag) {
          this.houseId = this.houseInfo = null
        }
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    methods: {
      zoomChanged (opt) {
        this.mapOption.zoom = opt
      },
      hidden () {
        this.daysShow = false
        this.ownShow = false
      },
      removeTimeId () {
        clearTimeout(this.idleTimeId)
      },
      idle (opt) {
        let self = this
        this.removeTimeId()
        if (this.boundsRound === null) {
          this.boundsRound = opt
        } else {
          this.idleTimeId = setTimeout(function () {
            self.boundsRound = opt
          }, 1000)
        }
      },
      sendEmail () {
        let self = this
        console.log(window.location)
        this.woopraEvent('CheckSoldPrice', {
          url: window.location.href.split('#')[0],
          title: this.$t('navigation.checkPrice'),
          phone: self.$store.state.userInfo ? self.$store.state.userInfo.phonenumber : null,
          email: self.$store.state.userInfo ? self.$store.state.userInfo.email : null
        })
        if (this.userId) {
          this.$tkAjax.post('/api/listing/soldprice/sendemail ', {
            'ml_num': this.houseId,
            'user_id': this.userId
          }).then(res => {
            if (res.data.status) {
              this.toast(res.data.data.message)
            } else {
              return Promise.reject(res.data.error.message)
            }
          }).catch(error => {
            this.toast(error)
          })
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
      coverChange (state) {
        this.flag = state
      },
      hideFooter () {
        this.flag = false
      },
      select (data) {
        this.selectHousesIndex = 0
        if (Array.isArray(data)) {
          this.selectHouses = data
          this.houseId = data[0]['ml_num']
        } else {
          this.selectHouses = [data]
          this.houseId = data['ml_num']
        }
      },
      selectOwn (opt) {
        this.flag = false
        this.ownShow = false
        let self = this
        this.$nextTick(function () {
          self.house = opt
        })
      },
      selectDays (opt) {
        this.flag = false
        this.daysShow = false
        let self = this
        this.$nextTick(function () {
          self.days = opt
        })
      },
      showOwn () {
        this.ownShow = !this.ownShow
        this.daysShow = false
      },
      showDays () {
        this.ownShow = false
        this.daysShow = !this.daysShow
      },
      search () {
        this.show = true
        let self = this
        let url = this.params === 'searchHouse'
          ? '/api/search/mapsearch/listing'
          : '/api/search/mapsearch/sold'
        return this.$tkAjax.post(url, Object.assign({
          'house_type': self.house.id,
          'days': self.days.id
        }, self.boundsRound)).then(res => {
          if (res && res.data && (res.data.data.list || res.data.data.listing)) {
            let list = res.data.data.list || res.data.data.listing
            let diffList = self.diff(self.houseList, list)
            if (self.houseList.length === 0) {
              self.houseList = list
            } else {
              self.$nextTick(() => {
                self.$refs.map.add(diffList)
              })
            }
            self.show = false
          }
        }).catch(error => {
          self.show = false
          this.toast(error)
        })
      },
      diff (list1, list2) {
        let uniList = []
        for (let i in list2) {
          let item = list2[i]
          if (this.indexList.indexOf(item['ml_num']) === -1) {
            uniList.push(item)
            this.indexList.push(item['ml_num'])
          }
        }
        return uniList
      }
    },
    components: {
      tkMap, loadding
    },
    head () {
      if (this.params === 'searchHouse') {
        return {
          title: this.$t('navigation.searchHouse')
        }
      } else {
        return {
          title: this.$t('navigation.checkPrice')
        }
      }
    }
  }
</script>
<style lang = 'scss' scoped>
  @import 'assets/scss/_variables.scss';
  .container{
    background:#f5f5f5;
    height:100%;
    width:100%;
    .header{position:relative;z-index:3;}
    .select{
      background: #fff;
      position:relative;
      font-size:14px;
      color:#666;
      z-index:3;
      .slit{
        width: 1px;
        height: 30px;
        background-color: #e0e0e0;
        &.active {
          height:44px;
          background:#f5f5f5;
        }
       }
      .button{
          line-height:44px;
          text-align:center;
          border-bottom: 1px solid transparent;
          .icon{
            color:#ccc;
            width:12px;
            height:12px;
          }
          &.active{
            border-bottom: 1px solid #f5f5f5;
          }
      }
      .list{
         background:#fff;
         position:absolute;
         top: 44px;
         left:0;
         padding-top:10px;
         width:100%;
         z-index:100;
         .li{
           background: #fff;
           padding: 0 15px;
           border-bottom:1px solid #f5f5f5;
           line-height:44px;
           cursor: pointer;
           &.active{
             background: #f5f5f5;
             color: #298998;
           }
           .icon{
             width:15px;
             height:33px;
             color: #298998;
           }
         }
      }
    }
    .map{
      width:100%;
      height:100%;
    }
    .footer{
      color:#333;
      width:100%;
      position:absolute;
      bottom:0;
      background:#fff;
      .f_con{
        min-height: 180px;
        padding:0 15px;
        overflow:hidden;
        .title{
          font-size:18px;
          line-height:1em;
          color: #141414;
          margin: 10px 0;
          .button{
            padding: $gutter-min !important;
            box-sizing: content-box;
          }
        }
      }
      .body{
        margin:11px 0;
        cursor: pointer;
        .logo{
          display:block;
          width:130px;
          overflow:hidden;
          background-size:cover;
        }
        .info{margin-left:15px;
         .info_price {
           font-size:18px;
           line-height:1em;
           color:#333;
         }
          .info_time{
            font-size:14px;
            color:#666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
          }
          .button{
            width:130px;
            font-size:16px;
            text-align:center;
            color:#fff;
            margin-top:12px;
            line-height:30px;
            border-radius: 4px;
            background-color: #28a3b3;
          }
          .btn-info{
            width: 100px;
            height:22px;
            border-radius:3px;
            margin:5px 5px 0 0;
            font-size:14px;
            line-height:22px;
            text-align:center;
            &:nth-child(1){
              background: #e5f5ff;
              color:#0099ff;
            }
            &:nth-child(2){
              background: #ffe9e5;
              color:#f84d2b;
            }
            &:nth-child(3){
               background: #e5f7e9;
               color:#00af25;
             }
            &:nth-child(4){
              background: #fff2e5;
              color:#ff8400;
            }
          }
        }
      }
      .f_footer{
        height:49px;
        padding:0 15px;
        border-top:1px solid #f5f5f5;
        width:100%;
        .icon{
          color: #666;
          width:14px;
          height:24px;
        }
      }
    }
    .shadow{
      position:fixed;
      top:0;
      left:0;
      height:100%;
      width: 100%;
      background:rgba(0, 0, 0, .5)
    }
  }
  @media (min-width:768px) {
    .container{
      .map{
        width:100%;
        height:calc(94vh - 96px);
      }
    }
  }
</style>