<template>
<div>
  <div class="page commodity-detail-page" v-if="showPage">
     <yd-navbar height="0.84rem" border-color="#E8E6E6">
        <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </div>
        <div class="search-box" slot="center">
          <div class="search" @click="goSearch">
            <i class="fa fa-search"></i>
            <span>搜索热词</span>
          </div>
        </div>
    </yd-navbar>
    <div class="content t-c">
      <div class="pic-slider pd-wrap">
        <yd-slider autoplay="3000" :show-pagination="false" :callback="slideChangeEnd">
          <yd-slider-item v-for="(item,index) in imgList" :key="index">
            <img :src="decodeURL(item.url)">
          </yd-slider-item>
        </yd-slider>
        <div class="pagination">{{nowIndex + '/' + this.imgCount}}</div>
      </div>
      <div class="name pd-wrap">{{ goodsData.productTitle }}</div>
      <div class="item-name pd-wrap">{{ goodsData.itemTitle }}</div>
      <div class="flex flex-cross-center flex-main-justify pd-wrap price-sale">
        <div>
          <div class="origin-price" v-if="activityProduct">
            <span class="integral-icon">{{ choosedSku.marketPrice }}</span>
          </div>
          <div class="sell-price">
            <span class="integral-icon">{{ choosedSku.closePrice }}</span>
          </div>
        </div>
        <div class="sales-num-box">已出售<span class="sales-num"> {{ goodsData.soldCount }}</span></div>
      </div>
      <div class="line-gray"></div>
      <div class="specification pd-wrap flex flex-main-justify flex-cross-center" v-if="isMoreAttr" @click="select">
        <div >
          <span>选择</span>
          <span v-if="choosedAttrText.length == 0">选择规格分类</span>
          <span v-else>{{choosedAttrText.join('，')}}</span>
        </div>
        <img src="../assets/img/more.png" class="more" alt="">
      </div>
      <div class="specification pd-wrap flex flex-main-justify flex-cross-center" v-else @click="select">
        <div >
          <span>选择</span>
          <span>默认规格</span>
        </div>
        <img src="../assets/img/more.png" class="more" alt="">
      </div>
      <div class="line-gray" v-if="isMoreAttr"></div>
      <div class="title2 pd-wrap">商品详情</div>
      <div class="detail pd-wrap">
        <div v-for="(item, index) in content" :key="index">
          <img :src="decodeURL(item)" alt="" v-if="regHttp(item)">
          <p v-else v-html="item"></p>
        </div>
      </div>
    </div>
    <div class="footer flex flex-main-justify flex-cross-center">
      <div class="collect t-c flex">
        <!-- <div>
          <i class="fa fa-headphones" style="color:#666666;"></i>
          <p>客服</p>
        </div> -->
        <div @click="clickCollect" class="collect-box">
          <img src="../assets/img/collect.png" alt="" v-if="goodsData.collectedFlag == 'false' || !goodsData.collectedFlag">
          <img src="../assets/img/collect-active.png" alt="" v-else>
          <p v-if="goodsData.collectedFlag == 'true' || goodsData.collectedFlag">已收藏</p>
          <p v-else>收藏</p>
        </div>
        <div @click="PUSH({path: '/shopping-cart', query: {showTabbar: false}})">
           <!-- <yd-icon name="shopcart-outline" size="0.38rem" color="#666666;"></yd-icon> -->
          <div class="cart-icon">
            <img src="../assets/img/shopping_cart.png" alt="">
            <span class="cart-num" v-if="$store.state.cartCount > 0">{{$store.state.cartCount}}</span>
          </div>
          <p>购物车</p>
        </div>
      </div>
      <div class="operate flex">
        <span class="btn add-to-card" @click="addCart">加入购物车</span>
        <span class="btn buy" @click="submit">立即购买</span>
      </div>
    </div>
    <!-- 选择规格组件 -->
    <sku-select :show="skuSelectShow" :type="skuSelectType" @hideSkuSelect="hideSkuSelect" @selectSku="selectSku" :data="skuSelectData" :count="skuSelectCount"></sku-select>
  </div>
</div>
</template>

<script>
import SkuSelect from '../components/sku-select'
export default {
  name: "commodity-detail",
  components: { SkuSelect },
  data() {
    return {
      // 搜索值
      searchVal: '',
      // loading: false,
      fullscreenLoading: true,
      showPage: false,
      showCollectText: true,
      numMax: 9999,
      goodsId: "",
      showType: "",
      Filter: "",
      imgCount: "",
      nowIndex: 1,
      collected: false,
      showBg: false,
      showPanel: false,
      buyCount: 1,
      imgList: [],
      listData: [],
      goodsData: {},
      skuList: [],
      comName: "",
      comSorce: "",
      content: [],
      skuData: [],
      isMoreAttr: false,
      choosedSku: {},
      choosedAttr: [],
      choosedAttrText: [],
      skuId: "",
      num: "",
      activityProduct: false,
      noStock: "",
      skuSelectShow: false,
      skuSelectType: '1',
      skuSelectCount: 1,
      skuSelectData: {},
      skuSelectedData: {}
    };
  },
  created() {
    this.goodsId = this.$route.query.id;
    this.skuId = this.$route.query.skuId;
    // this.showType = this.$route.query.showType;
    // this.Filter = this.$route.query.Filter;
    setTimeout(() => {

    }, 1000);
  },
  mounted() {
    this.init();
    // this.customBackKey(() => {
    //   // window.api.sendEvent({
    //   this.changePanelVisible(false);
    //   // extra: {}
    //   // });
    // });
    // this.cancleCustomBackKey();
  },
  computed: {
    headPic() {
      let imgUrl = "";
      this.imgList.map(item => {
        if (item.type == 10) imgUrl = item.url;
      });
      return imgUrl;
    }
  },
  watch: {
    numMax() {
      if (this.buyCount > this.numMax) {
        this.buyCount = 1;
      }
    }
  },
  methods: {
    // 去购物车
    goShoppingCart() {
      this.PUSH({ path: "/shopping-cart" });
    },
    // 选择完sku回调
    selectSku(data) {
      console.log(data, 'selectSku');
      console.log('啧啧啧');
      this.choosedAttrText = data.choosedAttrText;
      this.choosedSku = data.choosedSku;
    },
    hideSkuSelect(val) {
      this.skuSelectShow = val;
    },
    // 去搜索页
    goSearch() {
      this.PUSH({ path: "/search" });
    },
    showNumber(val, num) {
      this.buyCount = num;
      if (num > this.numMax) {
        this.$dialog.toast({
          mes: "商品已达到上限",
          timeout: 1500,
          callback: () => {
            // this.GO(-1);
          }
        });
        this.buyCount = this.numMax;
      }
    },
    init() {
      let param = {
        id: this.$route.query.id,
        // id: '1197472734609514497',
        cuserinfo: 66
        // skuId: this.skuId
      };
      this.$http
        .get("/Focus-BladeX-BootX/productlist/detail",
          param
        )
        .then(res => {
          console.log(res);
          // eslint-disable-next-line no-debugger
          // debugger
          let data = res.data;
          // this.skuSelectData = data;
          this.imgList = data.pics;
          this.imgCount = this.imgList.length;
          this.goodsData = data;
          this.skuSelectData['goodsData'] = this.goodsData;
          this.skuSelectData['skuSelectType'] = '1';
          this.skuList = data.skus;
          // this.skuSelectedData = this.skuList[0];
          this.content = this.goodsData.productDescription.split(",");
          this.comName = this.goodsData.producttitle;
          this.fullscreenLoading = false;
          this.showPage = true;
          // this.isMoreAttr = this.goodsData.specifications.length > 0;
          // notes 10:单规格 20:多规格
          this.isMoreAttr = this.goodsData.notes == '20';
          if (!this.isMoreAttr) {
            this.numMax = this.goodsData.skus[0].stock;
          }
          console.log("skuData", this.skuData);
        })
        .catch(err => {
          console.log("err1111", err);
        });
    },
    slideChangeEnd(index) {
      this.nowIndex = index + 1;
    },
    select() {
      this.changePanelVisible(true, this.showSkuSelect({
        show: true,
        type: '1',
        count: 1
      }))
    },
    changePanelVisible(val, cb) {
      if (!this.$store.state.userId) {
        this.customBackKey(() => {
          document.querySelector(".yd-confirm-btn.default").click();
        });
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
              color: false,
              callback: () => {
                this.cancleCustomBackKey();
              }
            }
          ]
        });
        return false;
      }
      if (this.stockCount == 0) {
        this.$dialog.toast({
          mes: "该商品已无存货",
          timeout: 300
        });
        return false;
      }
      // this.showBg = val;
      // this.showPanel = val;
      if (val) {
        this.changeStatusColor("#6A6A6A");
      } else {
        this.changeStatusColor("#FFFFFF");
      }
      cb && cb();
    },
    // 加入购物车
    addCart() {
      this.showSkuSelect({
        show: true,
        type: '2',
        count: 1
      })
    },
    // 显示规格选择组件
    showSkuSelect(obj) {
      this.skuSelectShow = obj.show;
      this.skuSelectData['count'] = obj.count;
      this.skuSelectData['skuSelectType'] = obj.type;
    },
    submit() {
      this.showSkuSelect({
        show: true,
        type: '3',
        count: 1
      })
      if (!this.$store.state.userId) {
        this.customBackKey(() => {
          document.querySelector(".yd-confirm-btn.default").click();
        });
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
              color: false,
              callback: () => {
                this.cancleCustomBackKey();
              }
            }
          ]
        });
        return false;
      }
    },
    clickCollect() {
      if (!this.isLogin) {
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
        return false;
      }
      // this.collected = !this.collected;
      if (!this.goodsData.collectedFlag) {
        let param = {
          productList: this.goodsData.id
        };
        this.$http
          .post("/Focus-BladeX-BootX/productcollect/submit", param)
          .then(res => {
            console.log(res);
            this.$dialog.toast({
              mes: "收藏成功",
              timeout: 300
            });
            this.goodsData.collectedFlag = true;
          })
          .catch(err => {
            console.log("err1111", err);
          });
      } else {
        let param = {
          productList: this.goodsData.id
        };
        this.$http
          .post("/Focus-BladeX-BootX/productcollect/remove", param)
          .then(res => {
            this.showCollectText = true;
            console.log(res);
            this.goodsData.collectedFlag = false;
            this.$dialog.toast({
              mes: "取消收藏成功",
              timeout: 300
            });
          })
          .catch(err => {
            console.log("err1111", err);
          });
      }
    }
  }
};
</script>

<style lang="scss">
.commodity-detail-page {
  height: 100vh;
  .home {
    width: 0.36rem;
    height: 0.32rem;
  }
  .yd-navbar-center-box {
    width: 6rem;
    margin-left: 1.2rem;
    .search-box {
      width: 100%;
    }
    &>span {
      width: 1rem;
    }
    .search {
      width: 6rem;
      height: 0.6rem;
      line-height: 0.6rem;
      border: 1px solid #E1E1E1;
      border-radius: 0.3rem;
      flex: 1;
      text-align: left;
      padding-left: 0.24rem;
      color: #CFCFCF;
      font-size: 0.24rem;
      i {
        margin-right: 0.24rem;
      }
    }
  }
  .content {
    height: calc(100vh - 1.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .yd-slider-item {
      height: 6.08rem;
    }
    .pic-slider {
      position: relative;
      margin-top: 0.4rem;
      padding: 0;
      min-height: 6.08rem;
      // .yd-slider-item img {
      //   height: 6.08rem;
      // }
      .pagination {
        padding: 0.07rem 0.32rem;
        color: #ffffff;
        font-weight: bold;
        position: absolute;
        right: 0.6rem;
        bottom: 0.34rem;
        z-index: 1;
        background-color: rgba($color: #000000, $alpha: 0.4);
        opacity: 0.7;
        font-size: 0.28rem;
        border-radius: 1rem;
      }
    }
    .name {
      font-size: 0.36rem;
      line-height: 0.54rem;
      text-align: left;
      font-weight: bold;
      margin-top: 0.4rem;
    }
    .origin-price {
      font-size: 0.2rem;
      color: #999;
      text-decoration: line-through;
      text-align: left;
    }
    .sell-price {
      font-size: 0.48rem;
      color: #FF2626;
      text-align: left;
    }
    .item-name {
      color: #999;
      font-size: 0.24rem;
      text-align: left;
    }
    .price-sale {
      padding-bottom: 0.16rem;
      margin-top: 0.14rem;
    }
    .sales-num-box {
      font-size: 0.24rem;
      color: #666;
      .sales-num {
        color: #FF2626;
      }
    }
    .price {
      height: 0.36rem;
      img {
        width: 0.32rem;
        height: 0.32rem;
        margin-right: 0.1rem;
      }
      span {
        font-size: 0.46rem;
        color: #ff2b44;
        font-weight: bold;
        &:nth-child(2) {
          position: relative;
          top: 0.1rem;
        }
        &:last-child {
          font-size: 0.44rem;
          transform: scale(0.5);
          display: inline-block;
          transform-origin: bottom;
          margin-left: -0.15rem;
        }
      }
    }
    .collectionPerson {
      margin-top: 0.15rem;
      color: #999999;
      & > div {
        height: 0.6rem;
        line-height: 0.6rem;
        width: 100%;
        div {
          font-size: 0.44rem;
          transform: scale(0.5);
          &:first-child {
            transform-origin: left;
          }
          &:last-child {
            transform-origin: right;
          }
        }
      }
    }
    .specification {
      height: 0.88rem;
      line-height: 0.88rem;
      font-size: 0.26rem;
      position: relative;
      .more {
        width: 0.4rem;
      }
      &::after {
        content: "";
        // height: 1px;
        position: absolute;
        left: 0.4rem;
        right: 0.4rem;
        top: 0;
        background-color: #e6e6e6;
      }
      & > div {
        span:first-child {
          color: #999999;
          margin-right: 0.3rem;
        }
      }
      .fa-ellipsis-h {
        color: #ABABAB;
      }
    }
    .title2 {
      font-size: 0.34rem;
      text-align: center;
      height: 0.88rem;
      line-height: 0.88rem;
    }
  }
  .footer {
    // height: 1.34rem;
    // padding: 0 0.17rem 0 0.4rem;
    .collect {
      width: 3.5rem;
      padding: 0 0.4rem;
      img {
        width: 0.44rem;
        height: 0.44rem;
      }
      div {
        flex: 1;
      }
      .fa {
        font-size: 0.44rem;
        display: block;
      }
      .cart-icon {
        position: relative;
        .cart-num {
          position: absolute;
          left: 50%;
          // transform: translateX(-10%);
          top: 0;
          background-color: #FF2626;
          border-radius: 0.12rem;
          font-size: 0.18rem;
          color: #fff;
          padding: 0 0.08rem;
          height: 0.24rem;
          line-height: 0.24rem;
        }
      }
      p {
        font-size: 0.2rem;
        // transform: scale(0.5);
        transform-origin: bottom;
        display: inline-block;
        width: 1.2rem;
        height: 0.2rem;
        color: #999;
      }
    }
    .operate {
      .btn {
        display: inline-block;
        height: 1rem;
        line-height: 1rem;
        color: #fff;
        font-size: 0.28rem;
        width: 2rem;
        text-align: center;
      }
      .add-to-card {
        background-color: #13B3EF;
      }
      .buy {
        background-color: #068DF9;
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
