<template>
  <div class="card-recharge-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#4189FF" bgcolor="#4189FF" color="#FFFFFF">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon color="#FFFFFF"></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content pd-wrap">
      <div class="info">
        <div class="top">
          <div :style="`background-image:url(${baseData.url});`">
            <!-- <img :src="decodeURL(baseData.url)" alt="" /> -->
          </div>
          <p class="title">{{baseData.mainTitle}}</p>
        </div>
        <!-- <p class="tip">请输入会员账号</p> -->
        <div class="input" v-if="!rechargeSuc">
          <input type="text" v-model="account" placeholder="请输入会员账号">
        </div>
        <div class="body" v-if="!rechargeSuc">
          <img class="reduce" @click="changeNumber('reduce')" src="../assets/img/recharge-reduce.png" alt="">
          <img class="add" @click="changeNumber('add')" src="../assets/img/recharge-add.png" alt="">
          <input type="number" readonly v-model="number">
        </div>
        <div class="suc" v-if="rechargeSuc">
          <img src="../assets/img/recharge-suc.png" alt="">
          <p>兑换成功</p>
        </div>
        <yd-button size="large" type="primary" :loading="loading" @click.native="submit">{{!rechargeSuc ? '确定' : '我知道了'}}</yd-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      code: 'sadhajkdhkasjdaks',
      baseData: {
        url: 'http://test-qn.zht87.com/focus/activity-1.png',
        mainTitle: '爱奇艺黄金会员月卡+3元话费',
        count: 6
      },
      content: [],
      number: 1,
      account: '',
      rechargeSuc: false,
      loading: false,
      appUrlScheme: {
        iqiyi: 'iqiyi://',
        tenVideo: 'tenvideo://',
        youku: 'youku://'
      }
    }
  },
  created () {
  },
  mounted () {
    // this.getDetail()
    let tmpData = {
      url: this.$route.query.img,
      mainTitle: this.$route.query.title,
      count: this.$route.query.quantity,
      cardId: this.$route.query.id
    }
    this.baseData = tmpData
  },
  computed: {
  },
  watch: {

  },
  methods: {
    login () {
      this.changeStatusColor('ligth', '#ff76aa')
    },
    changeNumber (type) {
      let that = this
      if (type == 'add') {
        if (this.number == this.baseData.count) {
          that.$dialog.toast({
            mes: '数量已达最大上限',
            timeout: 1500,
            callback: () => {}
          });
        } else {
          this.number++
        }
      } else if (type == 'reduce' && this.number > 1) {
        this.number--
      }
    },
    submit () {
      if (!this.rechargeSuc && !this.loading) {
        if (!this.account) {
          this.$dialog.toast({
            mes: "请输入会员账号",
            timeout: 1500
          });
          return false
        }
        this.loading = true
        let param = {
          cardId: this.baseData.cardId,
          phone: this.account,
          rechargeNum: this.number
        };
        this.$http
          .post("/focus.cardRecharge", param)
          .then(res => {
            this.loading = false
            if (res.code == 200) {
              this.rechargeSuc = true
            } else {
              this.$dialog.toast({
                mes: res.msg,
                timeout: 1500
              });
            }
          })
          .catch(err => {
            console.log("err1111", err);
          });
      } else {
        // this.openApp(this.appUrlScheme.tenVideo)
        this.GO(-1)
      }
    },
    openApp (nativeUrl) {
      var last = Date.now();

      var doc = window.document;

      var ifr = doc.createElement('iframe');

      // 创建一个隐藏的iframe
      ifr.src = nativeUrl;
      ifr.style.cssText = 'display:none;border:0;width:0;height:0;';
      doc.body.appendChild(ifr);

      setTimeout(function() {
        doc.body.removeChild(ifr);
        // setTimeout回小于2000一般为唤起失败
        if (Date.now() - last < 2000) {
          if (typeof onFail == 'function') {
            // onFail();
          } else {
            // 弹窗提示或下载处理等
          }
        } else {
          if (typeof onSuccess == 'function') {
            // onSuccess();
          }
        }
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
.card-recharge-page {
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
      padding: 0.64rem 0.34rem 0.68rem;
      .top {
        overflow: hidden;
        text-align: center;
        div {
          width: 4.12rem;
          height: 4.12rem;
          margin: 0 auto;
          background-size: cover;
          background-position: center;
        }
        .title {
          font-size: 0.36rem;
          font-weight: bold;
          color: #333333;
          margin: 0.38rem 0 0.4rem;
        }
      }
      .input {
        display: block;
        font-size: 0.3rem;
        font-weight: bold;
        color: #333333;
        margin: 0 auto;
        border: none;
        text-align: center;
        position: relative;
        padding-bottom: 0.38rem;
        input {
          display: block;
          font-size: 0.3rem;
          font-weight: bold;
          color: #333333;
          margin: 0 auto;
          border: none;
          text-align: center;
          &::-webkit-input-placeholder {
            color: #999999;
          }
        }
        &:after {
          content: '';
          width: 100%;
          height: 1px;
          background-color: #E6E6E6;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
      .body {
        position: relative;
        height: 1.26rem;
        overflow: hidden;
        img {
          width: 0.48rem;
          height: 0.48rem;
          position: absolute;
          &.reduce {
            left: 0;
            top: 0.56rem;
          }
          &.add {
            right: 0;
            top: 0.56rem;
          }
        }
        input {
          text-align: center;
          width: 3.93rem;
          height: 0.92rem;
          border-radius: 0.06rem;
          border: 1px solid #D6D6D6;
          margin: 0.34rem auto;
          display: block;
        }
      }
      .suc {
        text-align: center;
        margin-top: 0.4rem;
        img {
          width: 1.08rem;
          height: 1.08rem;
        }
        p {
          color: #666666;
          font-size: 0.32rem;
          margin-top: 0.2rem;
        }
      }
      .btn {
        height: 0.9rem;
        line-height: 0.9rem;
        width: 6rem;
        text-align: center;
        background-color: #4189FF;
        border-radius: 0.1rem;
        color: #FFFFFF;
        font-weight:bold;
        font-size: 0.32rem;
        margin-top: 1.34rem;
      }
    }
  }
}
</style>
