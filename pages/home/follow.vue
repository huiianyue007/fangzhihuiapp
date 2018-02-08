<template>
  <tk-container :statusBar="statusBar">
    <!--头部-->
    <tkui-header center slot="header">
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t("user.myFollow")}}</span>
      </tk-flex>
    </tkui-header>
    <!--主体部分-->
    <tk-flex column top class="container">
      <div class="con" v-if = 'houseList'>
        <!--未关注房源-->
        <tk-flex class="msg" middle center column v-if = 'houseList.length === 0'>
          <tk-icon class="icon" type = 'custom'>noattention</tk-icon>
          <div class="nothing">{{$t('user.noWatch')}}</div>
        </tk-flex>
        <!--关注房源展示数据-->
        <div class="follow">
          <div class="list" v-for = 'item in houseList' @click="go(item.ml_num)">
            <div class="img">
              <div class="select">
                <span class="selectOne" v-for="item1 in item.tags">{{item1}}</span>
              </div>
              <img :src="item.photo_url"  alt="" class = 'photo'>
              <div class="shadow"></div>
              <div class="desc">
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
                    <star class="star" :size = 'item.star' :iconStyle = "{width: '16px', height:'16px',color: '#ffc600'}" v-if = 'item.star'></star>
                  </div>
                </tk-flex>
              </div>
            </div>
            <tk-flex class="score" middle average>
              <div class="li">{{$t('common.School')}}: {{item.scores.school}}/10</div>
              <div class="li">{{$t('common.Growth')}}: {{item.scores.growth}}/10</div>
              <div class="li">{{$t('common.Rental')}}: {{item.scores.rent}}/10</div>
              <div class="li">{{$t('common.Land')}}: {{item.scores.land}}/10</div>
            </tk-flex>
            <div class="addr">{{$t('Recommend.address')}}: {{item.address}}</div>
          </div>
        </div>
      </div>
    </tk-flex>
    <!--底部footer组件-->
    <my-footer slot="footer"></my-footer>
  </tk-container>
</template>
<script>
  //星星组件
import star from '~/components/star'
import { tkAjax } from 'vue-tk'
import myFooter from "~/components/Footer"
export default {
  data () {
    return {
      //状态栏配置项
      statusBar: {
        show: true
      }
    }
  },
  methods: {
    go (key) {
      this.tkPush('/search/house/' + key)
    }
  },
  //异步请求关注数据
   async asyncData ({ store, redirect}) {
    //判断登录状态
    let userId = store.getters.userId
    if (!userId) {
      redirect('/login')
    }
    //请求数据
     return tkAjax.post('/api/user/watch/list', {
       'user_id': store.getters.userId
     }).then(res => {
       if (res.data.status) {
         return {
           houseList: res.data.data.houselist
         }
       } else {
         return Promise.reject(res.data.error.message)
       }
     }).catch(() => {
       return {
         houseList: []
       }
     })
   },
  //判断用户登录状态的中间件
    middleware: 'auth',
    components: {
      star,
      myFooter
    },
  head () {
    return {
      title: this.$t('navigation.follow')
    }
  }
}
</script>
<style scoped lang = 'scss'>
  @import '../../assets/scss/_variables';
  .container {
    height:100%;
    .con {
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
      .follow{
        .list{
          margin-top:15px;
          padding: 15px 15px;
          background-color: white;
          .img {
            position:relative;
            cursor: pointer;
            .select{
              position:absolute;
              top:10px;
              right:10px;
              z-index:3;
            }
            .selectOne {
              height:24px;
              margin-right: 5px;
              padding: 5px 10px;
              border-radius:2px;
              font-size:14px;
              line-height:24px;
              text-align:center;
              color:#fff;
              background:$primary-color;
            }
            .shadow{
              width:100%;
              height:220px;
              top:0;
              left:0;
              position:absolute;
              z-index:2;
            }
            .photo{
              width:100%;
              height:220px;
            }
            .desc{
              color: white;
              .bottom {
                position: absolute;
                bottom: 0;
                width: 100%;
                background: linear-gradient(180deg,transparent,rgba(0,0,0,0.7),rgba(0,0,0,0.8));
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
                .star {
                  flex: 0 0 auto;
                }
              }
            }
          }
          .score{
            margin-top:10px;
            .li{
              text-align:center;
              height: 22px;
              line-height:22px;
              font-size: 14px;
              border-radius: 3px;
              margin-right:10px;
              &:nth-child(1) {
                background: #e5f5ff;
                color: #0099ff;
              }
              &:nth-child(2) {
                background: #e5f7e9;
                color: #00af25;
              }
              &:nth-child(3) {
                background: #ffe9e5;
                color: #f84d2b;
              }
              &:nth-child(4) {
                background: #fff2e5;
                margin-right:0;
                color: #ff8400;
              }
            }
          }
          .addr{
            font-size:16px;
            margin-top:14px;
            color: #333;
          }
        }
      }
    }
  }
</style>