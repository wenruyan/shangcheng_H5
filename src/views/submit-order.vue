<template>
  <div class="page submit-order-page" v-if="show">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content t-c">
      <div class="address pd-wrap" @click="goAddressList">
        <div class="no flex flex-main-justify flex-cross-center" v-if="noAddress">
          <p>暂无可用地址，点击添加</p>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="yes" v-show="!noAddress">
          <div class="flex flex-main-justify name-phone">
            <div class="flex flex-cross-center">
              <span class="name">{{ addressObj.name }}</span>
              <img
                src="../assets/img/icon-default.png"
                class="is-default"
                alt
                v-if="addressObj.isDefault == '10'"
              />
            </div>
            <span class="phone">{{ hidePhone(addressObj.phone) }}</span>
          </div>
          <div class="address-text">
            <span v-if="addressObj.resultAddress">{{addressObj.addressDetail}}</span>
            <span v-else>{{ addressObj.province+addressObj.city+addressObj.area+addressObj.addressDetail }}</span>
            <i
              class="fa fa-angle-right"
            ></i>
          </div>
        </div>
      </div>
      <img src="../assets/img/grid.png" class="flex" alt />
      <!-- <div class="line-gray" v-if="isNotVirtual"></div> -->
      <div class="details">
        <div class="title2 pd-wrap">商品清单</div>
        <div class="pd-wrap">
          <div class="commodity">
            <div
              v-if="orderData.itemInfos.length > 1"
              class="infos flex flex-cross-center flex-main-justify"
              @click="goMerchBill"
            >
              <div>
                <img
                  v-for="item in orderData.itemInfos.slice(0,4)"
                  :key="item.goodsId"
                  :src="item.mainImgUrl"
                  alt
                />
              </div>
              <div class="flex flex-cross-center">
                <span>共{{orderData.quantity}}件</span>
                <i class="fa fa-angle-right"></i>
              </div>
            </div>
            <div class="info-one" v-else>
              <img :src="orderData.itemInfos[0].mainImgUrl" alt />
              <div>
                <p class="name">{{ orderData.itemInfos[0].name }}</p>
                <p class="specfication">
                  <span
                    v-for="(item, index) in orderData.itemInfos[0].sku.attrs"
                    :key="item.id"
                  >{{ item.productAttributeName + (index !=orderData.itemInfos[0].sku.attrs.length - 1 ? '，' : '')}}</span>
                </p>
                <p class="quantity">x {{orderData.itemInfos[0].quantity}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="pd-wrap detail-one" v-if="isNotVirtual">
          <div class="express flex flex-cross-center flex-main-justify">
            <span class="color-6">邮寄费用</span>
            <span class="color-3">免邮</span>
          </div>
        </div>
        <div class="pd-wrap flex flex-cross-center flex-main-justify detail-one">
          <span class="color-6">商品价格</span>
          <span class="integral-icon color-3">{{orderData.amountPrice}}</span>
        </div>
        <div class="pd-wrap flex flex-cross-center flex-main-justify detail-one">
          <div>
            <p class="color-6">运费</p>
            <p class="tip">
              注：
              <span class="integral-icon">{{orderData.deliveryFee}}</span> 约等于￥{{orderData.deliveryFee / 100}}
            </p>
          </div>
          <span class="integral-icon color-3">{{orderData.deliveryFee}}</span>
        </div>
        <div class="count-money pd-wrap detail-one">
          <div>
            <span>合计：</span>
            <span class="integral-icon color-red">{{computeAll()}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="line-gray"></div> -->
      <div class="integral-use">
        <div class="title2 pd-wrap">积分使用</div>
        <div class="pd-wrap soccer-account flex flex-main-justify flex-cross-center">
          <yd-input
            v-model="integral"
            max="20"
            placeholder="请输入积分"
            :show-success-icon="false"
            :show-error-icon="false"
            :show-clear-icon="false"
            @keyup.native="judgeIntegral"
          ></yd-input>
          <span>{{ this.hotCommodityData.integralBalance }}</span>
          <span class="all-integral-buy-btn" @click="allIntegralBuy" v-show="judgeAllIntegral">全积分购买</span>
          <span class="all-integral-buy-btn disabled" v-show="!judgeAllIntegral">全积分购买</span>
        </div>
        <div class="pd-wrap has color-6">
          拥有积分：
          <span class="integral-icon">{{ userInfo.pointsBalance }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="line-gray"></div>
    <div class="line-gray"></div>-->
    <div class="footer flex flex-main-justify flex-cross-center">
      <div class="total t-l">
        合计
        <span class="integral-icon" v-show="integral">{{ integral }}</span>
        <span class="symbol" v-show="integral && integral < computeAll()">+</span>
        <span v-show="integral < computeAll()">￥{{(computeAll() - +integral) / 100}}</span>
      </div>
      <div class="buy" @click="submit">支付</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemId: "",
      noAddress: false,
      isNotVirtual: false,
      totalPay: 0,
      defaultAddress: true,
      infos: [
        {
          imgUrl: ""
        }
      ],
      count: "",
      numMax: 999,
      hotCommodityData: "",
      orderData: {},
      integral: "",
      judgeAllIntegral: true,
      addressObj: {},
      show: false
    };
  },
  created() {
    this.$store.dispatch("getUserInfo");
    this.itemId = this.$route.query.id;
    let param = {
      jf: this.$route.query.jf, // 积分
      os: "0" // 平台类型
    };
    if (this.$route.query.cartIds) {
      param["cartIds"] = this.$route.query.cartIds;
      // 下单拿到数据
      this.$http
        .post("/Focus-BladeX-BootX/orderinformation/placeOrderForShoppingCart", param)
        .then(res => {
          console.log(res, "立即下单");
          this.handleAfterGetData(res);
        })
        .catch(err => {
          console.log("err1111", err);
        });
    }
    if (this.$route.query.productSkuId) {
      param["productSkuId"] = this.$route.query.productSkuId;
      // 购物车下单
      this.$http
        .post(
          "/Focus-BladeX-BootX/orderinformation/placeOrderDirectly",
          param
        )
        .then(res => {
          console.log(res, "立即下单");
          this.handleAfterGetData(res);
        })
        .catch(err => {
          console.log("err1111", err);
        });
    }
  },
  mounted() {
    this.numMax = this.$route.query.quantity;
    console.log(this.numMax, "iiiiiiii");
  },
  watch: {
    // 监听输入积分和需要支付积分是否一致
    integral(now) {
      console.log(now);
      if (now == this.computeAll()) {
        //  一致时，全积分购买按钮不能点击
        this.judgeAllIntegral = false;
      } else {
        this.judgeAllIntegral = true;
      }
      if (!now) {
        this.integral = "0";
      }
    }
  },
  methods: {
    // 拿到数据后处理
    handleAfterGetData(res) {
      this.orderData = res.data;
      if (this.orderData.itemInfos.length > 1) {
        this.$store.commit('updateMerchBillData', this.orderData.itemInfos);
      }
      if (this.$store.state.choosedAddress.id) {
        // 如果有选中的地址，则取选中的地址
        this.addressObj = this.$store.state.choosedAddress;
        this.addressObj['addressId'] = this.addressObj.id;
      } else if (this.orderData.addressId != -1) {
        // 没有有选中的地址，则取接口返回的默认地址
        this.addressObj = {
          addressId: this.orderData.addressId,
          name: this.orderData.addressee,
          phone: this.orderData.phone,
          addressDetail: this.orderData.addressDetail,
          resultAddress: true
        };
      } else {
        // 提示无地址
        this.noAddress = true;
      }
      this.show = true;
    },
    // 计算合计积分
    computeAll() {
      return +this.orderData.amountPrice + +this.orderData.deliveryFee;
    },
    // 判断输入积分
    judgeIntegral() {
      if (!/^(0|[1-9][0-9]*)(\.\d+)?$/.test(this.integral)) {
        this.integral = this.integral.replace(/\D/g, '');
      }
      if (this.integral.substr(0, 1) == '0') {
        this.integral = this.integral.substr(1);
      }
      // 输入积分大于商品总额或者大于已有积分
      if (
        this.integral > this.computeAll() ||
        this.integral > this.userInfo.pointsBalance
      ) {
        // 已有积分大于商品总额
        if (this.userInfo.pointsBalance > this.computeAll()) {
          this.allIntegralBuy();
        } else {
          // 已有积分小于商品总额
          this.integral = this.userInfo.pointsBalancel;
        }
      }
    },
    // 去商品清单
    goMerchBill() {
      this.PUSH({ path: "/merch-bill" });
    },
    allIntegralBuy() {
      this.integral = this.computeAll();
    },
    // 立即支付
    submit() {
      let param = {
        addressId: this.addressObj.addressId,
        quantity: this.orderData.quantity,
        jf: this.integral || 0, // 积分
        os: "0" // 平台类型
      };
      if (this.$route.query.cartIds) {
        param["cartIds"] = this.$route.query.cartIds;
      }
      if (this.$route.query.productSkuId) {
        param["skuId"] = this.$route.query.productSkuId;
      }
      if (!this.integral || this.integral == '0') {
        param["allCash"] = true;
      }
      this.pay(param);
    },
    // 选择地址
    goAddressList() {
      this.$router.push({
        path: "/address-list",
        query: { selectAddress: true }
      });
    }
  }
};
</script>

<style lang="scss">
.submit-order-page {
  $color-red: #ff2626;
  background-color: #f5f5f5;
  height: calc(100vh);
  .content {
    height: calc(100vh - 2.04rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    text-align: left;
    .address {
      font-size: 0.3rem;
      font-weight: bold;
      background-color: #fff;
      padding-top: 0.24rem;
      padding-bottom: 0.24rem;
      .no {
        height: 1.32rem;
        font-size: 0.32rem;
        .fa {
          font-size: 0.4rem;
        }
      }
      .yes {
        .name-phone {
          height: 0.42rem;
          line-height: 0.42rem;
          margin-bottom: 0.1rem;
          font-size: 0.3rem;
          span {
            line-height: 0.42rem;
          }
          .name {
            margin-right: 0.26rem;
          }
          .is-default {
            width: 0.72rem;
            height: 0.32rem;
            display: inline-block;
          }
        }
        .address-text {
          text-align: left;
          overflow: hidden;
          color: #999;
          font-size: 0.24rem;
          padding-right: 0.4rem;
          line-height: 1.4;
          position: relative;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          .fa {
            position: absolute;
            right: 0rem;
            // top: 50%;
            bottom: 0;
            // transform: translateY(-50%);
            font-size: 0.4rem;
          }
        }
      }
    }
    .details {
      background-color: #fff;
      margin-top: 0.1rem;
    }
    .title2 {
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.28rem;
      border-bottom: 1px solid #e6e6e6;
    }
    .commodity {
      overflow: hidden;
      padding-top: 0.2rem;
      padding-bottom: 0.25rem;
      .infos {
        padding-bottom: 0.15rem;
        span {
          font-size: 0.24rem;
          color: #666;
        }
        i {
          color: #ababab;
          font-size: 0.4rem;
        }
        img {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.1rem;
        }
        .fa-angle-right {
          margin-left: 0.2rem;
        }
      }
      .info-one {
        img {
          width: 2rem;
          height: 2rem;
          float: left;
          border-radius: 0.1rem;
          border: 1px solid #eeeeee;
          margin-right: 0.2rem;
        }
      }
      & > div {
        // margin-left: 2.26rem;
        .name {
          font-size: 0.26rem;
          text-align: left;
          line-height: 1.5;
          height: 0.7rem;
          margin-bottom: 0.1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .specfication {
          text-align: left;
          color: #999999;
          font-size: 0.22rem;
          height: 0.6rem;
          line-height: 1.2;
          overflow: hidden;
        }
        .quantity {
          color: #666666;
          font-size: 0.26rem;
          float: right;
        }
        .count {
          text-align: right;
          .yd-spinner {
            height: 0.6rem !important;
            width: 2rem !important;
            span {
              width: 30% !important;
            }
            .yd-spinner-input {
              width: 40% !important;
            }
          }
        }
      }
    }
    .integral-use {
      background-color: #fff;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
    }
    .express {
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.28rem;
      font-weight: bold;
      border-top: 1px solid #e6e6e6;
      span:last-child {
        color: #666666;
        font-weight: normal;
      }
    }
    .soccer-account {
      border-bottom: 1px solid #e6e6e6;
      font-weight: bold;
      height: 1rem;
      .all-integral-buy-btn {
        background-color: #fff;
        width: 1.8rem;
        height: 0.48rem;
        line-height: 0.48rem;
        font-size: 0.24rem;
        text-align: center;
        border-radius: 0.2rem;
        border: 1px solid #ff2626;
        color: #ff2626;
        &.disabled {
          background-color: #f5f5f5;
          color: #bebebe;
          border: none;
        }
      }
    }
    .has {
      text-align: right;
      height: 0.68rem;
      line-height: 0.68rem;
      font-size: 0.24rem;
    }
    .color-6 {
      color: #666;
    }
    .color-3 {
      color: #333;
    }
    .color-red {
      color: $color-red;
    }
    .tip {
      color: #ababab;
      font-size: 0.22rem;
    }
    .detail-one {
      padding-top: 0.1rem;
      padding-bottom: 0.1rem;
      font-size: 0.26rem;
      &.count-money > div {
        height: 1rem;
        line-height: 1rem;
        border-top: 1px solid #f5f5f5;
        text-align: right;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }
  .footer {
    width: 100%;
    height: 1.2rem;
    padding: 0 0.17rem 0 0.4rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    .total {
      font-size: 0.28rem;
      font-weight: bold;
      white-space: nowrap;
      span {
        color: $color-red;
        white-space: nowrap;
        overflow: hidden;
        &.symbol {
          margin-left: 0.2rem;
        }
      }
    }
    .buy {
      text-align: center;
      width: 1.64rem;
      height: 0.64rem;
      line-height: 0.64rem;
      background-color: $color-red;
      font-size: 0.28rem;
      color: #ffffff;
      border-radius: 0.32rem;
      font-weight: bold;
    }
  }
}
</style>
