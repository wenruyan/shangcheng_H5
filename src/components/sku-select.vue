<template>
  <div class="sku-select" v-show="show" @click.self="hideSkuSelect('10')">
    <transition name="slideUp">
      <div class="s-s-content" v-if="show" @click.stop>
        <i class="fa fa-close" @click="hideSkuSelect('10')"></i>
        <div class="flex">
          <img :src="choosedSku.skuImage || headPic" alt />
          <div>
            <div class="origin-price">
              <span
                class="integral-icon"
              >{{choosedSku.marketPrice ? choosedSku.marketPrice : comSorce2}}</span>
            </div>
            <div class="sell-price">
              <span
                class="integral-icon"
              >{{choosedSku.closePrice ? choosedSku.closePrice : comSorce}}</span>
            </div>
            <div class="selected-sku">
              <span class="text">已选：</span>
              <span v-if="goodsData.notes == '20'">
                <span
                  class="sku-one"
                  v-for="(item,ind) in choosedAttrText"
                  :key="item"
                >{{item + (ind != choosedAttrText.length-1 ? '，' : '')}}</span>
              </span>
              <span v-else>默认规格</span>
            </div>
          </div>
        </div>
        <div class="info-wrap">
          <div v-if="goodsData.notes == '20'">
            <div class="spec-item" v-for="(item, index) in skuData" :key="index" >
              <div class="title">{{item && item.productSpecificationName}}</div>
              <div class="attr">
                <div
                  class="attr-item"
                  :class="{'choosed': item2.choosed, }"
                  v-for="(item2, index2) in item.children"
                  :key="index2"
                  @click="chooseAttr(index, index2)"
                  v-show="item2.hasStock"
                >{{item2.productAttributeName}}</div>
              </div>
            </div>
          </div>
          <div class="number flex flex-main-justify flex-cross-center">
            <p>数量</p>
            <yd-spinner min="1" unit="1" v-model="count" :callback="changeNumber"></yd-spinner>
          </div>
        </div>
        <!-- type 1：选择规格入口 2：加入购物车入口 3：立即购买入口 -->
        <!-- 点击选择规格进入 -->
        <div class="operate flex flex-cross-center flex-main-justify" v-if="data.skuSelectType == '1'">
          <span class="add-cart" @click="addCart">加入购物车</span>
          <span class="buy" @click="buy">立即购买</span>
        </div>
        <!-- 点击加入购物车或立即购买 -->
        <div class="operate flex flex-cross-center flex-main-justify" v-else>
          <span class="confirm" @click="confirm">确认</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["data", "show"],
  data() {
    return {
      skuData: [],
      imgList: [],
      goodsData: {},
      skuList: [],
      comName: "",
      comSorce: "",
      comSorce2: "",
      isMoreAttr: true,
      choosedSku: {},
      choosedAttr: [],
      choosedAttrText: [],
      count: 1
    };
  },
  computed: {
    headPic() {
      let imgUrl = "";
      this.imgList.map(item => {
        if (item.picType == 10) imgUrl = item.url;
      });
      return imgUrl;
    }
    // count: {
    //   get() {
    //     return this.data.count
    //   },
    //   set() {
    //     // this.count = this.data.count
    //   }
    // }
  },
  watch: {
    data: {
      count(old, now) {
        console.log(now, 'val');
      },
      deep: true
    },
    show(now, val) {
      this.count = this.data.count;
    }
  },
  mounted() {
    console.log(this.data, "skua ");
    // 初始化数据，隐藏选择组件
    this.init();
    this.hideSkuSelect("30");
  },
  methods: {
    init() {
      let data = this.data.goodsData;
      // 商品数据
      // console.log('22222', this.data.goodsData.skus);
      // this.data.goodsData.skus.forEach(i => {
      //   let arr = [];
      //   let a = i.productSpecificationSet.split(',')[0];
      //   let b = i.productSpecificationSet.split(',')[1];
      //   arr = [b, a];
      //   i.productSpecificationSet = arr.join(',');
      // })
      // console.log('333333333', this.data.goodsData.skus);
      this.goodsData = data;
      // 已选规格
      this.skuSelectedData = this.data.skuSelectedData;
      this.imgList = data.pics;
      this.imgCount = this.imgList.length;
      this.skuList = data.skus;
      this.comName = this.goodsData.producttitle;
      // this.numMax = this.goodsData.specifications[0].quantity;
      this.numMax = this.goodsData.skus[0].stock;
      // 判断价格
      let maxPrice = 0;
      let maxPrice2 = 0;
      let minPrice = 99999999999;
      let minPrice2 = 99999999999;
      let stockCount = 0;
      let stockCount2 = 0;
      this.skuList.map(item => {
        stockCount += Number(item.stock);
        stockCount2 += Number(item.stock);
        let itemPrice = item.closePrice;
        let itemPrice2 = item.marketPrice;
        if (itemPrice > maxPrice) {
          maxPrice = itemPrice;
        }
        if (itemPrice2 > maxPrice2) {
          maxPrice2 = itemPrice2;
        }
        if (itemPrice < minPrice) {
          minPrice = itemPrice;
        }
        if (itemPrice2 < minPrice2) {
          minPrice2 = itemPrice2;
        }
      });
      this.stockCount = stockCount || 4;
      this.stockCount2 = stockCount2 || 4;
      if (maxPrice != minPrice) {
        // 对比最大及最小价格
        this.comSorce = minPrice + "~" + maxPrice;
      } else {
        this.comSorce = maxPrice;
      }
      if (maxPrice2 != minPrice2) {
        // 对比最大及最小价格
        this.comSorce2 = minPrice2 + "~" + maxPrice2;
      } else {
        this.comSorce2 = maxPrice2;
      }
      this.isMoreAttr = this.goodsData.specifications.length > 0;
      if (!this.isMoreAttr) {
        this.numMax = this.goodsData.skus[0].stock;
      }
      // 判断库存
      this.skuData = data.specifications.map((item, index) => {
        item.children = item.attributes.map((ele, ind) => {
          // 默认该规格库存
          let hasStock = false;
          data.skus.forEach(i => {
            if (i.productSpecificationSet.split(',').indexOf(ele.id) != -1 && i.stock > 0) {
              hasStock = true;
            }
          })
          ele.hasStock = hasStock;
          // ele.hasStock = true;
          return ele;
        });
        this.choosedAttr.push({});
        return item;
      });
      this.choosedAttrText = this.getAttrText();
      console.log("skuData", this.skuData);
      if (this.skuData.length == 1) {
        this.skuData[0].children.map(item => {
          this.skuList.map(item2 => {
            if (
              item2.productSpecificationSet.split(",")[0] == item.id &&
              item2.stock == 0
            ) {
              item.hasStock = false;
            }
          });
        });
      }
      console.log("data ole");
      console.log(this.skuSelectedData, "skuSelectedData");
      // 传递了已选规格
      if (this.skuSelectedData && this.skuSelectedData.length) {
        this.skuData.forEach((item, index) => {
          item.children.forEach((ele, ind) => {
            if (
              ele.id ==
              this.skuSelectedData.productSpecificationSet.split(",")[index]
            ) {
              this.chooseAttr(index, ind);
            }
          });
        });
      } else {
        this.selectDefault();
      }
    },
    selectDefault() {
      // 默认选中有库存的第一个
      this.skuData.forEach((item, index) => {
        let flag = true;
        item.children.forEach((ele, ind) => {
          if (ele.hasStock && flag) {
            this.chooseAttr(index, ind);
            flag = false;
          }
        })
      });
    },
    hideSkuSelect(hideType = "20") {
      // 如果没有在每种规格中选中一个规格，则选默认
      if (this.choosedAttrText.length < this.skuData.length) {
        this.selectDefault();
      }
      // 返回数据，选中的sku，选中的sku对应的文字展示，数量
      this.$emit("selectSku", {
        choosedSku: this.choosedSku,
        choosedAttrText: this.choosedAttrText,
        count: this.count,
        hideType
      });
      // 隐藏组件
      this.$emit("hideSkuSelect", false);
    },
    changeNumber() {},
    getAttrText() {
      let text = [];
      this.choosedAttr.map(item => {
        if (item.productAttributeName) text.push(item.productAttributeName);
      });
      console.log("text", text);
      return text;
    },
    chooseAttr(cIndex, cIndex2) {
      // 切换显示状态
      let item = this.skuData[cIndex];
      if (item.children[cIndex2].choosed) {
        item.children[cIndex2].choosed = false;
        this.choosedAttr[cIndex] = {};
        this.choosedAttrText = this.getAttrText();
      } else {
        item.children.map(item2 => {
          item2.choosed = false;
        });
        item.children[cIndex2].choosed = true;
        this.choosedAttr[cIndex] = item.children[cIndex2];
        this.choosedAttrText = this.getAttrText();
        // 为了判断当前选中的规格属性没有对应的sku或者对应的sku没有库存， 仅选择第一行规格时判断，因为选择其他行规格时不存在这个问题
        if (cIndex == 0) {
          // 此时判断选中的sku是否存在且有库存
          let hasSku = this.skuList.some((item, index) => {
            return item.productSpecificationSet.split(",").every((item2, index2) => {
              if (index2 < this.choosedAttrText.length) {
                return item2 == this.choosedAttr[index2].id && item.stock > 0
              } else {
                return true
              }
            })
          })
          console.log('hasSku', hasSku)
          if (!hasSku) { // 当前选中的规格属性没有对应的sku或者对应的sku没有库存
            this.choosedAttr.forEach((item, index) => {
              if (index > 0) {
                this.choosedAttr[index] = {} // 对应下标的位置选择的规格置空
                let sItem = this.skuData[index]
                sItem.children.map(item2 => { // 对应的skuData选中样式宣布置空
                  item2.choosed = false;
                });
                this.skuData.splice(index, 1, sItem);
              }
            })
            this.choosedAttrText = this.getAttrText();
          }
        }
      }
      this.skuData.splice(cIndex, 1, item);
      if (this.choosedAttrText.length == this.skuData.length) {
        // 此时所有规格全部选择，展示对应的价格
        let result = {};
        this.skuList.map(item => {
          let yes = true;
          item.productSpecificationSet.split(",").map((item2, index2) => {
            console.log(item2, "id1");
            console.log(this.choosedAttr[index2].id, "id2");
            if (item2 != this.choosedAttr[index2].id) yes = false;
          });
          console.log(yes, "yes");
          if (yes) result = item;
        });
        this.choosedSku = result;
        console.log(this.choosedSku, "choosedsku eeeeee");
        this.numMax = result.stock;
        if (this.numMax == 0) {
        }
      }
      if (
        this.choosedAttrText.length <= this.skuData.length &&
        this.choosedAttrText.length > 0
      ) {
        this.skuData.map(item => {
          item.children.map(item2 => {
            item2.hasStock = false; // 先将所有的都置为无库存
          });
        });
      } else if (this.choosedAttrText.length == 0) {
        this.skuData.map(item => {
          item.children.map(item2 => {
            item2.hasStock = true;
          });
        });
      }
      this.changeStatus(cIndex, cIndex2); // 根据库存筛选显示属性
    },
    changeStatus(cIndex, cIndex2) {
      console.log(this.skuList, "skulist");
      this.skuData.map((item, index) => {
        item.children.map((item2, index2) => {
          // 遍历每一个规格的每一条属性
          let tmpSkuList = [];
          this.skuList.map((item3, index3) => {
            // 遍历每一条sku
            // 当前sku与sku数组的sku相等
            if (item3.productSpecificationSet.split(",")[index] == item2.id) {
              // 当该条sku对应的属性与正在遍历的相等时
              let choosedIndex = []; // 选中的规格索引
              this.choosedAttr.map((item4, index4) => {
                if (item4.id && index != index4) choosedIndex.push(index4);
              });
              let tmpO = true;
              choosedIndex.map(item4 => {
                if (
                  item3.productSpecificationSet.split(",")[item4] !=
                  this.choosedAttr[item4].id
                ) {
                  tmpO = false;
                }
              });
              if (tmpO) {
                tmpSkuList.push(item3);
              }
            }
          });
          if (tmpSkuList.length > 0) {
            let hasStock = false;
            tmpSkuList.map(item3 => {
              if (item3.stock > 0) hasStock = true;
            });
            if (hasStock) {
              item2.hasStock = true;
            } else {
              item2.hasStock = false;
            }
          } else {
            // item2.hasStock = false;
          }
        });
      });
      // 接下来，第一个规格的所有存在sku并且有库存的属性，都显示
      this.skuData[0].children.map((item, index) => {
        let hasStock = this.skuList.some((item2, index2) => {
          return item2.productSpecificationSet.split(",")[0] == item.id && item2.stock > 0
        })
        item.hasStock = hasStock
        // this.choosedAttr[1] = {}
        // this.choosedAttrText = this.getAttrText();
      })
    },
    // 确认
    confirm() {
      this.checkLogin()
        .then(() => {
          // 加入购物车入口
          if (this.data.skuSelectType == '2') {
            this.addCart();
          } else if (this.data.skuSelectType == '3') {
            // 立即购买入口
            this.buy();
          } else if (this.data.skuSelectType == '10') {
            this.$emit("confirmSelectSku", {
              choosedSku: this.choosedSku,
              choosedAttrText: this.choosedAttrText,
              count: this.data.count
            });
          }
        })
    },
    // 加入购物车
    addCart() {
      this.checkLogin()
        .then(() => {
          console.log('登陆了')
          console.log(this.count, 'count');
          let param = {
            productList: this.data.goodsData.id,
            productSku: this.choosedSku.id,
            quantity: this.count,
            cUserInfo: this.$store.state.userId
          };
          this.$http
            .post("/Focus-BladeX-BootX/shoppingcartrecord/save", param)
            .then(res => {
              console.log(res, "添加购物车");
              this.$dialog.toast({
                mes: "添加购物车成功",
                timeout: 1500
              });
              console.log(this.count, 'count');
              this.$store.commit('increaseCartCount', this.count);
              this.hideSkuSelect();
            })
            .catch(err => {
              console.log("err1111", err);
            });
        })
    },
    // 立即购买
    buy() {
      this.checkLogin()
        .then(() => {
          // this.hideSkuSelect();
          this.PUSH({
            path: "/submit-order",
            query: {
              productSkuId: this.choosedSku.id,
              jf: this.choosedSku.closePrice * this.data.count, // 积分
              os: "0" // 平台类型
            }
          });
        })
    }
  }
};
</script>

<style lang="scss">
.sku-select {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  padding-top: 2.18rem;
  z-index: 998;
  .s-s-content {
    background-color: #fff;
    // height: 100%;
    width: 100%;
    border-radius: 0.16rem 0.16rem 0 0;
    padding: 0.6rem 0.3rem 0.3rem 0.3rem;
    position: absolute;
    bottom: 0;
    .fa-close {
      position: absolute;
      right: 0.3rem;
      top: 0.3rem;
      color: #ababab;
      font-weight: normal;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
      margin-right: 0.2rem;
    }
    .origin-price {
      color: #999;
      font-size: 0.2rem;
      text-decoration: line-through;
    }
    .sell-price {
      color: #ff2626;
      font-size: 0.48rem;
      font-weight: bold;
    }
    .selected-sku {
      margin-top: 0.2rem;
      .text {
        color: #999;
        font-size: 0.28rem;
      }
    }
    .info-wrap {
      max-height: 4.87rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .spec-item {
        padding-top: 0.35rem;
        .title {
          font-size: 0.3rem;
          font-weight: bold;
        }
        .attr {
          margin-top: 0.36rem;
          overflow: hidden;
          .attr-item {
            height: 0.6rem;
            line-height: 0.6rem;
            padding: 0 0.32rem;
            font-size: 0.28rem;
            border: 1px solid #f6f6f6;
            background-color: #fff;
            border-radius: 0.3rem;
            float: left;
            margin-right: 0.36rem;
            margin-bottom: 0.2rem;
            &.choosed {
              background-color: #ff2626;
              color: #fff;
            }
          }
        }
      }
      .number {
        margin-top: 0.35rem;
        & > p {
          font-size: 0.3rem;
          font-weight: bold;
        }
        .yd-spinner {
          height: auto !important;
          width: auto !important;
          &:before,
          &:after {
            background: none;
          }
          input {
            width: 0.72rem !important;
            height: 0.6rem !important;
            border-top: 1px solid rgba(245, 245, 245, 1);
            border-bottom: 1px solid rgba(245, 245, 245, 1);
            box-sizing: border-box;
          }
          span {
            width: 0.6rem;
            height: 0.6rem;
            background: none;
            box-sizing: border-box;
          }
          span:first-child {
            border: 1px solid rgba(245, 245, 245, 1);
            border-radius: 0.3rem 0 0 0.3rem;
          }
          span:last-child {
            border: 1px solid rgba(245, 245, 245, 1);
            border-radius: 0 0.3rem 0.3rem 0;
            &:after {
              background: none;
            }
          }
        }
      }
    }
    .operate {
      padding: 0.3rem;
      // position: absolute;
      // bottom: 0;
      // left: 0;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      margin-top: 2rem;
      span {
        width: 50%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.32rem;
        color: #fff;
        &.add-cart {
          background: #13b3ef;
          border-radius: 0.5rem 0 0 0.5rem;
        }
        &.buy {
          background: #068df9;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        &.confirm {
          background: #068df9;
          border-radius: 0.5rem;
          width: 100%;
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
}
</style>
