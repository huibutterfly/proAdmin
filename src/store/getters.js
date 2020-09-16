const getters = {
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers
};

export default getters