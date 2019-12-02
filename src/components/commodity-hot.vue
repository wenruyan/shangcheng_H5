<template>
  <div class="commodity-hot">
    <div class="header flex flex-main-justify flex-cross-center">
      <div class="title">{{itemData.name}}</div>
      <div class="go" @click="PUSH({path: '/commodity', query: {id: itemData.id, title: itemData.name}})">去逛逛 ></div>
    </div>
    <div class="slide-wrap">
      <div class="slide" :style="{'width': listData.length * 2.28 + 0.3 + 'rem'}">
        <div class="item f-l" v-for="(item, index) in listData" :key="index" @click="PUSH({path: '/commodity/detail', query: {id: item.id}})">
          <img class="main-pic" :src="item.url" alt="">
          <div class="name">{{item.productTitle}}</div>
          <!-- 活动价格，后台未返回该标志，暂定aaa -->
          <div class="old-price flex flex-cross-center" v-if="item.aaa
">{{item.marketPrice}}<img src="../assets/img/integral-icon.png" alt=""></div>
          <div class="price flex flex-cross-center">{{item.closePrice}}<img src="../assets/img/integral-icon.png" alt=""></div>
          <div class="cart" @click.stop="addCart(item)">
            <i class="yd-icon-shopcart-outline"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuickSkuSelect from '../components/QuickSkuSelect';
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
    },
    addCart(item) {
      // this.$emit('addCart', item)
      return QuickSkuSelect({ id: item.id }).then(data => {
        const { choosedSku, count } = data;
        console.log(111111, data)
        const path = '/Focus-BladeX-BootX/shoppingcartrecord/save'
        const query = {
          productList: item.id,
          productSku: choosedSku.id,
          quantity: count,
          cUserInfo: this.$store.state.userId || 2572033778385410
        }
        return this.$http.post(path, query).then(res => {
          return { count, res };
        })
      }).then(data => {
        this.$store.commit('increaseCartCount', data.count)
        this.$dialog.toast({
          mes: "添加成功，商品已经在购物车了",
          timeout: 1500
        });
      }).catch(err => {
        console.log(err.message)
      })
    }
  }
};
</script>
<style lang="scss">
.commodity-hot {
  width: 100%;
  height: 4.74rem;
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
    height: 3.86rem;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    .slide {
      height: 100%;
      padding-left: 0.28rem;
      .item {
        width: 2.08rem;
        margin-right: 0.2rem;
        position: relative;
        .main-pic {
          width: 2.08rem;
          height: 2.08rem;
        }
        .name {
          width: 100%;
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
        .old-price {
          margin-top: 0.04rem;
          font-size: 0.2rem;
          color: #999999;
          text-decoration: line-through;
          img {
            width: 0.25rem;
            height: 0.25rem;
            display: inline-block;
            margin-left: 0.14rem;
          }
        }
        .price {
          margin-top: 0.06rem;
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
        .cart {
          font-size: 0.32rem;
          color: #FF2626;
          padding: 0.14rem 0 0 0.3rem;
          position: absolute;
          right: 0.2rem;
          bottom: 0;
        }
      }
    }
  }
}
</style>
