<template>
  <div class="order-ones">
    <div class="order-one" v-for="(item, index) in data" :key="index">
      <div class="o-o-header flex flex-cross-center flex-main-justify">
        <span>{{ item.orderId }}</span>
        <!-- {{ statusObj[item.orderStatus] }} -->
        <span
          class="status"
          v-if="item.orderStatus == '60' || item.orderStatus == '120'"
          :class="{'gray':item.orderStatus == '50' || item.orderStatus == '60' || item.orderStatus == '120'}"
        >已取消</span>
        <span
          class="status"
          v-if="item.orderStatus == '50'"
          :class="{'gray':item.orderStatus == '50' || item.orderStatus == '60' || item.orderStatus == '120'}"
        >已完成</span>
        <span
          class="status"
          v-if="item.orderStatus == '20'"
        >等待发货</span>
        <span
          class="status"
          v-if="item.orderStatus == '30'"
        >等待收货</span>
        <span
          class="status"
          v-if="item.orderStatus == '130' || item.orderStatus == '10'"
        >等待付款</span>
      </div>
      <div class="o-o-content">
        <div
          class="o-o-body single flex flex-cross-center flex-main-justify"
          v-if="item.itemInfoVOs.length == 1"
          @click="goOrderDetail(item)"
        >
          <img :src="item.itemInfoVOs[0].sku.skuImage?item.itemInfoVOs[0].sku.skuImage:item.itemInfoVOs[0].pic.url" alt />
          <div class="right">
            <p class="name text-hidden-2">{{ item.itemInfoVOs[0].name }}</p>
            <div>
              <span class="sku" v-for="(e, i) in item.itemInfoVOs[0].sku.attrs" :key="i">{{ e + ',' }}</span>
            </div>
            <p class="quantity">x{{ item.itemInfoVOs[0].quantity }}</p>
          </div>
        </div>
        <div
          class="o-o-body multiple flex flex-cross-center flex-main-justify"
          v-else
          @click="goOrderDetail(item)"
        >
          <div class="img-box">
            <img  :src="ele.sku.skuImage?ele.sku.skuImage:ele.pic.url" v-for="(ele,index) in item.itemInfoVOs.slice(0,4)" :key="index" alt />
          </div>
          <div class="flex flex-cross-center">
            <span class="mount">共{{item.itemInfoVOs.length}}件</span>
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
        <div>
          <div @click="goTrack(item)" class="track-box" v-if="item.orderStatus == '30'">
            <img class="track" src="../assets/img/delevery_track.png" alt="">
            <div class="text">{{item.latestOrderTrack}}</div>
            <i class="fa fa-angle-right"></i>
          </div>
          <p class="rest-time" v-if="item.orderStatus == '10' || item.orderStatus == '130'">
            剩余
            <yd-countdown :time="item.countdown" format="{%h}时{%m}分"></yd-countdown>
          </p>
          <p class="need-money" v-if="judge(['10', '130'], item.orderStatus)">
            需付：
            <span>￥ {{item.payPriceCash/100}}</span>
          </p>
          <p class="need-money" v-if="judge(['20', '30', '50'], item.orderStatus)">
            合计：
            <span v-if="item.payPriceCash && !item.payPriceJf">￥{{item.payPriceCash/100}}</span>
            <span v-if="item.payPriceJf && !item.payPriceCash">{{item.payPriceJf}} 积分</span>
            <span v-if="item.payPriceJf && item.payPriceCash">{{item.payPriceJf}} 积分 + ￥{{item.payPriceCash/100}}</span>
          </p>
        </div>
        <div class="operate">
          <!-- <span class="btn gray" v-if="item.orderStatus != '120'" @click="goContact">联系客服</span> -->
          <span class="btn gray" v-if="judge(['30'], item.orderStatus)" @click="reBuy">再次购买</span>
          <span class="btn gray" v-if="judge(['50', '60', '120'], item.orderStatus)" @click="beforeDelOrder(item, index)">删除订单</span>
          <span
            class="btn red"
            v-if="judge(['30'], item.orderStatus)"
            @click="beforeConfirmReceipt(item, index)"
          >确认收货</span>
          <span class="btn red" v-if="judge(['10', '130'], item.orderStatus)" @click="cashPay(item.id)">支付</span>
          <span
            class="btn red"
            v-if="judge(['20', '50', '120', '60'], item.orderStatus)"
            @click="reBuy(item)"
          >再次购买</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data", 'tabIndex', 'chooseIndex'],
  data() {
    return {
      statusObj: {
        "10": "已下单",
        "20": "已支付",
        "30": "已发货",
        // "40": "已到货",
        "50": "已完成",
        "60": "交易关闭",
        "120": "已取消",
        "130": "待付款"
      }
    };
  },
  mounted() {
    console.log(this.data, "data");
    console.log(this.tabIndex, "tabIndex");
    console.log(this.chooseIndex, "chooseIndex");
  },
  methods: {
    // 根据订单状态判断是否显示
    judge(arr, orderStatus) {
      arr = arr instanceof Array ? arr : [arr];
      return arr.indexOf(orderStatus) != -1;
    },
    // 联系客服
    goContact() {},
    // 删除订单
    beforeDelOrder(item, index) {
      console.log(111111111);
      console.log(item);
      console.log(index);
      this.$dialog.confirm({
        title: "提示",
        mes: "确认要删除该订单吗？",
        opts: [
          {
            txt: "删除",
            color: true,
            callback: () => {
              this.delOrder(item, index);
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
    delOrder(item, index) {
      let param = {
        ids: item.id
      };
      this.$http
        .get("/Focus-BladeX-BootX/orderinformation/remove", param)
        .then(res => {
          console.log("res", res);
          if (res.code == 200) {
            this.$dialog.toast({
              mes: "删除成功",
              timeout: 1500,
              callback: () => {}
            });
            this.data.splice(index, 1);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 确认收货
    beforeConfirmReceipt(item, index) {
      this.$dialog.confirm({
        title: "提示",
        mes: "确认要收货该订单吗？",
        opts: [
          {
            txt: "确认收货",
            color: true,
            callback: () => {
              this.confirmReceipt(item, index);
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
    confirmReceipt(item, index) {
      let param = {
        id: item.id,
        orderStatus: "50"
      };
      this.$http
        .post("/Focus-BladeX-BootX/orderinformation/updateOrderStatus", param)
        .then(res => {
          console.log("res", res);
          if (res.code == 200) {
            this.$dialog.toast({
              mes: "确认收货成功",
              timeout: 1500,
              callback: () => {}
            });
            this.data.splice(index, 1);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 支付
    cashPay(id) {
      this.pay({ orderId: id })
    },
    // 再次购买
    reBuy(item) {
      let param = {
        orderId: item.id
      };
      this.$http
        .post("/Focus-BladeX-BootX/orderinformation/placeOrderAgain", param)
        .then(res => {
          console.log("res", res);
          if (res.code == 200) {
            console.log(res.data.join(","))
            this.PUSH({
              path: "/shopping-cart",
              query: {
                ids: res.data.join(","),
                showTabbar: false
              }
            });
          }
          if (res.code == 206) {
            this.$dialog.toast({
              mes: res.msg,
              timeout: 1500,
              callback: () => {}
            });
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    // 去订单详情
    goOrderDetail(item) {
      console.log(item);
      this.PUSH({
        path: "/order-detail",
        query: {
          orderId: item.id,
          tabIndex: this.tabIndex,
          chooseIndex: this.chooseIndex
        }
      });
    },
    // 去物流
    goTrack(item) {
      console.log(item);
      this.PUSH({
        path: "/order-tracking",
        query: {
          id: item.id,
          trackingnumber: item.trackingNumber,
          courierservices: item.courierServices
        }
      });
    }
  }
};
</script>

<style lang="scss">
.order-ones {
  .track-box {
    width: 100%;
    height: 1rem;
    display: flex;
    align-items: center;
    color: #999;
    font-size: 0.2rem;
    padding: 0.2rem 0;
    border-bottom: 1px solid #F8F8F8;
    margin: 0.2rem 0;
    .text {
      width: 5.78rem;
      padding: 0 0.2rem;
      line-height: 0.3rem;
    }
    .track {
      width: 0.4rem;
      height: 0.4rem;
    }
    .fa {
      color: #ababab;
      font-size: 0.4rem;
    }
  }
  .text-hidden-2 {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
  .order-one {
    margin-bottom: 0.1rem;
    background-color: #fff;
    .o-o-header {
      height: 0.72rem;
      border-bottom: 1px solid #f8f8f8;
      padding: 0 0.4rem;
      .status {
        color: #ffaa00;
        &.gray {
          color: #ababab;
        }
      }
    }
    .o-o-content {
      padding: 0 0.3rem;
    }
    .o-o-body {
      padding-top: 0.2rem;
      .mount {
        color: #666;
        font-size: 0.24rem;
        margin-right: 0.2rem;
      }
      .fa {
        color: #ababab;
        font-size: 0.4rem;
      }
    }
    .single {
      img {
        width: 1.8rem;
        height: 1.8rem;
        margin-right: 0.2rem;
      }
    }
    .multiple {
      img {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.2rem;
      }
    }
    .right {
      height: 1.8rem;
      flex: 1;
      .name {
        color: #333;
        font-size: 0.26rem;
        font-weight: bold;
        line-height: 0.36rem;
        margin-bottom: 0.08rem;
      }
      .sku {
        color: #999;
        font-size: 0.22rem;
      }
      .quantity {
        color: #666;
        font-size: 0.26rem;
        text-align: right;
        margin-right: 0.14rem;
      }
    }
    .rest-time {
      text-align: right;
      font-size: 0.22rem;
      color: #999;
      margin: 0.08rem 0 0.04rem 0;
    }
    .need-money {
      font-size: 0.28rem;
      color: #333;
      text-align: right;
      span {
        color: #ff2626;
      }
    }
    .operate {
      border-top: 1px solid #f8f8f8;
      text-align: right;
      height: 1rem;
      line-height: 1rem;
      margin-top: 0.2rem;
      .btn {
        width: 1.44rem;
        height: 0.56rem;
        line-height: 0.56rem;
        text-align: center;
        border: 1px solid;
        border-radius: 0.32rem;
        display: inline-block;
        margin-left: 0.2rem;
        font-size: 0.24rem;
        &.gray {
          border-color: #e1e1e1;
          color: #666;
        }
        &.red {
          border-color: #ff2626;
          color: #ff2626;
        }
      }
    }
  }
}
</style>
