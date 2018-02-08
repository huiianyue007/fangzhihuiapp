<template>
  <tk-container class="main-box container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button slot="left-menu" class="small icon" @click.native="tkBack()">
        <tk-icon>return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t("Recommend.IntelligenceRecommend")}}</span>
      </tk-flex>
    </tkui-header>
    <loadding ref = 'loadding' slot="cover"></loadding>
    <div class="box">
      <div class="range-box">
        <!--价格范围-->
        <tk-flex column class="price">
          <p class="num">$ {{value[0] | price}}-{{value[1] === 4500000 ? $t('Recommend.max') : value[1] | price}}</p>
        </tk-flex>
        <!--slider组件-->
        <vue-slider v-model="value" :dot-size="dotSize" :max="max" :tooltip="tooltip" :processStyle="processStyle" :data="data"></vue-slider>
        <tk-flex average class="rangeNum">
          <span>{{$t('Recommend.one')}}</span>
          <span>{{$t('Recommend.five')}}</span>
          <span>{{$t('Recommend.eight')}}</span>
          <span>{{$t('Recommend.two')}}</span>
          <span>{{$t('Recommend.max')}}</span>
        </tk-flex>
      </div>
      <div class="need">
        <!--投资需求-->
        <tk-flex between class="need1">
          <span class="title1">{{$t("Recommend.InvestmentRequirment")}}</span>
          <!--全部需求-->
          <tk-flex class="all" @click.native="checkAll">
            <tk-icon type="custom" style="width: 28px;height: 28px;">{{$store.state.bool ? 'selection_box' : 'selection_box_no'}}</tk-icon>
            <span :class="{checkA: $store.state.weighting.growth === '1' && $store.state.weighting.school === '1' && $store.state.weighting.rentalreturn === '1' && $store.state.weighting.lotsize === '1'}">{{$t("Recommend.All")}}</span>
          </tk-flex>
        </tk-flex>
        <tk-flex average class="xuqiu">
          <!--学区好-->
          <div class="item" :class="{active: $store.state.weighting.school === '1'}"
               @click="$store.commit('setWeightSchool', $store.state.weighting.school === '1' ? '0' : '1')"
               @click.prevent="check">
            <tk-icon type="custom" class="icon-size">community</tk-icon>
            <p>{{$t("Recommend.School")}}</p>
          </div>
          <!--升值快-->
          <div class="item" :class="{active: $store.state.weighting.growth === '1'}"
               @click="$store.commit('setWeightGrowth', $store.state.weighting.growth === '1' ? '0' : '1')" @click.prevent="check">
            <tk-icon type="custom" class="icon-size appreciation-one">appreciation</tk-icon>
            <p class="up">{{$t("Recommend.Growth")}}</p>
          </div>
          <!--租金回报高-->
          <div class="item shou" :class="{active: $store.state.weighting.rentalreturn === '1'}"
               @click="$store.commit('setWeightRent', $store.state.weighting.rentalreturn === '1' ? '0' : '1')" @click.prevent="check">
            <tk-icon type="custom" class="icon-size">return_high</tk-icon>
            <p>{{$t("Recommend.RentalYield")}}</p>
          </div>
          <!--地块大-->
          <div class="item" :class="{active: $store.state.weighting.lotsize === '1'}"
               @click="$store.commit('setWeightLotsize', $store.state.weighting.lotsize === '1' ? '0' : '1')" @click.prevent="check">
            <tk-icon type="custom" class="icon-size">plot_big</tk-icon>
            <p>{{$t("Recommend.Land")}}</p>
          </div>
        </tk-flex>
        <!--房屋类型-->
        <tk-flex between class="need1">
          <span class="title1">{{$t("Recommend.HouseType")}}</span>
          <!--全部房型-->
          <tk-flex class="all" :class="{active: listIsFull}" @click.native="pushAll">
            <tk-icon type="custom" class="check">{{listIsFull ? 'selection_box' : 'selection_box_no'}}</tk-icon>
            <span>{{$t("Recommend.AllType")}}</span>
          </tk-flex>
        </tk-flex>
        <tk-flex average class="xuqiu">
          <!--独立屋-->
          <div class="item" @click="pushone('D.')" :class="{active: listHas('D.')}">
            <tk-icon type="custom" class="icon-size">independent_house</tk-icon>
            <p>{{$t("name.Detached")}}</p>
          </div>
          <!--半独立屋-->
          <div class="item" @click="pushone('S.')" :class="{active: listHas('S.')}">
            <tk-icon type="custom" class="icon-size">semidetached_house</tk-icon>
            <p>{{$t("name.Semi-Detached")}}</p>
          </div>
          <!--镇房-->
          <div class="item" @click="pushone('A.')" :class="{active: listHas('A.')}">
            <tk-icon type="custom" class="icon-size">town_house</tk-icon>
            <p>{{$t("name.Townhouse")}}</p>
          </div>
          <!--公寓-->
          <div class="item" @click="pushone('C.')" :class="{active: listHas('C.')}">
            <tk-icon type="custom" class="icon-size">apartment</tk-icon>
            <p>{{$t("name.Condo")}}</p>
          </div>
        </tk-flex>
      </div>
      <!--城市筛选-->
      <tkui-list>
        <tkui-list-item class="border" @click.native="gocitylist">
          <div slot = 'left'>
            {{$t("Recommend.CityFilter")}}
          </div>
          <tk-flex middle slot = 'right'>
            <div style="width: 150px; text-align: right" class="text-hidden">
              <span v-for="(item, index) in cityList">{{item}}{{index < cityList.length -1 ? '、' : ''}}</span>
            </div>
            <tk-icon class="return small" type="custom">return_copy</tk-icon>
          </tk-flex>
        </tkui-list-item>
      </tkui-list>
    </div>
    <!--开始推荐按钮-->
    <div class="btn footer" ref = 'footer' slot="footer">
      <tkui-button class="block primary raised" @click.native = 'startcomm'>{{$t("Recommend.StartRecommendation")}}</tkui-button>
    </div>
  </tk-container>
</template>

<script>
import vueSlider from '~/components/vue-slider'
import loadding from '~/components/loading'
export default {
  data () {
    return {
      //slider初始值
      value: [
        500000,
        1200000
      ],
      //slider的宽度
      width: '100%',
      //slider高度
      height: 8,
      //sldier拖动按钮的大小
      dotSize: 34,
      min: 0,
      max: 4500000,
      tooltip: 'none',
      processStyle: {
        'backgroundColor': '#3e8b97'
      },
      //slider的data值
      data: [0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1750000, 2000000, 2250000, 2500000, 2750000, 3000000, 3250000, 3500000, 3750000, 4000000, 4250000, 4500000],
      //状态栏配置项
      statusBar: {
        show: true
      },
      show: false
    }
  },
  components: {
    vueSlider, loadding
  },
  asyncData ({app}) {
    if (app.active && app.active()) {
      return app.active()
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$refs.loadding.$emit('show')
      } else {
        this.$refs.loadding.$emit('hidden')
      }
    }
  },
  computed: {
    //全部房型是否全选
    listIsFull: function () {
      return this.$store.state.list.length === 4
    },
    cityList () {
      return this.$store.state.recommendCityList
    },
    params () {
      return {
        'house_type_filter': this.$store.state.list,
        'city_filter': this.$store.state.recommendCityList,
        'weighting': JSON.stringify(this.$store.state.weighting),
        price_low: this.value[0],
        price_high: this.value[1] === 4500000 ? 99999999 : this.value[1],
        scrollposition: '0'
      }
    }
  },
  methods: {
    //全部需求是否全选
    check () {
      if (this.$store.state.weighting.growth === '1' && this.$store.state.weighting.lotsize === '1' && this.$store.state.weighting.rentalreturn === '1' && this.$store.state.weighting.school === '1') {
        this.$store.commit('setBool', true)
      } else {
        this.$store.commit('setBool', false)
      }
    },
    //全部需求全选按钮
    checkAll () {
      if (this.$store.state.weighting.growth === '1' && this.$store.state.weighting.lotsize === '1' && this.$store.state.weighting.rentalreturn === '1' && this.$store.state.weighting.school === '1') {
        this.$store.commit('setWeightSchool', '0')
        this.$store.commit('setWeightGrowth', '0')
        this.$store.commit('setWeightRent', '0')
        this.$store.commit('setWeightLotsize', '0')
        this.$store.commit('setBool', false)
      } else {
        this.$store.commit('setWeightSchool', '1')
        this.$store.commit('setWeightGrowth', '1')
        this.$store.commit('setWeightRent', '1')
        this.$store.commit('setWeightLotsize', '1')
        this.$store.commit('setBool', true)
      }
    },
    //全部房型中是否有这个房型
    listHas (name) {
      return this.$store.state.list.indexOf(name) >= 0
    },
    //向房型中加入点击的房型
    pushone (val) {
      if (this.listIsFull) {
        this.$store.commit('setEmptyList')
      } else if (this.listHas(val)) {
        this.$store.commit('setDouList', this.$store.state.list.indexOf(val))
        return
      }
      this.$store.commit('setList', val)
    },
    //全选
    pushAll () {
      if (this.$store.state.list.length < 4) {
        this.$store.commit('setAllList')
      } else {
        this.$store.commit('setEmptyList')
      }
    },
    //前进至城市筛选页面
    gocitylist () {
      this.tkPush({path: '/recommend/city-recommend'})
    },
    //开始推荐
    startcomm () {
      this.show = true
      this.$tkAjax.post('/api/search/recommend/start', {}, {
        params: this.params,
        headers: {
          'content-type': 'application/json'
        }
      }).then(res => {
        this.show = false
        if (res.data.status) {
          this.tkPush({path: '/recommend/recommend-end', query: this.params})
        } else {
          return Promise.reject(res.data.error.message)
        }
      }).catch(() => {
        this.show = false
      })
    },
    return1 () {
      this.tkBack()
    }
  },
  head () {
    return {
      title: this.$t('navigation.recommend')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  .main-box {
    .box{
      min-height:100%;
      background:$white;
    }
    .range-box{
      margin:0 20px;
      padding: 30px 0;
      border-bottom: 1px solid  #eeeeee;
      .price{
        .num{
          height: 30px;
          font-size: $title-font-size;
          color: #333333;
          padding-bottom: 5px;
        }
        .percent{
          font-size: $AuxiliaryfontSize;
          color: #666666;
          padding-bottom: 10px;
        }
      }
      .rangeNum{
        padding-top: 20px;
        text-align: center;
        span{
          font-size: $subhead-font-size;
          color: #666666;
        }
      }
    }
    .need {
      padding: 30px 20px 0;
      .need1{
        width:100%;
        height: 28px;
          .title1{
            font-size: $subhead-font-size;
            padding-left: 14px;
            color: #333333;
          }
        .all{
          cursor: pointer;
          span {
            line-height:28px;
            color: #666666;
          }
          .check{
            width: 28px;
            height: 28px;
            cursor: pointer;
          }
          .checkA{
            color: #298998;
          }
        }
          .active{
              span{
                  color: #298998;
              }
          }
      }
      .xuqiu {
        padding-bottom: 30px;
        margin-bottom:30px;
        border-bottom:1px solid #eeeeee;
        &:last-child{
          margin-bottom:0;
        }
        .item {
          &:first-child{
            margin-left:0;
          }
          margin-top: 20px;
          margin-left: 20px;
          text-align: center;
          border:1px solid white;
          border-radius: 8px;
          padding-top: 10px;
          width: 70px;
          height: 80px;
          cursor: pointer;
          p {
            font-size: $AuxiliaryfontSize;
            padding-top:5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .up{
            padding-top: 9px;
          }
          .icon-size{
            width: 34px;
            height:34px;
          }
          .appreciation-one{
            width: 30px;
            height: 30px;
          }
        }
        .active {
          border:1px solid #298998;
          border-radius: 8px;
          p {
            color: #298998;
          }
          .icon-size{
            color: #298998;
          }
        }
      }
    }
    .list{
      float:left;
    }
    .cityList{
      width:92%;
      height: 57px;
      margin:0 auto;
      cursor: pointer;
      span {
        font-size: 18px;
        color: #333333;
      }
      .preview{
        float: right;
        ul li{
          float: left;
        }
        .return{
          float: left;
        }
      }
      h2{
        float: left;
        font-size: $subhead-font-size;
      }
    }
    .btn{
      width:100%;
      padding: $gutter;
      background: white;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
