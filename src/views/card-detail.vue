<template>
  <div class="card-detail-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#4189FF" bgcolor="#4189FF" color="#FFFFFF">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon color="#FFFFFF"></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content pd-wrap">
      <div class="info">
        <div class="title">
          <img :src="decodeURL(baseData.url)" alt="" />
          <span>{{baseData.mainTitle}}</span>
        </div>
        <div class="body">
          <p>兑换码</p>
          <p class="code">{{baseData.cdkey}}</p>
          <div class="copy" @click="copy">复制</div>
        </div>
        <div class="date">
          <span>到期日</span>
          <span>{{moment(baseData.validtime).format("YYYY-MM-DD")}}</span>
        </div>
      </div>
      <div class="desc">
        <div v-for="(item, index) in content" :key="index">
          <img :src="decodeURL(item)" alt="" v-if="regHttp(item)">
          <p v-else v-html="item"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      code: 'sadhajkdhkasjdaks',
      baseData: {},
      content: []
    }
  },
  created () {
  },
  mounted () {
    // this.getDetail()
    this.baseData = {
      mainTitle: this.$route.query.title,
      cdkey: this.$route.query.code,
      validtime: this.$route.query.endTime,
      url: this.$route.query.img
    }
    this.getGoodsDetail()
  },
  computed: {
  },
  watch: {

  },
  methods: {
    login () {
      this.changeStatusColor('ligth', '#ff76aa')
    },
    copy () {
      let that = this
      if (window.api) {
        let clipBoard = window.api.require('clipBoard');
        console.log(clipBoard)
        clipBoard && clipBoard.set({
          value: this.code
        }, function(ret, err) {
          if (ret) {
            if (ret.status == true) {
              that.$dialog.toast({
                mes: '复制成功',
                timeout: 1500
              });
            } else {
              alert(JSON.stringify(ret));
            }
          } else {
            alert(JSON.stringify(err));
          }
        });
      }
    },
    getDetail () {
      let param = {
        orderId: this.$route.query.id
      };
      this.$http
        .post("/focus.orderDetail", param)
        .then(res => {
          console.log(res);
          this.baseData = res.data.rows[0]
          this.getGoodsDetail()
        })
        .catch(err => {
          console.log("err1111", err);
        });
    },
    getGoodsDetail () {
      let param = {
        goodsId: this.$route.query.id
      };
      this.$http
        .post("/focus.goodsDetail", param)
        .then(res => {
          this.content = res.data.rows[0].description.split(',')
        })
        .catch(err => {
          console.log("err1111", err);
        });
    }
  }
}
</script>

<style lang="scss">
.card-detail-page {
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #4189FF;
    padding-top: 0.48rem;
    .info {
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 0.1rem;
      box-shadow:0px 13px 23px 0px rgba(39,102,205,0.24);
      position: relative;
      padding: 0 0.27rem;
      &:after, &:before {
        content: '';
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        background-color: #4189FF;
        position: absolute;
        top: 1.43rem;
        left: -0.18rem;
      }
      &:after {
        left: auto;
        right: -0.18rem;
      }
      .title {
        height: 1.58rem;
        line-height: 1.58rem;
        border-bottom: 1px solid #E4E4E4;
        img {
          width: 0.64rem;
          border-radius: 0.64rem;
          height: 0.64rem;
          margin-left: 0.22rem;
          margin-right: 0.41rem;
          position: relative;
          top: 0.18rem;
        }
        span {
          font-size: 0.26rem;
          font-weight: bold;
        }
      }
      .body {
        padding: 0.83rem 0 0.71rem;
        text-align: center;
        p {
          font-size: 0.42rem;
          color: #999999;
          font-weight: 500;
        }
        .code {
          font-size: 0.4rem;
          font-weight: 800;
          color: #4189FF;
          margin: 0.46rem 0 0.5rem;
        }
        .copy {
          width: 0.87rem;
          height: 0.44rem;
          line-height: 0.44rem;
          background-color: #EBEBEB;
          margin: 0 auto;
          font-size: 0.22rem;
          color: #666666;
        }
      }
      .date {
        border-top: 1px solid #E4E4E4;
        height: 1.14rem;
        line-height: 1.14rem;
        font-size: 0.24rem;
        span:first-child {
          color: #999999;
          margin-right: 0.45rem;
        }
      }
    }
    .desc {
      padding: 0.38rem 0.24rem 0.45rem;
      background-color: #FFFFFF;
      border-radius: 0.1rem;
      box-shadow:0px 13px 23px 0px rgba(39,102,205,0.24);
      margin-top: 0.26rem;
      margin-bottom: 0.3rem;
    }
  }
}
</style>
