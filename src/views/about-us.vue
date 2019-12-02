<template>
  <div class="about-us-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <img src="../assets/img/aboutus-bg.png" alt="">
      <p class="version">版本号V0.8.2 </p>
      <p class="protocol" @click="PUSH({path: '/protocol'})">《用户使用条款和隐私说明》</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "sadhajkdhkasjdaks"
    };
  },
  created() {},
  computed: {},
  watch: {},
  methods: {
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    }
  }
};
</script>

<style lang="scss">
.about-us-page {
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #cddef8;
    text-align: center;
    p {
      font-size: 0.26rem;
      font-weight: 500;
      &.version {
        color: #3c495d;
      }
      &.protocol {
        color: #4189ff;
        margin-top: 0.39rem;
        margin-bottom: 0.45rem;
      }
    }
  }
}
</style>
