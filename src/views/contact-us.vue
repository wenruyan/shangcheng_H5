<template>
  <div class="contact-us-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="content">
      <img src="../assets/img/contact.png" alt=""  @touchstart="gtouchstart(v)" @touchmove="gtouchmove()" @touchend="gtouchend(v)">
      <!-- <p class="version">版本号V1.0.0 </p>
      <p class="protocol" @click="PUSH({path: '/protocol'})">《用户使用条款和隐私说明》</p> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "sadhajkdhkasjdaks"
    };
  },
  created() {},
  computed: {},
  watch: {},
  methods: {
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    },
    save() {
      window.api.saveMediaToAlbum(
        {
          path:
            "https://www.focus-base.com/cdn/ea765a00c4d3f7950204a433385b22b.jpg"
        },
        function(ret, err) {
          if (ret && ret.status) {
            alert("保存成功");
          } else {
            alert("保存失败");
          }
        }
      );
    },
    gtouchstart: function gtouchstart(item) {
      this.timeOutEvent = setTimeout(() => {
        this.longPress(item);
      }, 500); // 这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
      return false;
    },
    // 手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gtouchend: function gtouchend(item) {
      clearTimeout(this.timeOutEvent); // 清除定时器
      if (this.timeOutEvent != 0) {
        // 这里写要执行的内容（尤如onclick事件）
        // vm.goChat(item);
      }
      return false;
    },
    // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove: function gtouchmove() {
      clearTimeout(this.timeOutEvent); // 清除定时器
      this.timeOutEvent = 0;
    },

    // 真正长按后应该执行的内容
    longPress: function longPress(item) {
      this.timeOutEvent = 0;
      // 执行长按要执行的内容，如弹出菜单
      // $api.css($api.dom(".Popup"), "display:block");
      this.save()
    }
  }
};
</script>

<style lang="scss">
.contact-us-page {
  span {
    color: #fff !important;
  }
  header.yd-navbar {
    background: #4189ff !important;
  }
  .yd-navbar:after {
    height: 0px;
  }
  .content {
    height: calc(100vh - 0.84rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #4189ff;
    text-align: center;
    // p {
    //     font-size: 0.26rem;
    //     font-weight: 500;
    //   &.version {
    //     color: #3C495D;
    //   }
    //   &.protocol {
    //     color: #3C485C;
    //     margin-top: 0.39rem;
    //     margin-bottom: 0.45rem;
    //   }
    // }
  }
}
</style>
