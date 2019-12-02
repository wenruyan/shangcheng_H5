<template>
  <div class="sort-condition">
    <div class="sort-condition-group">
      <div class="sort-condition-text" :class="{'sort-condition-is-selected': isGroupSelected}" @click="show = !show">
        <span>{{text}}</span>
        <img src="../assets/img/icon-down_arrow@3x.png"/>
      </div>
      <ul class="sort-condition-panel" v-if="show">
        <li :class="{'sort-condition-is-selected': value == o.value}" v-for="o in groups" :key="o.value" @click="choose(o)">{{o.text}}</li>
      </ul>
    </div>
    <div class="sort-condition-text" :class="{'sort-condition-is-selected': value == sortBySale.value}" @click="choose(sortBySale)">
      <span>{{sortBySale.text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sort-condition',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  computed: {
    text() {
      const option = this.groups.find(o => o.value == this.value);
      return option ? option.text : '综合排序'
    },
    isGroupSelected() {
      return this.groups.some(o => o.value == this.value);
    }
  },
  data() {
    const sortBySale = {
      text: "销量",
      value: "50",
      selected: false,
      lonely: true
    }

    const groups = [
      {
        text: '最新上架',
        value: '20',
        selected: false
      },
      {
        text: '综合排序',
        value: '10',
        selected: true
      },
      {
        text: '价格最低',
        value: '30',
        selected: false
      },
      {
        text: '价格最高',
        value: '40',
        selected: false
      }
    ];

    return {
      groups,
      sortBySale,
      show: false
    }
  },
  methods: {
    choose(o) {
      this.$emit('input', o.value);
      this.show = false;
    },
    handler(e) {
      const target = e.target;
      if (!this.$el.contains(target)) this.show = false;
    }
  },
  activated() {
    this.show = false;
  },
  mounted() {
    document.body.addEventListener('click', this.handler, true)
  },
  destroyed() {
    document.body.removeEventListener('click', this.handler)
  }
}
</script>

<style lang="scss">
.sort-condition{
  display: flex;
  flex-flow: row nowrap;
}

.sort-condition-group{
  position: relative;
}

.sort-condition-panel{
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  width: 1.8rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .25);
  z-index: 1;

  li{
    display: block;
    height: 0.65rem;
    line-height: 0.65rem;
    padding-left: 0.3rem;
    color: #333;

    &.sort-condition-is-selected{
      color: #068DF9;
    }
  }
}

.sort-condition-text{
  position: relative;
  font-size: 0.26rem;
  color: #666;
  line-height: 0.36rem;
  padding: 0.22rem 0.6rem 0.22rem 0.2rem;

  img{
    position: absolute;
    right: 0.2rem;
    top: 0.36rem;
    width: 0.2rem;
  }

  &.sort-condition-is-selected{
    color: #333;
    font-weight: 700;
  }
}
</style>
