<template>
  <div class="page soccer-exchange-page">
    <yd-navbar
      :title="$route.meta.title"
      height="0.84rem"
      border-color="#E8E6E6"
    >
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content t-c">
      <p class="title2 pd-wrap">最新上线</p>
      <div class="card" @click="openConfirm">
        <div class="flex flex-cross-center rightArrow" slot="right">
          <yd-navbar-next-icon></yd-navbar-next-icon>
        </div>
        <img src="../assets/img/soccer-exchange-bg.png" alt="" class="bg" />
        <img src="../assets/img/bbc-logo.png" alt="" class="logo" />
        <div class="bbc">步步抽</div>
        <div class="info flex flex-main-justify">
          <p v-if="time">
            <img
              src="../assets/img/clock.png"
              alt=""
              style="width:.22rem;height:.22rem;margin-right:.1rem"
            />
            <span>上次更新 {{ time }}</span>
          </p>
          <p v-if="!time"><span>暂未激活</span></p>
          <p>100步=1积分</p>
        </div>
        <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);color:#fff" >
          <p style="font-size:1.2rem">{{ soccer }}</p>
          <p style="font-size:.26rem">可换积分</p>
        </div>
      </div>
      <p class="title2 pd-wrap">敬请期待</p>
      <img src="../assets/img/soccer-logo.jpeg" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      soccer: "--",
      time: ""
    };
  },
  created() {
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 判断用户是否登录
      if (this.$store.state.userId) {
        let data = this.$store.state.mallPageData;
        console.log(data, "yyyyyyy");
        this.time = data.lastedPointTime;
        // this.soccer = +this.soccer;
        this.soccer = parseInt((data.step || 0) / 100);
      }
      this.getPageData()
    },
    openConfirm() {
      // 判断用户是否登录
      if (this.$store.state.userId) {
        if (this.soccer * 100 < 1) {
          this.notEnoughSoccer();
        } else {
          this.$dialog.confirm({
            title: "提示",
            mes: "请选择去步步抽更新步数还是直接兑换积分",
            opts: [
              {
                txt: "去更新步数",
                color: true,
                callback: () => {
                  this.goUpdateStep();
                }
              },
              {
                txt: "立即兑换",
                color: true,
                callback: () => {
                  this.$nextTick(() => {
                    // if (this.soccer < 1) {
                    //   this.notEnoughSoccer();
                    // } else {
                    this.exchangeConfirm();
                    // }
                  });
                }
              },
              {
                txt: "取消",
                color: false
              }
            ]
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
    },
    exchangeConfirm() {
      this.$dialog.confirm({
        title: "提示",
        mes:
          "您当前的累计步数为" +
          this.soccer * 100 +
          "步可兑换积分" +
          this.soccer +
          "分",
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              this.$nextTick(() => {
                this.$http
                  .post("/focus.stepToIntegral", {
                    step: this.soccer * 100,
                    money: "0"
                  })
                  .then(res => {
                    this.$http
                      .post("/focus.mallPageData", {})
                      .then(res => {
                        this.soccer = parseInt(res.step / 100);
                        sessionStorage.setItem(
                          "mallPageData",
                          JSON.stringify(res)
                        );
                      })
                      .catch(err => {
                        console.log("err", err);
                      });
                  })
                  .catch(err => {
                    console.log("err", err);
                  });
              });
            }
          },
          {
            txt: "取消",
            color: false
          }
        ]
      });
    },
    notEnoughSoccer() {
      this.$dialog.confirm({
        title: "提示",
        mes: "您的累计步数不足无法兑换请攒够步数之后再来兑换吧",
        opts: [
          {
            txt: "去更新步数",
            color: true,
            callback: () => {
              this.goUpdateStep();
            }
          },
          {
            txt: "取消",
            color: false
          }
        ]
      });
    },
    goUpdateStep() {
      let that = this;
      let mm = setInterval(() => {
        console.log(123)
        if (that.$route.name != 'soccer-exchange') {
          clearInterval(mm)
        } else {
          that.getPageData()
        }
      }, 1000)
      this.toMiniProgram({ path: '/pages/index/index?appPhone=' + this.$store.state.phone || 123123 }, (ret, err) => {
        if (ret.eventType == "back") {
          that.getPageData()
        } else {
          // alert(err.code);
        }
      })
    },
    getPageData () {
      let that = this
      this.$http
        .post("/focus.mallPageData", {})
        .then(res => {
          that.soccer = parseInt((res.step || 0) / 100);
          sessionStorage.setItem(
            "mallPageData",
            JSON.stringify(res)
          );
          that.$store.commit("mallPageData", res);
          that.time = res.lastedPointTime;
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="scss">
.soccer-exchange-page {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .title2 {
      margin-top: 0.4rem;
      margin-bottom: 0.32rem;
    }
    .card {
      width: 100%;
      padding: 0 0.29rem;
      position: relative;
      overflow: hidden;
      .rightArrow {
        position: absolute;
        top: 0.47rem;
        right: 0.6rem;
        span {
          color: #fff !important;
        }
      }
      .logo {
        width: 0.55rem;
        position: absolute;
        top: 0.34rem;
        left: 0.72rem;
      }
      .bbc {
        font-size: 0.32rem;
        color: #ffffff;
        font-weight: bold;
        position: absolute;
        top: 0.47rem;
        left: 1.42rem;
      }
      .info {
        height: 0.8rem;
        width: 6.04rem;
        position: absolute;
        bottom: 0.2rem;
        left: 50%;
        transform: translateX(-50%);
        border-top: 0.01rem solid rgba(153, 153, 153, 1);
        font-size: 0.22rem;
        color: #fff;
        p {
          line-height: 0.8rem;
        }
      }
    }
  }
}
</style>
