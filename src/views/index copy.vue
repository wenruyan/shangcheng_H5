<template>
  <div class="page index-page">
    <div class="index-content" v-if="!$store.state.hideTabbar">
      <yd-slider :loop="false">
        <yd-slider-item>
            <img src="../assets/img/guide_1.png">
            <yd-button type="hollow" class="jump" @click.native="hideGuide">跳过</yd-button>
        </yd-slider-item>
        <yd-slider-item>
            <img src="../assets/img/guide_2.png">
            <yd-button type="hollow" class="jump" @click.native="hideGuide">跳过</yd-button>
        </yd-slider-item>
        <yd-slider-item>
            <img src="../assets/img/guide_3.png">
            <yd-button type="hollow" class="hideGuide" @click.native="hideGuide">立即体验</yd-button>
        </yd-slider-item>
      </yd-slider>
    </div>
    <div class="index-content" v-else>
      <div class="banner">
        <div class="login-now" v-if="currentStatus" @click="PUSH({path: 'login-account'})">
          <div class="btn">立即登录</div>
          <div class="tips">立即登录查看账户余额</div>
        </div>
        <div class="info" v-else @click="PUSH({path: 'soccer-detail'})">
          <div class="btn">当前积分</div>
          <div class="soccer">{{ integralBalance }}</div>
        </div>
      </div>
      <div id="scroll-line">
        <div class="search" :class="{'isFiexd': searchBarFixed}" id="searchBar">
          <div @click="goSearch">
            <i class="fa fa-search"></i>
            <span>全球好礼积分换</span>
          </div>
        </div>
      </div>
      <div class="menu-wrap flex flex-main-justify" :class="{'menu-wrap-2': !$store.state.hasApp.wechat}">
        <div class="item" :class="{'hover': menuHover[0]}" @click="getHover(0)" v-if="$store.state.hasApp.wechat">
          <img src="../assets/img/index-menu-1.png" alt="">
          <p>积分兑换</p>
        </div>
        <div class="item" :class="{'hover': menuHover[1]}" @click="getHover(1)">
          <img src="../assets/img/index-menu-2.png" alt="">
          <p>{{ signText }}</p>
        </div>
        <div class="item" :class="{'hover': menuHover[2]}" @click="getHover(2)">
          <img src="../assets/img/index-menu-3.png" alt="">
          <p>全部商品</p>
        </div>
      </div>
      <div class="hot-title">热门商品</div>
      <div class="commodity">
        <CommodityList :listData='hotCommodityData'></CommodityList>
      </div>
      <div class="checking" v-if="checkingSuccess" @click="hideCheckingSuc">
        <img class="bg" src="../assets/img/checking-bg.png" alt="">
        <img class="pic" src="../assets/img/checking-success.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import CommodityList from "../components/commodity-list";
export default {
  name: "index",
  components: {
    CommodityList
  },
  data() {
    return {
      loginForm: "",
      searchBarFixed: false,
      hotCommodityData: [],
      menuHover: [false, false, false],
      isChecked: false,
      checkingSuccess: false,
      integralBalance: "",
      currentStatus: true,
      signText: "积分签到"
    };
  },
  created() {
    if (!localStorage.getItem("hideGuide")) {
      this.$store.commit("updateHideTabbar", false);
      this.changeStatusColor("dark", "#FFFFFF");
    } else {
      this.changeStatusColor("light", "#3b62ff");
    }
  },
  mounted() {
    this.customBackKey(() => {
      window.api.sendEvent({
        name: "closeApp",
        extra: {}
      });
    });
    console.log(this.$store.state.userId, "id     did");
    if (this.$store.state.userId) {
      this.currentStatus = false;
    }
    sessionStorage.setItem("searchVal", "");
    window.addEventListener("scroll", this.handleScroll);
    // if (this.$store.state.userId && this.$store.state.token) {
    this.$http
      .post("/focus.mallPageData", { userId: this.$store.state.userId })
      .then(res => {
        console.log("res", res);
        this.integralBalance = res.integralBalance + "";
        this.integralBalance = this.formatNum(this.integralBalance);
        this.$store.commit("updatePhone", res.phone || "");
        this.$store.commit("mallPageData", res);
        if (res.sign) {
          this.signText = "已签到";
        }
      })
      .catch(err => {
        console.log("err", err);
      });
    // }

    this.init();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    init() {
      this.getHotCommodity();
    },
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    },
    handleScroll() {
      let ele = document.querySelector("#scroll-line");
      if (ele.offsetTop) {
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        let offsetTop = ele.offsetTop;
        scrollTop > offsetTop
          ? (this.searchBarFixed = true)
          : (this.searchBarFixed = false);
      }
    },
    getHotCommodity() {
      let param = {};
      this.$http
        .post("/focus.getHotItems", param)
        .then(res => {
          console.log("res", res);
          this.hotCommodityData = res.data.rows;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    goSearch() {
      this.PUSH({ path: "/search" });
    },
    getHover(index) {
      // menu中图标的点击效果
      this.menuHover.splice(index, 1, true);
      this.$nextTick(() => {
        setTimeout(() => {
          this.menuHover.splice(index, 1, false);
        }, 100);
      });
      if (index == 0) {
        this.PUSH({
          path: "/soccer-exchange"
        });
      } else if (index == 1) {
        if (this.$store.state.userId) {
          if (this.$store.state.mallPageData.sign) {
            this.$dialog.toast({
              mes: "今日已签到",
              timeout: 1500
            });
          } else {
            this.$http
              .post("/focus.signIn", { userId: this.$store.state.userId })
              .then(res => {
                let obj = Object.assign({}, this.$store.state.mallPageData);
                obj.integralBalance += 5;
                obj.sign = 1;
                this.integralBalance = obj.integralBalance + "";
                this.integralBalance = this.formatNum(this.integralBalance);
                this.signText = "已签到";
                console.log(obj, "obj");
                this.$store.commit("mallPageData", obj);
                this.checkingSuccess = true;
                setTimeout(() => {
                  this.checkingSuccess = false;
                }, 3000);
              })
              .catch(err => {
                console.log("err", err);
              });
          }
        } else {
          this.$dialog.confirm({
            title: "提示",
            mes: "您还未登录，请先登录",
            opts: [
              {
                txt: "登录",
                color: true,
                callback: () => {
                  this.PUSH({ path: "/login-account" });
                }
              },
              {
                txt: "取消",
                color: false
              }
            ]
          });
        }
      } else if (index == 2) {
        // this.$store.state.showType = "";
        this.PUSH({ path: "/commodity" });
      }
    },
    hideCheckingSuc() {
      this.checkingSuccess = false;
    },
    // 隐藏引导页
    hideGuide() {
      this.changeStatusColor("light", "#3b62ff");
      localStorage.setItem("hideGuide", true);
      this.$store.commit("updateHideTabbar", true);
    }
  }
};
</script>

<style lang="scss">
.index-page {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .index-content {
    width: 100%;
    height: 100%;
    .yd-slider {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      .yd-slider-pagination {
        display: none;
      }
      .yd-slider-item {
        display: flex;
        flex-direction: column-reverse;
        position: relative;
        .jump {
          position: absolute;
          width: 1.11rem;
          height: 0.44rem;
          line-height: 0.44rem;
          background: rgba(242, 242, 251, 1);
          border-radius: 0.22rem;
          color: #89a1dd;
          font-size: 0.22rem;
          top: 0.55rem;
          right: 0.5rem;
        }
        .hideGuide {
          width: 2.8rem;
          height: 0.79rem;
          background: rgba(65, 137, 255, 1);
          border-radius: 0.4rem;
          color: #fff;
          font-size: 0.3rem;
          position: absolute;
          bottom: 1.05rem;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .banner {
      width: 100%;
      height: 4.03rem;
      background-color: #3b62ff;
      background-image: url("../assets/img/index-banner-bg.png");
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position-y: bottom;
      .btn {
        font-size: 0.56rem;
        padding: 0 0.6rem;
        background-color: #fbeb19;
        display: inline-block;
        border-radius: 2rem;
        color: #325af7;
        font-weight: bold;
        margin-left: 0.5rem;
        height: 1.2rem;
        line-height: 1.2rem;
        position: relative;
        transform: scale(0.5);
        transform-origin: left;
      }
      .login-now {
        padding-top: 1rem;
        .tips {
          font-size: 0.22rem;
          color: #fefefe;
          margin: -0.15rem 0 0 0.57rem;
        }
      }
      .info {
        padding-top: 1rem;
        .soccer {
          font-family: "DPCB";
          font-size: 1.1rem;
          color: #ffffff;
          margin: -0.4rem 0 0 0.5rem;
        }
      }
    }
    .search {
      width: 100%;
      padding-bottom: 0.12rem;
      transition: background-color 0.3s, top 0.5s ease 0.5s;
      top: -3rem;
      // background: #fff;
      & > div {
        width: 90%;
        position: relative;
        top: -0.5rem;
        margin: 0 auto 0;
        box-sizing: border-box;
        padding: 0.36rem 0.3rem;
        box-shadow: 0px 6px 13px 0px rgba(55, 93, 244, 0.06);
        border-radius: 1rem;
        background-color: #ffffff;
        transition: padding 0.2s;
        i {
          font-size: 0.26rem;
          color: #c9c9c9;
          margin-right: 0.3rem;
        }
        span {
          font-size: 0.28rem;
          color: #c9c9c9;
        }
      }
      &.isFiexd {
        background-color: #3b62ff;
        position: fixed;
        top: 0;
        z-index: 1;
        & > div {
          top: 0;
          // top: 10px;
          padding: 0.18rem 0.3rem;
          span {
            color: #999999;
          }
        }
      }
    }
    #scroll-line {
      width: 100%;
      height: 1rem;
    }
    .menu-wrap {
      width: 100%;
      box-sizing: border-box;
      padding: 0 0.87rem;
      margin-bottom: 0.5rem;
      &.menu-wrap-2 {
        padding: 0 1.87rem;
      }
      .item {
        width: 1.05rem;
        text-align: center;
        &.hover {
          img {
            opacity: 0.6;
          }
        }
        p {
          margin-top: 0.2rem;
          font-size: 0.26rem;
          color: #333333;
          white-space: nowrap;
          min-width: 1.03rem;
        }
      }
    }
    .hot-title {
      width: 100%;
      box-sizing: border-box;
      padding: 0 0.4rem;
      margin-bottom: 0.48rem;
      font-size: 0.38rem;
      color: #333333;
      font-weight: bold;
    }
    .commodity {
      width: 100%;
      padding-bottom: 0.98rem !important;
      min-height: 5rem;
      padding: 0 0.4rem;
      overflow: hidden;
    }
    .checking {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba($color: #000000, $alpha: 0.6);
      z-index: 101;
      img {
        width: 5.9rem;
        display: block;
        position: absolute;
        top: 2.15rem;
        left: 50%;
        margin-left: -2.95rem;
      }
      .bg {
        animation: myMove1 5s linear infinite;
        -webkit-animation: myMove1 5s linear infinite;
      }
      @keyframes myMove1 {
        0% {
          -webkit-transform: rotate(0deg);
        }
        50% {
          -webkit-transform: rotate(180deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }
      @-webkit-keyframes myMove1 {
        0% {
          -webkit-transform: rotate(0deg);
        }
        50% {
          -webkit-transform: rotate(180deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }
    }
  }
}
</style>
