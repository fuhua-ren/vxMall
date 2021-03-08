// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
	ajaxTimes++

	// 显示加载中的这个效果
	wx.showLoading({
		title: '加载中',
		mask: true
	})


	// 定义公共部分的url
	const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"

	return new Promise((resolve,reject) => {
		wx.request({
			// params就是传过来的值
			...params,
			url: baseUrl + params.url,
			success:(result) => {
				resolve(result.data.message)
			},
			fail: (err) => {
				reject(err)
			},

			// 关闭正在加载的图标
			// complete是wx.showLoading的一个属性
			// 接口调用结束的回调函数（调用成功、失败都会执行
			complete: () => {
				ajaxTimes--
				// 当所有发出的网络请求全部回来的时候
				if(ajaxTimes === 0){
					wx.hideLoading()
				}
			}
		});
	})
}
