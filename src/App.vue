<template>
  <div id="app" :class="{'hasTabbar': hasTabbar}">
    <!-- <transition :name="$store.state.transitionName"> -->
    <!-- <transition :name="transitionName"> -->
      <!-- <keep-alive> -->
      <keep-alive include="index,category,commodity,order-list,collection">
        <router-view>
            <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
        </router-view>
      </keep-alive>
    <!-- </transition> -->
    <!-- <transition :name="transitionName">
      <router-view v-if="!$route.meta.keepAlive"> -->
          <!-- 这里是不被缓存的视图组件，比如 page3 -->
      <!-- </router-view>
    </transition> -->
    <!-- </transition> -->
    <yd-tabbar style="height:0.98rem" :fixed="true" active-color="#068DF9" v-if="hasTabbar">
      <yd-tabbar-item style="font-size: 0.24rem" title="首页" link="" @click.native="REPLACE({ path: '/index'})" :active="$route.name == 'index'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/home_active.png" v-show="$route.name == 'index'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/home.png" v-show="$route.name != 'index'">
      </yd-tabbar-item>
      <yd-tabbar-item style="font-size: 0.24rem" title="分类" link="" @click.native="REPLACE({ path: '/category'})" :active="$route.name == 'category'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/category_active.png" v-show="$route.name == 'category'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/category.png" v-show="$route.name != 'category'">
      </yd-tabbar-item>
      <yd-tabbar-item style="font-size: 0.24rem" title="购物车" link="" @click.native="REPLACE({ path: '/shopping-cart'})" :active="$route.name == 'shopping-cart'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/cart_active.png" v-show="$route.name == 'shopping-cart'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/cart.png" v-show="$route.name != 'shopping-cart'">
        <yd-badge class="cart-count" slot="badge" type="danger" v-if="$store.state.cartCount > 0">{{$store.state.cartCount}}</yd-badge>
      </yd-tabbar-item>
      <!-- <yd-tabbar-item title="步步抽" link="#" @click.native="toMiniProgram({path: '/pages/index/index?appPhone='+ $store.state.phone})" v-if="$store.state.hasApp.wechat">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/tabbar_2.png">
      </yd-tabbar-item> -->
      <yd-tabbar-item style="font-size: 0.24rem" title="我的" link="" @click.native="REPLACE({ path: '/mine'})" :active="$route.name == 'mine'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/mine_active.png" v-show="$route.name == 'mine'">
        <img slot="icon" style="height: 0.50rem;" src="../src/assets/img/tabbar/mine.png" v-show="$route.name != 'mine'">
      </yd-tabbar-item>
    </yd-tabbar>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      transitionName: "slide-left"
    };
  },
  computed: {
    hasTabbar() {
      const param = this.$route.query.showTabbar;
      const hiddenTabbar = (typeof param == 'string' && param == 'false') || param === false;

      return this.$route.meta.showTabbar && this.$store.state.hideTabbar && !hiddenTabbar;
    }
  },
  mounted() {
    // this.$router.afterEach((to, from) => {
    //   const reloadPage = (to, from) => {
    //     if (from.name == "index" && to.name == "commodity") {
    //       let isRefresh = sessionStorage.get("isRefresh");
    //       if (isRefresh == "0") {
    //         sessionStorage.set("isRefresh", null);
    //         window.location.reload();
    //       } else {
    //         sessionStorage.set("isRefresh", 0);
    //       }
    //     } else if (from.name == "commodity" && to.name == "index") {
    //       sessionStorage.set("isRefresh", 0);
    //     }
    //   };
    // });
    // this.$http.get('')
  },
  watch: {
    $route(to, from) {
      console.log(this.$router.isBack);
      let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退
      console.log(to, from);
      if (
        (to.name == "index" && from.name == "mine") ||
        (to.name == "index" && from.name == "category") ||
        (to.name == "index" && from.name == "shopping-cart") ||
        (to.name == "index" && from.name == "mine") ||
        (to.name == "category" && from.name == "shopping-cart") ||
        (to.name == "category" && from.name == "mine") ||
        (to.name == "shopping-cart" && from.name == "mine") ||
        (to.name == "index" && from.name == "commodity") ||
        (to.name == "index" && from.name == "collection")
      ) {
        isBack = true;
      }
      if (isBack) {
        this.transitionName = "slide-right";
      } else {
        this.transitionName = "slide-left";
      }
      this.$router.isBack = false;
    }
  }
  // beforeRouteUpdate (to, from, next) {
  //   const toDepth = to.path.split('/').length
  //   const fromDepth = from.path.split('/').length
  //   this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  //   next()
  // }
};
</script>

<style lang="scss">
#app {
  & > div {
    width: 100%;
  }
  &.hasTabbar {
    padding-bottom: 0.98rem;
    height: 100vh;
  }
  .yd-tabbar {
    box-shadow: 0px 1px 20px 0px rgba(94, 94, 94, 0.1);
  }
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
// 积分图片
.integral-icon {
  position: relative;
  padding-right: 0.3rem;
  &:after {
    content: '';
    position: absolute;
    right: 0;
    width: 0.24rem;
    height: 0.24rem;
    bottom: 0;
    background-image: url('./assets/img/integral-icon.png');
    background-size: 100% 100%;
  }
}
.cart-count  {
  width: 0.72rem!important;
  height: 0.48rem!important;
  line-height: 0.48rem!important;
  padding: 0!important;
  font-size: 0.36rem!important;
  text-align: center!important;
  transform: scale(0.5)!important;
  transform-origin: left center!important;
}
#__vconsole .vc-toolbar .vc-tool {
  padding: 1em 0;
}
</style>
