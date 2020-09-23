<template>
  <div class="baseLayoutContainer">
    <el-drawer v-if="isMobile()" :visible.sync="collapsed" :with-header="false" direction="ltr">
      <SideMenu :menus="menus" :collapsed="false" :collapsible="true"></SideMenu>
    </el-drawer>
    <SideMenu :menus="menus" :collapsed="collapsed" :collapsible="true" v-else></SideMenu>

    <div class="contentItem" :style="{ paddingLeft: contentPaddingLeft}">
      <MenuHeader @toggle="setCollapsed"></MenuHeader>
      <div class="content">
        <menu-tab v-if="multiTab"></menu-tab>
      </div>
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import SideMenu from "@/components/Menu/SideMenu";
import MenuHeader from "@/components/MenuHeader/MenuHeader";
import { mapState, mapActions } from "vuex";
import { triggerWindowResizeEvent } from "@/utils/util";
import { mixin, mixinDevice } from "@/utils/mixin";

export default {
  name: "basic",
  components: {
    SideMenu,
    MenuHeader
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      menus: [],
      collapsed: false,
      multiTab: true
    };
  },
  computed: {
    ...mapState({
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft() {
      if (this.isMobile()) {
        return "0";
      }
      if (this.collapsed) {
        return "64px";
      }
      return "200px";
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created() {
    this.menus = this.mainMenu.find(item => item.path === "/").children;
    this.collapsed = !this.sidebarOpened
  },
  methods: {
    ...mapActions(["setSidebar"]),
    setCollapsed() {
      this.collapsed = !this.collapsed;
      this.setSidebar(!this.collapsed);
      triggerWindowResizeEvent();
    }
  }
};
</script>
<style lang="less" scoped>
.baseLayoutContainer {
  width: 100%;
  height: auto;
  display: flex;
  overflow-x: hidden;
  > .contentItem {
    width: 100%;
    padding-left: 200px;
    min-height: 100vh;
    padding-top: 68px;
    box-sizing: border-box;
  }
}
</style>
