<template>
  <div class="page search-page">
    <yd-navbar :title="$route.meta.title" height="0.84rem" border-color="#E8E6E6">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
    </yd-navbar>
    <div class="searchContent content t-c">
      <yd-flexbox class="pd-wrap search-input-wrap">
        <yd-flexbox-item class="flex">
          <img class="search" src="../assets/img/search.png" alt="" @click="onBlur">
          <!-- <yd-icon style="font-size: 0.3rem;" name="search" @click="onBlur"></yd-icon> -->
          <!-- <i class="fa fa-search" @click="onBlur"></i> -->
          <yd-input class="searchInput" v-model="searchVal" @keyup.native="associationQuery" ref="search" placeholder="全球好礼运动换"></yd-input>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVal: "",
      associateWords: [],
      historyKeywords: [],
      hotKeywords: []
    };
  },
  created() {
  },
  mounted() {
    // if (sessionStorage.getItem("searchVal")) {
    //   this.searchVal = sessionStorage.getItem("searchVal");
    // }
    this.$refs.search.setFocus();
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

    this.init();
    this.hotKeywords = JSON.parse(this.$store.state.mallPageData.hotsearch);
  },
  methods: {
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
      sessionStorage.setItem("searchVal", this.searchVal);
      this.PUSH({
        path: "/commodity",
        query: {
          keyWords: this.searchVal
        }
      });
    }
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
      .searchInput {
        color: #999999;
        font-size: 0.28rem;
        padding-left: 0.55rem;
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
</style>
