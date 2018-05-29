import originJSONP from 'jsonp'

/**
 * @description 封装成熟悉使用的jsonp方法
 * @param {string} url
 * @param {obj} data
 * @param {obj} option
 * @returns {promise obj} new Promise
 */
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, res) => {
      !err ? resolve(res) : reject(err)
    })
  })
}

/**
 * @description 传递的参数对象
 * @param {obj} data
 */
function param(data) {
  let url = ''
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : ''
    url += `&${key}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}