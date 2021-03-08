
import { showModal, showToast } from "../../utils/asyncWx.js"

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync('cart') || []
    // 计算全选
    // every数组方法，会遍历 会接受一个回调函数 那么每一个回调函数都返回true 那么every方法的返回值为true
    // 只要有一个回调函数返回了false，那么不在循环，直接返回false
    // 如果是空数组 调用every方法 返回值就是true
    // const allChecked = cart.length ? cart.every(v=>v.checked) : false

    this.setCart(cart)


    // 2. 将收货地址存储到data
    this.setData({
      address
    })
  },
  handleChooseAddress() {
    // vw内置api收货地址
    wx.chooseAddress({
      success: (address)=>{
        wx.setStorageSync('address', address);
      }
    });
  },
  // 商品选中
  handleItemChange(e) {
    // 获取被修改的商品id
    // console.log(e);
    const goods_id = e.currentTarget.dataset.id
    // console.log(goods_id);
    // 获取购物车数组
    let {cart} = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 将选中状态取反
    cart[index].checked = !cart[index].checked
    // 把购物车数据重新设置回data中和本地数据中
    // 调用下面的方法
    this.setCart(cart)
  },

  // 设置购物车状态 重新计算底部购物车价钱数量
  setCart(cart) {
    let allChecked = true

    let totalPrice = 0
    let totalNum = 0

    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.num*v.goods_price
        totalNum += v.num
      }else {
        allChecked = false
      }
    })

    // 解决数组为空的问题
    allChecked = cart.length != 0 ? allChecked : false

    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart)
  },

  // 商品全选
  handleItemAllCheck() {
    // 获取data数据
    let {cart, allChecked} = this.data
    // 修改值
    allChecked = !allChecked
    // 循环修改cart数组中商品的选中状态
    cart.forEach(v => v.checked = allChecked)
    // 将修改后的值保存回data中和本地数据中
    this.setCart(cart)
  },

  // 加减数量
  async handleItemNumEdit(e) {
    // console.log(e);
    // 获取穿过来的数据
    const {operation,id} = e.currentTarget.dataset
    // console.log(operation,id);

    // 获取购物车数组
    let {cart} = this.data

    // 找到要修改的商品数据
    const index = cart.findIndex(v => v.goods_id === id)

    // 弹窗提示
    // 根据index判断  当商品数量等于1并且点击opration时
    if(cart[index].num === 1 && operation === -1) {
      // 使用promise的方式
      const res = await showModal( "您是否要删除？")
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else {
      // 进行修改商品数量
      cart[index].num += operation
      // 设置回缓存和data中
      this.setCart(cart)
    }
  },
  // 点击结算功能
  async handlePay() {
    // 1. 判断是否有收货地址
    // 对象解构 意思是 totalNum = this.data.totalNum
    const {address,totalNum} = this.data
    if(!address.userName) {
      await showToast({title: "您还没选择收货地址"})
      return
    }

    // 2.判断用户有没有选购商品
    if(totalNum === 0) {
      await showToast({title: "您还没有选购商品"})
      return 
    }

    // 3.跳转到微信支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})