import Vue from "vue"
import store from "@/store"

const action = Vue.directive('action', {
  inserted: function(el, binding, vNode){
    const actionName = binding.arg.split('||')
    const roles = store.getters.roles
    const permissionId = vNode.context.$route.meta.permission
    roles.permissions.forEach(per => {
      if (per.permissionId === permissionId) {
        if (per.actionList && per.actionList.length) {
          const index = per.actionList.findIndex(item => actionName.includes(item))
          if (index === -1) {
            el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
          }
        }
      }
    });
  }
})

export default action;