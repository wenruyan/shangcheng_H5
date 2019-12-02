import Vue from 'vue';
import {
  Popover,
  MessageBox,
  Message,
  Upload,
  Tree,
  Tag,
  Dialog,
  Radio,
  RadioGroup,
  RadioButton,
  Cascader, Switch,
  Select,
  Option,
  OptionGroup, Row, Col, Button, Input, InputNumber, Form, FormItem, Table, TableColumn, Pagination, Dropdown, DropdownMenu, DropdownItem, Checkbox,
  CheckboxButton,
  CheckboxGroup } from 'element-ui';
import './element-variables.scss'
Vue.prototype.$ELEMENT = { zIndex: 3000 }; // 全局配置

const components = {
  Popover,
  MessageBox,
  Message,
  Upload,
  Tree,
  Tag,
  Dialog,
  Radio,
  RadioGroup,
  RadioButton,
  Cascader,
  Switch,
  Select,
  Option,
  OptionGroup,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  Form,
  FormItem,
  Table,
  TableColumn,
  Pagination,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  CheckboxButton,
  CheckboxGroup
};
Object.keys(components).forEach(key => {
  // Vue.use(components[key]);
  // console.log('key', components[key].name);
  Vue.component(components[key].name, components[key]);
});

// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
