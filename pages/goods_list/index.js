import { request } from "../../request/index.js"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口需要的数据
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,

  // 根据id获取数据
  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.cid = options.cid
    this.getGoodsList()

  },
  async getGoodsList() {
    const res = await request({url:"/goods/search", data: this.QueryParams})
    // 获取总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    // console.log(this.totalPages);

    this.setData({
      // 这里要进行的是数组的拼接 先解构在拼接
      goodsList:[...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh()
  },

  handleTabsItemChange(e) {
    // console.log(e);
    const {index} = e.detail

    let {tabs} = this.data
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false)

    this.setData({
      tabs
    })
  },
  // 页面上拉加载下一页
  // 页面触底
  onReachBottom() {
    // console.log('1111');
    if(this.QueryParams.pagenum >= this.totalPages){
      // 没有下一页数据
      // console.log('没数据了');
      // 微信的提示
      wx.showToast({
        title: '到底了',
      })
    }else {
      // console.log('还有数据');
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 监听下拉事件   刷新页面
  onPullDownRefresh(){
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1;
    // 3.重新发送请求
    this.getGoodsList()
  }

})