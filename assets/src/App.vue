
<template>
  <div class="terminal" id="terminal" v-show="visible" v-contextmenu:contextmenu>
    <div class="header">
      <span>终端</span>
      <ul class="menu-list">
        <li class="active">
          <select class="terminal-select" v-model="currentTab">
            <option :value="index" v-for="(item, index) in terminals" :key="index">{{ '终端'+index }}</option>
          </select>
        </li>
        <li class="icon-plus" @click="handlePlus"></li>
        <li class="icon-delete" @click="handleDelete"></li>
      </ul>
    </div>
    <div id="xterm-wrapper">
      <div
        v-for="(tab, index) in terminals"
        :key="index"
        class="xterm-tabs"
        v-show="index == currentTab"
      >
        <div v-if="tab.children.length >= 4" class="xterm-tab-item">
          <el-row type="flex" class="el-row-4">
            <el-col :span="12" v-for="(item, k) in tab.children.slice(0,2)" :key="k" class="el-col">
              <div class="terminal-pane" :id="item.name"></div>
            </el-col>
          </el-row>
          <el-row type="flex" class="el-row-4">
            <el-col :span="12" v-for="(item, k) in tab.children.slice(2)" :key="k" class="el-col">
              <div class="terminal-pane" :id="item.name"></div>
            </el-col>
          </el-row>
        </div>
        <div v-else class="xterm-tab-item">
          <el-row type="flex">
            <el-col
              :span="(24/tab.children.length)"
              v-for="(item, k) in tab.children"
              :key="k"
              class="el-col"
            >
              <div class="terminal-pane" :id="item.name"></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <v-contextmenu ref="contextmenu" class="contextmenu">
      <v-contextmenu-item @click="handleSplitPane">分屏</v-contextmenu-item>
      <v-contextmenu-item>关闭</v-contextmenu-item>
      <v-contextmenu-item>设置背景</v-contextmenu-item>
      <v-contextmenu-item>设置</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>
<script>
import io from "socket.io-client";
import uuidv4 from "uuid/v4";
import { WebLinksAddon } from "xterm-addon-web-links";
import Terminal from "./Xterm";
export default {
  name: "Terminal",
  data() {
    return {
      term: null,
      terminals: [],
      socket: null,
      currentTab: 0,
      visible: true
    };
  },
  methods: {
    createTerminal(container, callback) {
      let terminalname = "terminal" + uuidv4();

      let term = new Terminal();
      term.loadAddon(new WebLinksAddon());

      container.children.push({
        term: term,
        name: terminalname
      });

      callback && callback();

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
        container.children.forEach(item => {
          let termEle = document.getElementById(item.name);
          if (item.term.element != termEle.children[0]) {
            termEle.innerHTML = "";
            termEle.append(item.term.element);
          }
          item.term.fit();
        });
      });
    },
    command(cmd, hasEnter = true) {
      this.socket.emit("input", hasEnter ? cmd : cmd + "\r");
    },
    handlePlus() {
      let tab = { name: "tab" + this.terminals.length, children: [] };
      this.createTerminal(tab, () => {
        this.terminals.push(tab);
        this.currentTab = this.terminals.length - 1;
      });
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
    },
    handleSplitPane() {
      // 分屏
      let tab = this.terminals[this.currentTab];
      if (tab.children.length >= 4) {
        this.$message({
          type: "warning",
          message: "分屏已经达到最大数量"
        });
        return false;
      }
      this.createTerminal(tab);
    }
  },

  mounted() {
    this.socket = io(window.location.origin + "/terminal");
    if (this.terminals.length == 0) {
      let tab = { name: "tab0", children: [] };
      this.createTerminal(tab, () => {
        this.terminals.push(tab);
        this.currentTab = this.terminals.length - 1;
      });
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
  padding-top: 40px;
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

    .xterm-tabs,
    .xterm-tab-item,
    .el-row {
      width: 100%;
      height: 100%;
    }

    .el-row-4 {
      height: 50%;
    }

    .el-row-4:last-child {
      border-top: 1px solid #dcdfe6;
    }

    .el-col {
      padding: 10px;
    }

    .terminal-pane {
      width: 100%;
      height: 100%;
    }
  }
}

.contextmenu {
  background-color: #c0c4cc;
  border: 0;
  color: #303133;
  min-width: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-col-12:not(:last-child),
.el-col-8:not(:last-child) {
  border-right: 1px solid #dcdfe6;
  height: 100%;
}
</style>
