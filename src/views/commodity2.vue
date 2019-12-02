<template>
  <div class="page commodity-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div v-if="searchContent" class=" search-page content t-c">
      <yd-flexbox class="pd-wrap search-input-wrap">
        <yd-flexbox-item class="flex">
          <img class="search" src="../assets/img/search.png" alt="" @click="onBlur">
          <!-- <yd-icon style="font-size: 0.3rem;" name="search" @click="onBlur"></yd-icon> -->
          <!-- <i class="fa fa-search" @click="onBlur"></i> -->
          <yd-input v-model="searchVal" @keyup.native="associationQuery" ref="search" placeholder="全球好礼运动换"></yd-input>
        </yd-flexbox-item>
        <div @click="GO(-1)">取消</div>
      </yd-flexbox>
      <div class="associate pd-wrap" v-show="associateWords.length > 0">
        <div class="item flex flex-cross-center flex-main-justify" v-for="(item, index) in associateWords" :key="index" @click="autoInputWords(item)">
          <p class="t-l">{{ item }}</p>
          <img src="../assets/img/icon-top-left.png" alt="" />
        </div>
      </div>
      <div class="title2 pd-wrap flex flex-main-justify flex-cross-bottom">
        <p>历史记录</p>
        <p @click="clearHistory">清除</p>
      </div>
      <div class="history-list pd-wrap">
        <div class="item" v-for="(item, index) in historyKeywords" :key="index" @click="autoInputWords(item)">
          {{ item }}
        </div>
      </div>
      <div class="title2 pd-wrap flex">
        <p>热门搜索</p>
        <p></p>
      </div>
      <div class="history-list pd-wrap">
        <div class="item" v-for="(item, index) in hotKeywords" :key="index" @click="autoInputWords(item)">
          {{ item }}
        </div>
      </div>
    </div>
    <div v-if="commodityContent" class="content t-c">
        <yd-flexbox class="pd-wrap search-input-wrap">
          <yd-flexbox-item class="flex" @click.native="goSearch">
            <!-- <i class="fa fa-search"></i> -->
            <!-- <yd-icon name="search"></yd-icon> -->
            <img class="search" src="../assets/img/search.png" alt="">
            <yd-input v-model="searchVal" readonly ref="search" placeholder="全球好礼运动换"></yd-input>
          </yd-flexbox-item>
          <div @click="changeListShowType">
            <i class="fa fa-th-large" v-if="showType == 0"></i>
            <i class="fa fa-th-list" v-else></i>
          </div>
        </yd-flexbox>
        <div class="filter pd-wrap">
          <div :class="{'active': lastSetFilterIndex == 0}" @click="showFilterPanel(0)">{{sortOptions[sortIndex].text}}
            <i class="fa fa-caret-down" v-show="lastSetFilterIndex == 0"></i>
          </div>
          <div :class="{'active': lastSetFilterIndex == 1}" @click="showFilterPanel(1)">积分筛选
            <i class="fa fa-caret-down" v-show="lastSetFilterIndex == 1"></i>
          </div>
        </div>
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="filter-panel" v-show="sortPanelVisible || filterPanelVisible" @click="hideFilterPanel">
          <div class="opacity-bg"></div>
          <div class="panel-content"  @touchmove="filterPanelVisible = false;sortPanelVisible = false;">
            <div class="sort pd-wrap t-l" v-show="sortPanelVisible">
              <p :class="{'choosed': sortIndex == index}" @click="changeSortIndex(index,item)" v-for="(item, index) in sortOptions" :key="index">{{item.text}}</p>
            </div>
            <div class="soccer-filter pd-wrap" v-show="filterPanelVisible">
              <div class="item" :class="{'choosed': filterIndex == index}" v-for="(item, index) in soccerFilterOptions" :key="index" @click="changeFilterIndex(index,item)">{{item.text}}</div>
            </div>
          </div>
        </div>
        <div id="commodity-list" class="commodity pd-wrap">
          <CommodityList :listData='commodityData' v-if="showType == 0"></CommodityList>
          <div class="list" v-if="showType == 1">
            <div class="list-item" v-for="(item, index) in commodityData" :key="index" @click="toDetail(item)">
              <div style="float: left; width:2rem;height:2rem;margin-right: 0.18rem;border-radius: 0.1rem 0.1rem 0 0;background-color: #eee;">
                <img :src="decodeURL(item.url)" alt="">
              </div>
              <!-- <img :src="decodeURL(item.url)" alt=""> -->
              <div>
                <p class="name">{{item.itemtitle}}</p>
                <div class="bottom-info flex flex-main-justify flex-cross-bottom">
                  <div class="price flex flex-cross-center">
                    <img src="../assets/img/price-soccer.png" alt="">
                    <span>{{item.priceList.data[0].points}}</span>
                    <span>积分</span>
                  </div>
                  <div class="person">{{changeNumUnit(item.count)}}人付款</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import CommodityList from "../components/commodity-list";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "commodity",
  components: {
    CommodityList,
    MescrollVue
  },
  data() {
    return {
      searchContent: false,
      commodityContent: false,
      searchVal1: "",
      associateWords: [],
      historyKeywords: [],
      hotKeywords: [],
      showType: 0,
      type: "",
      filter: "",
      searchVal: "",
      mescroll: "",
      mescrollDown: {
        use: true,
        callback: this.downCallback
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback,
        auto: false,
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        // toTop: {
        //   // 回到顶部按钮
        //   src: "./static/mescroll/mescroll-totop.png", // 图片路径,默认null,支持网络图
        //   offset: 1000 // 列表滚动1000px才显示回到顶部按钮
        // },
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "commodity-list", // 父布局的id (1.3.5版本支持传入dom元素)
          icon: "", // 图标,默认null,支持网络图
          tip: "没找到相关商品，换换筛选条件再试试" // 提示
        }
      },
      commodityData: [],
      sortOptions: [
        {
          text: "默认排序",
          value: ""
        },
        {
          text: "积分降序",
          value: "desc"
        },
        {
          text: "积分升序",
          value: "asc"
        }
      ],
      soccerFilterOptions: [
        {
          text: "全部",
          low: "",
          high: ""
        },
        {
          text: "1-500积分",
          low: "1",
          high: "500"
        },
        {
          text: "501-1000积分",
          low: "501",
          high: "1000"
        },
        {
          text: "1001-1500积分",
          low: "1001",
          high: "1500"
        },
        {
          text: "1500积分以上",
          low: "1501",
          high: "999999999"
        }
      ],
      lastSetFilterIndex: 0,
      sortIndex: 0,
      filterIndex: 0,
      sortPanelVisible: false,
      filterPanelVisible: false,
      sorting: "",
      lowlimit: "",
      highlimit: "",
      isFirstEnter: false, // 是否第一次进入，默认false
      scrollTop: ""
    };
  },
  created() {
    this.isFirstEnter = true;
    // 只有第一次进入或者刷新页面后才会执行此钩子函数
    // 使用keep-alive后（2+次）进入不会再执行此钩子函数
    this.searchVal = this.$route.query.keyWords;
    // console.log(this.searchVal, 'pppppppp')
  },
  mounted() {
    this.commodityContent = true;
    this.customBackKey(() => {
      document.querySelector(".flex-cross-center").click();
      this.cancleCustomBackKey();
    });

    this.init();
    this.hotKeywords = JSON.parse(this.$store.state.mallPageData.hotsearch);
    // this.getData();
  },
  beforeRouteEnter(to, from, next) {
    // 路由导航钩子，此时还不能获取组件实例 `this`，所以无法在data中定义变量（利用vm除外）
    // 参考 https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
    // 所以，利用路由元信息中的meta字段设置变量，方便在各个位置获取。这就是为什么在meta中定义isBack
    // 参考 https://router.vuejs.org/zh-cn/advanced/meta.html
    if (from.name == "commodity-detail") {
      to.meta.isBack = true;
      // 判断是从哪个路由过来的，
      // 如果是详情页面过来的，表明当前页面不需要刷新获取新数据，直接用之前缓存的数据即可
      next(vm => {
        console.log(vm.scrollTop, "lllll");
        document.querySelector(".mescroll").scrollTop = vm.scrollTop;
      });
    } else {
      next()
    }
    // next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "commodity-detail") {
      this.scrollTop = document.querySelector(".mescroll").scrollTop;
      if (!from.meta.keepAlive) {
        to.meta.keepAlive = true;
      }
      next();
    } else {
      from.meta.keepAlive = false;
      to.meta.keepAlive = false;
      next();
    }
  },
  activated() {
    this.searchVal = this.$route.query.keyWords;
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      this.commodityData = [];
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      this.showType = 0;
      // this.changeSortIndex(0, "");
      this.sortIndex = 0;
      this.sorting = "";
      this.lastSetFilterIndex = 0;
      // this.changeFilterIndex(0, "");
      this.filterIndex = 0;
      this.highlimit = "";
      this.lowlimit = "";
      // this.commodityData = [];
      // this.mescroll.resetUpScroll();
      this.searchContent = false;
      this.commodityContent = true;
      // this.upCallback(this.mescrollUp.page, this.mescroll);
      this.mescroll.resetUpScroll();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },
  watch: {
    searchVal(val) {
      if (val) {
        // 模糊联想查询
        this.$http
          .post("/focus.search", { words: val })
          .then(res => {
            this.associateWords = res;
            console.log("res", res);
          })
          .catch(err => {
            console.log("err", err);
          });
      } else {
        this.associateWords = [];
      }
    },
    sortPanelVisible() {
      if (this.sortPanelVisible) {
        this.mescroll.lockDownScroll(true);
      } else {
        this.mescroll.lockDownScroll(false);
      }
    },
    filterPanelVisible() {
      if (this.filterPanelVisible) {
        this.mescroll.lockDownScroll(true);
      } else {
        this.mescroll.lockDownScroll(false);
      }
    }
  },
  methods: {
    getData(searchVal) {
      if (sessionStorage.getItem("searchVal")) {
        this.searchVal = sessionStorage.getItem("searchVal");
      }
      console.log(this.searchVal, "pppppp");
      // this.$refs.search.setFocus();
      if (this.searchVal) {
        // 模糊联想查询
        this.$http
          .post("/focus.search", { words: this.searchVal })
          .then(res => {
            this.associateWords = res;
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    },
    toDetail(item) {
      this.PUSH({
        path: "/commodity/detail",
        query: {
          id: item.id,
          skuId: item.skuId
          // showType: this.showType,
          // Filter: this.lastSetFilterIndex
        }
      });
    },
    init() {
      let historyKeywords = JSON.parse(localStorage.getItem("historyKeywords"));
      this.historyKeywords = Array.isArray(historyKeywords)
        ? historyKeywords.concat()
        : this.historyKeywords;
    },
    autoInputWords(val) {
      this.searchVal = val;
      this.historyKeywords.splice(
        this.historyKeywords.indexOf(this.searchVal),
        1
      );
      this.historyKeywords.unshift(this.searchVal);
      localStorage.setItem(
        "historyKeywords",
        JSON.stringify(this.historyKeywords)
      );
      this.toListPage();
    },
    clearHistory() {
      this.historyKeywords = [];
      localStorage.removeItem("historyKeywords");
    },
    onBlur() {
      let val = this.searchVal;
      console.log(val);
      if (this.searchVal) {
        let num = this.historyKeywords.indexOf(this.searchVal);
        if (num != -1) {
          this.historyKeywords.splice(num, 1);
        }
        this.historyKeywords.unshift(this.searchVal);
        if (this.historyKeywords.length > 10) {
          this.historyKeywords.pop();
        }
        localStorage.setItem(
          "historyKeywords",
          JSON.stringify(this.historyKeywords)
        );
        this.toListPage();
      }
    },
    associationQuery(e) {
      // let val = this.searchVal;
      if (e.keyCode == 13) {
        this.onBlur();
      }
    },
    toListPage() {
      console.log(666666666);
      this.commodityData = [];
      sessionStorage.setItem("searchVal", this.searchVal);
      let val = sessionStorage.getItem("searchVal");
      console.log(this.searchVal, "oooooooooo");
      this.getData(val);
      this.commodityContent = true;

      this.searchContent = false;
      // this.PUSH({
      //   path: "/commodity",
      //   query: {
      //     keyWords: this.searchVal
      //   }
      // });
    },
    goSearch() {
      this.searchContent = true;
      this.commodityContent = false;
      // this.PUSH({
      //   path: "/search"
      // });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      // console.log(t)
      this.$http
        .post("/focus.showCommodityList", {
          page: page.num,
          rows: page.size,
          goodslike: this.searchVal,
          goodstype: "",
          sorting: this.sorting,
          highlimit: this.highlimit,
          lowlimit: this.lowlimit
        })
        .then(res => {
          console.log(res, 'pppppp');
          let arr = [];
          arr = res.data.rows.concat();
          setTimeout(() => {
            if (page.num == 1) this.commodityData = [];
            this.commodityData = this.commodityData.concat(arr);
            mescroll.endSuccess(arr.length, true);
          }, 1000);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    downCallback(mescroll) {
      setTimeout(() => {
        mescroll.resetUpScroll();
      }, 1000);
    },
    changeListShowType() {
      if (this.showType == 0) {
        this.showType = 1;
      } else {
        this.showType = 0;
      }
      // this.$store.commit("showType", this.showType);
    },
    hideFilterPanel() {
      this.sortPanelVisible = false;
      this.filterPanelVisible = false;
    },
    showFilterPanel(val) {
      this.lastSetFilterIndex = val;
      // this.$store.commit("lastSetFilterIndex", this.lastSetFilterIndex);
      if (this.lastSetFilterIndex == 0) {
        this.filterPanelVisible = false;
        this.sortPanelVisible = true;
      } else {
        this.sortPanelVisible = false;
        this.filterPanelVisible = true;
      }
      return false;
    },
    changeSortIndex(val, item) {
      this.commodityData = [];
      this.sortIndex = val;
      this.sortPanelVisible = false;
      this.sorting = item.value;
      // 排序后的商品
      this.mescroll.resetUpScroll();
      // this.$store.commit("sortIndex", this.sortIndex);
    },
    changeFilterIndex(val, item) {
      // this.$store.commit("filterIndex", val);
      this.commodityData = [];
      this.filterIndex = val;
      this.sortPanelVisible = false;
      this.highlimit = item.high;
      this.lowlimit = item.low;
      this.mescroll.resetUpScroll();
    },
    search() {
      if (this.data.list.page > this.data.list.totalPage || this.data.loading) {
        return false;
      }
      let data = {
        page: this.data.list.page,
        rows: 20,
        goodslike: this.data.inputVal || "",
        sorting: this.data.sorting || "",
        highlimit: this.data.highlimit || "",
        lowlimit: this.data.lowlimit || "",
        goodstype: String(this.data.cid) || ""
      };
      this.$http.post("focus.showCommodityList", data, res => {
        let arr = this.data.listData;
        arr = arr.concat(res.data.rows);
        if (arr.length > 0) {
          this.setData({
            kong: false,
            listData: arr,
            lisData1: arr,
            list: {
              page: res.data.page + 1,
              rows: 20,
              totalPage: res.data.totalPage
            }
          });
        } else {
          this.setData({
            kong: true
          });
          // this.mescroll.resetUpScroll();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.search-page {
  .search-input-wrap {
    padding-top: 0.34rem;
    & > .yd-flexbox-item-center {
      padding: 0.2rem 0.3rem;
      background-color: #f7f7f7;
      position: relative;
      border-radius: 0.4rem;
      .search {
        font-size: 0.3rem !important;
        color: #999;
        position: absolute;
        top: 50%;
        transform: translateY(-40%);
        width: 0.26rem;
        height: 0.26rem;
      }
      i.yd-icon-search {
        font-size: 0.3rem !important;
        color: #999;
        position: absolute;
        top: 50%;
        transform: translateY(-40%);
      }
      // & > .fa {
      //   margin-right: 0.29rem;
      //   color: #999999;
      // }
      .yd-input {
        display: flex;
      }
      input {
        color: #999999;
        font-size: 0.28rem;
        // padding-left: 0.55rem;
      }
    }
    & > div {
      padding-left: 0.22rem;
      padding: 0.25rem 0 0.25rem 0.22rem;
      font-size: 0.28rem;
    }
  }
  .associate {
    margin-top: 0.2rem;
    position: absolute;
    z-index: 1;
    width: 100%;
    background-color: #ffffff;
    .item {
      height: 0.9rem;
      border-bottom: 1px solid #e6e6e6;
      p {
        width: 70%;
        font-size: 0.28rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      img {
        height: 0.16rem;
      }
    }
  }
  .title2 {
    padding-top: 0.47rem;
    & > p:last-child {
      font-size: 0.24rem;
      color: #3c98ff;
    }
  }
  .history-list {
    margin-top: 0.47rem;
    overflow: hidden;
    & > div {
      font-size: 0.28rem;
      color: #666666;
      padding: 0.2rem 0.53rem;
      margin-right: 0.1rem;
      margin-bottom: 0.18rem;
      float: left;
      background-color: #f6f6f6;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.commodity-page {
  .content {
    height: calc(100vh - 0.84rem);
    overflow: hidden;
  }
  .mescroll {
    height: calc(100% - 2.4rem);
  }
  .search-input-wrap {
    padding-top: 0.34rem;
    & > .yd-flexbox-item-center {
      padding: 0.2rem 0.3rem;
      background-color: #f7f7f7;
      border-radius: 0.4rem;
      position: relative;
      & > .fa {
        margin-right: 0.29rem;
        color: #999999;
      }
      .search {
        color: #999;
        font-size: 0.3rem !important;
        position: absolute;
        top: 50%;
        left: 0.31rem;
        transform: translateY(-40%);
        width: 0.26rem;
        height: 0.26rem;
      }
      i.yd-icon-search {
        color: #999;
        font-size: 0.3rem !important;
        position: absolute;
        top: 50%;
        left: 0.31rem;
        transform: translateY(-40%);
      }
      .yd-input {
        display: flex;
      }
      input {
        color: #999999;
        font-size: 0.28rem;
        margin-left: 0.55rem;
      }
    }
    & > div {
      padding-left: 0.22rem;
      padding: 0.25rem 0 0.25rem 0.22rem;
      font-size: 0.28rem;
      & > .fa {
        font-size: 0.4rem;
      }
    }
  }
  .filter {
    overflow: hidden;
    margin: 0.4rem 0;
    position: relative;
    z-index: 2;
    & > div {
      width: 50%;
      float: left;
      font-size: 0.3rem;
      .fa {
        font-size: 0.3rem;
        margin-left: 0.1rem;
      }
      &.active {
        color: #ff2b44;
      }
    }
  }
  .filter-panel {
    position: absolute;
    width: 100%;
    top: 0;
    // height: 100%;
    bottom: 0;
    z-index: 1;
    .opacity-bg {
      width: 100%;
      height: 2.1rem;
      opacity: 0;
    }
    .panel-content {
      background-color: rgba($color: #000000, $alpha: 0.6);
      position: fixed;
      top: 3.22rem;
      bottom: 0;
      width: 100%;
      .sort {
        width: 100%;
        background-color: #ffffff;
        p {
          font-size: 0.28rem;
          color: #666666;
          height: 0.9rem;
          line-height: 0.9rem;
          border-bottom: 1px solid #e8e6e6;
          &:last-child {
            border-bottom: none;
          }
          &.choosed {
            color: #ff2b44;
          }
        }
      }
      .soccer-filter {
        background-color: #ffffff;
        overflow: hidden;
        padding-bottom: 0.18rem;
        position: relative;
        z-index: 3;
        & > div {
          width: 45%;
          float: left;
          margin-right: 10%;
          height: 0.7rem;
          line-height: 0.7rem;
          font-size: 0.26rem;
          color: #666666;
          background-color: #f6f6f6;
          border-radius: 0.1rem;
          margin-bottom: 0.25rem;
          &:nth-child(2n) {
            margin-right: 0;
          }
          &.choosed {
            background-color: #ffe9ec;
            color: #ff2b44;
            font-weight: bold;
          }
        }
      }
    }
  }
  .list {
    .list-item {
      overflow: hidden;
      height: 2rem;
      margin-bottom: 0.32rem;
      img {
        width: 2rem;
        // height: 2rem;
        float: left;
        border-radius: 0.1rem;
        margin-right: 0.18rem;
      }
      & > div {
        // margin-left: 0.18rem;
        position: relative;
        .name {
          padding-top: 0.1rem;
          font-size: 0.28rem;
          line-height: 1.5;
          height: 0.9rem;
          // line-height: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .bottom-info {
          height: 1rem;
          // position: absolute;
          // bottom: 0.2rem;
          .price {
            height: 0.36rem;
            position: relative;
            img {
              width: 0.24rem;
              height: 0.24rem;
              margin-right: 0.06rem;
            }
            span {
              font-size: 0.3rem;
              color: #ff2b44;
              font-weight: bold;
              &:last-child {
                font-size: 0.36rem;
                transform: scale(0.5);
                display: inline-block;
                // transform-origin: bottom;
                margin-left: -0.15rem;
                position: absolute;
                right: -0.6rem;
                top: 0;
              }
            }
          }
          .person {
            font-size: 0.22rem;
            color: #999999;
            height: 0.36rem;
            line-height: 0.36rem;
          }
        }
      }
    }
  }
}
#commodity-list .list-wrap .item .name {
  text-align: left;
}
.commodity-page .list .list-item > div .name {
  text-align: left;
}
</style>
