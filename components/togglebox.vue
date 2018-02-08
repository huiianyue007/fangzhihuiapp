<template>
    <div class="main-box">
        <!--房源详情的toogleBox-->
        <div class="header" @click="toggle">
            <span class="title">{{title}}</span>
            <tk-icon type="custom" class="icon">{{icon}}</tk-icon>
        </div>
        <transition name="slide-fade">
            <div v-show="isshow"  class="">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        isshow: this.show
      }
    },
    props: {
      title: {
        type: String
      },
      show: Boolean
    },
    mounted () {
      this.$on('show', this.showToggle)
    },
    methods: {
      toggle () {
        this.isshow = !this.isshow
      },
      showToggle () {
        this.isshow = true
      }
    },
    computed: {
      icon () {
        if (this.isshow) {
          return 'pull'
        } else {
          return 'dropdown'
        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import '../assets/scss/main.scss';
    .main-box {
    .slide-fade-enter-active {
        transition: all .4s ease;
    }
    .slide-fade-leave-active {
        transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for <2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
  .header {
    padding: 15px;
    background-color: #f5f5f5;
    overflow: hidden;
    .title {
        font-size: $title-font-size;
        float: left;
    }
    .icon {
        float: right;
        color: $black;
    }
  }
}
</style>