import Vue from 'vue';
import Main from './main.vue';
let TerminalConstructor = Vue.extend(Main);

let instance;

const Terminal = function(options = {}) {
    if (Vue.prototype.$isServer) return;
    if (instance) {
        instance.visible = !instance.visible;
        return;
    }

    instance = new TerminalConstructor({
        data: {options, delInstance: () => (instance = null)}
    });

    instance.$mount();
    document.body.appendChild(instance.$el);

    return instance;
};

Terminal.command = (cmd, hasEnter) => instance.command(cmd, hasEnter);

Terminal.install = function(Vue) {
    Vue.prototype.$terminal = Terminal;
};

export default Terminal;
