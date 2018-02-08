<template>
    <div class = 'box' :class = "{show: flag}">
        <tkui-header center v-if = 'flag' :style = 'style'>
          <tkui-button class="small icon" slot = "left-menu" @click.native = 'resize'><tk-icon type = 'custom'>return</tk-icon></tkui-button>
          地图详情
        </tkui-header>
        <div class = 'shadow' @click = 'fullScreen' v-if = '!flag'></div>
        <gmap-map :center="center" :zoom="13" :style = '{height: flag ? clientHeight : height}' :options = 'mapOption' ref="map">
            <gmap-marker :position="center" :icon = "{url: 'linshiimg/dingwei11.png', anchor}">
                <gmap-info-window v-if = 'content'>{{content}}</gmap-info-window>
            </gmap-marker>
        </gmap-map>
    </div>
</template>
<script>
  import sassVar from 'mk-sass-variables-loader?all!assets/scss/main.scss'
  export default {
    data () {
      return {
        flag: this.mapInit,
        height: '',
        style: ''
      }
    },
    computed: {
      mapOption () {
        return {
          disableDefaultUI: !this.flag,
          gestureHandling: this.flag ? 'greedy' : 'none',
          fullscreenControl: false,
          streetViewControl: false
        }
      },
      clientHeight () {
        let headerHeight = parseInt(sassVar['header-height'])
        return `${window.innerHeight - this.$tkStatusBar.height() - headerHeight}px`
      },
      anchor () {
        if (!this.$isServer && window.google) {
          return new google.maps.Point(50, 50)
        }
      }
    },
    mounted () {
      this.height = this.$el.offsetHeight + 'px'
      this.style = {
        marginTop: this.$tkStatusBar.height() + 'px'
      }
    },
    methods: {
      fullScreen () {
        if (this.disableClick) return false
        if (window.history && window.history.pushState) {
          window.history.pushState('forward', null)
        }
        this.$emit('fullScreen')
        this.flag = true
      },
      resize () {
        this.$emit('resize')
        this.flag = false
      }
    },
    watch: {
      flag (val) {
        this.$gmapDefaultResizeBus.$emit('resize')
        if (!val) {
          this.$refs.map.$mapObject.setCenter(this.center)
          window.removeEventListener('popstate', this.resize)
        } else {
          window.addEventListener('popstate', this.resize)
        }
      }
    },
    props: {
      content: String,
      mapInit: Boolean,
      disableClick: Boolean,
      center: {
        type: Object,
        default () {
          return {
            lat: -19.8934596,
            lng: -44.0586543
          }
        }
      }
    }
  }
</script>
<style scoped lang = 'scss'>
    .box{
        position:relative;
        &.show{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            bottom:0;
        }
    }
    .shadow{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        z-index:1;
    }
</style>