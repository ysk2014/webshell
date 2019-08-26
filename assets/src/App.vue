<template>
  <div id="app">
    <transition name="el-fade-in-linear">
      <div class="home-main">
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      loading: false
    };
  },
  created() {
    document.onkeypress = () => {
      let _key = window.event.keyCode;
      if (_key === 96 && window.event.ctrlKey) {
        this.$terminal();
      }
    };
  },
  methods: {
    getInit() {
      this.loading = true;
    }
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
#app {
  height: 100%;
}
.home-main {
  height: 100%;
}
</style>

