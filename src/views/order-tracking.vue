<template>
  <div class="order-tracking" v-if="show">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
        <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </div>
    </yd-navbar>
    <div class="">
      <div class="order-info pd-wrap">
        <div class="o-i-one flex flex-main-justify">
          <span>订单编号</span>
          <span>{{orderDetail.orderID}}</span>
        </div>
        <div class="o-i-one flex flex-main-justify">
          <span>下单时间</span>
          <span>{{orderDetail.orderCreateDate}}</span>
        </div>
        <div class="o-i-one flex flex-main-justify">
          <span>运单号</span>
          <span>{{orderDetail.trackingnumber}}</span>
        </div>
        <div class="o-i-one flex flex-main-justify">
          <span>物流公司</span>
          <span>{{ orderDetail.orderTrack.company.fullname }}</span>
        </div>
      </div>
      <yd-timeline>
        <yd-timeline-item v-for="(item, ind) in orderDetail.orderTrack.info.context" :key="item.time">
            <p :class="{'lately':ind == 0}">{{ item.desc }}</p>
            <p class="time">{{ moment(item.time).format("YYYY-MM-DD HH:mm:ss") }}</p>
        </yd-timeline-item>
      </yd-timeline>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      orderDetail: {}
    };
  },
  created() {
    let param = {
      trackingnumber: this.$route.query.trackingnumber,
      courierservices: this.$route.query.courierservices,
      id: this.$route.query.id
    };
    this.$http
      .get("/Focus-BladeX-BootX/orderinformation/ordertracking", param)
      .then(res => {
        console.log(res, "物流信息");
        console.log(JSON.parse(res.data.orderTrack).data, "物流信息");
        this.orderDetail = res.data;
        this.orderDetail.orderTrack = JSON.parse(res.data.orderTrack).data;
        this.show = true;
      })
      .catch(err => {
        console.log("err1111", err);
      });
  }
}
</script>

<style lang="scss">
  .order-tracking {
    height: calc(100vh);
    background-color: #F5F5F5;
    .order-info {
      background-color: #fff;
      padding-top: 0.3rem;
      padding: 0.3rem;
      margin-bottom: 0.1rem;
      .o-i-one {
        span {
          font-size: 0.24rem;
          line-height: 0.48rem;
        }
        span:first-child {
          color: #666;
        }
        span:last-child {
          color: #333;
        }
      }
    }
    .lately {
      color: #068DF9;
    }
    .yd-timeline-item {
      font-size: 0.24rem;
      p {
        line-height: 0.3rem;
      }
      .time {
        font-size: 0.2rem;
        color: #666;
        margin-top: 0.08rem;
      }
      em {
        width: 0.22rem;
        height: 0.22rem;
      }
    }
    .yd-timeline-item:first-child {
      & > .yd-timeline-icon {
        background-color: #0080FF;
      }
    }
    .yd-timeline-item:first-child:before {
      background-color: rgba(0, 128, 255, 0.2);
    }
    .yd-timeline-custom-item:not(:last-child):after, .yd-timeline-item:not(:last-child):after {
      background: none;
    }
  }
</style>
