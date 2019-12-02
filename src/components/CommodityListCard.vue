<template>
  <div class="commodity-list-card" @click="jump">
    <img :src="item.url"/>
    <p class="commodity-list-card-title">{{item.productTitle}}</p>
    <div class="commodity-list-card-footer">
      <div>
        <!-- TODO: 活动价 -->
        <!-- <div class="commodity-list-card-origin-price" v-if="item.price">
          <span>{{item.price}}</span>
          <img class="commodity-list-card-points" src="../assets/img/icon-points.png"/>
        </div> -->
        <div class="commodity-list-card-price">
          <strong>{{item.price}}</strong>
          <img class="commodity-list-card-points" src="../assets/img/icon-points.png"/>
        </div>
      </div>
      <button type="button" class="commodity-list-card-add" @click.stop="add">
        <i class="yd-icon-shopcart-outline"></i>
      </button>
    </div>
  </div>
</template>

<script>
import QuickSkuSelect from '../components/QuickSkuSelect';

export default {
  name: 'commodity-list-card',
  props: {
    item: {
      type: Object,
      default() {
        return {}
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
      this.$emit('jump', this.item);
    }
  }
}
</script>

<style lang="scss">
.commodity-list-card{
  background-color: #fff;
  width: 3.5rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;

  & > img{
    display: block;
    width: 3.5rem;
    height: 3.5rem;
    margin: 0 auto;
  }
}

.commodity-list-card-title{
  padding: 0 0.18rem;
  margin: 0.1rem 0 0.08rem 0;
  font-size: 0.26rem;
  font-weight: 700;
  line-height: 0.36rem;
  color: #333333;
  min-height: 0.72rem;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.commodity-list-card-footer{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 0.18rem 0.2rem 0.18rem;
}

.commodity-list-card-price{
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

.commodity-list-card-origin-price{
  color: #999;
  font-size: 0.2rem;
  text-decoration: line-through;
  line-height: 0.28rem;
}

.commodity-list-card-points{
  width: 0.2rem;
  height: 0.2rem;
  margin-left: 0.06rem;
}

.commodity-list-card-add{
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

  i{
    font-size: 0.36rem;
  }
}
</style>
