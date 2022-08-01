import Taro from '@tarojs/taro';

const interceptor = function (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams
  if (method === 'POST') {
    requestParams.data = { ...data, openId: Taro.getStorageSync('openId') }
  }
 // console.log(`http ${method || 'GET'} --> ${url} data: `, data)

  return chain.proceed(requestParams)
    .then(res => {
    //  console.log(`http <-- ${url} result:`, res)
      return res.data.data;
    })
}
Taro.addInterceptor(interceptor);
export function get(path: string, params: any = null) {
  return Taro.request({ url: `${process.env.HOST}${path}`, method: "GET", data: params });
}
export function post(path: string, params: any= {}) {
  return Taro.request({ url: `${process.env.HOST}${path}`, method: "POST", header: { "content-type": 'application/x-www-form-urlencoded' }, data: params });
}
