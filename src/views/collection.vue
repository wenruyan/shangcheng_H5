<template>
  <div class="collection-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="list list-wrap" id="list-wrap">
          <ul>
            <li class="list-item " v-for="(item,index) in commodityData " :key="index" data-type="0" v-show="!item.hide">
              <div class="list-box" @touchstart.capture="touchStart" :data-index="item.goodsId" @touchend.capture="touchEnd" @click="toDetail(item)">
                <img class="list-img" :src="item.pic.url">
                <div class="list-content">
                    <p class="title isEffective" v-if="item.product.status == 20">{{item.product.itemTitle}}</p>
                    <p class="title isInvalid" v-else>{{item.product.itemTitle}}</p>
                    <div class="textPosition">
                      <div class="bottom-info flex flex-main-justify flex-cross-bottom">
                        <div class="price collectionPrice"  v-if="item.product.status == 20">
                          <div class="spec">{{item.sku.name}}</div>
                          <div>
                            <span class="primary_soccer m-r-5">{{item.sku.marketPrice}}</span>
                            <img v-if="item.sku.marketPrice" class="small" src="../assets/img/price-soccer.png">
                          </div>
                          <div>
                            <span class="sale_soccer m-r-5">{{item.sku.closePrice}}</span>
                            <img class="small" src="../assets/img/price-soccer.png">
                          </div>
                        </div>
                        <p class="invalid" v-else>失效</p>
                      </div>
                    </div>
                </div>
              </div>
              <div class="delete" @click="deleteSection(item,index)" :data-index="index">删除</div>
            </li>
          </ul>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "collection",
  components: {
    MescrollVue
  },
  data() {
    return {
      isFirstEnter: false, // 是否第一次进入，默认false
      scrollTop: "",
      startX: 0,
      endX: 0,
      id: "",
      code: "sadhajkdhkasjdaks",
      commodityData: [],
      mescrollDown: {
        use: true,
        callback: this.downCallback,
        offset: 40
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback,
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 没有数据了 --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "list-wrap", // 父布局的id (1.3.5版本支持传入dom元素)
          // icon: "../assets/img/no-commodity-list.png", // 图标,默认null,支持网络图
          tip: "暂无记录" // 提示
        }
      }
    };
  },
  created() {
    this.isFirstEnter = true;
  },
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if (from.name == "commodity-detail") {
      console.log(to.meta.isBack, "kkkkkk");
      to.meta.isBack = true;
      to.meta.keepAlive = true;
      // 判断是从哪个路由过来的，
      // 如果是详情页面过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
    }
    next();
    next(vm => {
      console.log(vm.scrollTop, "lllll");
      document.querySelector(".mescroll").scrollTop = vm.scrollTop;
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "commodity-detail") {
      this.scrollTop = document.querySelector(".mescroll").scrollTop;
      console.log(this.scrollTop, "pppp");
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
      // this.loading = true;
      this.commodityData = [];
      // this.upCallback(this.mescrollUp.page, this.mescroll);
      this.mescroll.resetUpScroll();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },
  methods: {
    // 滑动开始
    touchStart(e) {
      // 记录初始位置
      this.startX = e.touches[0].clientX;
    },
    // 滑动结束
    touchEnd(e) {
      // 当前滑动的父级元素
      let parentElement = e.currentTarget.parentElement;
      // 记录结束位置
      this.endX = e.changedTouches[0].clientX;
      // 左滑
      if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      // 右滑
      if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
        this.restSlide();
        parentElement.dataset.type = 0;
      }
      this.startX = 0;
      this.endX = 0;
    },
    // 判断当前是否有滑块处于滑动状态
    checkSlide() {
      let listItems = document.querySelectorAll(".list-item");
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type == 1) {
          return true;
        }
      }
      return false;
    },
    // 复位滑动状态
    restSlide() {
      let listItems = document.querySelectorAll(".list-item");
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0;
      }
    },
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      let param = {
        current: page.num,
        size: page.size
      };
      this.$http
        .get("/Focus-BladeX-BootX/productcollect/page", param)
        .then(res => {
          let arr = res.data.records;
          setTimeout(() => {
            if (page.num == 1) this.commodityData = [];
            this.commodityData = this.commodityData.concat(arr);
            console.log("commodityData", this.commodityData[0])
            mescroll.endSuccess(arr.length);
          }, 1000);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    downCallback(mescroll) {
      console.log(mescroll);
      mescroll.resetUpScroll();
    },
    toDetail(item) {
      console.log(item.id);
      if (item.product.status == "20") {
        this.PUSH({
          path: "/commodity/detail",
          query: {
            id: item.goodsId,
            skuId: item.skuId
          }
        });
      } else {
        this.$dialog.toast({
          mes: "该商品已失效",
          timeout: 1500,
          callback: () => {}
        });
      }
    },
    deleteSection(item, index) {
      console.log(item.productList)
      let param = {
        productList: item.productList
      };
      this.$http
        .post("/Focus-BladeX-BootX/productcollect/remove", param)
        .then(res => {
          console.log(res);
          if (res.success == true) {
            setTimeout(() => {
              this.loading = false;
              this.$dialog.toast({
                mes: "删除收藏成功",
                timeout: 300,
                callback: () => {
                  this.restSlide();
                }
              });
            }, 300);
          }
          let mm = {
            ...item
          }
          mm.hide = true
          this.commodityData.splice(index, 1, mm)
          console.log(this.mescrollUp.page, 'iiiiiiiii')
        })
        .catch(err => {
          console.log("err1111", err);
        });
    }
  }
};
</script>

<style lang="scss">
.collection-page {
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #ffffff;
    ul {
      overflow: hidden;
    }
    p.title.isEffective {
      font-size: .26rem;
    }
    p.title.isInvalid {
      font-size: 0.3rem;
      color: #999;
    }
    p.invalid {
      font-size: 0.22rem;
      width: 0.65rem;
      height: 0.27rem;
      color: #fff;
      background: #c8c8c8;
    }
    a.mint-cell-swipe-button {
      line-height: 90px;
    }
  }
}
.page-title {
  text-align: center;
  font-size: 17px;
  padding: 10px 15px;
  position: relative;
}
.page-title:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #ccc;
  color: #ccc;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.list-item {
  position: relative;
  // padding: 0.4rem 0.4rem 0.2rem;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  border-bottom: 1px solid #eee;
}
.list-item:last-child{
  border: none
}
.list-item[data-type="0"] {
  transform: translate3d(0, 0, 0);
}
.list-item[data-type="1"] {
  transform: translate3d(-2rem, 0, 0);
}
.list-box {
  height: 2.24rem;
  overflow: hidden;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  background: #fff;
  display: flex;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  justify-content: flex-end;
}
.list-item .list-img {
  display: block;
  width: 1.8rem;
  height: 1.8rem;
  background-color: #eeeeee;
}
.list-item .list-content {
  padding: 0 0 0.1rem 0.2rem;
  margin-top: -.5rem;
  .spec{
    height:.45rem;
    font-size:.22rem;
    line-height:.45rem;
    color:rgba(153,153,153,1);
  }
  .sale_soccer {
    font-size: 0.3rem;
    color: #ff2b44;
    font-weight: bold;
  }
  .primary_soccer {
    font-size: 0.2rem;;
    color:rgba(153,153,153,1);
    text-decoration: line-through;
  }
  img{
    width: .2rem;
    height: .2rem;
  }
}
.list-item .title {
  text-align: justify;
  width: 4.9rem;
  font-size: .26rem;
  font-weight: bold;
  line-height: .36rem;
  color: rgba(51,51,51,1);
  margin-bottom: .06rem;
}
.list-item .tips {
  display: block;
  overflow: hidden;
  font-size: 12px;
  color: #999;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-item .time {
  display: block;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0.1rem;
  color: #666;
}
.list-item .delete {
  width: 1.44rem;
  height: 2.24rem;
  background: #ff4949;
  font-size: 17px;
  color: #fff;
  text-align: center;
  line-height: 2.24rem;
  position: absolute;
  top: 0;
  right: -2rem;
}
.collectionPrice {
  height: 0.36rem;
  position: relative;
  img {
    width: 0.24rem;
    height: 0.24rem;
    margin-right: 0.06rem;
  }
  .sale_soccer {
    font-size: 0.3rem;
    color: #ff2b44;
    font-weight: bold;
    &:last-child {
      font-size: 0.36rem;
      transform: scale(0.5);
      display: inline-block;
      // transform-origin: bottom;
      margin-left: -0.15rem;
      // position: relative;
      // top: -0.05rem;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
.person {
  font-size: 0.22rem;
  color: #999999;
  height: 0.36rem;
  line-height: 0.36rem;
}
.m-r-5{
  margin-right: 5px;
}
</style>
