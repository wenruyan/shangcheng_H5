I<template>
  <div class="page address-list-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content t-c">
      <yd-cell-group>
        <yd-cell-item class="headPic" arrow href="" type="link" @click.native="uploadHeadPic">
            <span slot="left">头像</span>
            <img v-if="showImg"  :src="hotCommodityData.avatarUrl" alt="" slot="right">
            <img v-else :src="info.url" alt="" slot="right">
            <!-- <img :src="info.url" alt="" slot="right"> -->
        </yd-cell-item>
        <yd-cell-item arrow href="" type="link" @click.native="PUSH({path: '/nickname', query: {name: hotCommodityData.nickName}})">
            <span slot="left">昵称</span>
            <span slot="right" class="btn">{{hotCommodityData.nickName}}</span>
            <!-- <span slot="right" v-else class="btn" >请设置昵称</span> -->
            <!-- <span slot="right">{{info.nickName}}</span> -->
        </yd-cell-item>
        <yd-cell-item arrow href="" type="link"  @click.native="PUSH({path: '/replace-phone-step1'})">
            <span slot="left">手机号</span>
            <span slot="right">{{phone}}</span>
        </yd-cell-item>
        <yd-cell-item arrow href="" type="link"  @click.native="PUSH({path: '/amend-password-step1'})">
            <span slot="left">登录密码</span>
            <span slot="right">修改</span>
        </yd-cell-item>
      </yd-cell-group>
      <!-- <input type="file"> -->
      <div class="pd-wrap quit">
        <yd-button size="large" type="primary" @click.native="loginOut">退出登录</yd-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      hotCommodityData: "",
      showImg: false,
      phone: "",
      info: {
        phone: "",
        nickName: "",
        url: ""
      }
    };
  },
  created() {
  },
  mounted() {
    this.customBackKey(() => {
      this.PUSH({
        path: "/mine"
      });
    });
    this.init();
  },
  methods: {
    init() {
      let param = {
        userId: this.$store.state.userId
      };
      this.$http
        .post("/focus.mallPageData", param)
        .then(res => {
          console.log(res);
          this.hotCommodityData = res;
          if (this.hotCommodityData.nickName == "") {
            this.hotCommodityData.nickName = "请设置昵称";
          }
          if (this.hotCommodityData.avatarUrl) {
            this.showImg = true;
          }
          var tel = this.hotCommodityData.phone;
          this.$store.commit("updateInputPhone", this.hotCommodityData.phone);
          var reg = /^(\d{3})\d{4}(\d{4})$/;
          this.phone = tel.replace(reg, "$1****$2");
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    loginOut() {
      this.customBackKey(() => {
        document.querySelector(".yd-confirm-btn.default").click();
      });
      this.$dialog.confirm({
        title: "提示",
        mes: "是否退出登录",
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              this.$store.commit("updateUserId", "");
              this.$store.commit("updateToken", "");
              this.REPLACE({
                path: "/index"
                // query: {
                //   id: item.goodsId
                // }
              });
            }
          },
          {
            txt: "取消",
            color: false,
            callback: () => {
              this.cancleCustomBackKey();
              this.customBackKey(() => {
                this.PUSH({
                  path: "/mine"
                });
              });
            }
          }
        ]
      });
    },
    uploadHeadPic(valueId, imgId) {
      let that = this;
      window.api &&
        window.api.actionSheet(
          {
            title: "",
            cancelTitle: "取消",
            buttons: ["拍照", "从手机相册选择"]
          },
          function(ret, err) {
            if (ret) {
              let conf = {
                sourceType: "camera",
                mediaValue: "pic",
                destinationType: "base64",
                allowEdit: true,
                quality: 50,
                preview: true,
                targetWidth: 300,
                targetHeight: 300,
                saveToPhotoAlbum: false
              };
              if (ret.buttonIndex == 1) {
                conf.sourceType = "camera";
                window.api.getPicture(conf, function(ret, err) {
                  // alert(JSON.stringify(ret));
                  if (ret.base64Data) {
                    that.$dialog.loading.open("正在上传");
                    that.uploadImg(ret.base64Data);
                  }
                });
              } else if (ret.buttonIndex == 2) {
                // 手机相册选图片
                conf.sourceType = "library";
                window.api.getPicture(conf, function(ret, err) {
                  // alert(JSON.stringify(ret));
                  if (ret.base64Data) {
                    that.$dialog.loading.open("正在上传");
                    that.uploadImg(ret.base64Data);
                  }
                });
              }
            }
          }
        );
    },
    uploadImg(base64) {
      let param = {
        avatarUrl: base64
      };
      this.$http
        .post("/focus.updateUserInfo", param)
        .then(res => {
          console.log(res);
          this.$dialog.loading.close();
          this.$dialog.toast({
            mes: "修改成功",
            timeout: 1500,
            callback: () => {
              this.init();
            }
          });
        })
        .catch(err => {
          console.log("err", err);
          this.$dialog.loading.close();
        });
    },
    // 保存剪辑图像
    saveImg(path, valueId, imgId) {
      window.api.showProgress({
        title: "上传中...",
        text: "先喝杯茶..."
      });
      // 上传剪辑后的图像到服务器
      //   window.api.ajax({
      //     // report : false,
      //     url: URL_API + 'upload/upload/dir/images',
      //     // 这里是我们约定好的后台上传图片的位置 ，你可以根据你的需求来改
      //     method: 'post',
      //     cache: 'false',
      //     timeout: 30,
      //     dataTpye: 'json',
      //     data: {
      //       files: {
      //         file: path
      //       }
      //     }
      //   }, function(ret, err) {
      //     // alert(JSON.stringify(ret));
      //     api.hideProgress();
      //     if (ret.status == 1) {
      //       api.toast({
      //         msg: ret.info
      //       });
      //     }
      //     // 上传进度
      //     if (ret.status == 0) {
      //       api.toast({
      //         msg: '上传错误',
      //         duration: 3000,
      //         location: 'bottom'
      //       });
      //     } else if (ret.status == 1) {
      //       $api.byId(valueId).value = ret.id;
      //       $api.byId(imgId).src = ret.path;
      //     }
      //   });
    }
  }
};
</script>

<style lang="scss">
.address-list-page {
  .content {
    height: calc(100vh - 0.88rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 0.4rem;
    .headPic {
      .yd-cell-right {
        img {
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 50%;
        }
      }
    }
    .yd-cell-right {
      min-height: 1.6rem;
      font-size: 0.3rem;
      color: #999999;
    }
    .yd-cell-left {
      font-size: 0.3rem;
      font-weight: 500;
    }
    .yd-cell-arrow:after {
      color: #999999;
    }
    .yd-cell-item:after {
      margin-left: 0;
      // padding: 0 0.4rem;
      height: 1px;
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0.4rem;
      right: 0.4rem;
      content: "";
      width: auto;
      background-image: -webkit-gradient(
        linear,
        left bottom,
        left top,
        color-stop(50%, #ececec),
        color-stop(0, transparent)
      );
      background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
    }
    .quit {
      margin-top: 2.92rem;
    }
  }
}
</style>
