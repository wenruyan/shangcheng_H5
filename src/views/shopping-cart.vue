<template>
  <div class="shopping-cart-page" :class="{'shopping-cart-tabbar': hasTabbar}">
    <div class="shopping-cart-nav">
      <button type="button" class="shopping-cart-back" @click="GO(-1)" v-if="!hasTabbar">
        <i class="yd-back-icon"/>
      </button>
      <h3>购物车</h3>
    </div>
    <div class="shopping-cart-top"  v-if="page.list.length > 0">
      <yd-checkbox shape="circle" color="#FF2626" :value="isSelectedAll" @input="toggleSelectedAll">全选</yd-checkbox>
      <button type="button" @click="batchDel">
        <img src="../assets/img/icon-trash@3x.png"/>
      </button>
    </div>
    <div class="shopping-cart-list">
      <mescroll-vue  :down="mescrollDown" :up="mescrollUp" @init="ms => mescroll = ms">
        <shopping-cart-item
          v-for="(item, index) in page.list" :key="index"
          :item="item" @jump="jump" @select="select" :selected="selected.indexOf(item) >= 0"
          @change-spec="changeSpec" @change-num="changeNum"
          @delete="del" :disabled="item.salestatus == 10"
        />
        <div class="shopping-cart-tip" v-if="page.empty">
          <img src="../assets/img/shopping-cart-empty.png"/>
          <P>购物车内暂无商品</P>
          <p>快去看看有什么东西可以兑换</p>
          <button type="button" @click="PUSH('/')">去逛逛</button>
        </div>

        <commodity-recommend @success="recommendAddSucc" :list="recommend.list" v-if="!page.hasNextPage"/>
      </mescroll-vue>
    </div>

    <div class="shopping-cart-operate">
      <yd-checkbox shape="circle" color="#FF2626" :value="isSelectedAll" @input="toggleSelectedAll">全选</yd-checkbox>

      <p>合计：<strong>{{totalCost}}</strong></p>
      <button type="button" @click="checkOut">去结算</button>
    </div>
  </div>
</template>

<script>
import CommodityRecommend from '../components/CommodityRecommend.vue';
import MescrollVue from "mescroll.js/mescroll.vue";
import PointsIcon from '../assets/img/icon-points.png';
import QuickSkuSelect from '../components/QuickSkuSelect';
import _ from 'lodash';

export default {
  name: 'shopping-cart',
  data() {
    return {
      hasTabbar: true,
      mescroll: null,
      mescrollDown: {
        use: true,
        callback: this.refresh
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.loadmore,
        auto: false,
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 12 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        loadFull: {
          use: true,
          delay: 500
        }
      },
      page: {
        list: [],
        hasNextPage: true,
        empty: false
      },
      recommend: {
        current: 0,
        size: 12,
        list: [],
        hasNextPage: true
      },
      autoSelected: '',
      selected: []
    }
  },
  computed: {
    // 是否选中全部
    isSelectedAll() {
      if (this.page.list.length == 0) return false;

      return this.page.list.filter(i => this.selected.indexOf(i) < 0).length == 0;
    },
    totalCost() {
      return this.selected.map(i => i.sku.closePrice * i.quantity).reduce((acc, val) => (acc += val), 0)
    }
  },
  methods: {
    recommendAddSucc() {
      this.refresh(this.mescroll)
    },
    checkOut() {
      if (this.selected.length == 0) {
        return this.$dialog.toast({
          mes: '没有商品可以结算哦'
        })
      }

      if (!this.isLogin) {
        return this.$dialog.confirm({
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
              color: false
            }
          ]
        });
      }

      const cartIds = this.selected.map(i => i.id).join(',');

      this.PUSH({
        path: '/submit-order',
        query: { cartIds, jf: this.totalCost }
      });
    },
    select({ value, item }) {
      const index = this.selected.indexOf(item);
      if (value && index < 0) this.selected.push(item)
      if (!value && index >= 0) this.selected.splice(index, 1)
    },
    toggleSelectedAll(val) {
      this.selected = val ? [...this.page.list] : [];
    },
    jump(item) {
      this.PUSH(`/commodity/detail?id=${item.productList}`)
    },
    changeNum: _.throttle(function({ value, item }) {
      const old = item.quantity;
      this.updateSpec({
        id: item.id,
        productList: item.productList,
        productSku: item.productSku,
        quantity: value
      }).then(res => {
        item.quantity = value;
        this.$store.commit('increaseCartCount', value - old)
      })
    }, 500),
    changeSpec(event) {
      const { item, choosedSku, count } = event;
      this.updateSpec({
        id: item.id,
        productList: item.productList,
        productSku: choosedSku.id,
        quantity: count
      }).then(res => {
        this.refresh(this.mescroll)
      })
    },
    updateSpec(params, refresh, callback) {
      return this.$http.post('/Focus-BladeX-BootX/shoppingcartrecord/update', params)
    },
    // 批量删除
    batchDel() {
      if (this.selected.length == 0) {
        return this.$dialog.toast({
          mes: '你还没有选择商品哦'
        })
      }

      this.$dialog.confirm({
        title: '提示',
        mes: '确认删除？',
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              const ids = this.selected.map(i => i.id).join(',')
              return this.doRemove(ids).then(res => {
                this.refresh(this.mescroll)
              })
            }
          },
          {
            txt: "取消",
            color: false
          }
        ]
      });
    },
    // 单个删除
    del(item) {
      this.$dialog.confirm({
        title: '提示',
        mes: '确认删除？',
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              return this.doRemove(item.id).then(res => {
                this.refresh(this.mescroll)
              })
            }
          },
          {
            txt: "取消",
            color: false
          }
        ]
      });
    },
    doRemove(ids) {
      return this.$http.post('/Focus-BladeX-BootX/shoppingcartrecord/remove', { ids }, { emulateJSON: false })
    },
    refresh(mescroll) {
      this.recommend.current = 0;
      this.recommend.list = [];
      this.recommend.hasNextPage = true;

      this.page.list = [];
      this.page.hasNextPage = true;
      this.page.empty = false;

      mescroll.hideUpScroll(true);
      mescroll.resetUpScroll();
    },
    loadmore(page, mescroll) {
      if (!this.page.hasNextPage) return this.loadRecommend(page, mescroll);

      this.fetchData().then(res => {
        const data = res.data;

        this.page.list = this.page.list.concat(data);
        this.page.empty = this.page.list.length == 0;
        this.page.hasNextPage = false;

        this.$store.commit('updateCartCount', this.page.list.reduce((acc, i) => {
          acc += i.quantity
          return acc;
        }, 0));

        if (this.autoSelected) {
          this.$nextTick(() => {
            const selected = this.page.list.filter(i => this.autoSelected.indexOf(i.id) >= 0);
            this.selected = this.selected.concat(selected)
          })
        }
      }).catch(err => {
        console.log("err", err);
        this.page.hasNextPage = false;
        this.page.empty = true;
      }).finally(() => {
        mescroll.endSuccess(12, true);
      })
    },
    loadRecommend(page, mescroll) {
      const params = {
        current: this.recommend.current + 1,
        size: this.recommend.size
      }

      this.fetchRecommend(params).then(data => {
        const records = Array.isArray(data.records) ? data.records : [];
        const { current, total, size } = data;
        this.recommend.list = this.recommend.list.concat(records);
        this.recommend.current = current;

        const hasNextPage = current >= total / size
        this.recommend.hasNextPage = hasNextPage;
        mescroll.endSuccess(records.length, hasNextPage);
      }).catch(err => {
        console.log("err", err);
        mescroll.endErr();
      })
    },
    fetchData(params = {}) {
      const query = {
        cuserinfo: this.$store.state.userId
      }

      return this.$http.get('/Focus-BladeX-BootX/shoppingcartrecord/all', query)
    },
    fetchRecommend(params) {
      const query = {
        ...params
      };

      return this.$http.get("/Focus-BladeX-BootX/productlist/preProductList", query).then(res => {
        return res.data;
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const param = to.query.showTabbar;
      const hiddenTabbar = (typeof param == 'string' && param == 'false') || param === false;

      vm.hasTabbar = !hiddenTabbar;
      vm.autoSelected = to.query.ids;
    })
  },
  components: {
    [CommodityRecommend.name]: CommodityRecommend,
    MescrollVue,
    'shopping-cart-item': {
      name: 'shopping-cart-item',
      props: {
        item: {
          type: Object,
          default: false
        },
        disabled: {
          type: Boolean,
          default: false
        },
        selected: {
          type: Boolean,
          default: false
        }
      },
      methods: {
        select(value) {
          this.$emit('select', { value, item: this.item });
        },
        changeSpec(e) {
          e.stopPropagation();
          if (this.disabled) return;

          const props = {
            id: this.item.productList,
            buyCount: this.item.quantity,
            skuSelectedData: this.item.sku,
            operate: 'update'
          }

          QuickSkuSelect(props).then(res => {
            this.$emit('change-spec', { ...res, item: this.item });
          }).catch(e => {
            console.log(e.message)
          })
        },
        changeNum(value) {
          if (this.disabled) return;
          this.$emit('change-num', { value, item: this.item });
        },
        jump() {
          if (this.disabled) return;
          this.$emit('jump', this.item)
        },
        createCellSwipeRight(item) {
          return [{
            content: '删除',
            style: { background: '#FF2626', color: '#fff', width: '1.2rem', fontSize: '0.28rem', textAlign: 'center', lineHeight: '2.24rem' },
            handler: () => this.$emit('delete', item)
          }]
        }
      },
      render() {
        const item = this.item;
        const product = item.product || {};
        const sku = item.sku || {};
        const curSpec = Array.isArray(item.curSpec) ? item.curSpec : [];

        const title = product.productTitle || '';
        const image = item.mainPic || '';

        const spec = curSpec.map(i => i.productAttributeName).join(',');
        const warning = sku.stock < sku.inventoryearly;
        const quantity = item.quantity;
        const isSingle = product.notes == '10';

        return (
          <mt-cell-swipe right={this.createCellSwipeRight(this.item)}>
            <div class="shopping-cart-item" slot="title" onClick={this.jump}>
              <yd-checkbox value={this.selected} onInput={this.select} shape="circle" color="#FF2626" disabled={this.disabled} nativeOnClick={e => e.stopPropagation()}/>
              <img src={image}/>
              <div class="shopping-cart-item-main needsclick">
                <p class={['shopping-cart-item-name', this.disabled ? 'shopping-cart-is-disabled' : '']}>{title}</p>
                <div class="shopping-cart-item-between" style="margin-bottom: 0.06rem;">
                  {isSingle ? <span class="shopping-cart-item-spec shopping-cart-item-spec-default">默认规格</span> : (
                    <span class="shopping-cart-item-spec" onClick={this.changeSpec}>
                      <span>{spec}</span>
                      <i class="fa fa-angle-down"></i>
                    </span>
                  )}
                  {!this.disabled && warning && <span class="shopping-cart-item-tip">库存紧张</span>}
                </div>
                <div class="shopping-cart-item-between">
                  <div class="shopping-cart-item-price">
                    { /* TODO: 待补全原价 <span>{sku.marketPrice}</span> */ }
                    <strong>{sku.closePrice}</strong>
                    <img src={PointsIcon}/>
                  </div>
                  {
                    this.disabled
                      ? <div class="shopping-cart-item-none">商品已下架</div>
                      : <yd-spinner value={quantity} onInput={this.changeNum} height="0.48rem" width="1.5rem" nativeOnClick={e => e.stopPropagation()}/>
                  }
                </div>
              </div>
            </div>
          </mt-cell-swipe>
        )
      }
    }
  }
}
</script>

<style lang="scss">
.shopping-cart-page{
  position: relative;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  background-color: #F5F5F5;
  overflow: hidden;

  .commodity-recommend{
    margin-top: 0.2rem;
  }

  &.shopping-cart-tabbar{
    padding-bottom: 0.98rem;
  }
}

.shopping-cart-top{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 0.8rem;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #F5F5F5;

  .yd-checkbox{
    line-height: 0.8rem;
    padding-left: 0.3rem;

    & > span{
      vertical-align: middle;
    }
  }

  .yd-checkbox-text{
    font-size: 0.24rem;
    color: #666666;
    margin-left: 0.16rem;
  }

  button{
    padding: 0 0.4rem 0 0.2rem;
    border: none;
    background-color: transparent;
    outline: none;
    color: #999999;
    font-size: 0.4rem;

    img{
      width: 0.6rem;
    }
  }
}

.shopping-cart-list{
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .mint-cell-wrapper{
    padding-left: 0;
    background-image: none;
  }
}

.shopping-cart-nav{
  height: 0.84rem;
  background-color: #fff;
  position: relative;

  h3{
    color: #333333;
    text-align: center;
    font-size: 0.32rem;
    line-height: 0.84rem;
  }

  .shopping-cart-back{
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 0.3rem;
    border: none;
    outline: none;
    height: 100%;
    color: #666666;

    i::before{
      font-size: 0.36rem;
    }
  }
}

.shopping-cart-tip{
  padding: 0.8rem 0 0.5rem 0;
  text-align: center;
  background-color: #fff;

  img{
    display: block;
    width: 2rem;
    height: 2rem;
    margin: 0 auto 0.16rem auto;
  }

  p{
    line-height: 0.4rem;
    font-size: 0.26rem;
    color: #999;
  }

  button{
    margin-top: 0.34rem;
    width: 2.2rem;
    height: 0.64rem;
    border: 1px solid #FF2626;
    border-radius: 0.36rem;
    color: #FF2626;
    background-color: transparent;
    outline: none;
    padding: 0;
  }
}

.shopping-cart-operate{
  height: 1.2rem;
  background-color: #fff;
  border-top: 1px solid #F5F5F5;
  padding-right: 0.3rem;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  p{
    flex: 1;
    text-align: right;
    color: #666666;
    font-size: 0.24rem;
    padding: 0 0.2rem;

    strong{
      font-size: 0.28rem;
      font-weight: 700;
      color: #FF2626;
    }
  }

  .yd-checkbox{
    height: 1.2rem;
    line-height: 1.2rem;
    padding-left: 0.3rem;

    > span{
      vertical-align: middle;
      font-size: 0.24rem;
      color: #666666;
    }

    .yd-checkbox-icon{
      border-color: #E1E1E1;
    }

    .yd-checkbox-text{
      margin-left: 0.16rem;
    }
  }

  button{
    width: 1.64rem;
    height: 0.64rem;
    color: #fff;
    font-weight: 700;
    font-size: 0.28rem;
    border: none;
    background-color: #FF2626;
    border-radius: 0.32rem;
  }
}

.shopping-cart-item{
  height: 2.24rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  & > img{
    width: 1.8rem;
    height: 1.8rem;
  }

  .yd-checkbox {
    width: 0.9rem;
    padding: 0 0 0 0.3rem;
    line-height: 2.24rem;
  }

  .yd-checkbox-icon{
    vertical-align: middle;
  }

  .yd-checkbox-text{
    display: none;
  }

  .yd-spinner{
    border: 1px solid #F5F5F5;
    border-radius: 0.38rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    & > span{
      float: none;
      width: 0.48rem;
      height: 0.48rem;

      &:before,
      &:after{
        content: none;
      }

      & > i::after{
        color: #999;
      }
    }

    & > input{
      float: none;
      flex: 1;
      width: 0.56rem !important;
      height: 0.48rem;
      // pointer-events: none;
    }

    &:before,
    &:after{
      content: none;
    }
  }
}

.shopping-cart-item-main{
  flex: 1;
  padding-left: 0.1rem;
}

.shopping-cart-item-name{
  font-size: 0.26rem;
  font-weight: 700;
  line-height: 0.36rem;
  color: #333333;
  min-height: 0.72rem;

  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  margin-bottom: 0.1rem;

  &.shopping-cart-is-disabled{
    color: #999999;
  }
}

.shopping-cart-item-price{
  color: #FF2626;

  span{
    font-size: 0.2rem;
  }

  strong{
    font-weight: 700;
    font-size: 0.32rem;
    line-height: 0.44rem;
  }

  img{
     width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.06rem;
  }
}

.shopping-cart-item-none{
  font-size: 0.24rem;
  color: #999;
}

.shopping-cart-item-spec{
  background-color: #F8F8F8;
  border: 1px solid #F5F5F5;
  color: #999999;
  font-size: 0.22rem;
  padding: 0.04rem 0.4rem 0.04rem 0.16rem;
  display: inline-block;
  position: relative;
  border-radius: 0.2rem;
  line-height: 0.28rem;

  i.fa-angle-down{
    position: absolute;
    top: 0;
    right: 0;

    width: 0.36rem;
    height: 0.36rem;
    line-height: 0.36rem;
    font-size: 0.28rem;
    text-align: center;
  }

  &.shopping-cart-item-spec-default{
    padding-right: 0.16rem;
  }
}

.shopping-cart-item-between{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.shopping-cart-item-tip{
  font-size: 0.2rem;
  line-height: 0.36rem;
  color: #FF2626;
}
</style>
