<template>
  <div class="page index-page" id="index-page">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="search search-white" :class="{'fixed': searchBarFixed}" @click="PUSH('/search')">
        <div>
          <i class="fa fa-search"></i>
          <span>{{searchPlaceholder}}</span>
        </div>
      </div>
      <div class="search" id="search" @click="PUSH('/search')">
        <div>
          <i class="fa fa-search"></i>
          <span>{{searchPlaceholder}}</span>
        </div>
      </div>
      <div class="banner">
        <div class="banner-slider">
          <yd-slider autoplay="3000">
            <yd-slider-item v-for="(item,index) in bannerList" :key="index">
              <img class="slider-pic" :src="decodeURL(item.url)" @click="toThirdPath(item.externalLinks)"/>
            </yd-slider-item>
          </yd-slider>
        </div>
      </div>
      <div class="function-area" v-if="icons.length > 0">
        <div
          class="item f-l flex flex-dir-top flex-cross-center"
          v-for="(icon, index) in icons"
          :key="index" @click="toThirdPath(icon.externalLinks)"
        >
          <img :src="icon.icon" alt />
          <p>{{icon.name}}</p>
        </div>
      </div>
      <template v-for="(item, index) in moduleData">
        <commodity-choice :key="index" :list-data="item.productList" v-if="item.moduleType == 30" :item-data="item" ></commodity-choice>
        <commodity-hot :key="index" :list-data="item.productList" v-if="item.moduleType == 20" :item-data="item"></commodity-hot>
      </template>
      <commodity-recommend :list="commodityData"></commodity-recommend>
    </mescroll-vue>
  </div>
</template>

<script>
import CommodityChoice from "@/components/commodity-choice";
import CommodityHot from "@/components/commodity-hot";
import CommodityRecommend from "@/components/CommodityRecommend";
import MescrollVue from 'mescroll.js/mescroll.vue'
import { mapState } from 'vuex'
export default {
  name: "index",
  components: {
    CommodityChoice,
    CommodityHot,
    CommodityRecommend,
    MescrollVue
  },
  data() {
    return {
      searchBarFixed: false,
      bannerList: [],
      icons: [],
      moduleData: [],
      commodityData: [],
      mescroll: "",
      mescrollDown: {
        use: true,
        callback: this.downCallback
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback,
        auto: false,
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 20 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 到底了 --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "index-page", // 父布局的id (1.3.5版本支持传入dom元素)
          icon: "", // 图标,默认null,支持网络图
          tip: "没找到数据" // 提示
        },
        onScroll: this.handleScroll
      }
    };
  },
  async created() {
    await this.$store.dispatch('getRuntimeEnv')
    await this.$store.dispatch('getOpenid')
    await this.$store.dispatch('getUserInfo')
  },
  mounted() {
    // setTimeout(() => {
    //   this.$store.commit('increaseCartCount', 3)
    // }, 3000)
    // this.getBanner()
    // this.getKingkang()
    // this.getPublicParam()
    // this.getModule()
  },
  destroyed() {

  },
  computed: {
    ...mapState({
      runtimeEnv: state => state.runtimeEnv,
      openid: state => state.openid,
      searchPlaceholder: state => state.searchPlaceholder
    })
  },
  beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
    // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
      vm.$store.dispatch('getUserInfo')
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
    })
  },
  beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
  // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
    next()
  },
  methods: {
    handleScroll(mescroll, y, isUp) {
      let ele = document.querySelector("#search");
      let offsetHeight = ele.offsetHeight
      let scrollTop = y
      if (scrollTop > offsetHeight) {
        this.searchBarFixed = true
      } else {
        this.searchBarFixed = false
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.$http
        .get("/Focus-BladeX-BootX/productlist/preProductList", {
          current: page.num,
          size: page.size
        })
        .then(res => {
          let arr = [];
          arr = res.data.records;
          if (page.num == 1) this.commodityData = [];
          this.commodityData = this.commodityData.concat(arr);
          mescroll.endSuccess(arr.length, this.commodityData.length < res.data.total);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    downCallback(mescroll) {
      this.$store.dispatch('getUserInfo')
      this.getBanner()
      this.getKingkang()
      this.getPublicParam()
      this.getModule()
      setTimeout(() => {
        mescroll.resetUpScroll();
      }, 500)
      // setTimeout(() => {
      //   mescroll.resetUpScroll();
      // }, 1000);
    },
    getKingkang () {
      this.$http
        .get("/Focus-BladeX-BootX/modulemanagment/KeyAreaList")
        .then(res => {
          console.log(res)
          this.icons = res.data
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getPublicParam () {
      this.$http
        .get("/Focus-BladeX-BootX/hotsearch/publicPara")
        .then(res => {
          console.log(res)
          this.$store.commit('updateSearchPlaceholder', res.data.searchValue.join('，'))
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getBanner () {
      this.$http
        .get("/Focus-BladeX-BootX/modulemanagment/listBanner")
        .then(res => {
          console.log(res)
          this.bannerList = res.data[10]
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getModule () {
      this.$http
        .get("/Focus-BladeX-BootX/modulemanagment/activeProductList")
        .then(res => {
          console.log(res)
          this.moduleData = res.data
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="scss">
.index-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
  .yd-slider-pagination {
    .yd-slider-pagination-item {
      background-color: #fff;
      opacity: 0.7;
    }
    .yd-slider-pagination-item-active {
      background-color: #fff !important;
      opacity: 1;
    }
  }
  .search {
    width: 100%;
    padding: 0.2rem 0;
    background: #0682f7;
    div {
      width: 6.9rem;
      height: 0.6rem;
      line-height: 0.6rem;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 0.6rem;
      color: #c8c8c8;
      padding: 0 0.3rem;
      i {
        font-size: 0.3rem;
        margin-right: 0.3rem;
      }
    }
  }
  .search-white {
    background: #ffffff;
    position: fixed;
    top: -100%;
    z-index: 9;
    transition: top 0.4s;
    div {
      box-sizing: border-box;
      border: 1px solid #dddddd;
    }
    &.fixed {
      top: 0;
    }
  }
  .banner-slider {
    width: 100%;
    height: 3.15rem;
    background: #1b87f8;
    background: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(100%, #0682f7),
      color-stop(0, #0eccf0)
    );
    background: linear-gradient( 0deg, #0eccf0, #0682f7 );
    position: relative;
    &::before {
      content: "";
      width: 100%;
      height: 0.8rem;
      background-color: #ffffff;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .yd-slider-item {
      padding-bottom: 0.2rem;
    }
    .yd-slider-pagination {
      bottom: 0.3rem;
    }
    .slider-pic {
      width: 6.9rem;
      height: 2.8rem;
      margin: 0 auto;
      border-radius: 0.1rem;
      box-shadow: 0 0 10px #666;
      background-color: #ffffff;
    }
  }
  .function-area {
    background-color: #ffffff;
    padding: 0.1rem 0.26rem 0;
    overflow: hidden;
    .item {
      width: 1.38rem;
      overflow: hidden;
      img {
        display: block;
        width: 1.04rem;
        height: 1.04rem;
        border-radius: 2rem;
      }
      p {
        font-size: 0.24rem;
        color: #666666;
        margin-top: 0.12rem;
        margin-bottom: 0.32rem;
        height: 0.26rem;
        overflow: hidden;
      }
    }
  }
}
</style>
