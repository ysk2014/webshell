<template>
  <div class="dialog-modal" v-show="visible" @click.self="() => $emit('update:visible', false)">
    <div class="config-container">
      <div class="btn-close el-icon-close"></div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="背景图片" name="first">设置背景图片</el-tab-pane>
        <el-tab-pane label="主题" name="second">
          <el-select v-model="theme" placeholder="请选择">
            <el-option v-for="item in themes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import xtermTheme from "xterm-theme";
const themes = Object.keys(xtermTheme);

export default {
  name: "ConfigModal",
  props: {
    visible: Boolean
  },
  data() {
    return {
      activeName: "first",
      themes: themes,
      theme: null
    };
  },
  watch: {
    theme(val) {
      window.localStorage.setItem("themeName", val);
      this.$emit("setTheme", xtermTheme[val]);
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.1);

  &::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
}
.config-container {
  position: relative;
  display: inline-block;
  min-width: 420px;
  padding: 10px 10px 10px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
  overflow: hidden;
  backface-visibility: hidden;

  .btn-close {
    position: absolute;
    top: 5px;
    right: 10px;
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
}
</style>