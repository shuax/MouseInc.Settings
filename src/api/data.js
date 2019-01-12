import axios from '@/libs/api.request'

export const LoadSettings = () => {
  return axios.request({
    url: '/load_settings',
    data: {},
    method: 'post'
  })
}

export const SaveSettings = data => {
  return axios.request({
    url: '/save_settings',
    data: data,
    method: 'post'
  })
}

export const ResetSettings = () => {
  return axios.request({
    url: '/reset_settings',
    data: {},
    method: 'post'
  })
}

// export const getTableData = () => {
//   return axios.request({
//     url: 'get_table_data',
//     method: 'get'
//   })
// }

// export const getDragList = () => {
//   return axios.request({
//     url: 'get_drag_list',
//     method: 'get'
//   })
// }

// export const errorReq = () => {
//   return axios.request({
//     url: 'error_url',
//     method: 'post'
//   })
// }

// export const saveErrorLogger = info => {
//   return axios.request({
//     url: 'save_error_logger',
//     data: info,
//     method: 'post'
//   })
// }

// export const uploadImg = formData => {
//   return axios.request({
//     url: 'image/upload',
//     data: formData
//   })
// }

// export const getOrgData = () => {
//   return axios.request({
//     url: 'get_org_data',
//     method: 'get'
//   })
// }
