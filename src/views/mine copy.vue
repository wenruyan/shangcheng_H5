<template>
  <div class="page mine-page">
    <div class="banner">
      <div class="banner-top"></div>
      <div class="login-now flex flex-cross-center" v-if="!$store.state.userId" @click="PUSH({path: '/login-account'})">
        <img src="../assets/img/headPic-default.png" alt="">
        <div class="btn">登录赞积分<i class="fa fa-angle-right m-l-4"></i></div>
      </div>
      <div class="info flex flex-cross-center" v-else @click="PUSH({path: '/userInfo'})">
        <img v-if="showImg" :src="hotCommodityData.avatarUrl" alt="">
        <img  v-else src="../assets/img/headPic-default.png" alt="">
        <div>
          <div class="btn">{{hotCommodityData.nickName}}</div>
          <!-- <div v-else class="btn" >请设置昵称</div> -->
          <div class="soccer">积分：{{hotCommodityData.integralBalance}}</div>
        </div>
      </div>
    </div>
    <div class="order-menu flex flex-cross-center">
      <div class="item t-c" @click="loginAll">
        <img src="../assets/img/mine-order-all.png" alt="">
        <p>全部</p>
      </div>
      <div class="item t-c" @click="loginUnship">
        <img src="../assets/img/mine-order-2.png" alt="">
        <p>待发货</p>
        <yd-badge class="dot" bgcolor="#FF3E3E" color="#FFF" v-if="hotCommodityData.unshipped > 0">{{hotCommodityData.unshipped}}</yd-badge>
      </div>
      <div class="item t-c" @click="loginShip">
        <img src="../assets/img/mine-order-3.png" alt="">
        <p>已发货</p>
        <yd-badge class="dot" bgcolor="#FF3E3E" color="#FFF" v-if="hotCommodityData.shipped > 0">{{hotCommodityData.shipped}}</yd-badge>
      </div>
      <div class="item t-c" @click="loginAready">
        <img src="../assets/img/mine-order-4.png" alt="">
        <p>已完成</p>
      </div>
    </div>
    <div class="module-title">常用功能</div>
    <div class="menu">
      <yd-cell-group>
        <yd-cell-item arrow type="link" href="" @click.native="loginCard">
          <img slot="icon" src="../assets/img/mine-menu-card.png">
          <span slot="left">我的卡券</span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="" @click.native="loginScore">
          <img slot="icon" src="../assets/img/mine-menu-soccer.png">
          <span slot="left">积分记录</span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="" @click.native="loginCollect">
          <img slot="icon" src="../assets/img/mine-menu-fav.png">
          <span slot="left">我的收藏</span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="" @click.native="loginAdress">
          <img slot="icon" src="../assets/img/mine-menu-address.png">
          <span slot="left">收货地址</span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="" @click.native="PUSH({path: '/about-us'})">
          <img slot="icon" src="../assets/img/mine-menu-us.png">
          <span slot="left">关于我们</span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="" @click.native="contactUs">
          <img slot="icon" src="../assets/img/mine-menu-contact.png">
          <span slot="left">联系我们</span>
        </yd-cell-item>
    </yd-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: "",
      searchBarFixed: false,
      hotCommodityData: "",
      menuHover: [false, false, false],
      // showNickName: false,
      showImg: false
    };
  },
  created() {
    this.changeStatusColor("#3F73FF");
  },
  mounted() {
    this.customBackKey(() => {
      window.api.sendEvent({
        name: "closeApp",
        extra: {}
      });
    });
    if (this.$store.state.userId && this.$store.state.token) {
      this.init();
    }
    // JSON.parse(sessionStorage.getItem('mallPageData'))
    this.login();
  },
  methods: {
    init() {
      let param = {
        userId: this.$store.state.userId
      };
      this.$http
        .post("/focus.mallPageData", param)
        .then(res => {
          console.log(res);
          this.hotCommodityData = res;
          if (this.hotCommodityData.nickName == "") {
            this.hotCommodityData.nickName = "请设置昵称";
          }
          if (this.hotCommodityData.avatarUrl != "") {
            this.showImg = true;
          }
          this.$store.commit("updatePhone", res.phone || '');
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    dialog() {
      this.customBackKey(() => {
        document.querySelector(".yd-confirm-btn.default").click();
      });
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
            color: false,
            callback: () => {
              this.customBackKey(() => {
                window.api.sendEvent({
                  name: "closeApp",
                  extra: {}
                });
              });
            }
          }
        ]
      });
    },
    login() {
      // this.changeStatusColor('ligth', '#ff76aa')
      if (this.$store.state.userId) {
      } else {
        this.dialog();
      }
    },
    loginCard() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/card"
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    loginScore() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/soccer-detail"
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    loginCollect() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/collection"
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    loginAdress() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/address-list"
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    // loginAboutUs() {
    //   if (this.$store.state.userId) {
    //     this.PUSH({
    //       path: "/about-us"
    //     });
    //   } else {
    //     this.dialog();
    //   }
    // },
    // loginContactUs() {
    //   if (this.$store.state.userId) {
    //     this.contactUs();
    //   } else {
    //     this.dialog();
    //   }
    // },
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
            type: 2
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
            type: 3
          }
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    loginAready() {
      if (this.$store.state.userId) {
        this.PUSH({
          path: "/order-list",
          query: {
            type: 4
          }
        });
      } else {
        this.PUSH({ path: "/login-account" });
      }
    },
    getHover(index) {
      // menu中图标的点击效果
      this.menuHover.splice(index, 1, true);
      this.$nextTick(() => {
        setTimeout(() => {
          this.menuHover.splice(index, 1, false);
        }, 100);
      });
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
  background-color: #ffffff;
  position: relative;
  -webkit-overflow-scrolling: touch;
  .banner {
    width: 100%;
    height: 4.03rem;
    background-image: url("../assets/img/mine-banner-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position-y: bottom;
    .banner-top {
      background-color: #3f73ff;
      height: 0.84rem;
    }
    .login-now {
      padding-top: 0.06rem;
      img {
        width: 1.3rem;
        height: 1.3rem;
        margin-left: 0.4rem;
        border-radius: 1.3rem;
      }
      .btn {
        font-size: 0.38rem;
        font-weight: bold;
        color: #ffffff;
        margin-left: 0.29rem;
      }
    }
    .info {
      padding-top: 0.06rem;
      img {
        width: 1.3rem;
        height: 1.3rem;
        margin-left: 0.4rem;
        border-radius: 1.3rem;
      }
      & > div {
        margin-left: 0.29rem;
        color: #ffffff;
        .btn {
          font-size: 0.38rem;
          font-weight: bold;
        }
        .soccer {
          font-size: 0.32rem;
          margin-top: 0.2rem;
        }
      }
    }
  }
  .order-menu {
    width: 90%;
    height: 1.9rem;
    margin: 0 auto;
    position: absolute;
    top: 2.74rem;
    left: 5%;
    background-color: #ffffff;
    box-shadow: 0px 6px 13px 0px rgba(55, 57, 70, 0.08);
    border-radius: 0.2rem;
    box-sizing: border-box;
    padding: 0 0.2rem;
    .item {
      width: 25%;
      position: relative;
      .dot {
        position: absolute;
        left: 50%;
        top: -0.1rem;
        margin-left: 0.1rem;
        color: #ffffff;
        font-size: 0.18rem;
      }
      .yd-badge {
        // padding: 3px !important;
      }
      img {
        width: 0.44rem;
        height: 0.45rem;
        display: block;
        margin: 0 auto;
      }
      p {
        font-size: 0.22rem;
        color: #4c4c4c;
        margin-top: 0.17rem;
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
