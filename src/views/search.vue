<template>
  <div class="search-page">
    <div class="search-nav">
      <button type="button" class="search-nav-back" @click="GO(-1)"><i class="yd-back-icon"/></button>
      <form class="search-input" :class="{'search-input-result': mode == 'list'}" @submit.prevent="search" @click="focus">
        <div class="search-input-tag-wrap" v-if="mode == 'list'">
          <div class="search-input-tag" @click.stop="clear">
            <span>{{keyword}}</span>
            <i class="fa fa-close"></i>
          </div>
        </div>
        <template v-if="mode == 'search'">
          <input type="search" :placeholder="hotWord" v-model="keyword" ref="input"/>
          <button type="button" class="search-clear-btn" v-if="keyword" @click="clear">
            <i class="yd-icon-error"></i>
          </button>
        </template>
      </form>
      <button type="button" class="search-nav-cart" @click="PUSH({path: '/shopping-cart', query: {showTabbar: false}})">
        <i class="yd-icon-shopcart-outline">
          <span class="search-nav-cart-badge" v-if="cartCount">{{cartCount}}</span>
        </i>
      </button>
    </div>

    <template v-if="mode == 'search'">
      <div class="search-quick">
        <div class="search-tag-panel" v-if="historySearch.length > 0">
          <h3>历史搜索</h3>
          <search-tags
            :tags="historySearch" @choose="choose"
            :min="1.52" :max="3.8"
            :expand.sync="expandHistorySearch" expandable/>
        </div>

        <div class="search-tag-panel" v-if="hotSearch.length > 0">
          <h3>热门搜索</h3>
          <search-tags :tags="hotSearch" :max="2.28" @choose="choose"/>
        </div>
      </div>

      <!-- <div class="search-associate" v-if="keyword">
        <search-associate-item
          v-for="word in associateWords" :key="word"
          :value="word" :keyword="keyword" @click="choose(word)"
        />
      </div> -->
    </template>

    <div class="search-result" v-if="mode == 'list'">
      <div class="search-result-toolbar">
        <sort-condition :value="sort" @input="sortChange"/>
        <div class="search-result-toolbar-layout">
          <button type="button" @click="layout = 'list'" :class="{'search-is-selected': layout == 'list'}"><i class="fa fa-th-list"></i></button>
          <button type="button" @click="layout = 'card'" :class="{'search-is-selected': layout == 'card'}"><i class="fa fa-th-large"></i></button>
        </div>
      </div>
      <div class="search-result-list" :class="{'search-result-list-full': !page.hasNextPage}">
        <mescroll-vue :down="mescrollDown" :up="mescrollUp" @init="mescroll = $event">
          <commodity-list :layout="layout" :list="page.list" @jump="jump"/>
          <div class="search-result-empty" v-if="page.empty">未找到相关商品，更换关键词试试</div>
          <div class="search-result-list-divider" v-if="!page.empty && !page.hasNextPage">没有更多了</div>
          <commodity-recommend :list="recommend.list" v-if="!page.hasNextPage"/>
        </mescroll-vue>
      </div>
    </div>
  </div>
</template>

<script>
import SortCondition from '../components/SortCondition.vue';
import CommodityList from '../components/CommodityList.vue';
import MescrollVue from "mescroll.js/mescroll.vue";
import CommodityRecommend from '../components/CommodityRecommend.vue';

import { mapState } from 'vuex'

const HISTORT_KEY = '_focus_shopping_mall_search_history_';
const KEYWORD_KEY = '_focus_shopping_mall_search_keyword_';

export default {
  name: 'search',
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: true,
        callback: this.refresh
      },
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.loadmore,
        auto: false,
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 12 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看 这就是为什么无更多数据有时候不显示的原因
        loadFull: {
          use: true,
          delay: 500
        }
      },
      historySearch: this.getHistoryFromStorage(),
      expandHistorySearch: false,
      hotSearch: [],
      hotWord: '',
      // associateWords: [
      //   '华为手机', '华为手机5G', '华为荣耀', '华为华为手机华为', 'mate30 华为手机', '华为笔记本', '华为电脑'
      // ],
      keyword: '',
      layout: 'list',
      sort: '10',
      mode: 'search', // search list
      empty: false,
      page: {
        list: [],
        hasNextPage: true,
        empty: false
      },
      recommend: {
        current: 0,
        size: 12,
        list: [],
        hasNextPage: true
      }
    }
  },
  computed: {
    ...mapState(['cartCount'])
  },
  methods: {
    jump(item) {
      this.PUSH(`/commodity/detail?id=${item.productId}`)
    },
    clear() {
      this.keyword = '';
      this.mode = 'search';
      this.$nextTick(this.focusInput);
      this.historySearch = this.getHistoryFromStorage();
    },
    focus() {
      this.mode = 'search';
      this.$nextTick(this.focusInput)
      this.historySearch = this.getHistoryFromStorage();
    },
    focusInput() {
      this.$refs.input.focus();
    },
    // associate: _.debounce(function(word) {
    //   if (!word) return;
    //   //  do associate
    //   console.log('associate for ', word)
    // }, 250),
    choose(word) {
      this.keyword = word;
      this.search();
    },
    search() {
      this.mode = 'list';
      this.saveHistoryToStorage(this.keyword);
      sessionStorage.setItem(KEYWORD_KEY, this.keyword);
    },
    sortChange(val) {
      this.sort = val;
      this.refresh(this.mescroll)
    },
    refresh(mescroll) {
      this.recommend.current = 0;
      this.recommend.list = [];
      this.recommend.hasNextPage = true;

      this.page.list = [];
      this.page.hasNextPage = true;
      this.page.empty = false;

      mescroll.hideUpScroll(true);
      mescroll.resetUpScroll();
    },
    loadmore(page, mescroll) {
      if (!this.page.hasNextPage) return this.loadRecommend(page, mescroll);

      this.fetchData(page).then(({ records, total, current, size }) => {
        this.page.list = this.page.list.concat(records);

        this.page.empty = total == 0;
        this.page.hasNextPage = current < total / size;

        mescroll.endSuccess(12, true);
      }).catch(err => {
        console.log("err", err);
        mescroll.endErr();
      })
    },
    loadRecommend(page, mescroll) {
      this.fetchRecommend().then(({ records, total, current, size }) => {
        this.recommend.list = this.recommend.list.concat(records);
        this.recommend.current = current;

        const hasNextPage = current < total / size;
        this.recommend.hasNextPage = hasNextPage;
        mescroll.endSuccess(records.length, hasNextPage);
      }).catch(err => {
        console.log("err", err);
        mescroll.endErr();
      })
    },
    fetchData(params) {
      const path = '/Focus-BladeX-BootX/productlist/productList';
      const query = {
        current: params.num,
        size: params.size,
        findstr: this.keyword,
        sortType: this.sort
      };

      return this.$http.get(path, query).then(res => {
        return res.data;
      })
    },
    fetchRecommend() {
      const path = '/Focus-BladeX-BootX/productlist/preProductList';
      const query = {
        current: this.recommend.current + 1,
        size: this.recommend.size
      }

      return this.$http.get(path, query).then(res => {
        return res.data;
      })
    },
    saveHistoryToStorage(keyword) {
      const arr = this.getHistoryFromStorage();
      const index = arr.indexOf(keyword);

      if (index >= 0) arr.splice(index, 1);
      arr.unshift(keyword);
      if (arr.length > 120) arr.length = 120;

      localStorage.setItem(HISTORT_KEY, JSON.stringify(arr))
    },
    getHistoryFromStorage() {
      const str = localStorage.getItem(HISTORT_KEY);
      try {
        const data = JSON.parse(str);
        return Array.isArray(data) ? data : []
      } catch (error) {
        return []
      }
    },
    fetchHotSearch () {
      const path = '/Focus-BladeX-BootX/hotsearch/publicPara';
      const query = {}
      return this.$http.get(path, query).then(res => {
        this.hotWord = res.data.searchValue.join(',');
        this.hotSearch = res.data.hotSearchs.map(i => i.hotKey);
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 刷新后恢复搜索词
      if (from.name == null && from.path == '/') {
        const str = sessionStorage.getItem(KEYWORD_KEY);
        if (str) vm.choose(str);
      }
    })
  },
  mounted() {
    setTimeout(this.focusInput, 320);
    this.fetchHotSearch();
  },
  components: {
    [SortCondition.name]: SortCondition,
    [CommodityList.name]: CommodityList,
    [CommodityRecommend.name]: CommodityRecommend,
    MescrollVue,
    'search-tags': {
      name: 'search-tags',
      props: {
        tags: {
          type: Array,
          default() {
            return []
          }
        },
        expand: {
          type: Boolean,
          default: false
        },
        expandable: {
          type: Boolean,
          default: false
        },
        min: { // 收起时最大高度（rem)
          type: Number,
          default: -1
        },
        max: { // 展开时最大高度 (rem)
          type: Number,
          default: -1
        }
      },
      methods: {
        toggle(e) {
          this.$emit('update:expand', !this.expand);
        },
        choose(e, i) {
          this.$emit('choose', i)
        },
        createTag(i) {
          const tag = document.createElement('div');
          tag.innerText = i;
          tag.className = 'search-tag';
          tag.addEventListener('click', e => this.choose(e, i));
          return tag;
        },
        createExpand() {
          const tag = document.createElement('div');
          tag.className = 'search-tags-expand-btn';
          tag.innerHTML = '<i class="fa fa-angle-down"></i>';
          tag.addEventListener('click', e => this.toggle(e))
          return tag;
        },
        fill() {
          const rootFontSize = window.getComputedStyle(document.documentElement).fontSize;
          const base = parseInt(rootFontSize.replace(/px/ig, ''))
          const max = this.expandable ? (this.expand ? this.max : this.min) : this.max;

          const container = this.$el;
          for (let i = 0; i < this.tags.length; i++) {
            const item = this.tags[i];
            const tag = this.createTag(item);
            this.$el.appendChild(tag);

            const heightPx = window.getComputedStyle(container).height;
            const height = parseFloat(heightPx.replace(/px/ig, ''));
            const currHeight = height / base;

            if (currHeight > max) {
              container.removeChild(container.lastElementChild);
              if (this.expandable) {
                container.removeChild(container.lastElementChild);
                container.appendChild(this.createExpand())
              }
              break;
            }

            if (this.expandable && i == this.tags.length - 1 && currHeight > this.min) {
              if (currHeight > max) container.removeChild(container.lastElementChild);
              container.appendChild(this.createExpand())
            }
          }
        }
      },
      render() {
        this.$nextTick(this.fill);

        const className = {
          'search-tags': true,
          'search-tags-expand': this.expand
        }

        return <div class={className} key={this.expand}></div>
      }
    }
    // 'search-associate-item': {
    //   name: 'search-associate-item',
    //   props: {
    //     value: {
    //       type: String,
    //       default: null
    //     },
    //     keyword: {
    //       type: String,
    //       default: null
    //     }
    //   },
    //   methods: {
    //     click(e) {
    //       this.$emit('click', this.value)
    //     }
    //   },
    //   render() {
    //     if (this.value == null) return null;

    //     if (!this.keyword) {
    //       return <div class="search-associate-item" onClick={this.click}>{this.value}</div>
    //     }

    //     const reg = new RegExp(`(${this.keyword})`);
    //     const words = this.value.split(reg).filter(i => i);
    //     const content = words.map(word => word == this.keyword ? <strong>{word}</strong> : word)

    //     return (
    //       <div class="search-associate-item" onClick={this.click}>{content}</div>
    //     )
    //   }
    // }
  }
}
</script>

<style lang="scss">
.search-page{
  height: 100vh;
  overflow: hidden;
}

.search-nav{
  height: 0.84rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  button{
    height: 0.84rem;
    border: none;
    outline: none;
    background-color: transparent;
  }
}

.search-nav-back{
  width: 0.9rem;
  padding-left: 0.3rem;
  text-align: left;
  color: #666;

  i:before{
    margin-top: 0;
    font-size: 0.36rem;
  }
}

.search-nav-cart{
  width: 1.16rem;
  padding-right: 0.48rem;
  text-align: right;

  i{
    color: #999;
    font-size: 0.44rem;
    position: relative;
  }
}

.search-nav-cart-badge{
  background-color: #FF2626;
  font-size: 0.18rem;
  border-radius: 0.12rem;
  line-height: 0.26rem;
  padding: 0 0.08rem;
  color: #fff;

  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(50%);
}

.search-input{
  position: relative;
  flex: 1;
  height: 0.6rem;
  border-radius: 0.3rem;
  background-color: #F5F5F5;

  input[type="search"]{
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 0.24rem;
    font-weight: 700;
    color: #333333;
    font-size: 0.26rem;

    &::-webkit-search-cancel-button{
      -webkit-appearance: none;
    }

    &::-webkit-input-placeholder {
      color: #8B8B8B;
      font-size: 0.26rem;
      font-weight: 400;
		}
  }
}

.search-input-result{
  padding: 0.08rem 0 0 0.08rem;
}

.search-input-tag-wrap{
  display: inline-block;
  height: 100%;
}

.search-input-tag{
  background-color: #DCDCDC;
  border-radius: 0.2rem;
  padding: 0 0.1rem 0 0.2rem;
  font-size: 0.26rem;
  color: #333;
  // display: flex;
  // flex-flow: row nowrap;
  // align-items: center;
  height: 0.44rem;
  line-height: 0.44rem;

  span{
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
  }

  i{
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    font-size: 0.26rem;
    font-weight: 100;
    color: #A7A7A7;
    margin: 0 0.06rem 0 0.14rem;
  }
}

.search-clear-btn{
  position: absolute;
  right: 0;
  top: 0;
  outline: none;
  border: none;
  background-color: transparent;
  font-size: 15px;
  color: #c1c1c1;
  width: 0.58rem !important;
  height: 0.58rem !important;
}

.search-quick{
  margin-top: 0.12rem;
}

.search-tag-panel{
  padding: 0 0.3rem;

  h3{
    font-size: 0.28rem;
    font-weight: 700;
    line-height: 0.4rem;
    color: #333;
    padding: 0.22rem 0 0.2rem 0;
  }
}

.search-tag-list{
  display: flex;
  flex-flow: row wrap;
}

.search-tags{
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;
}

.search-tags-expand-btn{
  line-height: 0.56rem;
  height: 0.56rem;
  width: 0.56rem;
  color:#666666;
  text-align: center;

  i{
    line-height: 0.56rem;
    font-size: 0.6rem;
    font-weight: 400;
  }
}

.search-tags-expand .search-tags-expand-btn{
  transform: rotate(180deg);
}

.search-tag{
  padding: 0.1rem 0.3rem;
  font-size: 0.26rem;
  line-height: 0.36rem;
  height: 0.56rem;
  color:#666666;
  background-color: #F5F5F5;
  border-radius: 0.28rem;
  margin: 0 0.16rem 0.2rem 0;
  max-width: 40%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-associate{
  padding: 0 0.3rem;
}

.search-associate-item{
  font-size: 0.24rem;
  color: #333;
  line-height: 0.4rem;
  padding: 0.2rem 0;

  strong{
    color: #0080FF;
    font-weight: 400;
  }

  & + .search-associate-item{
    border-top: 1px solid #F5F5F5;
  }
}

.search-result-toolbar{
  height: 0.81rem;
  padding: 0 0.2rem;
  border-bottom: 1px solid #F5F5F5;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.search-result-toolbar-layout button{
  width: 0.8rem;
  height: 0.8rem;

  color: #999;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 0.36rem;

  &.search-is-selected{
    color: #333;
  }
}

.search-result-list{
  height: calc(100vh - 1.65rem);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #F8F8F8;
}

.search-result-empty{
  height: 4.04rem;
  padding-top: 1.7rem;
  color: #666666;
  font-size: 0.24rem;
  text-align: center;
}

.search-result-list-divider{
  font-size: 0.24rem;
  line-height: 0.34rem;
  padding: 0.2rem 0;
  color: #999999;
  text-align: center;
}
</style>
