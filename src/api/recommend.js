// import jsonp from 'common/js/jsonp'
// import {commonParams, options} from 'api/config'

// export function getRecommend() {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
//   const data = Object.assign({}, commonParams, {
//     uin: 0,
//     platform: 'h5',
//     needNewCode: 1
//   })

//   return jsonp(url, data, options)
// }
import originJsonp from 'jsonp'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1527514755450'

  const option = {
    param: 'jsonpCallback',
    // prefix: 'jsonp',
    name: 'jsonp1'
  }

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      !err ? resolve(data) : reject(err)
    })
  })
}