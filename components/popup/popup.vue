<template>
  <tk-cover transition :show = 'show' :hideOnClick = 'hideOnClick' :color = 'color' @change = 'hidden'>
      <tk-flex class="con_con" column>
        <tk-flex middle column class="message">
          <div class="title">{{title}}</div>
          <div class="desc" v-if = 'messageType === "html"' v-html = 'message'></div>
          <div class="desc" v-else >{{message}}</div>
        </tk-flex>
        <tk-flex middle average class = 'footer'>
          <div class="button cancel cursor" @click = 'cancel' v-if = 'alert'>{{cancelText}}</div>
          <div class="button submit active cursor" @click = 'submit'>{{submitText}}</div>
        </tk-flex>
      </tk-flex>
  </tk-cover>
</template>
<script>
  export default {
    props: {
      color: {
        Type: String,
        default: 'rgba(0, 0, 0, .4)'
      },
      alert: {
        default: true,
        type: Boolean
      },
      disableClick: Boolean,
      show: Boolean,
      message: String,
      messageType: String,
      title: String,
      hideOnClick: Boolean,
      cancelText: {
        Type: String,
        default: '取消'
      },
      submitText: {
        Type: String,
        default: '确定'
      }
    },
    data () {
      return {
        active: true
      }
    },
    methods: {
      hidden () {
        if (!this.hideOnClick) return
        this.show = false
      },
      submit () {
        this.active = true
        this.$emit('submit')
        if (this.disableClick) return false
        this.show = false
      },
      cancel () {
        this.active = false
        this.$emit('cancel')
        if (this.disableClick) return false
        this.show = false
      }
    }
  }
</script>
<style scoped lang = 'scss'>
    .con_con{
      background-color:#fff;
      width:290px;
      min-height:140px;
      border-radius: 4px;
      postion:relative;
      .message{
        flex:1;
        margin-top:15px;
        width:100%;
        text-align:center;
        .title {
          font-size: 18px;
          font-weight: bold;
          line-height: 1.11;
          text-align: center;
          color: #333;
        }
        .desc{
          font-size: 16px;
          width:210px;
          line-height: 1.64;
          text-align: center;
          color: #8f8f8f;
          margin:10px auto;
        }
      }
      .footer{
        postion:absolute;
        bottom:0;
        left:0;
        text-align:center;
        width:100%;
        border-top: 1px solid #f5f5f5;
        .button{
          line-height:47px;
          color: #666;
          &.active{
            color: #298998;
          }
          &.submit{
            border-left: 1px solid #f5f5f5;
          }
        }
      }
    }
</style>