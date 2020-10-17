<script>
import events from "./events";
import ElTabs from "element-ui/packages/tabs"
import ELTabPane from "element-ui/packages/tab-pane"

export default {
  name: "menuTab",
  data() {
    return {
      pages: [],
      fullPathList: [],
      activeKey: ''
    };
  },
  created() {
    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.selectedLastPath()
    console.log(events)
  },
  methods: {
    selectedLastPath () {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },
    removeTab(targetName) {
      let tabs = this.pages;
      let activeName = this.activeKey;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.activeKey = activeName;
      this.pages = tabs.filter(tab => tab.fullPath !== targetName);
      this.fullPathList = tabs.filter(tab => tab !== targetName);
    }
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.fullPath
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath)
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    }
  },
  render() {
    const { $data: { pages } } = this
    const on = {
      'tab-remove': this.removeTab
    }
    const panes = pages.map(page => {
      return (
        <ELTabPane key={page.fullPath} label={page.meta.title} name={page.fullPath}></ELTabPane>
      )
    })
    return(
      <div class="menuTab">
        <ElTabs type='card' closable v-model={this.activeKey} {...{on: on}}>
          {panes}
        </ElTabs>
      </div>
    )
  }
};
</script>