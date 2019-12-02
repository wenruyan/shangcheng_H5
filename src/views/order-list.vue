<template>
  <div class="my-order-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="goMine">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <yd-tab v-model="tabIndex" bg-color="#FFFFFF" :callback="getNum">
        <yd-tab-panel :label="item.val" v-for="(item, ind) in statusArr" :key="ind">
          <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUpObj[ind]" @init="mescrollInitObj[ind]">
            <div class="list-wrap" :class="'mescroll'+ind" :id="'list-wrap'+ind">
              <order-ones :tabIndex="tabIndex" :chooseIndex="chooseIndex" :data="listDataObj[ind]"></order-ones>
            </div>
          </mescroll-vue>
        </yd-tab-panel>
      </yd-tab>
    </div>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import OrderOnes from "../components/order-ones";
export default {
  name: "order-list",
  components: {
    MescrollVue,
    OrderOnes
  },
  data() {
    return {
      isFirstEnter: false, // 是否第一次进入，默认false
      tabIndex: 0,
      chooseIndex: "",
      orStatus: "",
      listDataObj: {},
      scrollTopObj: {},
      scrollTop: "",
      mescrollUpObj: {},
      mescrollInitObj: {},
      upCallbackObj: {},
      mescrollObj: {},
      mescrollDown: {
        use: true,
        callback: this.downCallback,
        offset: 40
      },
      orderStatus: {
        "10": "已下单",
        "20": "已付款",
        "30": "已发货",
        "40": "已到货",
        "50": "交易完成",
        "60": "交易关闭",
        "70": "退款中",
        "80": "已退款"
      },
      statusArr: [
        {
          val: "全部",
          status: ""
        },
        {
          val: "待付款",
          status: "10"
        },
        {
          val: "待收货",
          status: "20"
        },
        {
          val: "已完成",
          status: "30"
        },
        {
          val: "已取消",
          status: "40"
        }
      ]
    };
  },
  mounted() {
    this.tabIndex = this.$route.query.type - 1;
    this.getNum();
  },
  created() {
    this.isFirstEnter = true;
    // 初始配置
    for (let i = 0; i < this.statusArr.length; i++) {
      this.$set(this.listDataObj, i, []);
      this.$set(this.scrollTopObj, i, []);
      this.$set(this.upCallbackObj, i, (page, mescroll) => {
        this.getData(
          page,
          mescroll,
          (res, mescroll) => {
            let arr = [];
            arr = res.data.records.concat();
            arr.forEach(item => {
              item.status = this.orderStatus[item.orderStatus];
            });
            console.log(i, "iii");
            console.log(arr, "arr");
            setTimeout(() => {
              if (page.num == 1) this.listDataObj[i] = [];
              this.$set(this.listDataObj, i, this.listDataObj[i].concat(arr));
              // this.listDataObj[i] = this.listDataObj[i].concat(arr);
              // console.log(this.listDataObj, "listdata");
              // console.log(this.listDataObj[0], "listdata");
              mescroll.endSuccess(arr.length, true);
              console.log("sssssss");
            }, 1000);
          },
          this.statusArr[i].status
        );
      });
      this.$set(this.mescrollUpObj, i, {
        // 上拉加载的配置.
        callback: this.upCallbackObj[i],
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 没有数据了 --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "list-wrap" + i, // 父布局的id (1.3.5版本支持传入dom元素)
          // icon: "../assets/img/no-commodity-list.png", // 图标,默认null,支持网络图
          tip: "暂无记录" // 提示
        }
      });
      this.mescrollInitObj[i] = mescroll => {
        this.mescrollObj[i] = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      };
    }
  },
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if (from.name == "order-detail") {
      // console.log(this.tabIndex = this.$route.query.type - 1 || this.$route.query.tabIndex || this.$route.query.chooseIndex)
      to.meta.isBack = true;
      to.meta.keepAlive = true;
      // 判断是从哪个路由过来的，
      // 如果是详情页面过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }
    if (from.name == "order-tracking") {
      to.meta.isBack = true;
      to.meta.keepAlive = true;
      // 判断是从哪个路由过来的，
      // 如果是详情页面过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }
    // next();
    next(vm => {
      console.log(vm.scrollTop, "vm.scrollTop");
      // document.querySelectorAll(".mescroll")[vm.chooseIndex].scrollTop = vm.scrollTop;
      // document.querySelectorAll(".mescroll")[0].scrollTop = vm.scrollTop;
      // document.querySelectorAll(".mescroll")[1].scrollTop = vm.scrollTop;
      // document.querySelectorAll(".mescroll")[2].scrollTop = vm.scrollTop;
      // document.querySelectorAll(".mescroll")[3].scrollTop = vm.scrollTop;
      let arr = document.querySelectorAll(".mescroll");
      arr.forEach((item, index) => {
        item.scrollTop = vm.scrollTop;
      });
      if (vm.$route.query.update == 1) {
        console.log('详情页进行了操作')
        vm.tabIndex = vm.$route.query.tabIndex || vm.$route.query.chooseIndex;
        // if (vm.$route.query.update == 1) {
        vm.$set(vm.listDataObj, vm.tabIndex, []);
        vm.mescrollObj[vm.tabIndex].resetUpScroll();
        // }
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "order-detail") {
      console.log("order-detail");
      let arr = document.querySelectorAll(".mescroll");
      if (this.chooseIndex == 0 || this.tabIndex == 0) {
        this.scrollTop = arr[0].scrollTop;
      } else if (this.chooseIndex == 1 || this.tabIndex == 1) {
        this.scrollTop = arr[1].scrollTop;
      } else if (this.chooseIndex == 2 || this.tabIndex == 2) {
        this.scrollTop = arr[2].scrollTop;
      } else if (this.chooseIndex == 3 || this.tabIndex == 3) {
        this.scrollTop = arr[3].scrollTop;
      } else {
        this.scrollTop = arr[4].scrollTop;
      }
      console.log(this.scrollTop, "toto");
      if (!from.meta.keepAlive) {
        to.meta.keepAlive = true;
      }
      next();
    }
    if (to.name == "order-tracking") {
      console.log("order-tracking");
      let arr = document.querySelectorAll(".mescroll");
      if (this.chooseIndex == 0 || this.tabIndex == 0) {
        this.scrollTop = arr[0].scrollTop;
      } else if (this.chooseIndex == 1 || this.tabIndex == 1) {
        this.scrollTop = arr[1].scrollTop;
      } else if (this.chooseIndex == 2 || this.tabIndex == 2) {
        this.scrollTop = arr[2].scrollTop;
      } else if (this.chooseIndex == 3 || this.tabIndex == 3) {
        this.scrollTop = arr[3].scrollTop;
      } else {
        this.scrollTop = arr[4].scrollTop;
      }
      console.log(this.scrollTop, "toto");
      if (!from.meta.keepAlive) {
        to.meta.keepAlive = true;
      }
      next();
    } else {
      from.meta.keepAlive = false;
      to.meta.keepAlive = false;
      next();
    }
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.tabIndex = this.$route.query.type - 1;
      for (let i = 0; i < this.statusArr.length; i++) {
        this.$set(this.listDataObj, i, []);
        this.mescrollObj[i].resetUpScroll();
      }
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },
  methods: {
    goMine() {
      this.REPLACE({
        path: "/mine"
      });
    },
    getNum(label, key) {
      this.chooseIndex = key;
      console.log(key, "pppppppppp");
      if (this.mescrollObj[key].resetUpScroll) {
        this.$set(this.listDataObj, key, []);
        this.mescrollObj[key].resetUpScroll();
      }
    },
    login() {
      this.changeStatusColor("ligth", "#ff26aa");
    },
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    toDetail(item) {
      this.PUSH({
        path: "/order-detail",
        query: {
          orderId: item.id
        }
      });
    },
    getData(page, mescroll, cb, orStatus) {
      console.log(orStatus, "orStatus");
      this.$http
        .get("/Focus-BladeX-BootX/orderinformation/page", {
          current: page.num,
          size: page.size,
          // orderTyp: this.orStatus,
          orderStatus: orStatus,
          productIsVirtual: "10"
          // userId: this.$store.state.userId = '111'
        })
        .then(res => {
          cb && cb(res, mescroll);
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="scss">
.my-order-page {
  position: absolute;
  top: 0;
  height: calc(100vh);
  background-color: #f5f5f5;
  .content {
    // height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    border-top: 1px solid #f5f5f5;
    .yd-tab {
      height: 100%;
      .yd-tab-nav-item {
        font-size: 0.3rem;
        font-weight: bold;
        height: 0.7rem;
      }
      .yd-tab-nav .yd-tab-active:before {
        width: 50%;
        margin-left: -25%;
      }
      li.yd-tab-nav-item.yd-tab-active {
        color: #068df9 !important;
      }
      .yd-tab-nav:after {
        height: 0;
      }
      .yd-tab-panel {
        height: calc(100vh - 1.54rem);
        background-color: #f5f5f5;
        padding-top: 0.1rem;
        .yd-tab-panel-item {
          height: 100%;
          .item {
            height: 2.6rem;
            background-size: cover;
            padding: 0.4rem 0;
            border-bottom: 1px solid #f4f4f4;
            position: relative;
            .outImg {
              height: 2rem;
              width: 2rem;
              overflow: hidden;
              img {
                width: 2rem;
                // height: 2rem;
                border-radius: 0.1rem;
                background-color: #f9f9f9;
              }
            }
            .text {
              width: 100%;
              margin: 0 0 0 0.24rem;
              height: 100%;
              .title {
                font-size: 0.26rem;
                line-height: 0.4rem;
                height: 0.8rem;
                overflow: hidden;
                font-weight: bold;
              }
              .status {
                width: 1.2rem;
                text-align: right;
                color: #4189ff;
                font-weight: bold;
                font-size: 0.28rem;
                line-height: 0.4rem;
                .suc {
                  color: #ff790d;
                }
              }
              .pay-info {
                text-align: right;
                width: 100%;
                font-size: 0.26rem;
                color: #999999;
                margin-top: 0.6rem;
                span {
                  font-size: 0.28rem;
                  color: #068df9;
                  font-weight: bold;
                  margin-left: 0.1rem;
                }
              }
            }
          }
          // .item:after {
          //   content: " ";
          //   position: absolute;
          //   left: 0.4rem;
          //   // bottom: 0.4rem;
          //   top: 0.1rem;
          //   right: 0.4rem;
          //   height: 1px;
          //   border-bottom: 1px solid #ccc;
          //   color: #ccc;
          //   -webkit-transform-origin: 0 100%;
          //   transform-origin: 0 100%;
          //   -webkit-transform: scaleY(0.5);
          //   transform: scaleY(0.5);
          //   z-index: 2;
          // }
        }
      }
    }
  }
}
</style>
