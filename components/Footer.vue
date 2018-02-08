<template>
  <div class="other">
    <!--主页底部的四个按钮-->
    <tk-flex average middle class = 'footer'>
      <div :class="['list','cursor', {'active': url === item.url}]"
                 v-for="(item, key) in urlList" :key=key @click="push(item.url)">
        <tk-icon type='custom' class='icon'>{{url === item.url ? item.activeIcon : item.icon}}</tk-icon>
        <div class="li_title">{{$t('bottomBar.' + item.title)}}</div>
      </div>
    </tk-flex>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        urlList: [{
          url: '/',
          icon: 'home',
          activeIcon: 'home_selected',
          title: 'index'
        }, {
          url: '/home/follow',
          icon: 'attention1',
          activeIcon: 'attention_selecte',
          title: 'follow'
        }, {
          url: '/home/quotation',
          icon: 'quotes',
          activeIcon: 'quotes_selected',
          title: 'quotation'
        }, {
          url: '/home/user',
          icon: 'mine',
          activeIcon: 'mine_selected',
          title: 'user'
        }]
      }
    },
    computed: {
      url () {
        return this.$route.path
      }
    },
    methods: {
      push (opt) {
        this.tkPush(opt)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/scss/main';
  @media (max-width: 768px) {
    .other {
      transform: translate3d(0, 0, 0);
      width: 100%;
      height: 49px;
      flex: 0 0 49px;
    }
  }
  @media (min-width: 768px) {
    .other {
      transform: translate3d(0, 0, 0);
      width: 650px;
      height: 49px;
      flex: 0 0 49px;
      .footer {
        height: 49px;
        width: 100%;
        background-color: $white;
        box-shadow: 0 0 37.5px 0 rgba(169, 172, 189, 0.25);
        position:fixed;
        bottom:0;
        left:0;
        z-index:100;
        .list {
          text-align: center;
          font-size: 12px;
          .icon {
            width: 23px;
            height: 23px;
          }
          &.active {
            color: #298998;
          }
        }
      }
    }
  }
  @media (max-width: 1600px) {
    .footer {
      height: 49px;
      width: 100%;
      background-color: $white;
      box-shadow: 0 0 37.5px 0 rgba(169, 172, 189, 0.25);
      .list {
        text-align: center;
        font-size: 12px;
        .icon {
          width: 23px;
          height: 23px;
        }
        &.active {
          color: #298998;
        }
      }
    }
  }
</style>