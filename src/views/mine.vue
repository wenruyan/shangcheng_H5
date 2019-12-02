<template>
  <div class="page mine-page">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="info">
        <div class="login-now" v-if="!isLogin" @click="PUSH({path: '/login-sms'})">
          <div class="btn">登录</div>
          <div class="tips">登录后查看福利积分信息</div>
        </div>
        <div class="info-all" v-else>
          <div class="info-top flex flex-cross-top">
            <img class="head-pic" :src="userInfo.headImgUrl" alt="" v-if="userInfo.headImgUrl">
            <img class="head-pic" src="../assets/img/headPic-default.png" alt="" v-else>
            <div class="user-info">
              <p class="name">{{userInfo.name || '商城用户'}}</p>
              <p class="phone">{{hidePhone(userInfo.phone)}}</p>
            </div>
          </div>
          <div class="info-card" v-if="!userInfo.companyNo">
            <div class="money-wrap">
              <div class="label">我的福利金</div>
              <div class="money">{{userInfo.pointsBalance}}</div>
            </div>
            <div class="detail" @click="PUSH('/soccer-detail')">查看明细</div>
          </div>
          <div class="info-card-company" v-else>
            <div class="top flex flex-cross-center">
              <div class="logo">
                <img :src="userInfo.companyUrl" alt="">
              </div>
              <div class="name">{{userInfo.companyName}}</div>
            </div>
            <div class="money-wrap">
              <div class="label">我的福利金</div>
              <div class="money">{{userInfo.pointsBalance}}</div>
            </div>
            <div class="detail" @click="PUSH('/soccer-detail')">查看明细</div>
          </div>
          <!-- <div class="info-card">

          </div> -->
        </div>
      </div>
      <div class="order-menu flex flex-cross-center">
        <div class="item t-c" @click="loginShip">
          <img src="../assets/img/mine-order-wallet.png" alt="">
          <p>待付款</p>
          <yd-badge class="dot" bgcolor="#FF3E3E" color="#FFF" v-if="userInfo.waitPayOrderCount > 0">{{userInfo.waitPayOrderCount}}</yd-badge>
        </div>
        <div class="item t-c" @click="loginUnship">
          <img src="../assets/img/mine-order-delivery.png" alt="">
          <p>待收货</p>
          <yd-badge class="dot" bgcolor="#FF3E3E" color="#FFF" v-if="userInfo.waitReceiveOrderCount > 0">{{userInfo.waitReceiveOrderCount}}</yd-badge>
        </div>
        <div class="item t-c" @click="loginAll">
          <img src="../assets/img/mine-order-all.png" alt="">
          <p>全部</p>
        </div>
      </div>
      <div class="menu">
        <yd-cell-group>
          <yd-cell-item arrow type="link" href="" @click.native="loginCollect">
            <!-- <img slot="icon" src="../assets/img/mine-menu-fav.png"> -->
            <span slot="left">我的收藏</span>
          </yd-cell-item>
          <yd-cell-item arrow type="link" href="" @click.native="loginAdress">
            <!-- <img slot="icon" src="../assets/img/mine-menu-address.png"> -->
            <span slot="left">收货地址</span>
          </yd-cell-item>
          <yd-cell-item arrow type="link" href="" @click.native="contactUs">
            <!-- <img slot="icon" src="../assets/img/mine-menu-contact.png"> -->
            <span slot="left">联系我们</span>
          </yd-cell-item>
      </yd-cell-group>
      </div>
      <commodity-recommend :list="commodityData"></commodity-recommend>
    </mescroll-vue>
  </div>
</template>

<script>
import CommodityRecommend from "@/components/CommodityRecommend";
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  components: {
    CommodityRecommend,
    MescrollVue
  },
  data() {
    return {
      loginForm: "",
      searchBarFixed: false,
      hotCommodityData: "",
      menuHover: [false, false, false],
      // showNickName: false,
      showImg: false,
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
    // await this.$store.dispatch('getUserInfo')
  },
  mounted() {

  },
  methods: {
    loginCollect() {
      this.PUSH({
        path: "/collection"
      });
    },
    loginAdress() {
      this.PUSH({
        path: "/address-list"
      });
    },
    loginAll() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/order-list",
          query: {
            type: 1
          }
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    loginUnship() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/order-list",
          query: {
            type: 3
          }
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    loginShip() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/order-list",
          query: {
            type: 2
          }
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    contactUs() {
      this.PUSH({
        path: "/contact-us"
      });
      // this.$dialog.confirm({
      //   title: "提示",
      //   mes:
      //     '请发送邮件至<br><a href="mailto:info@focus_base.com">info@focus_base.com</a>',
      //   opts: [
      //     {
      //       txt: "我知道了",
      //       color: true,
      //       callback: () => {}
      //     }
      //   ]
      // });
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
      setTimeout(() => {
        mescroll.resetUpScroll();
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.mine-page {
  width: 100%;
  height: 100%;
  // height: calc(100vh - 0.82rem);
  overflow-y: auto;
  background-color: #F5F5F5;
  position: relative;
  -webkit-overflow-scrolling: touch;
  .info {
    .login-now {
      width: 100%;
      height: 3.4rem;
      background-image: url("../assets/img/mine-info-bg.png");
      background-size: 100%;
      background-repeat: no-repeat;
      text-align: center;
      overflow: hidden;
      .btn {
        width: 1.92rem;
        height: 0.68rem;
        line-height: 0.68rem;
        border-radius: 0.5rem;
        color: #1B93F9;
        font-size: 0.3rem;
        font-weight: bold;
        background-color: #fff;
        margin: 0.94rem auto 0.3rem;
      }
      .tips {
        width: 2.8rem;
        height: 0.56rem;
        line-height: 0.56rem;
        border-radius: 0.1rem;
        background-color: #1066AE;
        font-size: 0.2rem;
        color: #FFFFFF;
        margin: 0 auto;
        padding: 0 0.3rem;
        box-sizing: content-box;
      }
    }
    .info-all {
      height: 4.3rem;
      width: 100%;
      position: relative;
      background: #ffffff;
      .info-top {
        box-sizing: border-box;
        padding: 0.3rem 0 0 0.4rem;
        width: 100%;
        height: 3.4rem;
        background-image: url("../assets/img/mine-info-bg.png");
        background-size: 100%;
        background-repeat: no-repeat;
        .head-pic {
          width: 1rem;
          height: 1rem;
          border-radius: 1rem;
          margin-right: 0.2rem;
        }
        .user-info {
          height: 1rem;
          box-sizing: border-box;
          padding: 0.12rem 0 0.1rem;
          .name {
            font-size: 0.3rem;
            color: #ffffff;
            font-weight: bold;
            height: 0.42rem;
            line-height: 0.42rem;
          }
          .phone {
            font-size: 0.24rem;
            color: #ffffff;
            opacity: 0.8;
            height: 0.34rem;
            line-height: 0.34rem;
          }
        }
      }
      .info-card-company {
        width: 6.7rem;
        height: 2.46rem;
        position: absolute;
        bottom: 0.1rem;
        left: 0.4rem;
        background-image: url("../assets/img/info-card-bg-2.png");
        background-size: 100%;
        background-repeat: no-repeat;
        .top {
          height: 0.6rem;
          position: absolute;
          top: 0.3rem;
          .logo {
            height: 0.6rem;
            width: 1rem;
            background: #ffffff;
            position: relative;
            border-radius: 0 0.6rem 0.6rem 0;
            margin-right: 0.1rem;
            img {
              width: 0.48rem;
              height: 0.48rem;
              border-radius: 0.48rem;
              position: absolute;
              right: 0.05rem;
              top: 0.06rem;
            }
          }
          .name {
            font-size: 0.32rem;
            color: #ffffff;
          }
        }
        .money-wrap {
          position: absolute;
          left: 0.42rem;
          bottom: 0.4rem;
          .label {
            font-size: 0.24rem;
            color: #808998;
          }
          .money {
            font-size: 0.46rem;
            color: #ffffff;
            font-weight: bold;
          }
        }
        .detail {
          font-size: 0.26rem;
          color: #808998;
          position: absolute;
          bottom: 0.42rem;
          right: 0.42rem;
        }
      }
      .info-card {
        width: 6.7rem;
        height: 2.46rem;
        position: absolute;
        bottom: 0.1rem;
        left: 0.4rem;
        background-image: url("../assets/img/info-card-bg.png");
        background-size: 100%;
        background-repeat: no-repeat;
        .money-wrap {
          position: absolute;
          top: 0.6rem;
          left: 0.65rem;
          .label {
            color: #9da7b6;
            font-size: 0.26rem;
          }
          .money {
            color: #ffffff;
            font-size: 0.6rem;
            font-weight: bold;
          }
        }
        .detail {
          position: absolute;
          top: 0.6rem;
          right: 0.65rem;
          color: #9da7b6;
          font-size: 0.26rem;
          padding-right: 0.26rem;
          background-image: url('../assets/img/right_arrow.png');
          background-size: auto 80%;
          background-repeat: no-repeat;
          background-position: right center;
        }
      }
    }
  }
  .order-menu {
    width: 100%;
    height: 1.9rem;
    margin: 0 auto;
    background-color: #ffffff;
    position: relative;
    &::after {
      content: '';
      height: 0.1rem;
      width: 100%;
      background-color: #f5f5f5;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .item {
      width: 33.33%;
      position: relative;
      .dot {
        position: absolute;
        left: 50%;
        top: 0;
        margin-left: 0.1rem;
        color: #ffffff;
        font-size: 0.18rem;
        padding: 2px 6px;
      }
      img {
        width: 0.85rem;
        height: 0.8rem;
        display: block;
        margin: 0 auto;
      }
      p {
        font-size: 0.22rem;
        color: #4c4c4c;
        margin-top: 0.1rem;
      }
    }
  }
  .module-title {
    font-size: 0.4rem;
    font-weight: bold;
    margin: 1.08rem 0 0.28rem 0.4rem;
  }
  .menu {
    width: 100%;
    box-sizing: border-box;
    // padding: 0 0.16rem;
    .yd-cell {
      & > a {
        position: relative;
        &::after {
          content: "";
          width: calc(100% - 0.8rem);
          margin-left: 0.4rem;
          height: 1px;
          background-color: #e6e6e6;
          box-sizing: border-box;
          transform: scaleY(0.5);
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
      &:after {
        height: 0;
      }
      .yd-cell-right {
        min-height: 1.1rem;
      }
    }
    .yd-cell-icon img {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
}
.yd-confirm-bd a {
  color: #4189ff;
}
</style>
