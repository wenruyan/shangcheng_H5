<template>
  <div class="commodity-page">
    <div class="commodity-nav">
      <button type="button" class="commodity-nav-back" @click="GO(-1)"><i class="yd-back-icon"/></button>
      <h3>{{title}}</h3>
      <button type="button" class="commodity-nav-cart" @click="PUSH('/shopping-cart?showTabbar=false')">
        <i class="yd-icon-shopcart-outline">
          <span class="commodity-nav-cart-badge" v-if="cartCount > 0">{{cartCount}}</span>
        </i>
      </button>
    </div>
    <div class="commodity-toolbar">
      <sort-condition :value="sort" @input="sortChange"/>
      <div class="commodity-toolbar-layout">
        <button type="button" @click="layout = 'list'" class="commodity-toolbar-list" :class="{'commodity-is-selected': layout == 'list'}"></button>
        <button type="button" @click="layout = 'card'" class="commodity-toolbar-card" :class="{'commodity-is-selected': layout == 'card'}"></button>
      </div>
    </div>
    <mescroll-vue class="commodity-list-container commodity-scroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <commodity-list :formatter="formatterCommodityList" :layout="layout" :list="page.list" @jump="jump" id="commodity-page-list"/>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import CommodityList from '../components/CommodityList.vue';
import SortCondition from '../components/SortCondition.vue';

import { mapState } from 'vuex';

export default {
  name: 'commodity',
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: true,
        callback(mescroll) {
          setTimeout(() => {
            mescroll.resetUpScroll();
          }, 1000);
        }
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.loadMore,
        auto: false,
        page: {
          num: 0,
          size: 12
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "commodity-page-list", // 父布局的id (1.3.5版本支持传入dom元素)
          icon: "", // 图标,默认null,支持网络图
          tip: "没找到相关商品，换换筛选条件再试试" // 提示
        }
      },

      layout: 'list',
      sort: "10",
      page: {
        total: -1,
        list: []
      },
      moduleId: null,
      title: ''
    }
  },
  computed: {
    ...mapState(['cartCount'])
  },
  methods: {
    formatterCommodityList(item) {
      return {
        productId: item.id,
        productTitle: item.productTitle,
        price: item.marketPrice,
        url: item.url
      }
    },
    jump(item) {
      this.PUSH(`/commodity/detail?id=${item.productId}`)
    },
    sortChange(val) {
      this.sort = val;
      this.mescroll.resetUpScroll();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    loadMore(page, mescroll) {
      this.loading = true;
      this.fetchData(page).then(data => {
        const records = Array.isArray(data.records) ? data.records : [];
        const { current, total, size } = data;

        this.page.list = (page.num == 1 ? [] : this.page.list).concat(records);
        this.page.total = total;

        mescroll.endSuccess(records.length, current >= total / size);
      }).catch(err => {
        console.log("err", err);
        mescroll.endErr();
      })
    },
    fetchData(params) {
      const path = '/Focus-BladeX-BootX/modulemanagment/moduleProductList';
      const query = {
        moduleId: this.moduleId,
        size: params.size,
        sortType: this.sort
      }
      return this.$http.get(path, query).then(res => {
        return res.data || {};
      })
    }
  },
  activated() {
    const moduleId = this.$route.query.id;
    if (moduleId !== this.moduleId) {
      this.moduleId = this.$route.query.id;
      this.title = this.$route.query.title;
      this.mescroll && this.mescroll.resetUpScroll();
    }
  },
  components: {
    [CommodityList.name]: CommodityList,
    [SortCondition.name]: SortCondition,
    MescrollVue
  }
}
</script>

<style lang="scss">
.commodity-scroll{
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.commodity-page{
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

.commodity-nav{
  height: 0.84rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid #F5F5F5;
  padding: 0 0.6rem 0 0.3rem;

  h3{
    font-size: 0.32rem;
    font-weight: 400;
    margin: 0;
    text-align: center;
    flex: 1;
    height: 0.84rem;
    line-height: 0.84rem;
  }

  button{
    height: 0.84rem;
    width: 0.84rem;
    border: none;
    outline: none;
    background-color: transparent;
  }
}

.commodity-nav-back{
  text-align: left;
  color: #666;

  i:before{
    margin-top: 0;
    font-size: 0.36rem;
  }
}

.commodity-nav-cart{
  text-align: right;

  i{
    color: #999;
    font-size: 0.44rem;
    position: relative;
  }
}

.commodity-nav-cart-badge{
  background-color: #FF2626;
  font-size: 0.18rem;
  border-radius: 0.12rem;
  line-height: 0.26rem;
  padding: 0 0.08rem;
  color: #fff;

  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(50%);
}

.commodity-toolbar{
  height: 0.81rem;
  padding: 0 0.2rem;
  border-bottom: 1px solid #F5F5F5;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;

  position: relative;

  .sort-condition-group{
    position: static;
  }

  .sort-condition-panel{
    width: 100%;
  }
}

.commodity-list-container{
  flex: 1;
  background-color: #F5F5F5;
}

.commodity-toolbar-card,
.commodity-toolbar-list{
  width: 0.8rem;
  height: 0.8rem;

  border: none;
  outline: none;
  background-color: transparent;

  background-size: 0.36rem 0.36rem;
  background-position: center center;
  background-repeat: no-repeat;
}

.commodity-toolbar-list{
  background-image: url('../assets/img/icon-list_inactive@3x.png');

  &.commodity-is-selected{
    background-image: url('../assets/img/icon-list_active@3x.png');
  }
}

.commodity-toolbar-card{
  background-image: url('../assets/img/icon-grid_inactive@3x.png');

  &.commodity-is-selected{
    background-image: url('../assets/img/icon-grid_active@3x.png');
  }
}
</style>
