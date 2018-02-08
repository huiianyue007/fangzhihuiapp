<template>
  <tk-cover :show="loading" color="rgba(0,0,0,0)" :hideOnClick="false">
    <tk-flex middle center column class="loading-page">
      <div class="box" style="position: relative;width: 42px;height: 42px">
        <tk-loading type="moon" color="white" size="40px" backgroundColor="transparent"></tk-loading>
      </div>
      <div class="font">{{$t('index.loading')}}....</div>
    </tk-flex>
  </tk-cover>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  mounted () {
    this.$on('show', this.start)
    this.$on('hidden', this.finish)
  },
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.loading-page {
  width: 100px;
  height: 100px;
  position: fixed;
  z-index: 999;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  background: rgba(0,0,0,0.5);
  border-radius: 5px;
  .font {
    color: #fff;
    font-size: 16px;
    padding-top: 11px;
  }
}

</style>
