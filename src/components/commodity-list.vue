<template>
  <div class="commodity-list">
    <div class="list-wrap f-l">
      <div class="item left-item" v-for="(item) in leftListData" :key="item.id" @click="toDetailPage(item)">
        <img :src="decodeURL(item.url)" alt="">
        <p class="name">{{item.itemtitle}}</p>
        <div class="bottom-info flex flex-main-justify flex-cross-bottom">
          <div class="price flex flex-cross-center">
            <img src="../assets/img/price-soccer.png" alt="">
            <span>{{item.priceList.data[0].points}}</span>
            <span>积分</span>
          </div>
          <div class="person">{{changeNumUnit(item.count)}}人付款</div>
        </div>
      </div>
    </div>
    <div class="list-wrap f-r">
      <div class="item right-item" v-for="(item) in rightListData" :key="item.id" @click="toDetailPage(item)">
        <img :src="decodeURL(item.url)" alt="">
        <p class="name">{{item.itemtitle}}</p>
        <div class="bottom-info flex flex-main-justify flex-cross-bottom">
          <div class="price flex flex-cross-center">
            <img src="../assets/img/price-soccer.png" alt="">
            <span>{{item.priceList.data[0].points}}</span>
            <span>积分</span>
          </div>
          <div class="person">{{changeNumUnit(item.count)}}人付款</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommodityList",
  props: {
    listData: {
      type: Array,
      default: () => [
        {
          id: "1",
          img: "../assets/img/index-banner-bg.png",
          soccer: 123,
          person: 1
        },
        {
          id: "12",
          img: "../assets/img/index-banner-bg.png",
          soccer: 123,
          person: 1
        }
      ]
    }
  },
  data() {
    return {};
  },
  computed: {
    leftListData() {
      let arr = [];
      this.listData.forEach((item, index) => {
        if (index % 2 == 0) arr.push(item);
      });
      return arr;
    },
    rightListData() {
      let arr = [];
      this.listData.forEach((item, index) => {
        if (index % 2 == 1) arr.push(item);
      });
      return arr;
    }
  },
  methods: {
    toDetailPage(item) {
      this.PUSH({
        path: "/commodity/detail",
        query: {
          id: item.id,
          skuId: item.skuId
        }
      });
    }
  }
};
</script>
<style lang="scss">
.commodity-list {
  width: 100%;
  overflow: hidden;
  .list-wrap {
    width: 48%;
    .item {
      margin-bottom: 0.25rem;
      & > img {
        width: 100%;
        border-radius: 0.1rem 0.1rem 0 0;
        background-color: #eeeeee;
        min-height: 3rem;
        min-width: 100%;
      }
      .name {
        margin: 0.2rem 0 0.18rem;
        font-size: 0.28rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bottom-info {
        .price {
          height: 0.36rem;
          position: relative;
          img {
            width: 0.24rem;
            height: 0.24rem;
            margin-right: 0.06rem;
          }
          span {
            font-size: 0.3rem;
            color: #ff2b44;
            font-weight: bold;
            &:last-child {
              font-size: 0.36rem;
              transform: scale(0.5);
              display: inline-block;
              margin-left: -0.15rem;
              position: absolute;
              right: -0.6rem;
              top: 0;
            }
          }
        }
        .person {
          font-size: 0.22rem;
          color: #999999;
          height: 0.36rem;
          line-height: 0.36rem;
        }
      }
    }
  }
}
</style>
