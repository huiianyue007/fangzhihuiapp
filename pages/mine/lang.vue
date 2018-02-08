<template>
  <tk-container class="container container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t('user.switchLanguage')}}</span>
      </tk-flex>
    </tkui-header>
    <tkui-list class="small">
      <!--切换英文-->
      <tkui-list-item class = 'border' @click.native = 'translate("en")'>
        <div slot = 'left'>English</div>
        <tk-icon class="icon" slot = 'right' type = 'custom'>{{locale === 'en' ? 'selection_box' : 'selection_box_no'}}</tk-icon>
      </tkui-list-item>
      <!--切换中文-->
      <tkui-list-item class = 'border' @click.native = 'translate("zh")'>
        <div slot = 'left'>中文</div>
        <tk-icon class="icon"  slot = 'right' type = 'custom'>{{locale === 'zh' ? 'selection_box' : 'selection_box_no'}}</tk-icon>
      </tkui-list-item>
    </tkui-list>
  </tk-container>
</template>
<script>
  export default {
    data () {
      return {
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    computed: {
      //语言参数
      locale () {
        return this.$store.getters.lang
      }
    },
    methods: {
      //更改语言参数
      translate (opt) {
        if (opt === 'zh') {
          this.$tkAjaxGlobal.data.lang = 'zh'
        } else if (opt === 'en') {
          this.$tkAjaxGlobal.data.lang = 'en'
        }
        this.$store.commit('setLocaleForce', opt)
        if (this.$store.state.userId) {
          this.$tkAjax.post('/api/user/profile/update', {
            'lang': this.$store.getters.lang === 'zh' ? 'zh_CN' : 'en_US'
          }).then(() => {})
        }
      }
    },
    head () {
      return {
        title: this.$t('navigation.lang')
      }
    }
  }
</script>
<style scoped lang = 'scss'>
  .container{
    background: #f5f5f5;
    .list{
      font-size:20px;
      color: #666;
      padding: 0 15px;
      background: #fff;
      line-height: 50px;
      margin-bottom:1px;
      .icon{
          width:28px;
          height:28px;
      }
    }
  }
</style>