<template>
  <div class="main-search">
    <!--<ul>-->
      <!--<li class="item" v-for="(item,index) in history" @click="link(item)" :key="index">{{item}}</li>-->
    <!--</ul>-->
    <tkui-list class="small">
      <tkui-list-item class="border" v-for="(item, key) in history" @click.native="link(item)" :key = 'key'>
        <!--<li class="item" v-for="item in history" @click="link(item)">{{item}}</li>-->
        {{item}}
      </tkui-list-item>
    </tkui-list>
    <div class="clear">
      <button @click="clear1">
        <h3>{{$t('Search.ClearSearch')}}</h3>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        history: []
      }
    },
    mounted () {
      this.history = this.$store.state.mainsearchhistory
    },
    methods: {
      clear1 () {
        this.$store.commit('CLEARSEARCH_HISTORY')
      },
      link (item) {
        this.tkPush(this.path('/search/' + item))
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../assets/scss/main.scss';
  .main-search {
    ul {
      .item {
        width: 100%;
        height: 50px;
        background-color: $white;
        line-height: 50px;
        padding-left: 12px;
        font-size: 16px;
        color: #000;
        ~ .item {
          margin-top: 1px;
        }
      }
      /*padding-bottom: 50px;*/
    }

    .clear {
      position: relative;
      /*<!--margin-top: -50px;-->*/
      width: 100%;
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
      button {
        display: inline-block;
        font-size: 14px;
        margin-top: 20px;
        color: #999;
      }
    }
  }
</style>
