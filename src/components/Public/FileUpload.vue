<template>
  <div>
    <el-button size="small" @click="openUploadDialog" :disabled="isDisabled"><i class="el-icon-upload"></i>上传</el-button>
    <el-dialog
      :visible.sync="visible"
      :title="title"
      width="1000px"
      destroyOnClose
      :closed="initData"
      :show-close="false"
      :zIndex="10000"
    >
      <template slot="footer">
        <el-button size="small" type="primary" @click="confirmInfo">确认</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </template>
      <el-table
        :data="files"
        :rowKey="(record,index) => index"
        :pagination="false"
        size="small"
      >
       <el-table-column label="文件">
          <template slot-scope="scope">
            <img v-if="scope.row && scope.row.thumb" :src="scope.row.thumb" width="40" height="auto" />
          </template>
        </el-table-column >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.dataIndex"
          :label="item.title"
          :min-width="item.width">
        </el-table-column>
        <el-table-column label="上传状态">
          <template slot-scope="scope">
            <b v-if="scope.row && scope.row.error" style="color: #f00">{{ scope.row.error}}</b>
            <b v-else-if="scope.row && scope.row.success" style="color: #00f">SUCCESS</b>
            <b v-else-if="scope.row && scope.row.active">ACTIVE</b>
            <b v-else></b>
          </template>
        </el-table-column>
        <el-table-column label="上传进度" :min-width="130">
          <template slot-scope="scope">
            <el-progress
              :status="!scope.row.progress ? 'warning' : (parseInt(scope.row.progress) < 100) ? 'exception' : 'success'"
              :percentage="parseInt(scope.row.progress)">
            </el-progress>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              :disabled="scope.row && (scope.row.success || scope.row.error === 'compressing')"
              @click="$refs.upload.update(scope.row, {active: true})"
            >
              <el-icon size="small" type="upload"/>上传
            </el-button>
            <el-button style="margin-left: 5px" size="small" type="danger" @click="removeFile(scope.row)">
              <el-icon size="small" type="delete"/>移除
          </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-row style="width: 210px; margin-top: 15px" :gutter="12">
          <el-col :span="12">
            <file-upload
              class="btn btn-primary dropdown-toggle"
              :custom-action="uploadFile"
              :extensions="extensions"
              :accept="accept"
              :multiple="multiple"
              :maximum="maximum"
              :directory="directory"
              :size="size"
              :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
              :headers="headers"
              :data="data"
              :drop="drop"
              :drop-directory="dropDirectory"
              :add-index="addIndex"
              v-model="files"
              @input-filter="inputFilter"
              @input-file="inputFile"
              ref="upload">
              <el-button size="small" type="primary" ghost>
                <i class="el-icon-document-checked"></i>
                选择文件
              </el-button>
            </file-upload>
          </el-col>
          <el-col :span="12">
            <el-button size="small" type="primary" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
              <i class="fa fel-arrow-up" ariel-hidden="true"></i>
              <i class="el-icon-upload"></i>
              开始上传
            </el-button>
            <button type="danger" v-else @click.prevent="$refs.upload.active = false">
              <i class="el-icon-upload"></i>
              停止上传
            </button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
    <el-dialog
      class="edit-image-modal"
      :visible.sync="editFile.show"
      style="min-width: 1000px;"
      title="图片查看"
      width="70%"
      destroyOnClose
      :maskClosable="false"
    >
      <template slot="footer">
        <el-button type="primary" @click.prevent="onEditorFile">保存</el-button>
        <el-button type="submit" @click.prevent="editFile.show = false">关闭</el-button>
      </template>
      <form>
        <el-row>
          <el-col :md="1">
            <b>图片:</b>
          </el-col>
          <el-col :md="12">
            <el-input v-model="editFile.name" placeholder="请输入文件名称"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'">
            <div class="edit-image">
              <img :src="editFile.blob" ref="editImage" />
            </div>
            <div class="edit-image-tool">
              <el-button-group>
                <el-button type="primary" @click="editFile.cropper.rotate(-90)"><i class="el-icon-upload"></i></el-button>
                <el-button type="primary" @click="editFile.cropper.rotate(90)"><i class="el-icon-upload"></i></el-button>
              </el-button-group>
              <el-button-group style="margin-left: 20px;">
                <el-button type="primary" @click="editFile.cropper.crop()"><i class="el-icon-upload"></i></el-button>
                <el-button type="primary" @click="editFile.cropper.clear()"><i class="el-icon-upload"></i></el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </form>
    </el-dialog>
  </div>
</template>
<script>
import ImageCompressor from '@xkeshi/image-compressor'
import Cropper from 'cropperjs'
import FileUpload from 'vue-upload-component'
import * as qiniu from 'qiniu-js'
import moment from 'moment'

function formatSize (size) {
  return (size / 1024).toFixed(2) + 'KB'
}

function isNumber (value) {
  return typeof value === 'number' && !isNaN(value)
}
export default {
  components: {
    FileUpload
  },
  props: {
    type: {
      type: String,
      default: 'image'
    },
    config: {
      type: Object,
      default: () => {
        return {
          multiple: false,
          maximum: 0
        }
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    headers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      columns: [
        { title: '文件名称', dataIndex: 'name', width: 300 },
        {
          title: '文件大小',
          dataIndex: 'size',
          width: 100,
          customRender: (text) => {
            return formatSize(text)
          }
        }
      ],
      files: [],
      minSize: 1024,
      addIndex: false,
      thread: 3,
      name: 'file',

      editFile: {
        show: false,
        name: ''
      },
      isValid: true,
      imageHost: ''
    }
  },
  computed: {
    title () {
      return this.type === 'image' ? '上传图片' : (this.type === 'vedio' ? '上传视频' : '上传文件')
    },
    accept () {
      if (this.type === 'image') {
        return 'image/png,image/gif,image/jpeg,image/webp'
      } else if (this.type === 'vedio') {
        return 'video/mp4,video/ogg,video/webm'
      } else {
        return '*'
      }
    },
    extensions () {
      if (this.type === 'image') {
        return 'gif,jpg,jpeg,png,webp,bmp'
      } else if (this.type === 'vedio') {
        return 'mp4,ogv,webm'
      } else {
        return '*'
      }
    },
    multiple () {
      return this.config.multiple === true
    },
    maximum () {
      return this.config.multiple ? this.config.maximum : 1
    },
    directory () {
      return this.config.directory === true
    },
    drop () {
      return this.config.drop !== false
    },
    dropDirectory () {
      return this.config.dropDirectory !== false
    },
    size () {
      const size = (this.config.size === undefined || !isNumber(this.config.size)) ? 10 * 1024 : this.config.size
      return size * 1024
    },
    autoCompress () {
      const autoCompress = (this.config.autoCompress === undefined || !isNumber(this.config.autoCompress))
        ? 10 * 1024 : this.config.autoCompress
      return autoCompress * 1024
    },
    autoUpload () {
      return this.config.autoUpload !== false
    },
    limit () {
      let limit = false
      if (this.config.limit !== undefined) {
        limit = this.config.limit.split('*')
      }
      return limit
    }
  },
  created () {
    this.$http.get('PrivateService/qiniu-info').then(res => {
      if (!res.result) {
        return this.$message.error(res.msg)
      }
      this.imageHost = res.data.domain
    })
  },
  methods: {
    openUploadDialog () {
      this.visible = true
      this.initData()
    },
    handleCancel () {
      this.visible = false
    },
    confirmInfo () {
      const successFiles = []
      this.files.forEach(item => {
        if (item.success === true) {
          const img = new Image()
          img.src = item.blob
          successFiles.push({
            url: item.response.url,
            hash: item.response.hash,
            name: item.name,
            size: formatSize(item.size),
            width: img.width,
            height: img.height
          })
        }
      })
      console.log(this.files)
      if (successFiles.length === 0) {
        return this.$message.error('没有上传成功的文件')
      }
      this.visible = false
      this.$emit('ok', successFiles)
    },
    removeFile (file) {
      this.$refs.upload.remove(file)
      if (file.success) {
        this.$http.post('PrivateService/delete-file', { key: file.response.key }).then(res => {
          if (!res.result || !res.data.result) {
            console.log('           res  = ')
            console.dir(res)
          }
        })
      }
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // 添加文件前
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          this.$message.error('请选择正确类型的文件')
          return prevent()
        }

        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          this.$message.error('请选择正确类型的文件')
          return prevent()
        }

        if (this.config.size !== undefined && this.size) {
          if (newFile.size > this.size) {
            this.$message.error('文件大小不能超过' + formatSize(this.size))
            return prevent()
          }
        }

        // 自动压缩
        if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
          newFile.error = 'compressing'
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512
          })
          imageCompressor.compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, { error: '', file, size: file.size, type: file.type })
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, { error: err.message || 'compress' })
            })
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // 创建 blob 字段
        newFile.blob = ''
        const URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
          this.checkIsValidImage(newFile)
        }
      }
    },

    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // update

        if (newFile.active && !oldFile.active) {
          // beforeSend

          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }

        if (newFile.progress !== oldFile.progress) {
          // progress
        }

        if (newFile.error && !oldFile.error) {
          // error
        }

        if (newFile.success && !oldFile.success) {
          // success
        }
      }

      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }

      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.autoUpload && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    onEditFileShow (file) {
      this.editFile = { ...file, show: true }
      this.$refs.upload.update(file, { error: 'edit' })
    },

    onEditorFile () {
      if (!this.$refs.upload.features.html5) {
        this.$message.error('浏览器不支持当前操作')
        this.editFile.show = false
        return
      }

      const data = {
        name: this.editFile.name
      }
      if (this.editFile.cropper) {
        const binStr = atob(this.editFile.cropper.getCroppedCanvas().toDataURL(this.editFile.type).split(',')[1])
        const arr = new Uint8Array(binStr.length)
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        data.file = new File([arr], data.name, { type: this.editFile.type })
        data.size = data.file.size
      }
      this.$refs.upload.update(this.editFile.id, data)
      this.editFile.error = ''
      this.editFile.show = false
    },
    async uploadFile (file) {
      const result = await this.$http.get('PrivateService/token').then(res => {
        if (res.result && res.result === 'true') {
          const token = res.data
          const suffix = file.name.substring(file.name.lastIndexOf('.'))
          const key = moment().unix() + file.id + suffix
          const config = {}
          const putExtra = {
            fname: file.name,
            mimeType: null
          }
          qiniu.upload(file.file, key, token, putExtra, config).subscribe({
            next: (result) => {
              this.$refs.upload.update(file, { progress: parseFloat(result.total.percent).toFixed(0) })
            },
            error: (errResult) => {
              this.$refs.upload.update(file, { error: errResult })
            },
            complete: (result) => {
              const response = {
                key: result.key,
                hash: result.hash,
                url: this.imageHost + '/' + result.key
              }
              this.$refs.upload.update(file, { response: response })
            }
          })
        }
      })
      console.log(this.files)
      return result
    },
    initData () {
      this.files = []
    },
    checkIsValidImage (file) {
      const limit = this.limit
      if (limit) {
        const img = new Image()
        img.src = file.blob
        img.onload = () => {
          if (img.width !== Number(limit[0]) && limit[1] === '--') {
            this.$message.error('图片(' + file.name + ')尺寸不符合要求,要求宽:' + limit[0])
            this.$refs.upload.remove(file)
          } else if (limit[1] !== '--' && (img.width !== Number(limit[0]) || img.height !== Number(limit[1]))) {
            this.$message.error('图片(' + file.name + ')尺寸不符合要求,要求宽高:' + limit[0] + '*' + limit[1])
            this.$refs.upload.remove(file)
          }
        }
      }
    }
  },
  watch: {
    'editFile.show' (newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' })
      }

      if (newValue) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return
          }
          const cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false
          })
          this.editFile = {
            ...this.editFile,
            cropper
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~cropperjs/src/index.css';
  .edit-image-modal {
    .ant-form-item {
      margin-bottom: 5px;
    }
  }
  .edit-image img {
    max-width: 100%;
    max-height: 500px;
  }
  .edit-image-tool {
    margin-top: .6rem;
    margin-right: .6rem;
  }
</style>
