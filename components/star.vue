<template>
  <tk-flex middle class = 'star'>
      <div class="icon" v-for = '(item, i) in ar' :key = 'i' v-if = '!flag || i!== index + 1'>
        <tk-icon type = 'custom' :style = 'iconStyle' :class = "{'opacity': i > index - 1}">{{item}}</tk-icon>
        <tk-icon v-for = '(item, key) in ar' type = 'custom' :style = 'iconStyle' :key = 'key' :class = '{"active": flag && key ===(index + 1)}' v-if = 'flag && key ===(index + 1) && key=== i + 1'>{{item}}</tk-icon>
      </div>
  </tk-flex>
</template>
<script>
    export default {
      computed: {
        index () {
          return Math.floor(this.size)
        },
        flag () {
          return this.size > this.index
        },
        ar () {
          let index = this.index
          let ar = []
          for (let i = 0; i < index; i++) {
            ar.push('follow')
          }
          if (this.flag) {
            ar[index] = 'follow'
            ar[++index] = 'follow_half'
          }
          if (this.maxSize && this.maxSize > this.size) {
            for (let j = 0; j < this.maxSize - index; j++) {
              ar.push('follow')
            }
          }
          return ar
        }
      },
      props: ['size', 'iconStyle', 'maxSize']
    }
</script>
<style scoped lang = 'scss'>
  .star{
    .icon{
      position:relative;
      overflow:hidden;
      .active{
        position:absolute;
        bottom:0;
        left:0;
      }
      .opacity{
        opacity: .4;
      }
    }
  }
</style>
