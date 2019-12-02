<template>
  <div class="commodity-choice">
    <div class="header flex flex-main-justify flex-cross-center">
      <div class="title">{{itemData.name}}</div>
      <div class="go" @click="PUSH({path: '/commodity', query: {id: itemData.id, title: itemData.name}})">去逛逛 ></div>
    </div>
    <div class="slide-wrap">
      <yd-slider autoplay="3000">
        <yd-slider-item v-for="(page,pageIndex) in formatList" :key="pageIndex">
          <!-- <img class="slider-pic" :src="decodeURL(item.url)"> -->
          <div class="item flex flex-cross-bottom f-l" v-for="(item, index) in page" :key="index" @click="PUSH({path: '/commodity/detail', query: {id: item.id}})">
            <img class="main-pic" :src="item.url" alt="">
            <div class="info">
              <div class="name">{{item.productTitle}}</div>
              <div class="price flex flex-cross-center">{{item.closePrice}}<img src="../assets/img/integral-icon.png" alt=""></div>
            </div>
          </div>
        </yd-slider-item>
      </yd-slider>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommodityChoice",
  props: {
    itemData: {},
    listData: {
      type: Array,
      default: () => [
        {
          id: "1",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜资生堂芬浓透润美容液发膜'
        },
        {
          id: "12",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜'
        },
        {
          id: "12",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜'
        },
        {
          id: "12",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜'
        },
        {
          id: "12",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜'
        },
        {
          id: "12",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜'
        },
        {
          id: "12",
          img: "https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/aa64034f78f0f736a4a890f80955b319eac413f0.jpg",
          soccer: 123,
          person: 1,
          title: '资生堂芬浓透润美容液发膜'
        }
      ]
    }
  },
  data() {
    return {};
  },
  computed: {
    formatList() {
      let arr = []
      this.listData.forEach((item, index) => {
        if (index < 6) {
          if (arr[0]) {
            arr[0].push(item)
          } else {
            arr[0] = [item]
          }
        } else {
          if (arr[1]) {
            arr[1].push(item);
          } else {
            arr[1] = [item]
          }
        }
      });
      return arr
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
.commodity-choice {
  width: 100%;
  height: 6.6rem;
  overflow: hidden;
  margin-top: 0.2rem;
  background-color: #fff;
  .header {
    padding: 0.22rem 0.3rem;
    .title {
      font-size: 0.32rem;
      color: #333333;
      font-weight: bold;
    }
    .go {
      font-size: 0.24rem;
      color: #999999;
    }
  }
  .slide-wrap {
    height: 5.7rem;
    .yd-slider {
      height: 100%;
      .yd-slider-pagination {
        .yd-slider-pagination-item {
          background-color: #333333;
        }
        .yd-slider-pagination-item-active {
          background-color: #000000!important;
        }
      }
    }
    .item {
      width: 50%;
      box-sizing: border-box;
      padding-left: 0.3rem;
      margin-bottom: 0.22rem;
      .main-pic {
        width: 1.52rem;
        height: 1.52rem;
        margin-right: 0.16rem;
      }
      .info {
        .name {
          height: 0.68rem;
          line-height: 0.35rem;
          overflow: hidden;
          font-size: 0.24rem;
          color: #333333;
          font-weight: 400;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .price {
          margin-top: 0.34rem;
          font-size: 0.28rem;
          color: #FF2626;
          font-weight: bold;
          img {
            width: 0.25rem;
            height: 0.25rem;
            display: inline-block;
            margin-left: 0.14rem;
          }
        }
      }
    }
  }
}
</style>
