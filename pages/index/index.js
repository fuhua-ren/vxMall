import { request } from "../../request/index.js"

Page({

  data: {
    swiperList: [],
    cateList: [],
    floorList: []
  },
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // })
    this.getSwiperiList();
    this.getCateList();
    this.getFloorList();

  },
  getSwiperiList() {
    request({ url: '/home/swiperdata'})
    .then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  getCateList() {
    request({ url: '/home/catitems'})
    .then(result => {
      this.setData({
        cateList: result
      })
    })
  },
  getFloorList() {
    request({ url: '/home/floordata'})
    .then(result => {
      this.setData({
        floorList: result
      })
    })
  }
})