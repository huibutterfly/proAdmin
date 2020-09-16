import {
  axios
} from '@/utils/request'

export function login(parameter) {
  return axios({
    url: '/Staff/staffCheck',
    method: 'post',
    data: parameter
  })
}

export function getRoutesInfo() {
  return axios({
    url: '/Staff/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}