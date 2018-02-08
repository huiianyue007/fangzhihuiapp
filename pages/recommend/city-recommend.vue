<template>
    <tk-container class="container container-wrap" :statusBar="statusBar">
        <!--头部-->
        <tkui-header center slot="header">
            <tkui-button slot="left-menu" class="small icon" @click.native="clearList">
                <tk-icon>return</tk-icon>
            </tkui-button>
            <tk-flex middle center>
                <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
                <span>{{$t("Recommend.CityFilter")}}</span>
            </tk-flex>
            <tkui-button class = 'small border' slot="right-menu" @click.native="goRecommend">{{$t("common.confirm")}}</tkui-button>
        </tkui-header>
        <!--循环城市列表-->
        <div class="body-box">
            <div class="city-list" v-for="(item, index) in result">
                <div class="first-letter"><h2>{{item.title}}</h2></div>
                <tk-flex wrap>
                    <button class="city" v-for="(item1, k) in item.list" @click = 'toogle(item1)' :class="{active: item1.flag}">
                        {{item1.Name}}
                    </button>
                </tk-flex>
            </div>
        </div>
    </tk-container>
</template>

<script>
import { tkAjax } from 'vue-tk'
import { Toast } from 'mint-ui'
export default {
    data () {
      return {
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    //异步请求数据
    async asyncData ({store, app}) {
      //后退时保存的数据
      if (app.active && app.active()) {
        return {
          result: app.active().result
        }
      } else {
        if (!store.state.recommendCity.length) {
          return tkAjax.post('/api/search/recommend/setup', {}, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(res => {
            if (res.data.status) {
              store.commit('setRecommendCity', res.data.data.municipality_filter)
              return {
                result: store.state.recommendCity
              }
            } else {
              return Promise.reject(res.data.error.message)
            }
          }).catch(err => {
            error({statusCode: '404', message: err})
          })
        }
      }
    },
    methods: {
        //更改样式
        toogle (opt) {
          this.$nextTick(() => {
            if (!opt.flag) {
              this.$set(opt, 'flag', true)
              this.$store.commit('ADD_RECOMMENDCITYLIST', opt.Name)
            } else {
              this.$set(opt, 'flag', false)
              this.$store.commit('DELETE_RECOMMENDCITYLIST', opt.Name)
            }
          })
        },
      //返回按钮  返回智能推荐页面
      clearList () {
        this.tkBack('/recommend/recommend')
      },
      //确定按钮 返回智能推荐页面
      goRecommend () {
        this.$store.commit('setRecommendCity', this.result)
        this.tkBack('/recommend/recommend')
      }
    }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
    @import 'assets/scss/_variables.scss';
    .body-box{
        padding: $header-gutter;
        background-color: #f4f4f4;
        min-height:100%;
        .first-letter{
            h2{
                font-size: $title-font-size;
                font-weight: 500;
                color: #666666;
                padding-bottom: 15px;
            }
        }
        .city-list{
            overflow: hidden;
            .city{
                width: 100px;
                height: 41px;
                font-size: $font-size;
                line-height: 41px;
                border-radius: 2px;
                text-align: center;
                background-color: #ffffff;
                border: solid 1px #ebebeb;
                margin-bottom: 10px;
                margin-right: 15px;
                cursor: pointer;
            }
            .active{
                background-color: #28a3b3;
                border: solid 1px #298998;
                color: white;
            }
        }
    }
</style>