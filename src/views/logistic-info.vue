<template>
  <div class="page logistic-info-page">
    <yd-navbar
      :title="$route.meta.title"
      height="0.84rem"
      border-color="#E8E6E6"
    >
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <div class="innerContent" style="width:100%;height:100%;overflow-y:auto;">
        <div class="flex">
          <div>
            <img
              src="../assets/img/phone.png"
              alt=""
              style="width: 1.8rem;height:1.8rem"
            />
          </div>
          <div class="flex flex-cross-center" style="margin-left:.34rem">
            <div
              style="font-size:.26rem;color:#333;font-weight:bold"
              class="detail"
            >
              <p>
                物流状态：
                <span style="color:#FF2B44">派送中</span>
              </p>
              <p>
                物流公司：
                <span>圆通快递</span>
              </p>
              <p>
                物流单号：
                <span>123456789</span>
              </p>
            </div>
          </div>
        </div>
        <div style="position:relative;font-size:.36rem;color:#333">
          <img src="../assets/img/bgMap.png" alt="" />
          <span style="position:absolute;top:.4rem;left:.3rem">北京</span>
          <span style="position:absolute;top:.4rem;right:.6rem">上海</span>
        </div>
        <ul style="padding-right:.3rem">
          <li
            v-for="item in list"
            :key="item"
            style="color:#999;margin-top:.84rem"
            class="flex"
          >
            <div style="text-align:right;width:2rem">
              <p style="font-size:.3rem;margin-bottom:.1rem">{{ item.time }}</p>
              <p style="font-size:.24rem">{{ item.date }}</p>
            </div>
            <div class="flex" style="align-items: center">
              <img
                src="../assets/img/people.png"
                alt=""
                style="width:.4rem;height:.4rem;max-width:.4rem;margin:0 .3rem;align-items: center;"
              />
            </div>
            <div class="flex" style="align-items: center">
              <span style="align-items: center">{{ item.text }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        },
        {
          date: "2019-03-06",
          time: "12:00",
          text: "上海市上海市上海市上海市上海市上海市上海市上海市"
        }
      ]
    };
  },
  components: {}
};
</script>

<style lang="scss">
.logistic-info-page {
  .content {
    height: calc(100vh - 0.84rem);
    padding: .4rem;
    padding-right: 0;
    .detail p {
      margin-bottom: 0.2rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
