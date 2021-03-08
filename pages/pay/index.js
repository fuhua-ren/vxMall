
import { showModal, showToast } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"


Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1. 获取缓存中的收货地址
    try {
      var address = wx.getStorageSync('address')
      if (address) {
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      }
    }catch(e) {
      // address.all = false
    }
    let cart = wx.getStorageSync('cart') || []

    cart = cart.filter(v => v.checked)

    // 2. 将收货地址存储到data
    this.setData({
      address
    })

    let totalPrice = 0
    let totalNum = 0

    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.num*v.goods_price
        totalNum += v.num
      }
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  async handlePrderPay() {
    // 判断缓存中是否有token
    const token = wx.getStorageSync('token')
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return
    }
    
    // 创建订单
    // 准备请求头参数
    const header = {Authorization: token}
    // 准备请求体参数
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    const cart = this.data.cart
    let goods= []
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))

    // 这里内容在p103 因为没有企业微信不能完成
    const orderParams = {order_price, consignee_addr, goods}
    // 准备发送请求
    const {order_number} = await request({
      url: "/my/orders/create",
      method: "POST",
      data: orderParams,
      header
    })
    // 因为没有token 所以不能实现 

    const res = await request({
      url:"/my/orders/create",
      method: "POST",
      header,
      data: {order_number}
    })

    console.log(res);
    // 成功有一个pay
  }
})

