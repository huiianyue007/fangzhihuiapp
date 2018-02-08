<template>
  <tk-container class="container container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center slot="header">
      <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t('user.changePass')}}</span>
      </tk-flex>
    </tkui-header>
    <!--输入新密码-->
    <div class="container-padding">
      <tk-flex left middle class="layer">
        <div class="fill input">
          <input type="text" :placeholder="$t('user.newPass')" v-model="newPass">
        </div>
      </tk-flex>
    </div>
    <!--更改密码按钮-->
    <div class="gutter">
      <tkui-button class="block primary raised" @click.native="changePass">{{$t('user.submit')}}</tkui-button>
    </div>
    <loadding ref = 'loadding'></loadding>
  </tk-container>
</template>
<script>
  import loadding from '~/components/loading'
  export default {
    data () {
      return {
        //loading
        loadingBool: false,
        //新密码
        newPass: '',
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    components: {
      loadding
    },
    computed: {
      //用户信息
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    watch: {
      loadingBool (val) {
        if (val) {
          this.$refs.loadding.$emit('show')
        } else {
          this.$refs.loadding.$emit('hidden')
        }
      }
    },
    methods: {
      //发送更改密码请求
      changePass () {
          this.loadingBool = true
          this.$tkAjax.post('/api/user/profile/changepassword', {
            'password': this.newPass
          }).then((res) => {
            if (res.data.status) {
              this.toast({message: res.data.data.message, position: 'bottom'})
              this.tkBack()
              this.loadingBool = false
            }
          }).catch(() => {
            this.loadingBool = false
          })
        }
      }
    }
</script>
<style scoped lang = 'scss'>
  .container {
    background:#fff;
    .layer {
      height: 60px;
      box-shadow: 0px 1px 0 0 #f5f5f5;
      color: #000;
      padding: 0 15px;
      .input {
        input{
          width:100%;
        }
      }
      input{
        text-indent:1em;
      }
    }
    .gutter {
      margin-top: 40px;
    }
  }
</style>