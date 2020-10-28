import ElMenu from "element-ui/packages/menu";
import ElMenuItem from "element-ui/packages/menu-item";
import ELSubMenu from "element-ui/packages/submenu";
import { mixin } from "@/utils/mixin";

export default {
  name: "SideMenu",
  mixins: [mixin],
  props: {
    menu: {
      type: Array,
      required: true
    },
    collapsible: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      selectedKeys: ''
    };
  },
  computed: {},
  mounted() {
    this.setMenu()
  },
  watch: {
    $route: function () {
      this.setMenu()
    }
  },
  methods: {
    setMenu() {
      const routes = this.$route.matched.concat()
      const {
        hidden
      } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = routes[routes[routes.length - 1].path]
      } else {
        this.selectedKeys = routes.pop().path
      }
    },
    renderItem(menu){
      if(!menu.hidden){
        return menu.children && !menu.hideChildrenInMenu ? this.setELSubMenu(menu) : this.setMenuItem(menu)
      }
    },
    setMenuItem(menu) {
      if(menu.children && menu.hideChildrenInMenu){
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      return (
        <ElMenuItem index={menu.path}>
          {menu.meta.title}
        </ElMenuItem>
      )
    },
    setELSubMenu(menu){
      let itemArray = []  
      if(!menu.hideChildrenInMenu){
        menu.children.forEach(item => {
          itemArray.push(this.setMenuItem(item))
        });
      }
      return (
        <ELSubMenu index={menu.path}>
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{menu.meta.title}</span>
          </template>
          {itemArray}
        </ELSubMenu>
      )
    },
    handleSelect(key){
      this.selectedKeys = key
      this.$router.push({ path: this.selectedKeys })
    }
  },
  render() {
    const { menu } = this
    const menuTree = menu.map(item => {
      if(item.hidden){
        return null
      }
      return this.renderItem(item)
    })
    const on = {
      select: this.handleSelect
    }
    return (
      <ElMenu
        {...{on: on}} collapse={this.collapsible && !this.sidebarOpened}
        class="el-menu-vertical"
        default-active={this.selectedKeys}
        background-color="#001529"
        text-color="#fff"
        show-timeout="250"
        hide-timeout="250"
        active-text-color="#ffd04b"
      >
        {menuTree}
      </ElMenu>
      )
    }
  };