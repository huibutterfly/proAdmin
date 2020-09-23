<template>
  <div>
    <div>
      <!-- 这是一个次布局哈哈哈哈哈 -->
    </div>
    <div class="contentBody">
      <keep-alive>
        <router-view ref="content" />
      </keep-alive>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .contentBody{
    padding: 0 15px;
  }
</style>
