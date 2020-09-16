<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <div
        :class="[
          'sideMenu',
          isMobile() && 'MobileMenu',
          sidebarOpened ? 'header-side-opened' : 'header-side-close',
        ]"
        v-if="visible"
      >
        <i
          :class="[
            'menuIcon',
            collapsed ? 'el-icon-s-fold' : 'el-icon-s-unfold'
          ]"
          @click="toggle"
        ></i>
      </div>
    </div>
  </transition>
</template>
<script>
import { mixin, mixinDevice } from "@/utils/mixin";
export default {
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      visible: true,
      oldScrollTop: 0
    };
  },
  mounted() {
    document.addEventListener("scroll", this.handleScroll, { visible: true });
  },
  methods: {
    handleScroll() {
      const scrollTop =
        document.body.scrollTop + document.documentElement.scrollTop;
      if (!this.ticking) {
        this.ticking = true;
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true;
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false;
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true;
          }
          this.oldScrollTop = scrollTop;
          this.ticking = false;
        });
      }
    },
    toggle() {
      this.$emit("toggle");
    }
  }
};
</script>
<style lang="less" scoped>
.header-animat {
  position: relative;
  z-index: 500;
}
.showHeader-enter-active {
  transition: all 0.25s ease-in-out;
}
.showHeader-leave-active {
  transition: all 0.25s ease-in-out;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
.sideMenu {
  position: fixed;
  top: 0;
  right: 0;
  height: 64px;
  line-height: 64px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  width: calc(100% - 200px);
  transition: width 0.2s;
  -webkit-transition: width 0.25s;
  box-sizing: border-box;
  padding: 0 15px 0 0;
  background-color: #ffffff;
  .menuIcon {
    font-size: 24px;
    width: 64px;
    line-height: 64px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }
}
.header-side-open {
  width: calc(100% - 200px);
}
.header-side-close {
  width: calc(100% - 64px);
}
.MobileMenu {
  width: 100%;
}
</style>
