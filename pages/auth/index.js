import { request } from "../../request/index.js"
import { showModal, showToast, login } from "../../utils/asyncWx.js"

Page({
  async handleGetUserInfo(e) {
    try {
      // 获取用户信息
      const {encryptedData, rawData, iv, signature} = e.detail
      // 获取小程序登录成功后的code
      const {code} = await login()
      // 发送请求获取token
      const loginParams = {encryptedData, rawData, iv, signature, code}
      // const {token} = await request({url: "/my/orders/req_unifiedorder", data:loginParams, method: "post"})
      // 这里没有token 假设获取到token
      const token = '11111111111'
      console.log(token);
      wx.setStorageSync('token', token)

      // 成功之后返回上一层 1表示返回上一程 2表示上两层
      wx.navigateBack({
        delta: 1,
      })
    } catch (error) {
      console.log(error)
    }
  }
})