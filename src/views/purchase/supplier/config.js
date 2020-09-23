export const columns = [
  {
    title: '供应商编号',
    dataIndex: 'supplier_number',
    width: 130
  },
  {
    title: '供应商名称',
    dataIndex: 'name',
    width: 130
  },
  {
    title: '联系人',
    dataIndex: 'contacts',
    width: 130
  },
  {
    title: '联系电话',
    dataIndex: 'mobile',
    width: 130
  },
  {
    title: '业务部门',
    dataIndex: 'department_name',
    width: 130
  },
  {
    title: '状态',
    dataIndex: 'in_service_text',
    width: 100
  }
]

export const supplier = {
  supplier_number: '',
  department_id: '',
  name: '',
  credit_code: '',
  contacts: '',
  mobile: '',
  in_service: '1',
  address: '',
  selected_region: '',
  assess: '',
  bank_type: '',
  cash_bank_holder: '',
  memo: '',
  register_address: '',
  tax_number: '',
  account_number: ''
}
