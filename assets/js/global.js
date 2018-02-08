import messageBox from '~/components/popup/'
import { Toast } from 'mint-ui'
export default {
  computed: {
    accessToken () {
      if (this.$store) {
        return this.$store.getters.getAccess
      }
    },
    userId () {
      if (this.$store) {
        return this.$store.state.userId
      }
    },
    setting () {
      if (this.$store) {
        return this.$store.getters.getSetting
      }
    },
    locale () {
      if (this.$store) {
        return this.$store.getters.lang
      }
    }
  },
  methods: {
    //切换语言
    path (url) {
      return url
    },
    goBack () {
      this.tkBack()
    },
    getUserId () {
      return this.$store.dispatch('getUserId')
    },
    getUserInfo () {
      return this.$store.dispatch('getUserInfo')
    },
    //alert方法
    alert (opt) {
      return new Promise((resolve, reject) => {
        messageBox(opt).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    toast (opt) {
      Toast(opt)
    }
  }
}
