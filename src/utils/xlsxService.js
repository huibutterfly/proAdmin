import {
  saveAs
} from 'file-saver'
import XLSX from 'xlsx'

/**
 * 根据 `path` 获取安全值
 * @param obj 数据源，无效时直接返回 `defaultValue` 值
 * @param path 若 `null`、`[]`、未定义及未找到时返回 `defaultValue` 值
 * @param defaultValue 默认值
 */
function deepGet (obj, path, defaultValue) {
  if (!obj || path == null || path.length === 0) return defaultValue
  if (!Array.isArray(path)) {
    path = ~path.indexOf('.') ? path.split('.') : [path]
  }
  if (path.length === 1) {
    const checkObj = obj[path[0]]
    return typeof checkObj === 'undefined' ? defaultValue : checkObj
  }
  const res = path.reduce((o, k) => (o || {})[k], obj)
  console.log(res)
  return typeof res === 'undefined' ? defaultValue : res
}

function handleRender (ret, item, index, customRender, cb) {
  const render = customRender(ret.v, item, index)
  if (typeof render === 'object') {
    ret.v = render.children
    render.attrs && cb(render.attrs)
  } else {
    ret.v = render
  }
  return ret
}

function getColumnValue (item, col, index, cb) {
  let ret = {
    t: 'n',
    v: deepGet(item, col.dataIndex, '')
  }
  if (col.exportFormat) {
    ret.v = col.exportFormat(ret.v, item, index)
  } else if (col.customRender) {
    ret = handleRender(ret, item, index, col.customRender, cb)
  } else if (col.children && col.children[0].customRender) {
    ret = handleRender(ret, item, index, col.children[0].customRender, cb)
  }
  return ret
}

/**
 * 创建符合格式的sheets
 * @param {*} sheetname sheet名称
 * @param {*} columns 表格的columns配置 (指定某一列不被导出,可以配置参数 exported 为false)
 * @param {*} data 要导出的jion数据
 * @returns
 */
function createSheet (sheetname, columns, data, headers = []) {
  const sheets = {}
  const sheet = (sheets[sheetname || 'Sheet1'] = {})
  const colData = columns.filter(w => w.exported !== false && w.dataIndex)
  const cc = colData.length
  const dc = data.length
  let start = 1
  const merges = []
  start += headers.length
  const colProps = columns.map(item => {
    if (item.width) {
      if (typeof item.width === 'string') {
        item.width = Number(item.width.replace(/\D/g, ''))
      }
      return { wpx: item.width }
    }
    return {}
  })
  // header
  for (let row = 0; row < headers.length; row++) {
    let colIndex = 0
    const header = headers[row]
    for (let i = 0; i < header.length; i++) {
      const col = header[i]
      sheet[`${XLSX.utils.encode_col(colIndex)}${row + 1}`] = {
        t: 's',
        v: col.text
      }
      // 当前单元格占列数
      const colSpan = col.colSpan || 1
      merges.push(getColMerge(colIndex, col.colSpan, row))
      colIndex += colSpan
    }
  }

  // column
  for (let i = 0; i < cc; i++) {
    const tit = colData[i].title
    if (colData[i].colSpan > 1) {
      merges.push(getColMerge(i, colData[i].colSpan, start))
    }
    sheet[`${XLSX.utils.encode_col(i)}${start}`] = {
      t: 's',
      v: typeof tit === 'object' ? tit.text : tit
    }
  }

  // content
  for (let i = 0; i < dc; i++) {
    for (let j = 0; j < cc; j++) {
      const contentRow = i + start + 1
      const mergeRow = i + start
      const value = getColumnValue(data[i], colData[j], i, (attrs) => {
        if (attrs && attrs.rowSpan && attrs.rowSpan > 1) {
          merges.push(getRowMerge(mergeRow, mergeRow + attrs.rowSpan - 1, j))
        }
      })
      sheet[`${XLSX.utils.encode_col(j)}${contentRow}`] = value
    }
  }

  if (cc > 0 && dc > 0) {
    sheet['!ref'] = `A1:${XLSX.utils.encode_col(cc)}${dc + start}`
  }
  sheet['!merges'] = merges
  sheet['!cols'] = colProps
  return sheets
}

function createArraySheet (sheetname, datas) {
  const sheets = {}
  const sheet = (sheets[sheetname || 'Sheet1'] = {})
  const merges = []
  const widthData = datas.length === 0 ? [] : datas[0]
  const cc = widthData.length
  const dc = datas.length
  const colProps = widthData.map(() => {
    return { wpx: 60 }
  })

  for (let i = 0; i < datas.length; i++) {
    const data = datas[i]
    for (let j = 0; j < data.length; j++) {
      sheet[`${XLSX.utils.encode_col(j)}${i + 1}`] = {
        t: 'n',
        v: data[j]
      }
    }
  }

  if (cc > 0 && dc > 0) {
    sheet['!ref'] = `A1:${XLSX.utils.encode_col(cc)}${dc + 1}`
  }

  sheet['!merges'] = merges
  sheet['!cols'] = colProps
  return sheets
}

function read (wb) {
  const ret = {}
  wb.SheetNames.forEach(name => {
    const sheet = wb.Sheets[name]
    ret[name] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  })
  return ret
}

function getMerge (fromCol, fromRow, toCol, toRow) {
  return {
    s: {
      c: fromCol,
      r: fromRow
    },
    e: {
      c: toCol,
      r: toRow
    }
  }
}

// 合并列
function getColMerge (from, to, row) {
  return getMerge(from, row, to, row)
}

// 合并行
function getRowMerge (from, to, col) {
  return getMerge(col, from, col, to)
}

/**
 * 下载导出文件
 * @param {*} options
 */
function download (options) {
  const wb = XLSX.utils.book_new()
  if (Array.isArray(options.sheets)) {
    (options.sheets).forEach((value, index) => {
      const ws = XLSX.utils.json_to_sheet(value.data)
      XLSX.utils.book_append_sheet(wb, ws, value.name || `Sheet${index + 1}`)
    })
  } else {
    wb.SheetNames = Object.keys(options.sheets)
    wb.Sheets = options.sheets
  }

  if (options.callback) options.callback(wb)
  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'array',
    ...options.opts
  })
  saveAs(new Blob([wbout], {
    type: 'application/octet-stream'
  }), options.filename)
}

/**
 *  导入Excel并输出JSON，支持 `<input type="file">`、URL 形式
 * @param file 类型:`File` | `string`
 * @param rABS 加载数据方式 `readAsBinaryString` （默认） 或 `readAsArrayBuffer`，[更多细节](http://t.cn/R3n63A0)
 */
const importFile = function (file, rABS = 'readAsBinaryString') {
  return new Promise((resolve) => {
    // from file
    const reader = new FileReader()
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, {
        type: 'binary'
      })
      const obj = read(wb)
      let lineArr = []
      for (const key in obj) {
        lineArr = obj[key]
        break
      }
      resolve(lineArr)
    }
    reader[rABS](file)
  })
}

/**
 * 导出
 * @param opt 导出配置 {filename: '文件名称',column: table.columns, data: tabble.data, sheetname:'可选参数', callback: '可选参数'}
 */
const exportList = function (opt, type = '') {
  let sheets = null
  if (type === 'arrayExport') {
    sheets = createArraySheet(opt.sheetname, opt.datas)
  } else {
    sheets = createSheet(opt.sheetname, opt.columns, opt.data, opt.headers)
  }
  console.log(sheets)
  return download({
    sheets,
    filename: opt.filename || 'export.xlsx',
    callback: opt.callback
  })
}

export default {
  exportList,
  importFile
}
