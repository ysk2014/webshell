import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Terminal from './components/Terminal/main.js';
Vue.use(Terminal);

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
