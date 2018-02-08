<template>
  <tk-container class="container container-wrap" :statusBar="statusBar">
    <div class="top" slot="header">
      <!--头部-->
      <tkui-header center>
        <tkui-button slot="left-menu" class="small icon" @click.native="tkBack">
          <tk-icon>return</tk-icon>
        </tkui-button>
        <tk-flex middle center>
          <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
          <span>{{$t("Report.Report")}}</span>
        </tk-flex>
      </tkui-header>
      <!--报表日期范围-->
      <tk-flex middle center class="date">
        <span>{{result.report_period.text}}</span>
      </tk-flex>
      <!--房型切换-->
      <div class="tab-title">
        <button v-for="(item, key) in result.housetype_filter" @click="changeHouseType(item.id)" :class="{active: item.id === houseType}" :key = 'key'>{{item.name}}</button>
      </div>
    </div>
    <!--表格数据展示-->
    <tkui-table class="header-fixed average" style="height: 100%;">
      <tkui-table-header>
        <tkui-table-row class="middle">
          <tkui-table-cell padding="15px 0 15px">{{$t("name.City")}}</tkui-table-cell>
          <tkui-table-cell padding="15px 0 15px">{{$t("Report.Rents")}}</tkui-table-cell>
          <tkui-table-cell padding="15px 0 15px">{{$t("Report.Sold")}}</tkui-table-cell>
          <tkui-table-cell padding="15px 0 15px">{{$t("Report.Ratio")}}</tkui-table-cell>
        </tkui-table-row>
      </tkui-table-header>
      <tkui-table-body>
        <template v-for="item in result.report_data">
          <tkui-table-title>{{item.title}}</tkui-table-title>
          <template v-for = 'city in item.data'>
            <tkui-table-row class="message border middle" @click.native="go(city.municipality_name)">
              <tkui-table-cell style="width: 120px;" class="left">{{city.municipality_name}}</tkui-table-cell>
              <tkui-table-cell>{{city.lease}}</tkui-table-cell>
              <tkui-table-cell>{{city.sold}}</tkui-table-cell>
              <tkui-table-cell>{{city.ratio}}%</tkui-table-cell>
              <tkui-table-cell style="width: 30px;" padding="0">
                <tk-icon class="small" type="custom">return_copy</tk-icon>
              </tkui-table-cell>
            </tkui-table-row>
          </template>
        </template>
      </tkui-table-body>
    </tkui-table>
    <loadding ref = 'loadding'></loadding>
  </tk-container>
</template>

<script>
import {tkAjax, tkAjaxGlobal} from 'vue-tk'
import loadding from '~/components/loading'
export default {
  data () {
    return {
      //初始化房型
      houseType: 'D.',
      //loading显示
      show: false,
      //状态栏样式配置
      statusBar: {
        show: true
      }
    }
  },
  methods: {
    //进入社区报告页面
    go (val) {
      this.tkPush({path: '/analyze/report-community', query: {'municipality': val, house_type: this.houseType}})
    },
    //更改房型,并请求数据
    changeHouseType (val) {
      this.houseType = val
      this.show = true
      tkAjax.post('/api/stats/rentratio', {}, {
        params: {
          house_type: val
        }
      }).then(res => {
        if (res.data.status) {
          this.show = false
          this.result = res.data.data
        } else {
          return Promise.reject(res.data.error.message)
        }
      }).catch(() => {})
    }
  },
  watch: {
    //watch show的值
    show (val) {
      if (val) {
        this.$refs.loadding.$emit('show')
      } else {
        this.$refs.loadding.$emit('hidden')
      }
    }
  },
  //异步请求初始化数据
  asyncData ({app, error}) {
    //后退时保存的数据 app.active()
    if (app.active && app.active()) {
      return {
        result: app.active().result,
        houseType: app.active().houseType
      }
    } else {
      return tkAjax.post('/api/stats/rentratio', {}, {
        params: {
          house_type: 'D.'
        }
      }).then(res => {
        if (res.data.status) {
          return {
            result: res.data.data
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
    loadding
  },
  head () {
    return {
      title: this.$t('navigation.reportCity')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import 'assets/scss/_variables.scss';
    .container{
        .top {
          .date{
            height: 44px;
            background-color: #f5f5f5;
            span{
              font-size: 16px;
              color: #298998;
            }
          }
          .tab-title::-webkit-scrollbar {
            display:none
          }
          .tab-title{
            background-color: #ffffff;
            font-size:$AuxiliaryfontSize;
            color: #999999;
            overflow: auto;
            display: flex;
            button{
              height: 44px;
              font-size: 14px;
              line-height: 44px;
              padding: 0 15px;
              white-space: nowrap;
              border-bottom: 2px solid white;
            }
            .active {
              color: $black;
              font-size: 16px;
              border-bottom: 2px solid #298998;
            }
          }
        }
    }
</style>