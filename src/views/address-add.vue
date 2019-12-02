<template>
  <div class="address-add-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <yd-input
              slot="right"
              :on-blur="NameBlur"
              :show-error-icon="false"
              :show-success-icon="false"
              v-model="name"
              placeholder="请输入姓名"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input
              slot="right"
              regex="mobile"
              :on-blur="phoneBlur"
              :show-error-icon="false"
              :show-success-icon="false"
              v-model="phone"
              max="11"
              placeholder="请输入手机号"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input
              slot="right"
              readonly
              :show-error-icon="false"
              :show-success-icon="false"
              v-model="areaText"
              placeholder="请选择省市区"
              @click.native="showDistrict = true"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input
              slot="right"
              :show-error-icon="false"
              :show-success-icon="false"
              v-model="detailAddress"
              max="150"
              placeholder="请输入详细地址"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item type="label">
            <div class="default-address" slot="left">设为默认地址</div>
            <yd-switch slot="right" size="small" color="#4189FF" v-model="isDefault"></yd-switch>
          </yd-cell-item>
        </yd-cell-group>
      </div>
    </div>
    <div class="pd-wrap bottom-btn flex flex-main-justify">
      <div class="delete" @click="beforeDelAddress">删除</div>
      <yd-button
        class="save"
        size="large"
        type="primary"
        v-if="canClick"
        :loading="loading"
        @click.native="goNext"
      >保存</yd-button>
      <yd-button class="save" size="large" type="disabled" disabled v-else>保存</yd-button>
    </div>
    <!-- <yd-cityselect v-model="showDistrict" :callback="sureCity" :items="district" provance="北京" city="朝阳区" area="管庄"></yd-cityselect> -->
    <yd-cityselect v-model="showDistrict" :callback="sureCity" :items="district" :provance="itemData.province" :city="itemData.city" :area="itemData.area"></yd-cityselect>
  </div>
</template>

<script>
import District from "ydui-district/dist/jd_province_city_area_id";
export default {
  data() {
    return {
      loading: false,
      district: District,
      showDistrict: false,
      id: "",
      wechatUserInfo: "",
      name: "",
      phone: "",
      area: [],
      areaText: "",
      detailAddress: "",
      isDefault: false,
      itemData: {},
      itemData2: {}
    };
  },
  created() {
    if (this.$route.query.address) {
      let itemData = JSON.parse(this.$route.query.address);
      this.itemData = itemData;
      console.log(itemData);
      this.id = itemData.id;
      this.wechatUserInfo = itemData.wechatUserInfo;
      this.name = itemData.name;
      this.phone = itemData.phone;
      this.detailAddress = itemData.addressDetail;
      this.isDefault = itemData.isDefault == 10;
      this.area = [
        {
          name: itemData.province,
          value: ""
        },
        {
          name: itemData.city,
          value: ""
        },
        {
          name: itemData.area,
          value: ""
        }
      ];
      this.areaText =
        itemData.province + " " + itemData.city + " " + itemData.area;
    }
  },
  mounted() {},
  computed: {
    canClick() {
      return Boolean(
        this.name &&
          this.regMobile(this.phone) &&
          this.area.length > 0 &&
          this.detailAddress
      );
    }
  },
  watch: {
    showDistrict() {
      if (this.showDistrict) {
      }
    }
  },
  methods: {
    NameBlur() {
      // if (this.name == "") {
      //   // setTimeout(() => {
      //   this.loading = false;
      //   this.$dialog.toast({
      //     mes: "姓名不能为空",
      //     timeout: 300
      //     // callback: () => {
      //     //   this.GO(this.$route.query.history);
      //     // }
      //   });
      //   // }, 50);
      // } else if (!/^[\w\u4e00-\u9fa5]\S{0,12}$/.test(this.name)) {
      //   setTimeout(() => {
      //     this.loading = false;
      //     this.$dialog.toast({
      //       mes: "姓名格式错误，请修改或者重新输入",
      //       timeout: 1500
      //       // callback: () => {
      //       //   this.GO(this.$route.query.history);
      //       // }
      //     });
      //   }, 1000);
      // } else if (/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(this.name)) {
      //   setTimeout(() => {
      //     this.loading = false;
      //     this.$dialog.toast({
      //       mes: "姓名格式错误，请修改或者重新输入",
      //       timeout: 1500
      //       // callback: () => {
      //       //   this.GO(this.$route.query.history);
      //       // }
      //     });
      //   }, 1000);
      // }
    },
    phoneBlur() {
      // if (this.phone == "") {
      //   setTimeout(() => {
      //     this.loading = false;
      //     this.$dialog.toast({
      //       mes: "手机号不能为空",
      //       timeout: 800
      //       // callback: () => {
      //       //   this.GO(this.$route.query.history);
      //       // }
      //     });
      //   }, 1000);
      // } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone)) {
      //   setTimeout(() => {
      //     this.loading = false;
      //     this.$dialog.toast({
      //       mes: "手机号码格式错误，请修改或者重新输入",
      //       timeout: 1500
      //       // callback: () => {
      //       //   this.GO(this.$route.query.history);
      //       // }
      //     });
      //   }, 1000);
      // }
    },
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    },
    goNext() {
      if (this.name == "") {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "姓名不能为空",
            timeout: 1500
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else if (!/^[\w\u4e00-\u9fa5]\S{0,12}$/.test(this.name)) {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "姓名格式错误，请修改或者重新输入",
            timeout: 1500
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else if (/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(this.name)) {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "姓名格式错误，请修改或者重新输入",
            timeout: 1500
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else {
        this.loading = true;
        this.addAddress();
        // setTimeout(() => {
        //   this.loading = false;
        //   this.$dialog.toast({
        //     mes: "保存成功",
        //     timeout: 1500,
        //     callback: () => {
        //       // this.GO(-1);
        //     }
        //   });
        // }, 1000);
      }
    },
    sureCity(ret) {
      this.areaText = ret.itemName1 + " " + ret.itemName2 + " " + ret.itemName3;
      this.area = [
        {
          name: ret.itemName1,
          value: ret.itemValue1
        },
        {
          name: ret.itemName2,
          value: ret.itemValue2
        },
        {
          name: ret.itemName3,
          value: ret.itemValue3
        }
      ];
    },
    addAddress() {
      let param = {
        // address: JSON.stringify({
        id: this.id,
        wechatUserInfo: this.wechatUserInfo,
        province: this.area[0].name,
        city: this.area[1].name,
        area: this.area[2].name,
        addressDetail: this.detailAddress,
        name: this.name,
        phone: this.phone,
        isDefault: this.isDefault ? 10 : 20
        // })
      };
      this.$http
        .post("/Focus-BladeX-BootX/useraddress/submit", param)
        .then(res => {
          console.log("res", res);
          this.loading = false;
          this.$dialog.toast({
            mes: "保存成功",
            timeout: 1500,
            callback: () => {
              // this.GO(-1);
            }
          });
          setTimeout(() => {
            this.GO(-1);
          }, 1000)
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    beforeDelAddress(item) {
      if (!this.id) {
        this.GO(-1);
        return false;
      }
      this.$dialog.confirm({
        title: "提示",
        mes: "确认删除？",
        opts: [
          {
            txt: "确定",
            color: true,
            callback: () => {
              this.delAddress(item);
            }
          },
          {
            txt: "取消",
            color: false,
            callback: () => {}
          }
        ]
      });
    },
    delAddress(item) {
      console.log(this.id, "iiiiiiii");
      let param = {
        ids: this.id
      };
      this.$http
        .get("/Focus-BladeX-BootX/useraddress/remove", param)
        .then(res => {
          console.log("res", res);
          this.$dialog.toast({
            mes: "删除成功",
            timeout: 1500,
            callback: () => {
              this.GO(-1);
            }
          });
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="scss">
.address-add-page {
  .content {
    height: calc(100vh - 2.1rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    font-weight: bold;
    .input-form {
      padding-top: 0.3rem;
    }
    .yd-cell-item .yd-input input {
      font-weight: bold;
    }
    .default-address {
      padding-left: 0.15rem;
      font-size: 0.3rem;
    }
  }
  .yd-btn-block {
    margin-top: 0;
  }
  .bottom-btn {
    .delete {
      width: 37%;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.36rem;
      background-color: #c6dcff;
      font-weight: bold;
      color: #2a7bff;
      text-align: center;
      border-radius: 0.1rem;
    }
    .save {
      width: 60%;
      height: 1rem;
      line-height: 1rem;
      font-weight: bold;
    }
  }
}
</style>
