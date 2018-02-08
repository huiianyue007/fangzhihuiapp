<template>
   <tkui-header center>
       <tkui-button class = 'small icon' slot = 'left-menu' @click.native = 'tkBack()' v-show = 'back'>
           <tk-icon type = 'custom' class = 'icon' :style = '{ "color": color}'>return</tk-icon>
       </tkui-button>
       <div class="header_title"><slot></slot></div>
       <div slot = 'right-menu'>
           <slot name = 'button'></slot>
       </div>
   </tkui-header>
</template>
<!--</div>-->
<script>
  export default {
    props: {
      back: Boolean,
      color: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style scoped lang = 'scss'>
 .header_title{
     text-align:center;
 }
</style>