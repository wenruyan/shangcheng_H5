<template>
  <div class="page soccer-detail-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div id="list-wrap" class="innerContent" style="width:100%;height:100%;overflow-y:auto;">
          <ul style="width:100%;height:100%">
            <li v-for="(item, index) in list" :key="index">
              <h4 style="font-size:0.36rem;color:#222;">{{ item.date }}</h4>
              <div v-for="(ele, index1) in item.record"  :key="index1" class="record">
                <div class="flex flex-main-justify">
                  <span style="font-size:.30rem;font-weight:bold;color:#333;">
                    {{ detail[ele.pointsTransactionType] }}
                  </span>
                  <span style="font-size:.32rem;font-weight:bold;text-align:right" :class="ele.transactionType == 10 ? 'rColor' : 'bColor'">
                    {{ ele.transactionType == 20 ? '-' : '+' }} {{ ele.amount }}
                  </span>
                </div>
                <p style="font-size:.24rem;color:#666;margin-top:.14rem">
                  {{ ele.createDate }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    MescrollVue
  },
  data() {
    return {
      list: [],
      mescrollDown: {
        use: true,
        callback: this.downCallback,
        offset: 40
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback,
        page: {
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
      detail: {
        "10": "新用户赠送",
        "20": "步数抽奖",
        "30": "分享邀请佣金",
        "40": "积分兑换",
        "50": "积分转入",
        "60": "积分消费",
        "70": "积分签到",
        "80": "积分抽奖",
        "90": "分享赠送"
      }
    };
  },
  mounted() {},
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      let param = {
        current: page.num,
        size: page.size
      };
      this.$http
        .get("/Focus-BladeX-BootX/pointstransaction/list", param)
        .then(res => {
          console.log(res);
          let data = res.data.records;
          let tmpArr = [];
          let date = "";
          setTimeout(() => {
            if (page.num == 1) this.list = [];
            // this.list = this.list.concat(data);
            for (let item of data) {
              date =
                item.createDate.substr(0, 4) +
                "年" +
                item.createDate.substr(5, 2) +
                "月";
              let noR = true;
              for (let item2 of tmpArr) {
                if (item2.date == date) {
                  item2.record.push(item);
                  noR = false;
                }
              }
              if (noR) {
                tmpArr.push({
                  date: date,
                  record: [item]
                });
              }
            }
            if (page.num > 1) {
              let arr = [];
              let obj = {};
              this.list.forEach(item => {
                if (!obj[item.date]) {
                  obj[item.date] = item.record;
                }
              });
              tmpArr.forEach(item => {
                if (obj[item.date]) {
                  obj[item.date] = obj[item.date].concat(item.record);
                } else {
                  obj[item.date] = item.record;
                }
              });
              for (let i in obj) {
                arr.push({
                  date: i,
                  record: obj[i]
                });
              }
              console.log(222222222);
              console.log(obj);
              console.log(arr)
              this.list = arr
              console.log(this.list)
            } else {
              this.list = this.list.concat(tmpArr);
            }
            mescroll.endSuccess(data.length);
          }, 1000);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    downCallback(mescroll) {
      console.log(mescroll);
      mescroll.resetUpScroll();
    }
  }
};
</script>
<style lang="scss">
.soccer-detail-page {
  overflow: hidden;
  .content {
    height: calc(100vh - 0.84rem);
    padding-bottom: 0.4rem;
    .showImg {
      width: 100%;
      height: 100%;
      // position: relative;
      img {
        width: 3.52rem;
        height: 3.58rem;
        // position: absolute;
        margin-top: 3.38rem;
        margin-left: 2.11rem;
      }
      p:nth-of-type(1) {
        margin-top: 1.12rem;
        font-size: 0.3rem;
        font-weight: bold;
        color: #444;
        text-align: center;
      }
      p:nth-of-type(2) {
        margin-top: 0.27rem;
        font-size: 0.26rem;
        font-weight: 500;
        color: #666;
        text-align: center;
      }
    }
    li {
      border-bottom: 1px solid #e6e6e6;
      padding-left: 0.4rem;
      padding-top: 0.58rem;
      .record {
        margin-top: 0.3rem;
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 0.3rem;
        padding-right: 0.4rem;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  span.rColor {
    color: #ff2b44;
  }
  span.bColor {
    color: #4189ff;
  }
}
</style>
