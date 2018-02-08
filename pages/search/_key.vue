<template>
  <tk-container class="main-box" :statusBar="statusBar">
    <!--头部-->
    <tkui-header class="main-top header-search" color = '#999' slot="header">
      <tkui-button slot="left-menu" class="cursor icon small" @click.native = 'tkBack'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <!--搜索框-->
      <tk-flex middle class="text-search">
        <tk-icon type="custom" class="small icon">search</tk-icon>
        <input type="text" class="input fill text-hidden" v-model="svalue" :placeholder="$t('index.searchMessage')">
      </tk-flex>
      <template slot = 'right-menu'>
        <tkui-button class = "small primary raised marginhide no-inherit" @click.native="searchall">
          {{$t('Search.Search')}}
        </tkui-button>
      </template>
    </tkui-header>
    <!--主体部分-->
    <div class="show" v-if="showRes">
      <div class="result">
        <!--房源部分-->
        <div class="title">
          {{$t("name.Listings")}}
        </div>
        <tkui-list class="search-house-res">
          <tkui-list-item class="border res-item" v-for="(item, index) in result.house_list" @click.native="housedetail(item.ml_num)" :key="index">
            <tk-icon slot="left" type="custom" class="primary big">price</tk-icon>
            <div class="content">
              <p class="top">{{item.address}} <span :class="item.status_sold ? 'lineThough' : ''" >${{item.price}}</span></p>
              <div class="c-box">
                <div class="left">
                  <p class="city">{{item.municipality_name}} - {{item.community_name}}</p>
                  <p class="bottom">{{item.ml_num}} <span>{{$t('Search.listingData')}}: {{item.date_start}}</span>
                    <span v-for="item1 in item.tags" class="sold">[{{item1}}]</span>
                  </p>
                </div>
                <div class="icon">
                  <tk-icon type="custom" class="small">return_copy</tk-icon>
                </div>
              </div>
            </div>
          </tkui-list-item>
        </tkui-list>
        <!--社区部分-->
        <div class="title">
          {{$t("name.Community")}}
        </div>
        <tkui-list class="search-house-res small">
          <tkui-list-item class="border res-item" v-for="(item, index) in result.community_list" @click.native="goToCommunity(item.municipality, item.community)" :key="index">
            <tk-icon slot="left" type="custom" class="primary big">home</tk-icon>
            <div class="content">
              <p class="top">{{item.community_name}}</p>
              <p class="bottom">{{item.municipality_name}}</p>
            </div>
            <div class="icon">
              <tk-icon type="custom" class="small">return_copy</tk-icon>
            </div>
          </tkui-list-item>
        </tkui-list>
      </div>
    </div>

    <div class="hidden" v-else>
      <div class="content">
        <tk-icon type="custom" class="icon">no_content</tk-icon>
        <p>没有搜到结果，请换个关键词试一下。</p>
      </div>
    </div>
  </tk-container>
</template>

<script>
  import {tkAjax} from 'vue-tk'
  export default {
    data () {
      return {
        svalue: '',
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    //异步请求数据
    asyncData ({params, app, error}) {
      //后退不刷新页面
      if (app.active && app.active()) {
        return {
          result: app.active().result
        }
      } else {
        return tkAjax.post('/api/search/fulltext/findall', {'search_term': params.key})
          .then(res => {
            if (res.data.status) {
              if (res.data.data.house_list.length === 0 && res.data.data.community_list.length === 0) {
                return {result: null}
              }
              return {result: res.data.data}
            } else {
              return Promise.reject(res.data.error.message)
            }
          }).catch(err => {
            if (err) {
              error({statusCode: '404', message: err})
            }
          })
      }
    },
    methods: {
      //将搜索结果放入搜索历史
      searchall () {
        if (this.$store.state.mainsearchhistory.indexOf(this.svalue) < 0) {
          this.$store.commit('PUSHSEARCH_HISTORY', this.svalue)
        }
        if (this.svalue) {
          this.tkPush(`/search/${this.svalue}`)
        }
      },
      //跳转房源详情页
      housedetail (key) {
        this.tkPush('/search/house/' + key)
      },
      goToCommunity (city, comnty) {
        this.tkPush({
          path: '/home/quotation',
          query: {
            'municipality': city, 'community': comnty
          }
        })
      }
    },
    computed: {
      showRes () {
        if (this.result) {
          return true
        } else {
          return false
        }
      }
    },
    head () {
      return {
        title: this.$t('navigation.searchResult')
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  .main-box {
    .header-search {
      .text-search {
        height:34px;
        padding-left:1em;
        margin-right:1em;
        border-radius: $button-border-radius;
        background:#f4f4f4;
        .input {
          font-size: 14px;
        }
      }
    }
    .show {
      .result {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #f4f4f4;
        overflow: auto;
        padding-bottom: 64px;
        .title {
          width: 100%;
          height: 33px;
          font-size: 14px;
          line-height: 33px;
          padding-left: 11px;
        }
        .search-house-res {
          width: 100%;
          .res-item {
            cursor: pointer;
            display: flex;
            background-color: $white;
            ~ li {
              margin-top: 1px;
            }
            .icon {
              flex: 0 0 52px;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .content {
              flex: 1;
              .top {
                font-size: 16px;
                overflow: hidden;
                span {
                  float: right;
                  color: #ff5b29;
                  padding-top: 2px;
                }
              }
              .bottom {
                padding-top: 4px;
                color: #a9acbd;
                font-size: 12px;
                span {
                  padding-left: 4px;
                }
                .sold {
                  margin-left: 20px;
                }
              }
              .c-box {
                display: flex;
                .left {
                  flex: 1;
                  .city {
                    font-size: 16px;
                    color: #666;
                  }
                }
                .icon {
                  flex:0 0 30px;
                }
              }
              .lineThough {
                text-decoration: line-through;
              }
            }
          }
        }
      }
    }
    .hidden {
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: #f4f4f4;
      display: flex;
      justify-content: center;
      .content {
        margin-top: 115px;
        text-align: center;
        .icon {
          width: 130px;
          height: 106px;
          margin: 0 auto;
        }
        p {
          font-size: 16px;
          color: #999999;
        }
      }
    }
  }
</style>
