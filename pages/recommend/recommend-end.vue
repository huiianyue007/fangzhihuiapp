                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <template>
  <tk-container class="section container-wrap" :statusBar="statusBar" infinite-wrapper ref = 'list' @scroll="scrollHandler">
      <!--头部-->
      <tkui-header class="header" center slot="header">
        <tkui-button slot="left-menu" class="small icon" @click.native="tkBack">
          <tk-icon>return</tk-icon>
        </tkui-button>
        <tk-flex middle center>
          <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
          <span>{{$t("RecommendCommunity.RecommendCommunity")}}</span>
        </tk-flex>
      </tkui-header>
      <!--弹出层-->
      <div class="tanchu" v-show="bool">
        <span>{{resultList.text.summary}}</span>
      </div>
      <!--上个页面的选择-->
      <tk-link to="/recommend/recommend" class = 'overhide' v-if = 'query'>
        <div class="condition">
          <tkui-list class="small" v-if="query.city_filter && query.city_filter.length > 0">
            <tkui-list-item>
              <div class="city1 text-hidden"><span slot = 'left' v-for="(item, index) in query.city_filter">{{item}}{{index < query.city_filter.length -1 ? '、' : ''}}</span></div>
              <tk-icon type="custom" class="icon alter" slot = 'right'>edit</tk-icon>
            </tkui-list-item>
          </tkui-list>
          <ul class="price">
            <!--价格-->
            <li>
              <tk-icon type="custom" class="icon">return_high</tk-icon>
              ${{this.query.price_low | price}}-{{ priceHigh}}
            </li>
            <!--房型-->
            <li>
              <tk-icon type="custom" class="icon">appreciation</tk-icon>&thinsp;
              <span>{{resultList.text.investment}}</span>
            </li>
            <!--需求-->
            <li>
              <tk-icon type="custom" class="icon">town_house</tk-icon>&thinsp;&thinsp;
              <span>{{resultList.text.house_type}}</span>
            </li>
          </ul>
        </div>
      </tk-link>
      <!--主体部分-->
      <tkui-list v-if = 'resultList.community_list'>
        <tkui-list-item class="minute-news cursor" v-for="(item, index) in resultList.community_list" @click.native="tohouselist(item.community, item.house_type)" :key="index">
          <div class="news">
            <!--城市,社区名称-->
            <tk-flex class="city-name">
              <span class="name fill">{{item.community_name}}</span>
              <span class="name-one">{{item.municipality_name}}</span>
            </tk-flex>
            <div class="middle-news">
              <!--图片-->
              <div class="image">
                <tk-box ratio="4:3" :style="'background-image: url(' + item.photo_url + '); background-size: cover;'"></tk-box>
                <p>{{item.text.listings}}</p>
              </div>
              <!--右侧信息-->
              <div class="right-news">
                <p>${{item.price_avg}}<span>{{item.text.median_price}}</span></p>
                <star class="star" :size = 'item.star' :iconStyle = "{width: '16px', height:'16px',margin: '0 2px',color: '#ffc600'}"></star>
                <tk-flex wrap class="modules">
                  <div class="little school"><span>{{$t("common.School")}}:{{item.scores.school}}/10</span></div>
                  <div class="little rend"><span>{{$t("common.Rental")}}:{{item.scores.rent}}/10</span></div>
                  <div class="little up"><span>{{$t("common.Growth")}}:{{item.scores.growth}}/10</span></div>
                  <div class="little place"><span>{{$t("common.Land")}}:{{item.scores.land}}/10</span></div>
                </tk-flex>
              </div>
            </div>
            <!--底部信息-->
            <tk-flex class="foot">
                <div class="little" :class="list[item1]" v-for="item1 in item.tags">{{item1}}</div>
            </tk-flex>
          </div>
        </tkui-list-item>
        <!--无限滚动加载-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
          <tk-flex middle column center class="card" slot = 'no-results'>
            <tk-icon class="icon photo" type = 'custom'>noattention</tk-icon>
            <div class="nothing">没有获取到房源</div>
          </tk-flex>
          <p slot="no-more">没有更多数据了</p>
        </infinite-loading>
    </tkui-list>
  </tk-container>
</template>

<script>
import { tkAjax } from 'vue-tk'
import star from '~/components/star'
import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
export default {
  data () {
    return {
      pushend: true,
      bool: true,
      list: {
        '名校区': 'school',
        '豪宅区': 'luxury',
        '低犯罪率': 'sin',
        'Famous school': 'school',
        'Luxury': 'luxury',
        'Low crime rate': 'sin'
      },
      listStyle: null,
      //状态栏配置项
      statusBar: {
        show: true
      }
    }
  },
  computed: {
    //给价格进行千分位处理
    priceHigh () {
      if (this.query.price_high >= 4500000) {
        return '不限'
      } else {
        let string = String(this.query.price_high)
        let ar = []
        for (let i = 0; string.length > 0; i++) {
          if (string.length >= 3) {
            ar[i] = string.substring(string.length - 3, string.length)
            string = string.substring(0, string.length - 3)
          } else {
            ar[i] = string
            string = ''
          }
        }
        return '$' + ar.reverse().join(',')
      }
    }
  },
  mounted () {
    //记录滚动高度
    this.$nextTick(() => {
      if (this.scrollTop) {
        this.$refs.list.scrollTo(this.scrollTop)
      }
    })
  },
  //异步请求数据
  async asyncData ({query, app}) {
    //后退时不刷新
    if (app.active && app.active()) {
      return {
        result: app.active().result,
        resultList: app.active().resultList,
        query: app.active().query,
        queryhouse: app.active().queryhouse,
        scrollTop: app.active().scrollTop,
        wightingArr: app.active().wightingArr
      }
    } else {
      //vue-router有一个query传参bug，在数组仅有一个元素时，会以字符串形式显示，这里将字符串还原为array
      let arrayQuery = [
        'house_type_filter',
        'city_filter'
      ]
      for (let item of arrayQuery) {
        if (typeof query[item] === 'string') {
          query[item] = [query[item]]
        }
      }
      let arr = []
      let obj = JSON.parse(query.weighting)
      for (let key in obj) {
        if (obj[key] === '1') {
          arr.push(key)
        }
      }
      return tkAjax.post('/api/search/recommend/start', {}, {
        params: query
      }).then(res => {
        return {
          result: res.data,
          resultList: res.data.data,
          query: query,
          queryhouse: JSON.parse(JSON.stringify(query)),
          scrollTop: 0,
          wightingArr: arr
        }
      })
    }
  },
  components: {
    star,
    InfiniteLoading
  },
  methods: {
    scrollHandler (top) {
      this.scrollTop = top
    },
    //前进到社区列表页
    tohouselist (num, type) {
      this.queryhouse.community_code = num
      this.queryhouse.community_house_type = type
      this.queryhouse.scrollposition = '0'
      this.tkPush({path: '/recommend/detail', query: this.queryhouse})
    },
    //返回上一页
    back () {
      this.tkBack()
    },
    //滚动无限加载
    onInfinite () {
      this.$nextTick(() => {
        if (this.resultList.community_list.length > 0) {
          this.$refs.infiniteLoading.isFirstLoad = false
        }
        if (this.resultList.community_list.length < 15) {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          return false
        }
      })
      this.query.scrollposition = this.query.scrollposition * 1 + 15
      if (this.query.scrollposition < this.resultList.scrollmax) {
        this.$tkAjax.post('/api/search/recommend/start', {}, {
          headers: {
            'content-type': 'application/json'
          },
          params: this.query
        }).then(res => {
          if (res.data.status) {
            this.resultList.community_list = this.resultList.community_list.concat(res.data.data.community_list)
            this.$nextTick(() => {
              if (res.data.data.community_list.length < 15) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              } else {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              }
            })
          } else {
            return Promise.reject(res.data.error.message)
          }
        }).catch(() => {})
      }
    }
  },
  head () {
    return {
      title: this.$t('navigation.recommendEnd')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import 'assets/scss/_variables.scss';
    .section {
        background-color: white;
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
        .tanchu{
          width:100%;
          height: 26px;
          background-color: #298998;
          line-height: 26px;
          text-align: center;
          span{
            font-size: $fontSizeMini;
            color: #ffffff;
          }
        }
        .condition{
          width:90%;
          margin:0 auto;
          padding: 20px;
          margin-top: 26px;
          margin-bottom: 30px;
          border-radius: 6px;
          background-color: #ffffff;
          box-shadow: 0px 12px 50px 0 rgba(22, 83, 93, 0.12);
          .small {
            .city1 {
              display: inline-block;
            }
          }
          .icon{
            height: 15px;
            width: 15px;
          }
          .name{
            padding-bottom: 10px;
            overflow: hidden;
            span{
              font-size: $title-font-size;
            }
          }
          .price{
            overflow: hidden;

            li{
              float: left;
              padding: 5px 20px 0 0;
              font-size: $AuxiliaryfontSize;
              color: #666666;
            }
          }
        }
        .minute-news{
            width: 100%;
            background-color: #ffffff;
            border-bottom: 1px solid #fafafa;
            .news{
                width:100%;
                .city-name{
                    width:100%;
                    padding: 10px 0;
                    .name{
                        font-size: $subhead-font-size;
                        font-weight: 500;
                        color: #333333;
                    }
                    .name-one{
                        font-size: $font-size;
                        color: #999999;
                    }
                }
                .middle-news{
                    width:100%;
                    overflow: hidden;
                    .image{
                        width:130px;
                        position: relative;
                        float: left;
                        margin-right: 10px;
                        p{
                            position: absolute;
                            bottom:0;
                            width:100%;
                            height: 21.5px;
                            line-height: 21.5px;
                            font-size:$fontSizeMini;
                            color: #ffffff;
                            text-align: center;
                            background: black;
                            opacity: 0.7;
                        }
                    }
                    .right-news{
                        p{
                            font-size: $title-font-size;
                            span{
                                padding-left: 5px;
                                font-size: 10px;
                                color: #333333;
                            }
                        }
                        .modules{
                            width: 170px;
                            .little{
                                width:80px;
                                height: 22px;
                                text-align: center;
                                font-size: $AuxiliaryfontSize;
                                margin-top: 6px;
                                span {
                                    line-height: 22px;
                                }
                            }
                            .school{
                                background-color: #e5f5ff;
                                color: #0099ff;
                            }
                            .rend{
                                margin-left: 10px;
                                background-color: #ffe9e5;
                                color: #f84d2b;
                            }
                            .up{
                                color: #00af25;
                                background-color: #e5f7e9;
                            }
                            .place{
                                margin-left: 10px;
                                color: #ff8400;
                                background-color: #fff2e5;
                            }
                        }
                    }
                }
                .foot{
                    margin-top: 10px;
                    .little{
                        padding: 2px 6px;
                        margin-left: 5px;
                        border-radius: 1.5px;
                        font-size: $AuxiliaryfontSize;
                    }
                    .school{
                        border: solid 1px #298998;
                        color: #298998;
                    }
                    .luxury{
                        border: solid 1px #ffc600;
                        color: #ffc600;
                    }
                    .sin{
                        color: #ff5b29;
                        border: solid 1px #ff5b29;
                    }
                }
            }
        }
    }
</style>

