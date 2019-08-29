import Vue from 'vue';
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

import { Row, Col, Message,  Select, Option, Tabs, TabPane, Icon } from 'element-ui';

import App from './App.vue';
 
Vue.use(contentmenu);
Vue.use(Row);
Vue.use(Col);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Icon);

Vue.prototype.$message = Message;


new Vue({
    el: '#terminal',
    render: h => h(App)
});

