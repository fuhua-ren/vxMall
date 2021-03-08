import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  Goodsinfo: {},
  onLoad: function (options) {
    // 获取id
    const {goods_id} = options
    // console.log(goods_id);

    this.getGoodsDetail(goods_id)
  },

  // data:{goods_id}}传递一个数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url:'/goods/detail',data:{goods_id}})
    // console.log(goodsObj);
    this.Goodsinfo = goodsObj
    this.setData({
      goodsObj: {
        // 这样做可以只获取需要渲染的数据
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iPhone部分手机 不识别 webp图片格式
        // 自己更改 确保后台存在1.webp => 1.jpg
        // 下面将webp格式转换成为jpg格式
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'jpg'),
        pics:goodsObj.pics
      }
    })
  },

  // 点击轮播图放大预览
  handlePrevewImage(e){
    // 预览图片
    // 1.构造要预览的图片数组
    const urls = this.Goodsinfo.pics.map(v=>v.pics_mid)
    // 2.接收传递过来的图片
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },
  handleAddCart() {
    // console.log(this.Goodsinfo);
    // wx.getStorageSync本地缓存  获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart")||[]
    console.log(cart);
    // 判断 商品对象是否存在于购物车中 findIndex找到符合条件的会返回改索引 找不到返回-1
    let index = cart.findIndex(v=>v.goods_id === this.Goodsinfo.goods_id)
    if(index === -1) {
      // 不存在 第一次就添加进去
      this.Goodsinfo.num = 1;
      this.Goodsinfo.checked = true;
      cart.push(this.Goodsinfo)
    }else {
      cart[index].num++
    }
    // 将购物车重新添加会缓存中 wx.setStorageSync 和上文不同
    wx.setStorageSync('cart', cart)
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户手抖 1.5秒后才能重新添加
      mask: true
    })

  }

})