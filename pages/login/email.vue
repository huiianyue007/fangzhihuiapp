<template>
    <!--顶部组件myUser-->
  <my-user>
      <div class="container">
          <div class="desc">
              <p>{{$t('Register.enterInformation')}}</p>
          </div>
          <!--填写邮箱-->
          <tk-flex left middle class="layer">
              <tk-icon class = "icon" type = 'custom'>mailbox</tk-icon>
              <input type="text" v-model = 'email' :placeholder="$t('Register.enterEmail')">
          </tk-flex>
          <!--完成注册按钮-->
          <tkui-button class = 'block rounded button raised' :class = '[email ? "primary" : "disabled"]' @click.native = 'submit'>{{$route.query.from === 'register' ? '完成注册' : '立即登录'}}</tkui-button>
          <loadding ref = 'loadding'></loadding>
      </div>
  </my-user>
</template>
<script>
  import loadding from '~/components/loading'
  import myUser from '~/components/userPageHeader'
  export default {
    data () {
      return {
        //填写邮箱
        email: '',
        //loading
        show: false
      }
    },
    computed: {
      url () {
        return this.$store.getters.getPage
      },
      userId () {
        return this.$store.getters.userId
      }
    },
    watch: {
      show (val) {
        if (val) {
          this.$refs.loadding.$emit('show')
        } else {
          this.$refs.loadding.$emit('hidden')
        }
      }
    },
    components: {
      loadding,
      myUser
    },
    methods: {
      //提交邮箱
      submit () {
        this.show = true
        this.$tkAjax.post('/api/user/profile/update', {
          'user_id': this.userId,
          'email': this.email
        }).then(res => {
          this.show = false
          return new Promise((resolve, reject) => {
            if (res.data.status) {
              resolve()
            } else {
              reject(res.data.error.message)
            }
          })
        }).then(() => {
          return this.getUserId()
        }).then(() => {
          this.tkBack()
        }).catch(() => {})
      }
    },
    head () {
      return {
        title: this.$t('navigation.email')
      }
    }
  }
</script>
<style lang = 'scss' scoped>
  .container{
     overflow:hidden;
     padding:0 25px;
    .desc{
      font-size: 14px;
      line-height:2em;
      margin: 38px 0 32px;
      text-align: left;
      color: #333;
    }
      .layer {
          height: 50px;
          box-shadow: 0px 1px 0 0 #f5f5f5;
          .icon{
              width: 40px;
              height:30px;
          }
          input{
              color:#000;
              text-indent:1em;
              flex:1;
          }
      }
      .button {
          margin-top:25px;
      }
  }
</style>