<template>
  <tk-container class="container container-wrap" :statusBar="statusBar">
    <!--头部-->
    <tkui-header center>
      <tkui-button class="small icon" slot = 'left-menu' @click.native = 'tkBack()'>
        <tk-icon type="custom">return</tk-icon>
      </tkui-button>
      <tk-flex middle center>
        <img class="headerImage" src="~/assets/img/headerLogo.png" alt="">
        <span>{{$t('user.Email')}}</span>
      </tk-flex>
    </tkui-header>
    <!--输入新邮箱-->
    <div class="container-padding">
      <tk-flex left middle class="layer">
        <div class="fill input">
          <input type="text" :placeholder="$t('user.newEmail')" v-model="newEmail">
        </div>
      </tk-flex>
    </div>
    <!--更改邮箱按钮-->
    <div class="gutter">
      <tkui-button class="block primary raised" @click.native="changeEmail">{{$t('user.submitEmail')}}</tkui-button>
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
        //新邮箱
        newEmail: '',
        //状态栏配置项
        statusBar: {
          show: true
        }
      }
    },
    components: {
      loadding
    },
    watch: {
      loadingBool (val) {
        if (val) {
          this.$refs.loadding.$emit('show')
        } else {
          this.$refs.loadding.$emit('hidden')
        }
      },
    },
    methods: {
      //发送更新邮箱请求
      changeEmail () {
        this.loadingBool = true
        this.$tkAjax.post('/api/user/profile/update', {
          'email': this.newEmail
        }).then((res) => {
          this.loadingBool = false
          if (res.data.status) {
            this.$store.commit('setEmail', this.newEmail)
            this.toast({message: res.data.data.message, position: 'bottom'})
          }
          this.tkBack()
        }).catch(() => {
          this.loadingBool = false
        })
      }
    }
  }
</script>

<style scoped lang = 'scss'>
  .container {
    background: #fff;
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