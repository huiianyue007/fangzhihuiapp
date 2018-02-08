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
                    <span>{{$t("index.reportComm")}}</span>
                </tk-flex>
            </tkui-header>
            <!--房型切换-->
            <div class="tab-title">
                <button v-for="(item, index) in result.housetype_filter" @click.stop="changeHouseType(item.id)" :class="{active: item.id === houseType}">{{item.name}}</button>
            </div>
            <!--投资房比例-->
            <div class="small-title">
                <span>{{result.report_data.title}}</span>
            </div>
        </div>
        <!--表格数据展示-->
        <tkui-table class = 'header-fixed' style="height: 100%;">
            <tkui-table-header>
                <tkui-table-row class="middle">
                    <tkui-table-cell>{{$t("name.Community")}}</tkui-table-cell>
                    <tkui-table-cell padding="15px 0 15px" class="community">{{$t("Report.Rents")}}</tkui-table-cell>
                    <tkui-table-cell padding="15px 0 15px" class="community">{{$t("Report.Sold")}}</tkui-table-cell>
                    <tkui-table-cell padding="15px 0 15px" class="community">{{$t("common.Listedfor")}}</tkui-table-cell>
                    <tkui-table-cell padding="15px 0 15px" class="community">{{$t("Report.Ratio")}}</tkui-table-cell>
                </tkui-table-row>
            </tkui-table-header>
            <tkui-table-body>
                <template v-for="(item, index) in result">
                    <tkui-table-row class="message border middle" v-for="(city, key) in item.community" :key="key">
                        <tkui-table-cell class="left name">{{city.community_name}}</tkui-table-cell>
                        <tkui-table-cell>{{city.lease}}</tkui-table-cell>
                        <tkui-table-cell>{{city.sold}}</tkui-table-cell>
                        <tkui-table-cell>{{city.list_days}}</tkui-table-cell>
                        <tkui-table-cell>{{city.ratio}}%</tkui-table-cell>
                    </tkui-table-row>
                </template>
            </tkui-table-body>
        </tkui-table>
        <loadding ref = 'loadding'></loadding>
    </tk-container>
</template>

<script>
    import {tkAjax} from 'vue-tk'
    import loadding from '~/components/loading'
    export default {
        data () {
            return {
              //初始化房型
              houseType: 'D.',
              //loading的显示
              show: false,
              //状态栏配置项
              statusBar: {
                show: true
              }
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
      //异步请求初始化数据
      asyncData (context) {
        return tkAjax.post('/api/stats/rentratio/city', {}, {
          params: context.query
        }).then(res => {
          return {
            result: res.data.data,
            oldQuery: context.query
          }
        })
      },
      methods: {
        //更改房型,并请求数据
        changeHouseType (val) {
          this.houseType = val
          this.show = true
          tkAjax.post('/api/stats/rentratio/city', {}, {
            params: {
              'municipality': this.oldQuery.municipality,
              house_type: val
            }
          }).then(res => {
            this.result = res.data.data
            this.show = false
          })
        }
      },
      components: {
        loadding
      },
      head () {
        return {
          title: this.$t('navigation.reportCommunity')
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import 'assets/scss/_variables.scss';
    .container{
        width:100%;
        .tab-title::-webkit-scrollbar {
            display: none;
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
        .small-title{
            width:100%;
            height:50px;
            font-size: $subhead-font-size;
            font-weight: 500;
            padding-left:10px;
            background-color: #f5f5f5;
            line-height: 50px;
        }
        .table-box {
            width: 100%;
            height: calc(100vh - 138px);
            overflow: auto;
            .name {
                width: 100px;
            }
        }
    }
</style>