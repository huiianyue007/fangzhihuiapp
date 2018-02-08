<template>
  <tk-container class="container container-wrap" :statusBar="statusBar" ref="box" infinite-wrapper @scroll="scrollHandler">
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button slot="left-menu" class="small icon" @click.native="return1">
        <tk-icon>return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t("CommunityListing.CommunityListing")}}</span>
      </tk-flex>
    </tkui-header>
    <!--主体部分-->
    <div class="box" >
      <!--地图组件-->
      <tk-marker class = 'map' :center = 'center' :content = 'markers.content' disableClick></tk-marker>
      <div class="detail-map" ref = 'detailMap'>
        <!--城市.社区-->
        <tk-flex between class="city" v-if = 'lastQuery.city_filter'>
          <span >{{$t("name.City")}}:{{resultList.community.municipality_name}}</span>
          <span class="comm">{{$t("name.Community")}}：{{resultList.community.community_name}}</span>
        </tk-flex>
        <!--社区行情-->
        <tk-flex between class="commniuty" @click.native="goTo(resultList.community.municipality)">
          <tk-flex class="price">
            <tk-icon type="custom" class="appreciation">appreciation</tk-icon>
            <span>{{$t("CommunityListing.CommunityStats")}}</span>
          </tk-flex>
          <tk-icon type="custom" class="go">return_copy</tk-icon>
        </tk-flex>
        <h3 class="house" ref = 'house'>{{$t("CommunityListing.all")}}</h3>
      </div>
      <!--循环房源列表-->
      <div class="all-city" v-for="item in resultList.house_list" @click="changeAddress(item.ml_num, item.address)">
        <div class="image cursor">
          <div class="big-shade">
            <!--图片-->
            <tk-box ratio="16:9" :style="'background-image: url(' + item.photo_url + ');background-size: cover'"></tk-box>
            <!--遮罩-->
            <div class="shade">
              <tk-flex center middle between>
                <span class="price">${{item.price}}</span>
                <span class="date">{{item.text.dom_short }}</span>
              </tk-flex>
              <tk-flex between center middle class="appraise">
                <span>{{item.house_type_name}} {{item.text.rooms_short}}</span>
                <!--星星组件-->
                <star class="star" :size = 'item.star' :iconStyle = "{width: '16px', height:'16px',margin: '0 2px',color: '#ffc600'}"></star>
              </tk-flex>
            </div>
          </div>
        </div>
        <!--学区,升值,租金,地块 模块-->
        <tk-flex class="modules">
          <div class="little school"><span>{{$t("common.School")}}:{{item.scores.school}}/10</span></div>
          <div class="little rend"><span>{{$t("common.Rental")}}:{{item.scores.rent}}/10</span></div>
          <div class="little up"><span>{{$t("common.Growth")}}:{{item.scores.growth}}/10</span></div>
          <div class="little place"><span>{{$t("common.Land")}}:{{item.scores.land}}/10</span></div>
        </tk-flex>
        <!--地址-->
        <p class="address">{{$t("Recommend.address")}}:{{item.address}}</p>
      </div>
      <!--无限滚动加载-->
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
        <tk-flex middle column center class="card" slot = 'no-results'>
          <tk-icon class="icon photo" type = 'custom'>noattention</tk-icon>
          <div class="nothing">没有获取到房源</div>
        </tk-flex>
        <p slot="no-more">没有更多数据了</p>
      </infinite-loading>
    </div>
  </tk-container>
</template>

<script>
  import tkMarker from '~/components/maker'
  import star from '~/components/star'
  import { tkAjax } from 'vue-tk'
  import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
  export default {
    data () {
      return {
        //初始化地图中点
        center: {},
        mapOption: {
          disableDefaultUI: true,
          gestureHandling: 'none'
        },
        markers: {},
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    //异步请求数据
    async asyncData ({query, app, error}) {
      //后退时获取数据
      if (app.active && app.active()) {
        return {
          resultList: app.active().resultList,
          lastQuery: app.active().lastQuery,
          scrollTop: app.active().scrollTop
        }
      } else {
        return tkAjax.post('/api/search/recommend/community', {}, {
          params: query,
          headers: {
            'content-type': 'application/json'
          }
        }).then(res => {
          if (res.data.status) {
            return {
              resultList: res.data.data,
              lastQuery: query,
              scrollTop: 0,
              center: {
                lng: res.data.data.community.map.lon * 1,
                lat: res.data.data.community.map.lat * 1
              },
              markers: {
                content: res.data.data.community.community_name,
                icon: 'linshiimg/dingwei11.png'
              }
            }
          } else {
            return Promise.reject(res.data.error.message)
          }
        }).catch(err => {
          error({statusCode: '404', message: err})
        })
      }
    },
    components: {
      tkMarker,
      star,
      InfiniteLoading
    },
    mounted () {
      //记录滚动高度
      this.$nextTick(() => {
        if (this.scrollTop) {
          this.$refs.box.scrollTo(this.scrollTop)
        }
      })
    },
    methods: {
      scrollHandler (top) {
        this.scrollTop = top
      },
      //返回上一页
      return1 () {
        this.lastQuery.scrollposition = 0
        this.tkBack()
      },
      //前进到行情数据页
      goTo (opt) {
        this.lastQuery.scrollposition = 0
        this.tkPush({path: '../home/quotation', query: {community: this.resultList.community.community, municipality: opt}})
      },
      //前进到房源详情页
      changeAddress (value, key) {
        this.content = key
        this.tkPush('/search/house/' + value)
      },
      //无限滚动加载
      onInfinite () {
        if (this.resultList.house_list.length > 0) {
          this.$refs.infiniteLoading.isFirstLoad = false
        }
        this.lastQuery.scrollposition = this.lastQuery.scrollposition * 1 + 5
        this.$tkAjax.post('/api/search/recommend/community', {}, {
          params: this.lastQuery,
          headers: {
            'content-type': 'application/json'
          }
        }).then(res => {
          if (res.data.status) {
            this.resultList.house_list = this.resultList.house_list.concat(res.data.data.house_list)
            this.$nextTick(() => {
              if (res.data.data.house_list.length < 5) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              } else {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              }
            })
          } else {
            return Promise.reject(res.data.error.message)
          }
        }).catch(() => {
        })
      }
    },
    head () {
      return {
        title: this.$t('navigation.recommendDetail')
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  .container{
    .map {
      height:220px;
    }
    .detail-map{
      padding:$pageGutter;
      background-color: white;
      .house{
        margin-top: 10px;
        font-size: $title-font-size;
        color: #333333;
      }
      .city{
        span{
          font-size:$caption-font-size;
          color: #999999;
        }
      }
      .commniuty{
        cursor: pointer;
        padding: $header-gutter 0;
        border-bottom: 1px solid #eeeeee;
        .price{
          .appreciation{
            width: 20px;
            height: 24px;
            margin-right: 5px;
          }
        }
      }
    }
    .all-city{
      padding:15px 15px 10px;
      background-color: white;
      margin-bottom: 1px;
      .image{
        position: relative;
        .big-shade{
          width:100%;
          background-color: rgba(0, 0, 0, .9);
          position: relative;
          .ratio-msg{
            width:100%;
          }
          .shade{
            position: absolute;
            bottom:0;
            width:100%;
            padding: 10px;
            background: linear-gradient(180deg,transparent,rgba(0,0,0,0.7),rgba(0,0,0,0.8));
            .price{
              font-size: $title-font-size;
              font-weight: 600;
              color: #ffffff;
            }
            .date{
              font-size: $caption-font-size;
              color: #ffffff;
            }
            .appraise{
              padding-top: 5px;
              span{
                font-size: $caption-font-size;
                color: #ffffff;
              }
            }
          }
        }
      }
      .modules{
        padding: 5px 0;
        .little{
          width:80px;
          height: 22px;
          text-align: center;
          font-size: $AuxiliaryfontSize;
          margin-top: 8px;
          span {
            line-height: 22px;
          }
        }
        .school{
          background-color: #e5f5ff;
          color: #0099ff;
        }
        .rend{
          margin-left: 6px;
          background-color: #ffe9e5;
          color: #f84d2b;
        }
        .up{
          margin-left: 6px;
          color: #00af25;
          background-color: #e5f7e9;
        }
        .place{
          margin-left: 6px;
          color: #ff8400;
          background-color: #fff2e5;
        }
      }
      .address{
        font-size: $font-size;
        text-align: left;
        color: #333333;
        margin-top: 15px;
      }
    }
    .card {
      width:100%;
      .photo{
        margin-top: 50px;
        width:101px;
        height:111px;
        display:block;
        margin-bottom:20px;
      }
      .nothing{
        display:block;
      }
    }
  }
</style>