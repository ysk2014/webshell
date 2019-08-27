import Vue from 'vue';
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

import { Row, Col, Message } from 'element-ui';

import App from './App.vue';
 
Vue.use(contentmenu);
Vue.use(Row);
Vue.use(Col);

Vue.prototype.$message = Message;


new Vue({
    el: '#terminal',
    render: h => h(App)
});

