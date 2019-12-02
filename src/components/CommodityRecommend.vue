<template>
  <div class="commodity-recommend">
    <slot name="header">
      <div class="commodity-recommend-header">
        <img src="../assets/img/guess_wht_you_like@3x.png"/>
      </div>
    </slot>
    <commodity-list
      layout="card" :list="list"
      @jump="jump" @success="$emit('success')"/>
  </div>
</template>

<script>
import CommodityList from './CommodityList.vue';

export default {
  name: 'commodity-recommend',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    [CommodityList.name]: CommodityList
  },
  methods: {
    jump(item) {
      this.PUSH(`/commodity/detail?id=${item.productId}`);
    }
  }
}
</script>

<style lang="scss">
.commodity-recommend-header{
  padding: 0.2rem 0;
  text-align: center;
  color: #068DF9;
  font-size: 0.34rem;
  line-height: 0.48rem;

  img{
    display: block;
    height: 0.48rem;
    margin: 0 auto;
  }
}
</style>
