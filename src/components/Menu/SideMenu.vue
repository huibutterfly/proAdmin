<template>
  <div id="menu">
    <SMenu :menu="menus" :collapsed="collapsed"></SMenu>
  </div>
</template>
<script>
import SMenu from "./menu";
export default {
  props: {
    menus: {
      type: Array,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  name: "SideMenu",
  components: {
    SMenu
  }
};
</script>
<style lang="less" scoped>
#menu {
  .el-menu-vertical {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 800;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
