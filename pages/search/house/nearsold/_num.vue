<template>
  <tk-container class="main-box" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button class="small button icon" slot="left-menu" @click.native = 'tkBack()'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t('houseDetail.NearBySimilarSold')}}</span>
      </tk-flex>
    </tkui-header>
    <div class="scroll"v-if = 'result'>
      <div class="main-house">
        <div class="img-box">
          <img :src="result.house.photo_url" alt="" width="100%" style="height: 37vh">
          <div class="bg-color">
            <div class="top">
              {{result.house.text.dom_long}}
            </div>
            <div class="adress">{{result.house.address}}</div>
            <div class="community">{{result.house.community_name}}</div>
            <div class="statistics">
              <div class="item">
                <tk-icon type="custom" class="icon">bedroom</tk-icon>
                <p>{{result.house.bedroom}} {{result.house.bedroom === 1 || locale === 'zh' ? $t("common.bd") : $t("common.bds")}}</p>
              </div>
              <div class="item">
                <tk-icon type="custom" class="icon">bathroom</tk-icon>
                <p>{{result.house.washroom}} {{result.house.washroom === 1 || locale === 'zh' ? $t("common.ba") : $t("common.bas")}}</p>
              </div>
              <div class="item">
                <tk-icon type="custom" class="icon">garage</tk-icon>
                <p>{{result.house.parking.garage}} {{result.house.parking.garage === 1 || locale === 'zh' ? $t("common.gr") : $t("common.grs")}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="mytogglebox">
            <ul>
              <li class="item">
                <span class="left">{{$t('houseDetail.Size')}}:</span>
                <span class="right">{{result.house.house_area.area}} {{result.house.house_area.unit}} {{result.house.house_area.area_note}}</span>
              </li>
              <li class="item"  v-if="result.house.land">
                <span class="left">{{$t("Recommend.Land")}}:</span>
                <span class="right">{{result.house.land.front}} x {{result.house.land.depth}} {{result.house.land.unit}}</span>
              </li>
              <li class="item">
                <span class="left">{{$t('houseDetail.ListingPrice')}}:</span>
                <span class="right">${{result.house.price}}</span>
              </li>
              <li class="item"  v-if="result.house.estimate_price">
                <span class="left">{{$t('houseDetail.estimate')}}:</span>
                <span class="right special">${{result.house.estimate_price}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--附近成交-->
      <div class="near-house">
      <div class="title">{{$t('houseDetail.NearBySimilarSold')}} <span>({{$t('nearSold.similarity')}})</span></div>
      <div class="main-near-house" v-for="(item, index) in result.nearby" @click="gohousenum(item.ml_num)">
        <div class="img-box">
          <img :src="item.photo_url" alt="" width="100%" style="height: 33vh">
          <div class="bg-color">
            <div class="top1">{{item.text.dom_long}}</div>
            <div class="price">${{item.price_sold}}</div>
            <div class="month">{{$t('nearSold.date')}}: {{item.sold_month}}</div>
            <div class="month" v-if="item.difference_score">{{$t('houseDetail.similarity')}}: {{item.difference_score}}</div>
            <div class="statistics">
              <div class="item">
                <div>
                  <tk-icon type="custom" class="icon">bedroom</tk-icon>
                  <div class="icon-box pull" v-if="result.house.bedroom < item.bedroom">
                    <tk-icon type="custom" class="min-icon" >pull_up_arrow</tk-icon>
                  </div>
                  <div class="icon-box drop" v-else-if="result.house.bedroom > item.bedroom">
                    <tk-icon type="custom" class="min-icon">drop_down_arrow</tk-icon>
                  </div>
                  <div class="icon-box right" v-else>
                    <tk-icon type="custom" class="min-icon">mpx_choice</tk-icon>
                  </div>
                </div>
                <p>{{item.bedroom}} {{item.bedroom === 1 || locale === 'zh' ? $t("common.bd") : $t("common.bds")}}<span v-if="item.bedroom - result.house.bedroom !== 0">( {{item.bedroom - result.house.bedroom > 0? '+' + (item.bedroom - result.house.bedroom) : item.bedroom - result.house.bedroom}} )</span></p>
              </div>
              <div class="item">
                <div>
                  <tk-icon type="custom" class="icon">bathroom</tk-icon>
                  <div class="icon-box pull" v-if="result.house.washroom < item.washroom">
                    <tk-icon type="custom" class="min-icon" >pull_up_arrow</tk-icon>
                  </div>
                  <div class="icon-box drop" v-else-if="result.house.washroom > item.washroom">
                    <tk-icon type="custom" class="min-icon">drop_down_arrow</tk-icon>
                  </div>
                  <div class="icon-box right" v-else>
                    <tk-icon type="custom" class="min-icon">mpx_choice</tk-icon>
                  </div>
                </div>
                <p>{{item.washroom}} {{item.washroom === 1 || locale === 'zh' ? $t("common.ba") : $t("common.bas")}}<span v-if="item.washroom - result.house.washroom !== 0">( {{item.washroom - result.house.washroom > 0? '+' + (item.washroom - result.house.washroom) : item.washroom - result.house.washroom}} )</span></p>
              </div>
              <div class="item">
                <div>
                  <tk-icon type="custom" class="icon">garage</tk-icon>
                  <div class="icon-box pull" v-if="result.house.parking.total < item.parking.total">
                    <tk-icon type="custom" class="min-icon" >pull_up_arrow</tk-icon>
                  </div>
                  <div class="icon-box drop" v-else-if="result.house.parking.total > item.parking.total">
                    <tk-icon type="custom" class="min-icon">drop_down_arrow</tk-icon>
                  </div>
                  <div class="icon-box right" v-else>
                    <tk-icon type="custom" class="min-icon">mpx_choice</tk-icon>
                  </div>
                </div>
                <p>{{item.parking.total}} {{$t("common.gr")}}<span v-if="item.parking.total - result.house.parking.total !== 0">( {{item.parking.total - result.house.parking.total > 0? '+' + (item.parking.total - result.house.parking.total) : item.parking.total - result.house.parking.total}} )</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="mytogglebox">
            <ul>
              <li class="item">
                <span class="left">{{$t("houseDetail.Size")}}: {{item.house_area.area}} {{item.house_area.unit}} {{item.house_area.area_note}}</span>
                <span class="right">
                  <tk-icon type="custom">Price</tk-icon>
                  {{item.distance}}{{item.distance_unit}}
                </span>
              </li>
              <li class="item"  v-if="item.land">
                <span class="left">{{$t('nearSold.land')}}: {{item.land.front}} x {{item.land.depth}} {{item.land.unit}}</span>
                <span class="right house-type">{{item.house_type_name}}</span>
              </li>
              <li class="item" v-else>
                <span class="left">{{$t('nearSold.land')}}:</span>
                <span class="right house-type">{{item.house_type_name}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
      <tk-flex class="empty" column middle center v-else>
        <tk-icon class="icon" type = 'custom'>noattention</tk-icon>
        <div class="nothing">附近没有已售房源</div>
      </tk-flex>
    </tk-container>
</template>

<script>
  import {tkAjax} from 'vue-tk'
  export default {
    data () {
      return {
        statusBar: {
          show: true
        }
      }
    },
    asyncData ({params, app, error}) {
      if (app.active && app.active()) {
        return {
          result: app.active().result
        }
      } else {
        var bianliang = params.num
        var settings = {
          'url': '/api/listing/nearby/sold',
          'method': 'POST',
          'params': {'ml_num': bianliang}
        }
        return tkAjax.request(settings).then(response => {
          if (response.data.status) {
            return {result: response.data.data}
          } else {
            return Promise.reject(response.data.error.message)
          }
        }).catch(() => {
          return {
            result: null
          }
        })
      }
    },
    methods: {
      gohousenum (num) {
        this.tkPush('/search/house/' + num)
      }
    },
    head () {
      return {
        title: this.$t('navigation.nearSold')
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  .main-box {
    .headerImage {
      width: 20px;
      margin-right: 5px;
      vertical-align: top;
    }
    .header {
      .title {
        font-size: $font-size;
      }
    }
    .main-house {
      .img-box {
        position: relative;
        overflow: hidden;
        img {
          float: left;
        }
        .bg-color {
          position: absolute;
          top:0;
          left:0;
          background-color: rgba(0,0,0,0.4);
          width: 100%;
          height: 100%;
          cursor: pointer;
          .top {
            position: absolute;
            right:0;
            top:10px;
            padding: 7px 7px 7px 4px;
            background-color: #298998;;
            color: $white;
            font-size: $AuxiliaryfontSize;
            height: 32px;
            &:before {
              content:'';
              position: absolute;
              top: 0;
              left: -16px;
              width: 0;
              height: 0;
              z-index: 9;
              border-bottom: 16px solid #298998;
              border-top: 16px solid #298998;
              border-left: 16px solid transparent;
              border-right: 0 none;
            }
          }
          .adress {
            padding-top: 83px;
            font-size: $headline-font-size;
            color: $white;
            text-align: center;
          }
          .community {
            padding-top: 15px;
            text-align: center;
            font-size: $AuxiliaryfontSize;
            color: $white;
          }
          .statistics {
            display: flex;
            bottom: 15px;
            position: absolute;
            width: 100%;
            .item {
              flex: 1;
              text-align: center;
              /*height: 122px;*/
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              .icon {
                color: $white;
                width: 30px;
                height: 30px;
              }
              p {
                margin-top: 10px;
                color: $white;
                font-size: $AuxiliaryfontSize;
              }
            }
          }
        }
      }
      .content {
        clear: both;
        margin-bottom: 1px;
        .mytogglebox {
          padding: 17px 15px;
          .special {
            color: #298998;
          }
        }
      }
    }
    .near-house {
      margin: 0 15px;
      border-top: 1px solid #eeeeee;
      .title {
        padding-top: 33px;
        font-size: $title-font-size;
        font-weight: 500;
        padding-left: 7px;
        padding-bottom: 20px;
        span {
          font-size: 16px;
          color: #666;
        }
      }
      .main-near-house {
        border-bottom: 1px solid $border-color;
        margin-bottom: $gutter;
        &:last-child{
          border-bottom: 0;
          margin-bottom: 0;
        }
        .img-box {
          position: relative;
          overflow: hidden;
          img {
            float: left;
          }
          .bg-color {
            position: absolute;
            top:0;
            left:0;
            background-color: rgba(0,0,0,0.4);
            width: 100%;
            height: 100%;
            cursor: pointer;
            .top1 {
              position: absolute;
              right:0;
              top:10px;
              padding: 7px 7px 7px 4px;
              background-color: #298998;;
              color: $white;
              font-size: $AuxiliaryfontSize;
              height: 32px;
              &:before {
                content:'';
                position: absolute;
                top: 0;
                left: -16px;
                width: 0;
                height: 0;
                z-index: 9;
                border-bottom: 16px solid #298998;
                border-top: 16px solid #298998;
                border-left: 16px solid transparent;
                border-right: 0 none;
              }
            }
            .price {
              font-size: 20px;
              color: $white;
              padding-left: 15px;
              padding-top: 15px;
            }
            .month {
              font-size: $AuxiliaryfontSize;
              color: $white;
              padding-left: 15px;
              padding-top: 7px;
            }
            .statistics {
              display: flex;
              bottom: 15px;
              position: absolute;
              width: 100%;
              .item {
                flex: 1;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .icon-box {
                  display: inline-block;
                  width: 15px;
                  height: 15px;
                  vertical-align: bottom;
                  margin-left: -5px;
                  border-radius: 50%;
                  .min-icon {
                    color: $white;
                    width: 12px;
                    height: 14px;
                    vertical-align: top;
                    margin-top: 1px;
                  }
                }
                .pull {
                  background-color: #F82E2E;
                }
                .drop {
                  background-color: #1AC32A;
                }
                .right {
                  background-color: #009CFF;
                }
                .icon {
                  color: $white;
                  width: 30px;
                  height: 30px;
                }
                p {
                  margin-top: 10px;
                  color: $white;
                  font-size: $AuxiliaryfontSize;
                }
              }
            }
          }
        }
        .content {
          .house-type {
            padding:0 5px;
            font-size: 14px;
            color: #009cff;
            border-radius: 2px;
            background-color: #E1F3FF;
            border: solid 1px #009cff;
            margin-top: 3px;
          }
        }
      }
    }
  }
  .empty{
    height:100%;
    .icon{
      width:101px;
      height:111px;
      display:block;
    }
    .nothing{
      font-size: 16px;
      font-weight: 500;
      color: #999999;
    }
  }
</style>
