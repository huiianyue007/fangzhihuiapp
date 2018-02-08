<template>
    <tk-container class="container container-wrap" :statusBar="statusBar">
        <!--头部-->
        <tkui-header center slot="header">
            <tkui-button slot="left-menu" class="small icon" @click.native="return1">
                <tk-icon>return</tk-icon>
            </tkui-button>
            <tk-flex middle center>
                <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
                <span>{{$t("index.analyze")}}</span>
            </tk-flex>
        </tkui-header>
        <!--主体部分-->
        <div class="box">
            <!--城市房产分析报告-->
            <tk-flex center middle class="small-title">
                <img src="../../assets/img/shape1.png" alt="">
                <span>{{$t('Report.city')}}</span>
                <img src="../../assets/img/shape2.png" alt="">
            </tk-flex>
            <!--两个图片-->
            <tk-flex average column>
                <tk-link to="/analyze/report-city">
                    <div class="report">
                        <tk-box ratio="16:9" class="poster">
                            <tk-flex center>
                                <span class="report">{{$t('index.analyzeReport')}}</span>
                            </tk-flex>
                        </tk-box>
                    </div>
                </tk-link>
                <div class="more">
                    <tk-box ratio="16:9" class="ratio-msg" v-show="$store.getters.lang === 'zh'"></tk-box>
                    <tk-box ratio="16:9" class="enratio-msg" v-show="$store.getters.lang === 'en'"></tk-box>
                </div>
            </tk-flex>
        </div>
    </tk-container>
</template>

<script>
    import TkLink from "../../components/tkLink"
    export default {
      data () {
        return {
          //状态栏的配置项
          statusBar: {
            show: true
          },
          zhImage: {
            'background-image': 'url("../../assets/img/More.png")'
          },
          enImage: {
            'background-image': 'url("../../assets/img/enMore.png")'
          }
        }
      },
      components: {
        TkLink
      },
      methods: {
        return1 () {
          this.tkBack()
        }
      },
      head () {
        return {
          title: this.$t('navigation.analyze')
        }
      }
    }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
    @import 'assets/scss/_variables.scss';
    .container{
        .small-title{
            width:100%;
            height: 50px;
            font-size: $caption-font-size;
            span{
                padding:0 10px;
            }
            img{
                width:73px;
            }
        }
        .report{
            margin-bottom: 10px;
            .poster {
                background-image: url("../../assets/img/Proportion-report.png");
                background-size: cover;
                .report {
                    font-size: 26px;
                    color: white;
                    padding-top: 50px;
                }
            }
        }
        .ratio-msg {
            background-image: url("../../assets/img/More.png");
            background-size: cover;
        }
        .enratio-msg {
            background-image: url("../../assets/img/enMore.png");
            background-size: cover;
        }
    }
    @media (min-width: 768px) {
        .report {
            font-size: 34px !important;
        }
    }
</style>