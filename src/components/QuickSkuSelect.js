import Vue from 'vue';
import SkuSelect from './sku-select.vue';
import http from '../utils/http';
import vue from '../main'
const Component = Vue.extend(SkuSelect);

function destroyComponent(instance) {
  const el = instance.$el;
  setTimeout(() => {
    el.parentNode.removeChild(el)
    instance.$destroy(true);
  }, 1500)
}

export default function(options = {}) {
  const path = '/Focus-BladeX-BootX/productlist/detail';
  const query = {
    id: options.id,
    cuserinfo: options.cuserinfo
  };

  return http.get(path, query).then(res => {
    const skus = res.data.skus;
    // const specifications = res.data.specifications;
    const isSingle = res.data.notes == '10';
    // 判断规格， 单规格直接加入购物车
    if (isSingle && options.operate !== 'update') {
      if (!vue.isLogin) {
        vue.$dialog.confirm({
          title: "提示",
          mes: "您还未登录，请先登录",
          opts: [
            {
              txt: "登录",
              color: true,
              callback: () => {
                vue.PUSH({ path: "/login-sms" });
              }
            },
            {
              txt: "取消",
              color: false,
              callback: () => {

              }
            }
          ]
        });
        return Promise.reject(new Error('cancel'))
      }
      const sku = skus[0];
      // const productSpecificationSet = sku.productSpecificationSet;

      // const isMatch = productSpecificationSet.split(',').every((id, index) => {
      //   const spec = specifications[index] || {};
      //   const attr = spec.attributes || [];
      //   if (attr.length == 0) return false;

      //   return attr.some(a => a.id == id);
      // });

      return Promise.resolve({
        choosedSku: sku,
        count: 1
      })
    }

    return new Promise((resolve, reject) => {
      let el = document.createElement('div');
      let instance = new Component({
        propsData: {
          show: false,
          data: {
            goodsData: res.data,
            skuSelectedData: options.operate !== 'update' ? null : options.skuSelectedData,
            count: options.buyCount || 1,
            skuSelectType: options.type || '10'
          }
        }
      })

      // 因组件挂载时会触发关闭事件，暂不监听
      // instance.$on('hideSkuSelect', event => {
      //   instance.show = event;
      //   destroyComponent(instance);
      //   reject(new Error('cancel'));
      // })

      instance.$on('selectSku', event => {
        if (event.hideType == '10') {
          instance.show = false;
          destroyComponent(instance);
          reject(new Error('cancel'));
        }
      })

      instance.$on('confirmSelectSku', event => {
        instance.show = false;
        destroyComponent(instance);
        resolve(event)
      })

      document.body.appendChild(el);

      instance.$mount(el);
      instance.show = true;
    })
  })
}
