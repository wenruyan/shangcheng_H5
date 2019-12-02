<template>
  <div class="my-card-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="list-wrap" id="list-wrap">
          <div v-for="(item, index) in listData" :key="index">
            <!-- 已使用/已过期 -->
            <mt-cell-swipe
            title="" class="111" v-if="(item.cardtype == '40' || item.cardtype == '20') && (item.status=='100' || item.status=='110')" :right="[{
                content: '删除',
                style: { width: '1rem', height: '1rem', backgroundColor: '#FF2B44', padding: '0', borderRadius: '100%', margin: '0.5rem 0.3rem 0 0', textAlign: 'center', color: '#FFFFFF' },
                handler: () => optItem('del', item, index)
              }]">
              <div slot="title" class="item flex flex-cross-center gray">
                <img :src="item.skuimage" alt="">
                <div class="text">
                  <div class="title">{{item.cardName}}</div>
                  <div class="date" v-if="item.status!='100' && item.cardtype == '40'">到期日：{{moment(item.endtime).format('YYYY-MM-DD')}}</div>
                  <div class="date" v-else></div>
                  <div class="type type1" >{{item.cardtype == '40' ? "兑换码" : "福利券"}}</div>
                </div>
                <div class="btn btn1 gray" @click="toDetail(item)" v-if="item.status==100">已使用</div>
                <div class="btn gray" v-else>已过期</div>
              </div>
            </mt-cell-swipe>
            <!-- 未使用 -->
            <mt-cell-swipe
            title="" class="222" v-else-if="(item.cardtype == '40' || item.cardtype == '20') && item.status=='90'" :right="[{
                content: '已使用',
                style: { width: '1rem', height: '1rem', backgroundColor: '#6A6A6A', padding: '0', borderRadius: '100%', margin: '0.5rem 0.3rem 0 0', textAlign: 'center', color: '#FFFFFF' },
                handler: () => optItem('used', item, index)
              }, {
                content: '删除',
                style: { width: '1rem', height: '1rem', backgroundColor: '#FF2B44', padding: '0', borderRadius: '100%', margin: '0.5rem 0.3rem 0 0', textAlign: 'center', color: '#FFFFFF' },
                handler: () => optItem('del', item, index)
              }]">
              <div slot="title" class="item flex flex-cross-center" :class="{'fuli': item.cardtype == '20'}">
                <img :src="item.skuimage" alt="">
                <div class="text">
                  <div class="title">{{item.cardName}}</div>
                  <div class="date" v-if="item.cardtype == '40'">到期日：{{moment(item.endtime).format('YYYY-MM-DD')}}</div>
                  <div class="date" v-else></div>
                  <div class="type type1" >{{item.cardtype == '40' ? "兑换码" : "福利券"}}</div>
                </div>
                <div class="btn btn1" @click="toDetail(item)" >去使用</div>
              </div>
            </mt-cell-swipe>
            <mt-cell-swipe
            title="" v-else-if="item.cardtype == '30'" :right="[]">
              <div slot="title" class="item flex flex-cross-center recharge">
                <img :src="item.skuimage" alt="">
                <div class="text">
                  <div class="title">{{item.cardName}}</div>
                  <div class="date">数量：{{item.quantity}}份</div>
                  <div class="type">直充券</div>
                </div>
                <div class="btn" @click="toDetail(item)" >去使用</div>
              </div>
            </mt-cell-swipe>
          </div>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  components: {
    MescrollVue
  },
  data () {
    return {
      tabIndex: 0,
      mescrollDown: {
        use: true,
        callback: this.downCallback,
        offset: 40
      },
      mescrollUp: { // 上拉加载的配置.
        callback: this.upCallback,
        page: {
          type: '',
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 没有数据了 --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "list-wrap", // 父布局的id (1.3.5版本支持传入dom元素)
          // icon: "../assets/img/no-commodity-list.png", // 图标,默认null,支持网络图
          tip: "暂无记录" // 提示
        }
      },
      listData: []
    }
  },
  created () {

  },
  computed: {
  },
  watch: {

  },
  methods: {
    login () {
      this.changeStatusColor('ligth', '#ff76aa')
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      console.log('page', page)
      let arr = []
      this.getList(page.type, page.num.toString(), (res) => {
        if (!res.data) {
          this.listData = []
          mescroll.endSuccess(0, false)
          return false
        }
        arr = res.data.rows
        if (page.num == 1) this.listData = []
        this.listData = this.listData.concat(arr)
        console.log(this.listData)
        mescroll.endSuccess(arr.length, this.listData.length != res.data.total)
      })
    },
    downCallback (mescroll) {
      console.log(mescroll)
      mescroll.resetUpScroll();
    },
    toDetail (item) {
      if (item.cardtype == '30') { // 直充
        this.PUSH({
          path: '/card/recharge',
          query: {
            id: item.cardId,
            quantity: item.quantity,
            title: item.cardName,
            img: item.skuimage
          }
        })
      } else if (item.cardtype == '40') { // 兑换码
        this.PUSH({
          path: '/card/detail',
          query: {
            id: item.productId,
            code: item.codeName,
            endTime: item.endtime,
            title: item.cardName,
            img: item.skuimage
          }
        })
      } else if (item.cardtype == '20') {
        if (window.api) {
          let browser = window.api.require('webBrowser');
          browser.open({
            url: item.codeName,
            titleBar: {
              bg: "#FFFFFF",
              textColor: "#333333"
            }
          });
        } else {
          this.$dialog.toast({
            mes: "请在APP中打开",
            timeout: 1500,
            callback: () => {}
          });
        }
      }
    },
    getList (type, num, cb) {
      let param = {
        rows: '10',
        page: num.toString(),
        sort: '',
        status: '',
        cardtype: ''
      };
      this.$http
        .post("/focus.cardPackageList", param)
        .then(res => {
          console.log(res);
          cb && cb(res);
        })
        .catch(err => {
          console.log("err1111", err);
        });
    },
    optItem (type, item, index) {
      let param = {
        cardId: item.cardId,
        status: ''
      };

      if (type == 'del') {
        console.log('删除', item)
        param.status = '2'
        this.$dialog.confirm({
          title: "提示",
          mes: "卡券删除后不可找回,请谨慎操作",
          opts: [
            {
              txt: "确定",
              color: true,
              callback: () => {
                this.updateCardStatus(param, (res) => {
                  if (res.code == 200) {
                    this.$dialog.toast({
                      mes: "已删除",
                      timeout: 1500,
                      callback: () => {}
                    });
                    this.listData.splice(index, 1)
                  } else {
                    this.$dialog.toast({
                      mes: "操作失败",
                      timeout: 1500,
                      callback: () => {}
                    });
                  }
                })
              }
            },
            {
              txt: "取消",
              color: false,
              callback: () => {}
            }
          ]
        });
        return false
      } else if (type == 'used') {
        console.log('已使用', item)
        param.status = '1'
        this.updateCardStatus(param, (res) => {
          if (res.code == 200) {
            item.status = 1000 // 先随意改成不显示的状态，后面再改成已使用的状态，否则左滑菜单按钮显示有问题
            this.listData.splice(index, 1, item)
            this.$nextTick(() => {
              item.status = 100
              this.listData.splice(index, 1, item)
            })
          } else {
            this.$dialog.toast({
              mes: "操作失败",
              timeout: 1500,
              callback: () => {}
            });
          }
        })
      }
    },
    updateCardStatus (param, cb) {
      this.$http
        .post("/focus.cardStateUpdate", param)
        .then(res => {
          console.log(res);
          cb && cb(res)
        })
        .catch(err => {
          console.log("err1111", err);
        });
    }
  }
}
</script>

<style lang="scss">
.my-card-page {
  position: absolute;
  top: 0;
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #F9F9F9;
    padding-top: 0.2rem;
    .item {
      height: 2.08rem;
      background-image: url('../assets/img/card-bg.png');
      background-size: cover;
      padding: 0.24rem 0.16rem 0.24rem 0.24rem;
      margin: 0 auto 0.15rem;
      position: relative;
      width: 6.7rem;
      &::after {
        content: '';
        width: 1.6rem;
        height: 1.6rem;
        background-color: #000000;
        position: absolute;
        top: 0.24rem;
        left: 0.24rem;
        opacity: 0;
      }
      &.fuli {
        .type {
          background-color: #FFECE4!important;
          color: #FF6C2B!important;
        }
        .btn {
          background-color: #FF6C2B!important;
        }
      }
      &.gray {
        &::after {
          opacity: 0.28;
        }
        .date {
          visibility: hidden;
        }
        .title {
          color: #999999!important;
        }
        .type {
          background-color: #E4E4E4!important;
          color: #FFFFFF!important;
        }
        .btn {
          background-color: #E4E4E4!important;
        }
      }
      &>img {
        width: 1.6rem;
        height: 1.6rem;
      }
      .text {
        width: 2.64rem;
        margin: 0 0.5rem 0 0.2rem;
        height: 100%;
        .title {
          font-size: 0.24rem;
          line-height: 0.35rem;
          color: #555555;
          height: 0.65rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .date {
          color: #999999;
          font-size: 0.24rem;
          transform: scale(0.75);
          transform-origin: left;
          margin-top: 0.2rem;
          min-height: 0.28rem;
        }
        .type {
          width: 1.76rem;
          height: 0.66rem;
          line-height: 0.66rem;
          text-align: center;
          transform: scale(0.5);
          transform-origin: left;
          font-size: 0.36rem;
          color: #4189FF;
          background-color: #EEF2FF;
        }
        .type1 {
          color: #FF2B44;
          background-color: #FFE8EB;
        }
      }
      .btn {
        width: 1.35rem;
        height: 0.46rem;
        line-height: 0.46rem;
        text-align: center;
        border-radius: 0.08rem;
        color: #FFFFFF;
        background-color: #4189FF;
        font-size: 0.24rem;
        &.btn1 {
          background-color: #FF2B44;
        }
        &.gray {
          color: #FFFFFF;
          background-color: #E4E4E4;
        }
      }
    }
  }
  .mint-cell {
    background: none;
    .mint-cell-wrapper {
      background-image: none!important;
    }
  }
}
</style>
