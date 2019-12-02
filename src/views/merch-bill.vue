<template>
  <div class="merch-bill">
     <yd-navbar
      :title="$route.meta.title"
      height="0.84rem"
      border-color="#E8E6E6"
    >
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="list pd-wrap flex" v-for="(item,index) in list" :key="index">
      <img class="item_img" :src="item.mainImgUrl">
      <!-- <img class="item_img" src="../assets/img/express-status-2.png"> -->
      <div class="flex flex-dir-top flex-main-justify flex-1">
        <p class="name">{{ item.name }}</p>
        <p class="sku">
          <span v-for="(ele, index) in item.sku.attrs" :key="index">{{ ele.productAttributeName }},</span>
        </p>
        <div class="flex flex-main-justify flex-cross-center bottom ">
          <span class="paypricejf paypricejf-icon">
            {{ item.goodsPriceJf }}
            <img class="icon_jf" src="@/assets/img/price-soccer.png">
          </span>
          <span class="mount">x{{ item.quantity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      list: [
        {
          id: '1',
          imgUrl: '../assets/img/express-status-2.png',
          name: 'Apple iPhone 11 (A2223) 128GB黑色 移动联通电信4G手机 双卡双待',
          sku: [
            '黑色', '128G', '移动回购版', '官方标配'
          ],
          payPriceJf: '18520',
          quantity: 3
        }
      ]
    };
  },
  mounted() {
    this.list = this.$store.state.merchBillData
    console.log(this.list)
  },
  methods: {
    // loadList(page, mescroll) {
    //   let params = {
    //     current: page.num,
    //     size: page.size,
    //     orderInformation: this.$route.query.orderInformation
    //   }
    //   this.$http.get("/Focus-BladeX-BootX/orderiteminfo/page", params).then(res => {
    //     console.log(res.data.records)
    //     this.list = res.data.records
    //     mescroll.endSuccess(this.list.length);
    //   })
    // },
  }
}
</script>

<style lang="scss">
.merch-bill {
  .list {
    padding-top: 0.24rem;
    padding-bottom: 0.24rem;
    border-bottom: 1px solid #F8F8F8;
    &:last-child {
      border-bottom: none;
    }
    .item_img {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: 0.2rem;
    }
    .name {
      color: #333;
      font-size: 0.26rem;
      font-weight: bold;
      line-height: 0.36rem;
    }
    .sku {
      color: #999;
      font-size: 0.26rem;
    }
    .bottom {
      height: 0.44rem;
    }
    .paypricejf {
      color: #FF2626;
      font-size: 0.32rem;
    }
    .mount {
      color: #666;
      font-size: 0.26rem;
    }
    .icon_jf{
      width: .2rem;
      height: .2rem;
    }
  }
}
</style>
