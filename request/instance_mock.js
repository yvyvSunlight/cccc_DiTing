const BASE_URL = '/mock/'; // 替换为你的接口基础地址

const instance_mock = (url, method = 'GET', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`, // 拼接完整的请求地址
      method: method, // 请求方法
      data: data, // 请求参数
      header: {
        'Content-Type': 'application/json', // 默认 Content-Type
        ...headers, // 合并自定义请求头
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data); // 请求成功，返回数据
		  uni.showToast({
			title: '请求成功',
			icon: 'success',
			mask: true
		  })
        } else {
          reject(res); // 请求失败，返回错误信息
		  uni.showToast({
			title: '请求失败',
			icon: 'fail',
			mask: true
		  })
        }
      },
      fail: (err) => {
        reject(err); // 请求失败，返回错误信息
		uni.showToast({
			title: '请求失败',
			icon: 'fail',
			mask: true
		})
      },
    });
  });
};

// 导出封装的请求方法
export default instance_mock;