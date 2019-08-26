
<template>
  <div class="terminal" id="terminal" v-show="visible">
    <div class="header">
      <span>终端</span>
      <ul class="menu-list">
        <li class="active">
          <select class="terminal-select" v-model="current">
            <option :value="index" v-for="(item, index) in terminals" :key="index">{{ '终端'+index }}</option>
          </select>
        </li>
        <li class="icon-plus" @click="handlePlus"></li>
        <li class="icon-delete" @click="handleDelete"></li>
      </ul>
    </div>
    <div id="xterm-wrapper">
      <div
        v-for="(item, index) in terminals"
        :id="item.name"
        :key="index"
        v-show="index == current"
      ></div>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
import { WebLinksAddon } from "xterm-addon-web-links";
import Terminal from "./Xterm";
export default {
  name: "Terminal",
  data() {
    return {
      term: null,
      terminals: [],
      socket: null,
      current: 0,
      visible: true
    };
  },
  methods: {
    createTerminal() {
      let terminalname = "terminal" + this.terminals.length;

      let term = new Terminal();
      term.loadAddon(new WebLinksAddon());
      this.terminals.push({
        term: term,
        name: terminalname
      });
      this.current = this.terminals.length - 1;

      term.on("resize", size => {
        this.socket.emit(terminalname + "-resize", [size.cols, size.rows]);
      });
      term.on("data", data => {
        this.socket.emit(terminalname + "-input", data);
      });

      this.socket.on(terminalname + "-output", arrayBuffer => {
        term.write(arrayBuffer);
      });

      window.addEventListener("resize", () => {
        term.fit();
      });
      this.socket.emit("create", { name: terminalname, cwd: this.cwd });

      this.$nextTick(() => {
        term.open(document.getElementById(terminalname));
        term.fit();
      });
    },
    command(cmd, hasEnter = true) {
      this.socket.emit("input", hasEnter ? cmd : cmd + "\r");
    },
    handlePlus() {
      this.createTerminal();
    },
    handleDelete() {
      if (this.terminals.length == 1) {
        this.$destroy();
      } else {
        let { term, name } = this.terminals[this.current];
        term.destroy();

        if (this.current + 1 != this.terminals.length) {
          let next = this.terminals[this.current + 1];
          document.getElementById(name).append(next.term.element);
        }

        this.terminals.splice(this.current, 1);
        this.current = this.terminals.length - 1;
        this.terminals[this.current].term.focus();
        this.socket.emit("remove", name);
      }
    }
  },

  mounted() {
    this.socket = io(window.location.origin + "/terminal");
    if (this.terminals.length == 0) {
      this.createTerminal();
    }
  },

  beforeDestroy() {
    this.socket.close();
    if (this.terminals.length > 0) {
      this.terminals.forEach(({ term }) => {
        term.destroy();
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

#terminal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  padding: 50px 10px 10px;
  background-color: #000;
  z-index: 1002;

  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #000;
    color: #fff;
    font-size: 14px;
    font-weight: bolder;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #909399;

    * {
      box-sizing: border-box;
    }
    .menu-list {
      list-style: none;
      float: right;
      height: 40px;
      li {
        padding: 0 10px;
        line-height: 40px;
        cursor: pointer;
        color: #fff;
        float: left;
      }
    }
    .terminal-select {
      background-color: #000;
      color: #fff;
      width: 120px;
      margin-right: 5px;
    }
    .icon-plus {
      width: 40px;
      height: 40px;
      background: url(./assets/images/plus.png) center no-repeat;
      background-size: 16px;
    }
    .icon-delete {
      width: 40px;
      height: 40px;
      background: url(./assets/images/delete.png) center no-repeat;
      background-size: 17px;
    }
    .icon-close {
      width: 40px;
      height: 40px;
      background: url(./assets/images/close.png) center no-repeat;
      background-size: 16px;
    }
  }

  #xterm-wrapper {
    width: 100%;
    height: 100%;

    & > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
