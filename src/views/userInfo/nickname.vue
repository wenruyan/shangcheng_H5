I<template>
  <div class="page nickname-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
      <div @click="save" slot="right" style="color:#4189FF;font-size: 0.28rem;">
        保存
      </div>
    </yd-navbar>
    <div class="content t-c">
      <yd-input slot="right" :show-error-icon="false" :show-success-icon="false" v-model="nickname" placeholder="请输入昵称"></yd-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickname: "",
      newName: "",
      oldName: ""
      // hotCommodityData:''
    };
  },
  created() {
    this.nickname = this.$route.query.name;
  },
  mounted() {
    this.init();
    let param = {
      userId: this.$store.state.userId
    };
    this.$http
      .post("/focus.mallPageData", param)
      .then(res => {
        console.log(res);
        // this.hotCommodityData = res;
        this.oldName = res.nickName;
      })
      .catch(err => {
        console.log("err", err);
      });
  },
  watch: {
    // nickname:function(value,old){
    //   console.log(value)
    //   console.log(old)
    //   this.newName = value
    //   this.oldName = old
    // }
  },
  methods: {
    init() {},
    save() {
      console.log(this.nickname == this.oldName);
      console.log(this.oldName);
      if (this.nickname == this.oldName) {
        this.GO(-1);
      } else {
        let param = {
          newNickName: this.nickname,
          userId: this.$store.state.userId
        };
        var reg = /^[\w\u4e00-\u9fa5]\S{0,15}$/;
        if (reg.test(param.newNickName)) {
          this.$http
            .post("/focus.changeNickName", param)
            .then(res => {
              console.log(res);
              // let param = {
              //   userId: this.$store.state.userId
              // };
              this.loading = false;
              this.$dialog.toast({
                mes: "保存成功",
                timeout: 1500,
                callback: () => {
                  this.GO(-1);
                }
              });
            })
            .catch(err => {
              console.log("err", err);
            });
        } else {
          this.$dialog.toast({
            mes: "字符串长度在1-16个字符之间",
            timeout: 1500
          });
          return false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.nickname-page {
  .content {
    height: calc(100vh - 0.84rem);
    background-color: #f9f9f9;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 0.4rem;
    .yd-input {
      height: 1.2rem;
      line-height: 1.2rem;
      background-color: #ffffff;
      padding: 0 0.4rem;
      border-top: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      input {
        font-size: 0.3rem;
      }
    }
  }
}
</style>
