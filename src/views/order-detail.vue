<template>
  <div class="page order-detail-page">
    <yd-navbar
      :title="$route.meta.title"
      height="0.84rem"
      border-color="#E8E6E6"
    >
      <div class="flex flex-cross-center" slot="left" @click="back">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content t-c">
      <div class="c-body">
        <div class="order-status">
          <div class="pr flex flex-cross-center flex-main-justify">
            <div>
              <p class="status-text bold">{{ orderStatusObj[orderDetail.orderStatus] }}</p>
              <span v-if="judgeShow(['10','130'], orderDetail.orderStatus)">剩余：</span><yd-countdown  v-if="judgeShow(['10','130'], orderDetail.orderStatus)" :time="orderDetail.countdown" format="{%m}分{%s}秒"></yd-countdown>
              <p class="need-pay" v-if="judgeShow(['10','130'], orderDetail.orderStatus)">需付款：<span class="bold">￥{{ orderDetail.payPriceCash/100 }}</span></p>
            </div>
            <div class="right" v-if="judgeShow(['10','130'], orderDetail.orderStatus)">
              <p class="re-buy" @click="reBuy">去支付</p>
            </div>
            <span v-if="judgeShow(['20','30', '40', '50','120','60'], orderDetail.orderStatus)"  class="re-buy" @click="reBuy">再次购买</span>
          </div>
        </div>
        <!-- v-if="orderDetail.orderStatus == 30" -->
        <div class="wl flex flex-cross-center flex-main-justify" v-if="judgeShow(['30'], orderDetail.orderStatus)" @click="checkWl">
          <img class="track" src="../assets/img/delevery_track.png.png">
          <p class="wl_info flex-1">{{orderDetail.latestOrderTrack}}</p>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="address pd-wrap flex flex-cross-center flex-main-justify">
          <img src="../assets/img/mine-menu-address.png" class="address-icon" alt="">
          <div class="yes">
            <div class="flex flex-main-justify">
              <div class="name">{{ orderDetail.addressee }}</div>
              <div class="phone">{{ hidePhone(orderDetail.phone) }}</div>
            </div>
            <div class="address-text text-hidden-2">{{ orderDetail.addressdetail }}地址详情</div>
          </div>
        </div>
        <div class="gap"></div>
        <div class="title2 pd-wrap">商品清单</div>
        <div class="pd-wrap">
          <div class="commodity" v-for="(item, ind) in orderDetail.itemInfoVOs" :key="ind">
            <img :src="item.sku.skuImage"/>
            <div>
              <p class="name text-hidden-2">{{ item.name }}</p>
              <p class="specfication">
                <span>{{ item.sku.name}}</span>
              </p>
              <div class="flex flex-main-justify">
                <span class="price">
                  <span class="price-num bold">{{ item.goodsPriceJf }} </span>
                  <img src="../assets/img/integral-icon.png" alt="">
                </span>
                <span class="count">x {{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="gap"></div>
        <div class="pd-wrap order-info">
          <div class="soccer-account flex flex-main-justify">
            <span>订单编号</span>
            <span>{{ orderDetail.orderId }}</span>
          </div>
          <div class="soccer-account flex flex-main-justify">
            <span>下单时间</span>
            <span>{{ orderDetail.createDate }}</span>
          </div>
          <div class="soccer-account flex flex-main-justify">
            <span>商品价格</span>
            <span>{{ orderDetail.amountPrice }}积分</span>
          </div>
          <div class="soccer-account flex flex-main-justify">
            <span>运费</span>
            <span>￥{{ orderDetail.deliveryFee }}</span>
          </div>
          <div class="soccer-account flex flex-main-justify">
            <span>积分消耗</span>
            <span>{{ orderDetail.payPriceJf }}积分</span>
          </div>
          <div class="soccer-account pay flex flex-main-justify">
            <span>需付款</span>
            <span>￥{{ orderDetail.payPriceCash/100 }}</span>
          </div>
        </div>
        <div class="gap"></div>
        <div class="operate">
          <div v-if="judgeShow(['10','130'], orderDetail.orderStatus)">
            <span class="btn cancel" v-if="judgeShow(['10','130'], orderDetail.orderStatus)"  @click="handleCancel">取消订单</span>
            <span class="btn confirm" v-if="judgeShow(['10','130'], orderDetail.orderStatus)" @click="cashPay(orderDetail.id)">支付</span>
          </div>
          <span class="btn confirm" v-if="judgeShow(['20','50','120','60'], orderDetail.orderStatus)" @click="reBuy">再次购买</span>
          <span class="btn confirm" v-if="judgeShow(['30','40'], orderDetail.orderStatus)" @click="confirmReceipt">确认收货</span>
          <span class="btn confirm" v-if="judgeShow(['50', '60','120'], orderDetail.orderStatus)" @click="delOrder">删除订单</span>
        </div>
      </div>
    </div>
     <transition name="slideUp">
      <div class="spec-panel" v-if="showPanel">
        <div class="s-p-title bold">
          <span>取消订单</span>
          <i class="fa fa-close" @click="hideReasonSelect"></i>
        </div>
        <div class="tip">
          <p class="tip-title">温馨提示：</p>
          <p>1.限时特价等优惠可能一并取消</p>
          <p>2.订单一旦取消，无法恢复</p>
        </div>
        <div class="reason-select">
          <p class="bold">请选择取消订单的原因（必选）:</p>
          <yd-radio-group v-model="cancelReason" color="#1391F9">
            <yd-radio :val="item.key" v-for="item in cancelReasonArr" :key="item.key">{{ item.val }}</yd-radio>
          </yd-radio-group>
        </div>
        <p class="btn" :class="cancelReason ? 'active' : ''" @click="abolishOrder">提交</p>
      </div>
    </transition>
    <transition name="fade">
      <div class="bg" v-if="showBg" @click="hideReasonSelect"></div>
    </transition>
  </div>
</template>

<script>
export default {
  // name: "order-detail",
  data() {
    return {
      itemId: "",
      orderTime: "",
      noAddress: false,
      buyCount: 1,
      restTime: [],
      showBg: false,
      showPanel: false,
      cancelReason: '',
      orderStatusObj: {
        "10": "等待付款",
        "20": "等待发货",
        "30": "等待收货",
        "40": "等待收货",
        "50": "已完成",
        "60": "已取消",
        "120": "已取消",
        "130": "等待付款"
      },
      orderDetail: {
        id: "2540876420432384",
        amount: "0.0000",
        mortgageAmount: "0.0000",
        time: '2019-11-22 18:24:00',
        extra: '0', // 运费
        originIntegral: 10000,
        mineIntegral: 6000,
        needMoney: '40.00',
        orderStatus: "10",
        goodsArr: [{
          mainTitle: "【拼好货】梅林四喜丸子罐头280gx5红烧猪肉丸子狮子头卤味熟食下饭菜肉肉肉",
          url: "https://img.yzcdn.cn/upload_files/2018/10/10/FmrWNuXofxs0rknH4atiDQxY6Att.jpg",
          quantity: 3,
          sku: [
            '黑色', '128G', '移动版'
          ],
          price: '1900'
        }, {
          mainTitle: "【拼好货】梅林四喜丸子罐头280gx5红烧猪肉丸子狮子头卤味熟食下饭菜肉",
          url: "https://img.yzcdn.cn/upload_files/2018/10/10/FmrWNuXofxs0rknH4atiDQxY6Att.jpg",
          quantity: 3,
          sku: [
            '黑色', '128G', '移动版'
          ],
          price: '1900'
        }],
        addressDetail: "wDVD的",
        phone: "16778754577",
        name: "二维无",
        quantity: 1,
        productIsVirtual: '10',
        process: '济南市 山东主城区 公司总部济南市天桥区新沙服务部 已揽收正在发往上海市浦东新区'
      },
      cancelCan: false,
      cancelReasonArr: [
        {
          key: "0",
          val: "其他"
        },
        {
          key: "1",
          val: "地址信息填写错误"
        },
        {
          key: "2",
          val: "商品信息填写错误"
        },
        {
          key: "3",
          val: "不想要了"
        },
        {
          key: "4",
          val: "商品无货"
        },
        {
          key: "5",
          val: "商品降价"
        }
      ],
      update: false
    };
  },
  created() {
    this.itemId = this.$route.query.id;
  },
  mounted() {
    this.init();
  },
  methods: {
    hideReasonSelect() {
      this.showPanel = false;
      this.showBg = false;
    },
    handleCancel() {
      this.showBg = true;
      this.showPanel = true;
    },
    init() {
      let params = {
        id: this.$route.query.orderId
      }
      this.$http.get("/Focus-BladeX-BootX/orderinformation/detail", params).then(res => {
        console.log("data", res.data)
        this.orderDetail = res.data
      })
      this.countDown(this.orderDetail.time);
    },
    // 倒计时
    countDown(endTimeStr) {
      let endTime = new Date(endTimeStr).getTime();
      let startTime = new Date().getTime();
      let differ = parseInt((endTime - startTime) / 1000);
      if (differ <= 0) {
        this.orderDetail.orderStatus = '60';
        return;
      };
      let modulo = differ % (60 * 60 * 24); // 取模（余数）
      modulo = modulo % (60 * 60);
      let minutes = Math.floor(modulo / 60);
      minutes = +minutes < 10 ? '0' + minutes : minutes;
      let seconds = modulo % 60;
      seconds = +seconds < 10 ? '0' + seconds : seconds;
      this.restTime = [minutes, seconds];
      setTimeout(() => {
        this.countDown(endTimeStr);
      }, 1000)
    },
    back() {
      let param = {
        tabIndex: this.$route.query.tabIndex,
        chooseIndex: this.$route.query.chooseIndex
      };
      if (this.update) {
        param['update'] = '1';
      }
      this.REPLACE({
        path: "order-list",
        query: param
      })
    },
    judgeShow(arr, param) {
      arr = arr instanceof Array ? arr : [arr];
      return arr.indexOf(param) != -1;
    },
    // 取消订单
    abolishOrder() {
      this.$dialog.confirm({
        title: "提示",
        mes: "确认取消？",
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              let params = {
                id: this.$route.query.orderId,
                orderStatus: '120',
                cancelReason: this.cancelReason
              }
              this.$http.post("/Focus-BladeX-BootX/orderinformation/updateOrderStatus", params).then(res => {
                this.handleResult(res, '确认取消', () => {
                  this.init();
                  this.showBg = false;
                  this.showPanel = false;
                  this.update = true;
                });
              })
            }
          },
          {
            txt: "取消",
            color: false,
            callback: () => {}
          }
        ]
      })
    },
    // 删除订单
    delOrder() {
      this.$dialog.confirm({
        title: "提示",
        mes: "确认删除？",
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              let params = {
                ids: this.$route.query.orderId
              }
              this.$http.get("/Focus-BladeX-BootX/orderinformation/remove", params).then(res => {
                this.handleResult(res, '删除', () => {
                  this.update = true;
                  this.back();
                });
              })
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
    // 再次购买
    reBuy() {
      let params = {
        orderId: this.$route.query.orderId
      }
      this.$http.post("/Focus-BladeX-BootX/orderinformation/placeOrderAgain", params).then(res => {
        this.PUSH({ path: "shopping-cart", query: { ids: res.id } })
      })
    },
    // 确认收货
    confirmReceipt() {
      let params = {
        orderStatus: '50',
        id: this.$route.query.orderId
      }
      this.$http.post("/Focus-BladeX-BootX/orderinformation/updateOrderStatus", params).then(res => {
        this.handleResult(res, '确认收货', () => {
          this.update = true;
          this.init();
        });
      })
    },
    handleResult(res, text, cb) {
      if (res.code == 200) {
        this.$dialog.toast({
          mes: "订单已" + text,
          timeout: 1000,
          callback: () => {
            cb && cb();
          }
        });
      } else {
        this.$dialog.toast({
          mes: "订单" + text + "失败",
          timeout: 1500
        });
      }
    },
    goMyCard() {
      if (this.orderDetail.productIsVirtual == 20) {
        this.PUSH({ path: "/card" });
      }
    },
    // 查看物流信息
    checkWl() {
      this.PUSH({
        path: "/order-tracking",
        query: {
          id: this.$route.query.orderId,
          courierservices: this.orderDetail.courierServices,
          trackingnumber: this.orderDetail.trackingNumber
        }
      });
    },
    cashPay(id) {
      this.pay({ orderId: id })
    }
  }
};
</script>

<style lang="scss">
.order-detail-page {
  .pr {
    position: relative;
  }
  .bold {
    font-weight: bold;
  }
  .gap {
    height: 0.1rem;
    background-color: #F5F5F5;
  }
  .text-hidden-2 {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
  .content {
    height: calc(100vh - 0.88rem);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #F5F5F5;
    .c-body {
      background-color: #fff;
    }
    .wl{
      color: #66A7F6;
      font-size:.24rem;
      line-height:.3rem;
      color:rgba(6,141,249,1);
      padding: .2rem .4rem 0 .4rem;
      text-align: left;
      margin-bottom: .4rem;
      .track{
        width: .4rem;
      }
      .wl_info{
        padding:0 .2rem;
      }
    }
    .order-status {
      // height: 1.52rem;
      padding: 0.32rem 0.4rem;
      background:linear-gradient(90deg,rgba(0,128,255,1) 0%,rgba(106,169,246,1) 100%);
      color: #fff;
      text-align: left;
      .right {
        width: 2rem;
        text-align: center;
        position: absolute;
        right: 0;
        top: 0.12rem;
        p {
          margin: 0 auto;
        }
        .re-buy {
          margin-bottom: 0.1rem;
        }
        span{
          font-size: 0.2rem;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.02rem;
        }
      }
      .status-text {
        font-size: 0.32rem;
        margin-bottom: .1rem;
      }
      .need-pay {
        margin-top: 0.14rem;
      }
      span {
        font-size: 0.24rem;
      }
      .re-buy {
        width: 1.52rem;
        height: 0.52rem;
        line-height: 0.52rem;
        text-align: center;
        border-radius: 0.32rem;
        color: #068DF9;
        background-color: #fff;
        font-weight: bold;
      }
    }
    .process {
      margin-top: 0.36rem;
      color: rgba(255, 255, 255, 0.8);
      .fa-truck {
        width: 0.4rem;
        height: 0.4rem;
        font-size: 0.4rem;
        margin-right: 0.22rem;
      }
      .fa-angle-right {
        margin-left: 0.12rem;
      }
    }
    .status {
      width: 100%;
      height: 2rem;
      background-color: #ff7647;
      background: linear-gradient(
        27deg,
        rgba(255, 75, 75, 0.98),
        rgba(255, 43, 68, 0.98)
      );
      padding: 0 0.47rem 0 0.4rem;
      & > div {
        text-align: left;
        p {
          color: #ffffff;
          font-size: 0.24rem;
          &:first-child {
            font-weight: bold;
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
          }
        }
      }
      img {
        width: 1.8rem;
        height: 1.8rem;
      }
    }
    .express-status {
      padding-left: 0.4rem;
      padding: 0.67rem 0 0.35rem 0.4rem;
      position: relative;
      overflow: hidden;
      &:after {
        content: "";
        height: 1px;
        width: 100%;
        background-color: #f4f4f4;
        position: absolute;
        left: 0.4rem;
        bottom: 0;
      }
      .fa {
        position: absolute;
        top: 0.7rem;
        &.fa-truck {
          color: #999999;
          left: 0.4rem;
        }
        &.fa-angle-right {
          right: 0.4rem;
        }
      }
      p {
        text-align: left;
        padding-left: 0.4rem;
        font-size: 0.3rem;
        padding-right: 0.6rem;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .address {
      color: rgba(51,51,51,1);
      font-size: 0.3rem;
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      .no {
        height: 100%;
        font-size: 0.32rem;
        .fa {
          font-size: 0.4rem;
        }
      }
      .yes {
        flex: 1;
        & > div {
          padding-left: 0.2rem;
          .name {
            font-weight: bold;
            background-size: 0.22rem;
            background-repeat: no-repeat;
            background-position: center left;
          }
          &:last-child {
            text-align: left;
            overflow: hidden;
            line-height: 1.4;
            position: relative;
            .fa {
              position: absolute;
              right: 0rem;
              bottom: 0;
              font-size: 0.4rem;
            }
          }
        }
      }
      .address-text {
        color: #ABABAB;
        font-size: 0.24rem;
      }
      .address-icon {
        width: 0.4rem;
      }
    }
    .title2 {
      // padding: 0.4rem;
      padding: 0 0.4rem 0.4rem 0.4rem;
      font-size: 0.3rem;
      height: 0.72rem;
      line-height: 0.72rem;
      border-bottom: 1px solid #F8F8F8;
    }
    .commodity {
      overflow: hidden;
      // padding-bottom: 0.25rem;
      padding: 0.24rem 0;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
      & > img {
        width: 2rem;
        height: 2rem;
        float: left;
        border-radius: 0.1rem;
        border: 1px solid #eeeeee;
      }
      & > div {
        margin-left: 2.26rem;
        .name {
          font-size: 0.26rem;
          text-align: left;
          line-height: 1.5;
          height: 0.8rem;
          font-weight: bold;
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
        .count {
          text-align: right;
          color: #999999;
          .yd-spinner {
            height: 0.4rem !important;
            width: 1.6rem !important;
          }
        }
        .price {
          color: #FF2626;
          font-size: 0.2rem;
          .price-num {
            font-size: 0.32rem;
          }
          img {
            width: 0.2rem;
            height: 0.2rem;
          }
        }
      }
    }
    .line {
      height: 1px;
      width: 100%;
      margin-left: 0.4rem;
      background-color: #f4f4f4;
    }
    .order-info {
      padding-top: 0.2rem;
    }
    .soccer-account {
      font-size: 0.26rem;
      font-weight: bold;
      color: #999999;
      height: 0.6rem;
      span {
        line-height: 0.6rem;
      }
      span:last-child {
        font-weight: normal;
      }
      &.pay {
        color: #333333;
        font-size: 0.28rem;
        height: 0.8rem;
        line-height: 0.8rem;
        border-top: 1px solid #F8F8F8;
        margin-top: 0.2rem;
        span {
          line-height: 0.8rem;
        }
        span:last-child {
          color: #ff2b44;
        }
      }
    }
    .operate {
      & > div {
        line-height: 1.2rem;
      }
      text-align: right;
      height: 1.2rem;
      line-height: 1.2rem;
      .btn {
        width: 1.64rem;
        height: 0.64rem;
        line-height: 0.64rem;
        display: inline-block;
        text-align: center;
        border-radius: 0.32rem;
        &.cancel {
          color: #FF2626;
          border: 1px solid #FF2626;
        }
        &.confirm {
          color: #fff;
          background-color: #FF2626;
          margin: 0 0.2rem 0 0.36rem;
        }
      }
    }
  }
  .bg {
    background-color: #000000;
    opacity: 0.6;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
  }
   .spec-panel {
    position: fixed;
    right: 0;
    left: 0;
    z-index: 6;
    // height: 9rem;
    background-color: #ffffff;
    border-radius: 0.2rem 0.2rem 0 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 0.3rem 0.4rem 0.44rem;
    .s-p-title {
      text-align: center;
      position: relative;
      color: #1D2023;
      font-size: 0.3rem;
      .fa-close {
        position: absolute;
        right: 0;
        color: #ABABAB;
      }
    }
    .tip {
      background-color: #f3f3f3;
      padding: 0.2rem 0.4rem;
      border-radius: 0.2rem;
      margin: 0.4rem 0;
      p {
        line-height: 0.32rem;
        font-size: 0.22rem;
        color: #606972;
      }
      .tip-title {
        color: #3B97FA;
        font-size: 0.24rem;
        margin-bottom: 0.1rem;
      }
    }
    .yd-radio {
      display: block;
      margin-top: 0.4rem;
      padding-right: 0;
      .yd-radio-icon {
        width: 0.34rem !important;
        height: 0.34rem !important;
        float: right;
      }
      .yd-radio-text {
        font-size: 0.26rem;
      }
    }
    .btn {
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      border-radius: 0.6rem;
      color: #fff;
      margin-top: 0.8rem;
      background-color: #DCDCDC;
      &.active {
        background-color: #1391F9;
      }
    }
  }
  .slideUp-enter-active,
  .slideUp-leave-active {
    transition: all 0.2s;
  }
  .slideUp-enter-to {
    bottom: 0;
  }
  .slideUp-enter, .slideUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
    bottom: -9rem !important;
  }
}
</style>
