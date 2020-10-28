<template>
  <div id="purchase-supplier">
    <el-card :bordered="false">
      <div class="button-row">
        <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch" :loading="isLoading" v-action:search>查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-delete" @click="onClearQuery">清空</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="fileUploadDialogVisible = true" v-action:new>新增</el-button>
        <file-upload type="image" :config="{multiple: true}"></file-upload>
      </div>
      <el-form label-position="top" size="mini">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item label="供应商编码：">
                <el-input size="small" v-model="queryParam.supplier_number" placeholder="供应商编码" />
              </el-form-item>
            </el-col>
             <el-col :span="4">
              <el-form-item label="名称：">
                <el-input size="small" v-model="queryParam.name" placeholder="名称" />
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <el-table
        :data="data"
        height="550"
        border
        v-loading="isLoading"
        size="small"
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.dataIndex"
          :label="item.title"
          :min-width="item.width">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 500, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { columns, supplier } from './config'
import FileUpload from '@/components/Public/FileUpload'

export default {
  data(){
    return{
      columns,
      supplier,
      queryParam: {},
      isLoading: false,
      data: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      fileUploadDialogVisible: false
    }
  },
  components: {
    FileUpload
  },
  created(){
    this.getSupplier()
  },
  methods:{
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
    onSearch () {
      this.getSupplier()
    },
    async getSupplier () {
      try {
        this.isLoading = true
        const res = await this.$http({
          url: '/Supplier/get',
          method: 'post',
          data: {
            ...this.queryParam,
            pages: `${this.currentPage}:${this.pageSize}`
          }
        })
        this.total = res.count
        this.data = res.data.map(item => ({
          ...item,
          key: item.id,
          in_service_text: { 1: '有效', 2: '无效' }[item.in_service]
        }))
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onClearQuery(){

    },
    onAddDetail(){

    },
  }
}
</script>
<style lang="less" scoped>
  
  
</style>