<template>
  <a :href="href" @click="handler" class="tk-link"><slot></slot></a>
</template>
<script>
export default {
  name: 'tk-link',
  computed: {
    href () {
      return ''
      if (this.back && !this.to) {
        return 'javascript:void(0)'
      } else {
        return this.$router.resolve(this.to).href
      }
    }
  },
  methods: {
    handler (e) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      if (this.back) {
        this.tkBack(this.to)
      } else if (this.to) {
        this.replace ? this.tkReplace(this.to) : this.tkPush(this.to)
      }
      return false
    }
  },
  props: {
    to: [String, Object],
    back: Boolean,
    replace: Boolean
  }
}
</script>
