<template>
  <div class="page address-list-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content t-c">
      <div class="no" v-if="listData.length == 0">当前地址列表为空</div>
      <div class="yes">
        <div class="item pd-wrap" :style="{'background':changeColor}" v-for="(item, index) in listData" :key="index">
          <div class="top-line flex flex-cross-center" @click="clickItem(item)">
            <p class="name">{{item.name}}</p>
            <p class="phone">{{hidePhone(item.phone)}}</p>
            <img src="../assets/img/icon-default.png" class="default" v-if="item.default[0]" />
          </div>
          <div class="detail" @click="clickItem(item)">
            {{item.detail}}
          </div>
          <div class="opt flex flex-main-justify" v-if="isEditType">
            <div class="opt-default">
              <yd-checkbox-group v-model="item.default" color="#4189FF">
                <yd-checkbox :val="true" shape="circle" @click.native="setDefault(index,item)">设为默认地址</yd-checkbox>
              </yd-checkbox-group>
            </div>
            <div class="opt-other">
              <span class="delete" @click="beforeDelAddress(item)">删除</span>
              <span class="edit" @click="editAddress(item)">编辑</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer flex flex-main-justify flex-cross-center">
      <div class="buy" @click="submit">新增收货地址</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [],
      isEditType: true,
      changeColor: "#fff",
      isClick: true
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.selectAddress) {
        this.isEditType = false;
      }
      this.getList();
    },
    getList() {
      let param = {
        // userId: '2572033778385410'
      };
      this.$http
        .get("/Focus-BladeX-BootX/useraddress/listNoPage", param)
        .then(res => {
          console.log("res", res);
          this.listData = res.data.map(item => {
            item.detail = `${item.province} ${item.city} ${item.area} ${
              item.addressDetail
            }`;
            item.default = [item.isDefault == 10];
            return item;
          });
          console.log(this.listData, "list");
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    addAddress() {
      this.PUSH({ path: "/address-add" });
    },
    editAddress(item) {
      this.PUSH({
        path: "/address-add",
        query: {
          address: JSON.stringify(item)
        }
      });
    },
    beforeDelAddress(item) {
      this.$dialog.confirm({
        title: "提示",
        mes: "确认删除？",
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              this.delAddress(item);
              this.init();
            }
          },
          {
            txt: "取消",
            color: false,
            callback: () => {}
          }
        ]
      });
    },
    delAddress(item) {
      let param = {
        ids: item.id
      };
      this.$http
        .get("/Focus-BladeX-BootX/useraddress/remove", param)
        .then(res => {
          console.log("res", res);
          this.$dialog.toast({
            mes: "删除成功",
            timeout: 1500,
            callback: () => {
              this.getList();
            }
          });
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    submit() {
      if (this.isLogin) {
        this.addAddress();
      } else {
        this.$dialog.confirm({
          title: "提示",
          mes: "您还未登录，请先登录",
          opts: [
            {
              txt: "登录",
              color: true,
              callback: () => {
                this.PUSH({ path: "/login-sms" });
              }
            },
            {
              txt: "取消",
              color: false,
              callback: () => {

              }
            }
          ]
        });
      }
    },
    clickItem(item) {
      console.log(99999);
      if (!this.isEditType) {
        console.log(item, "item");
        this.$store.commit("updateChoosedAddress", item);
        // let obj = this.$store.state.buyGoodsInfo;
        // obj.addressId = item.id;
        // this.$store.commit("updateBugGoodsInfo", obj);
        this.GO(-1);
      }
    },
    setDefault(index2, item) {
      console.log(item)
      if (this.isClick) {
        this.isClick = false;
        let isDefault = item.default[0] ? 20 : 10;
        item.default[0] = !item.default[0];
        let param = {
          id: this.listData[index2].id,
          isDefault,
          wechatUserInfo: item.wechatUserInfo
        };
        this.$http
          .post("/Focus-BladeX-BootX/useraddress/setDefaultAddress", param)
          .then(res => {
            this.listData.map((item, index) => {
              if (index != index2) {
                item.default = [false];
              }
              this.isClick = true;
            });
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    }
  }
};
</script>

<style lang="scss">
.address-list-page {
  position: absolute;
  top: 0;
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    padding-bottom: 1.52rem;
    position: relative;
    -webkit-overflow-scrolling: touch;
    padding-top: 0 !important;
    .no {
      margin-top: 1rem;
      font-size: 0.28rem;
      color: #999999;
    }
    .yes {
      padding: 0.22rem 0;
      .item {
        border-bottom: 1px solid #f4f4f4;
        &:active {
          background-color: #f2f2f2;
        }
        .top-line {
          font-weight: bold;
          padding-top: 0.33rem;
          .name {
            font-size: 0.36rem;
          }
          .phone {
            font-size: 0.26rem;
            margin: 0 0.22rem;
          }
          .default {
            height: 0.24rem;
          }
        }
        .detail {
          font-weight: 500;
          font-size: 0.24rem;
          line-height: 0.3rem;
          color: #666666;
          text-align: left;
          padding: 0.33rem 0 0.27rem;
        }
        .opt {
          border-top: 1px solid #f4f4f4;
          padding: 0.22rem 0;
          .opt-default {
            .yd-checkbox-icon {
              width: 0.3rem !important;
              height: 0.3rem !important;
              i {
                width: 0.12rem !important;
                height: 0.18rem !important;
              }
            }
            .yd-checkbox-text {
              font-size: 0.22rem;
              position: relative;
              top: -0.02rem;
            }
          }
          .opt-other {
            position: relative;
            top: 0.04rem;
            & > span {
              padding-left: 0.4rem;
              font-size: 0.22rem;
              &.delete {
                background-image: url("../assets/img/icon-trash.png");
                background-size: auto 100%;
                background-repeat: no-repeat;
              }
              &.edit {
                background-image: url("../assets/img/icon-edit.png");
                background-size: auto 100%;
                background-repeat: no-repeat;
                margin-left: 0.6rem;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    height: 1.52rem;
    width: 100%;
    padding: 0 0.5rem;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 1999;
    .buy {
      text-align: center;
      padding: 0.33rem 0;
      width: 100%;
      background-color: #4189ff;
      font-size: 0.34rem;
      color: #ffffff;
      border-radius: 0.1rem;
      font-weight: bold;
    }
  }
}
</style>
