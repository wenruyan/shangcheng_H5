export default [
  {
    path: 'commodity',
    name: 'main-commodity',
    component: () => import('../views/commodity/index.vue'),
    meta: {
      title: '商品'
    },
    redirect: { name: 'main-commodity-list' },
    children: [
      {
        path: 'list',
        name: 'main-commodity-list',
        component: () => import('../views/commodity/list.vue'),
        meta: {
          title: '列表'
        }
      },
      {
        path: 'label',
        name: 'main-commodity-label',
        component: () => import('../views/commodity/label.vue'),
        meta: {
          title: '标签'
        }
      },
      {
        path: 'specification',
        name: 'main-commodity-specification',
        component: () => import('../views/commodity/specification.vue'),
        meta: {
          title: '规格'
        }
      },
      {
        path: 'sort',
        name: 'main-commodity-sort',
        component: () => import('../views/commodity/sort.vue'),
        meta: {
          title: '分类'
        }
      },
      {
        path: 'create',
        name: 'main-commodity-create',
        component: () => import('../views/commodity/create.vue'),
        meta: {
          title: '新建'
        }
      }
    ]
  }
]
