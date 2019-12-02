<script>
import CommodityListItem from './CommodityListItem.vue';
import CommodityListCard from './CommodityListCard.vue';

export default {
  name: 'CommodityList',
  props: {
    layout: {
      type: String,
      // list, card
      default: 'list'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    formatter: {
      type: Function,
      default: null
    }
  },
  computed: {
    fList() {
      if (typeof this.formatter != 'function') return this.list;

      return this.list.map(this.formatter)
    }
  },
  methods: {
    jump(e) {
      this.$emit('jump', e)
    },
    createItem(item) {
      return <commodity-list-item item={item} onJump={this.jump} onSuccess={e => this.$emit('success')}/>
    },
    createCard(item) {
      return <commodity-list-card item={item} onJump={this.jump} onSuccess={e => this.$emit('success')}/>
    }
  },
  render() {
    return (
      <div class="commodity-list" data-layout={this.layout}>
        {this.fList.map(i => this.layout == 'card' ? this.createCard(i) : this.createItem(i))}
      </div>
    )
  },
  components: {
    [CommodityListItem.name]: CommodityListItem,
    [CommodityListCard.name]: CommodityListCard
  }
}
</script>

<style lang="scss">
.commodity-list[data-layout]{
  display: flex;
  flex-flow: column wrap;

  &[data-layout="card"]{
    padding: 0 0.1rem;
    flex-direction: row;

    .commodity-list-card{
      margin-left: 0.1rem;
    }
  }
}
</style>
