<template>
  <div class="category-page">
    <div class="category-search">
      <div class="category-search-inner" @click="toSearch">
        <i class="yd-icon-search" style="font-size: 0.36rem"/>
        <span>{{hotWord}}</span>
      </div>
    </div>
    <div class="category-main">
      <div class="category-tab category-scroll">
        <div
          v-for="(type, index) in types" :key="index"
          class="category-tab-item" :class="{'category-tab-selected': type == selectedType}"
          @click="choose(type)"
        >{{type.productCategoryName}}</div>
      </div>
      <div class="category-detail category-scroll" v-if="init">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <img class="category-banner" :src="banner" v-if="banner"/>
          <div class="category-filter">
            <sort-condition :value="sort" @input="sortChange"/>
          </div>
          <div id="category-commodity-list">
            <commodity-list :list="page.list" @jump="jump"/>
          </div>
        </mescroll-vue>
      </div>
    </div>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import CommodityList from '../components/CommodityList.vue';
import SortCondition from '../components/SortCondition.vue';

/**
 * 接口列表
 * 1. 广告图
 * 2. 搜索热词
 */
export default {
  name: 'category',
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: true,
        callback: mescroll => {
          this.page.list = []
          mescroll.resetUpScroll();
        }
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.loadMore,
        auto: false,
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 12 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5,
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "category-commodity-list", // 父布局的id (1.3.5版本支持传入dom元素)
          icon: "", // 图标,默认null,支持网络图
          tip: "没找到相关商品，换换筛选条件再试试" // 提示
        }
      },
      init: false,
      selectedType: null,
      sort: '10',
      page: {
        list: [],
        total: -1
      },
      types: [],
      hotWord: '',
      banner: ''
    }
  },
  computed: {
    selectedOption() {
      return this.sortBySale.selected ? this.sortBySale : this.sortGroups.find(o => o.selected)
    },
    isSelectedGroup() {
      return this.sortGroups.includes(this.selectedOption);
    }
  },
  beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
    // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
    })
  },
  beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
  // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
    next()
  },
  methods: {
    jump(item) {
      this.PUSH(`/commodity/detail?id=${item.productId}`)
    },
    toSearch() {
      this.PUSH('/search')
    },
    sortChange(val) {
      this.sort = val;
      this.mescroll.resetUpScroll();
    },
    choose(type) {
      const isChnage = this.selectedType != type;
      this.selectedType = type;
      isChnage && this.mescroll && this.mescroll.resetUpScroll();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    loadMore(page, mescroll) {
      this.loading = true;
      this.fetchData(page).then(res => {
        const records = Array.isArray(res.records) ? res.records : []
        this.page.list = (page.num == 1 ? [] : this.page.list).concat(records);
        mescroll.endSuccess(records.length, res.current < res.total / res.size);
      }).catch(err => {
        console.log("err", err);
        mescroll.endErr();
      })
    },
    fetchData(params) {
      const query = {
        categroyId: this.selectedType.id,
        sortType: this.sort,
        current: params.num,
        size: params.size || 12
      };
      const path = '/Focus-BladeX-BootX/productcategory/selectProductByCategory';

      return this.$http.get(path, query).then(res => {
        return res.data;
      })
    },
    fetchTypes() {
      const path = '/Focus-BladeX-BootX/productcategory/selectCategoryByMid';
      // TODO: 待确定值
      const query = {
        type: 10
        // type: 20
      };

      return this.$http.get(path, query).then(res => {
        return res.data;
      })
    },
    fetchBanner() {
      const path = '/Focus-BladeX-BootX/modulemanagment/listBanner';
      const query = { moduleType: 40 };
      return this.$http.get(path, query).then(res => {
        const item = res.data[20] || [];
        this.banner = (item[0] || {}).url;
      }).catch(e => console.log(e));
    },
    fetchHotSearch () {
      const path = '/Focus-BladeX-BootX/hotsearch/publicPara';
      const query = {}
      return this.$http.get(path, query).then(res => {
        this.hotWord = res.data.searchValue.join(',');
      }).catch(e => console.log(e));
    },
    async initialize() {
      try {
        const types = await this.fetchTypes();
        if (types.length <= 0) return;

        this.types = types.sort((a, b) => a.sortOrder - b.sortOrder);
        this.choose(types[0]);
        this.init = true;
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.fetchBanner()
    this.initialize();
    this.fetchHotSearch();
  },
  components: {
    MescrollVue,
    [CommodityList.name]: CommodityList,
    [SortCondition.name]: SortCondition
  }
}
</script>

<style lang="scss">
.category-page{
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  padding-bottom: 0.98rem;
}

.category-scroll{
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.category-search{
  padding: 0.2rem 0.28rem;
}

.category-search-inner{
  height: 0.6rem;
  border: 1px solid #E1E1E1;
  border-radius: 0.3rem;
  padding-left: 0.24rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: #CFCFCF;

  .yd-icon-search{
    font-size: 0.36rem;
    line-height: 1;
    margin-right: 0.24rem;
  }
}

.category-main{
  height: 0;
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
}

.category-tab{
  width: 1.8rem;
  background-color: #F5F5F5;
}

.category-tab-item{
  position: relative;
  height: 0.8rem;
  padding: 0.24rem 0 0 0.42rem;
  font-size: 0.24rem;
  color: #666666;
  border-bottom: 1px solid #fff;

  &.category-tab-selected{
    font-weight: 700;
    background-color: #fff;
    color: #068DF9;

    &::after{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0.04rem;
      background-color: #068DF9;
    }
  }
}

.category-detail{
  flex: 1;
  padding: 0 0.28rem 0 0.2rem;
}

.category-filter{
  height: 0.8rem;
  font-size: 0.26rem;
  position: relative;
  display: flex;
  border-bottom: 1px solid #F5F5F5;

  .sort-condition-group{
    position: static;
  }

  .sort-condition-panel{
    width: 100%;
  }
}

.category-banner{
  display: block;
  width: 5.22rem;
  height: 2rem;
}

#category-commodity-list{
  .commodity-list-item{
    padding: 0.2rem 0;

    & > img{
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .commodity-list-item-title{
    font-weight: 400;
    font-size: 0.24rem;
  }
}
</style>
