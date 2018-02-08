<template>
  <div class="box">
    <section class="container">
      <tk-status-bar></tk-status-bar>
      <div class="error">
        <tkui-header center>
          {{this.$t("errorPage.errorPage")}}
        </tkui-header>
        <div class="content">
          <tk-icon class="icon" type="custom">{{error.statusCode === 404 ? '404_img' : 'fail_img'}}</tk-icon>
          <div class="title1">
            {{msg}}
          </div>
          <div class="title2">
            {{$t('errorPage.network')}}：{{error.statusCode}}
          </div>
          <tkui-button class="border primary"  v-if="error.statusCode === 404" to="/">
            {{$t('errorPage.Backhome')}}
          </tkui-button>
          <tkui-button class="border primary"  v-else @click.native="update">
            {{$t('errorPage.reload')}}
          </tkui-button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: ['error'],
  computed: {
    msg: function () {
      let defaultMsg = this.error.statusCode === '404' ? this.$t('errorPage.notFind') : this.$t('errorPage.network')
      return this.error.message || defaultMsg
    }
  },
  methods: {
    update () {
      window.location.reload()
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
.box,.container{
  height: 100%;
}

.error {
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
      width: 137px;
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
    button {
      margin-top: 85px;
    }
  }
}

</style>
