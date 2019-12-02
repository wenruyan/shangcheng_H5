<template>
<div class="commodity-list-item" @click="jump">
  <img :src="item.url"/>
  <div class="commodity-list-item-content">
    <p class="commodity-list-item-title">{{item.productTitle}}</p>
    <div class="commodity-list-item-footer">
      <div>
        <!-- TODO: 原价 -->
        <!-- <div class="commodity-list-item-origin-price">
          <span>169000</span>
          <img class="commodity-list-item-points" src="../assets/img/icon-points.png"/>
        </div> -->
        <div class="commodity-list-item-price">
          <strong>{{item.price}}</strong>
          <img class="commodity-list-item-points" src="../assets/img/icon-points.png"/>
        </div>
      </div>
      <button type="button" class="commodity-list-item-add" @click.stop="add">
        <i class="yd-icon-shopcart-outline"></i>
      </button>
    </div>
  </div>
</div>
</template>

<script>
import QuickSkuSelect from '../components/QuickSkuSelect';

export default {
  name: 'commodity-list-item',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    add() {
      return QuickSkuSelect({ id: this.item.productId }).then(data => {
        const { choosedSku, count } = data;
        const path = '/Focus-BladeX-BootX/shoppingcartrecord/save'
        const query = {
          productList: this.item.productId,
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
        this.$emit('success')
      }).catch(err => {
        console.log(err.message)
      })
    },
    jump() {
      this.$emit('jump', this.item)
    }
  }
}
</script>

<style lang="scss">
.commodity-list-item{
  padding: 0.2rem 0.3rem 0.24rem 0.3rem;

  display: flex;
  flex-flow: row nowrap;
  background-color: #fff;

  & > img {
    display: block;
    height: 1.8rem;
    width: 1.8rem;
    margin-right: 0.2rem;
  }

  & + .commodity-list-item{
    border-top: 1px solid #F5F5F5;
  }
}

.commodity-list-item-content{
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}

.commodity-list-item-title{
  color: #333;
  line-height: 0.32rem;
  font-weight: 700;
  font-size: 0.26rem;

  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.commodity-list-item-footer{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-end;
  height: 0.44rem;
}

.commodity-list-item-price{
  color: #FF2626;

  span{
    font-size: 0.2rem;
  }

  strong{
    font-weight: 700;
    font-size: 0.32rem;
    line-height: 0.44rem;
  }
}

.commodity-list-item-origin-price{
  color: #999;
  font-size: 0.2rem;
  text-decoration: line-through;
}

.commodity-list-item-points{
  width: 0.2rem;
  height: 0.2rem;
  margin-left: 0.06rem;
}

.commodity-list-item-add{
  width: 0.72rem;
  height: 0.72rem;
  border: none;
  padding: 0;
  margin: 0;
  outline: none;
  color: #FF2626;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 0.05rem;

  i{
    font-size: 0.36rem;
  }
}
</style>
