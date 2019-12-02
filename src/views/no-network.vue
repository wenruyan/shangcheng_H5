<template>
  <div class="no-network-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content pd-wrap">
      <p>网络丢失</p>
      <p>请检查您的网络设置</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      code: 'sadhajkdhkasjdaks'
    }
  },
  created () {
  },
  computed: {
  },
  watch: {

  },
  methods: {
    login () {
      this.changeStatusColor('ligth', '#ff76aa')
    }
  }
}
</script>

<style lang="scss">
.no-network-page {
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #FFFFFF;
    padding-top: 1.65rem;
    text-align: center;
    p {
      &:first-child {
        margin-top: 0.83rem;
        margin-bottom: 0.26rem;
        color: #444444;
        font-size: 0.3rem;
        font-weight: bold;
      }
      &:last-child {
        font-size: 0.26rem;
        color: #666666;
        font-weight: 500;
      }
    }

  }
}
</style>
