<template>
  <tk-container class="box">
    <section class="container">
      <div class="error1">
        <tkui-header center>{{this.$t("errorPage.errorPage")}}</tkui-header>
        <div class="content">
          <tk-icon class="icon" type="custom">{{errorInfo.icon}}</tk-icon>
          <div class="title1">
            {{errorInfo.title}}
          </div>
          <div class="title2">
            {{errorInfo.title2}}
          </div>
          <tkui-button class="primary border button" @click.native = 'update'>
            {{errorInfo.button}}
          </tkui-button>
        </div>
      </div>
    </section>
  </tk-container>
</template>
<script>
  import myHeader from '~/components/header'
  export default {
    //异步请求数据
    asyncData (context) {
      return {
        query: context.query
      }
    },
    computed: {
      //判断状态码
      errorInfo () {
        if (this.query.statusCode === 900 || this.query.statusCode === 910 || this.query.statusCode === 0) {
          return {
            icon: 'fail_img',
            title: this.query.message,
            title2: `${this.$t('errorPage.network')}: ${this.query.statusCode}`,
            button: this.query.statusCode === 910 ? '重新登录' : this.$t('errorPage.reload')
          }
        } else {
          return {
            icon: '404_img',
            title: this.$t('errorPage.notFind'),
            title2: this.$t('errorPage.Error404'),
            button: this.$t('errorPage.Backhome')
          }
        }
      }
    },
    components: {
      myHeader
    },
    methods: {
      update () {
        if (this.query.statusCode === 404) {
          this.tkReplace('/')
        } else {
          this.tkReplace('/login')
        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @media (min-width: 768px) {
    .box {
      transform: translate3d(0, 0, 0);
      width: 375px;
      height: 667px;
      overflow: auto;
      margin: 0 auto;
    }
  }

  .error1 {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      background: #F4F4F4;
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 200px;
        height: 153px;
        margin-top: 101px;
      }
      .title1 {
        padding-top: 14px;
        color: #666;
        font-size: 20px;
      }
      .title2 {
        padding-top: 9px;
        color: #999;
        font-size: 14px;
      }
      .button {
        margin-top: 85px;
      }
    }
  }
</style>
