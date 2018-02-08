<template>
  <tk-container class="container-wrap" :statusBar="statusBar">
    <tk-flex class="main-search" column>
      <!--头部-->
      <tkui-header class="main-top" color = '#999'>
        <tkui-button slot="left-menu" class="cursor icon small" @click.native = 'tkBack'>
          <tk-icon class="back icon"  type="custom">return</tk-icon>
        </tkui-button>
        <!--搜索框-->
        <tk-flex middle class="text-search fill">
          <tk-icon type="custom" class="small icon">search</tk-icon>
          <input type="text" class="input fill text-hidden" v-model="svalue" :placeholder="$t('index.searchMessage')" v-focus>
        </tk-flex>
        <!--搜索按钮-->
        <tkui-button class = "small primary raised marginhide no-inherit" slot = 'right-menu' @click.native="searchall">
          {{$t('Search.Search')}}
        </tkui-button>
      </tkui-header>
      <div class="show fill" v-show="showHistory">
        <tk-flex middle class="history">
          <span>{{$t('Search.history')}}</span>
        </tk-flex>
        <div class="bottom">
          <searchhistory class="content"></searchhistory>
        </div>
      </div>
      <tk-flex center middle class="hidden fill" v-show="!showHistory">
        <div class="content">
          <tk-icon type="custom" class="icon">Nocontent</tk-icon>
          <p class="caption text-center">{{$t('Search.noSearch')}}</p>
        </div>
      </tk-flex>
    </tk-flex>
  </tk-container>
</template>

<script>
  import searchhistory from '~/components/searchhistory'
  export default {
    data () {
      return {
        svalue: '',
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    components: {
      searchhistory
    },
    methods: {
      searchall () {
        if (!this.svalue) {
          return
        }
        if (this.$store.state.mainsearchhistory.indexOf(this.svalue) < 0) {
          this.$store.commit('PUSHSEARCH_HISTORY', this.svalue)
        }
        if (this.svalue) {
          this.tkPush(`/search/${this.svalue}`)
        }
      }
    },
    computed: {
      showHistory () {
        if (this.$store.state.mainsearchhistory.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    head () {
      return {
        title: this.$t('navigation.search')
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'assets/scss/_variables.scss';
  .main-search {
    background-color: #f4f4f4;
    height:100%;
    .text-search {
      height:34px;
      padding-left:1em;
      margin-right:1em;
      border-radius: $button-border-radius;
      background:#f4f4f4;
      .input {
        color:#333 !important;
        font-size: 14px;
      }
    }
    .show {
      .history {
        height: 44px;
        background-color: #f4f4f4;
        padding-left: 11px;
        span {
          font-size: 14px;
          color: #999;
        }
      }
      .bottom {
        cursor: pointer;
        background-color: #f4f4f4;
      }
    }
    .hidden {
      background-color: #f4f4f4;
      display: flex;
      justify-content: center;
      .content {
        .icon {
          width: 130px;
          height: 106px;
        }
      }
    }
  }
</style>
