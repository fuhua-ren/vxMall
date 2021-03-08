import { request } from "../../request/index.js"

// import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 接口返回数据
    currentIndex: 0,

    // 设置每次点击切换的时候顶部的距离（还要配合下面的改变数据使用）
    scrollTop: 0
    

  },
  Cates: [],
  onLoad: function(options) {
    // 判断本地存储中是否有旧数据 若无 则发送新的请求 若有 则判断旧数据是否过期 没有过期就使用

    // 1.获取本地存储中的数据（小程序自带）  cates 是一个 key
    const Cates = wx.getStorageSync('cates')

    if(!Cates){
      // 如果Cates不存在，则发送请求网络   就是 本地中没有存有数据（这里是Cates）
      this.getCates();
    }else {
      // Date.now()-Cates.time 计算出 为过期时间 
      if(Date.now()-Cates.time > 1000 * 10) {
        this.getCates();
      }else {
        console.log('使用旧数据');
        this.Cates = Cates.data;

        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

    // this.getCates()
  },
  async getCates() {

    // promise的方式
    // request({
    //   url: '/categories'
    // }).then(res => {
    //   // console.log(res);
    //   this.Cates = res.data.message;

    //   // 把接口的数据存入本地存储中
    //   // 存储时间撮Date.now()
    //   wx.setStorageSync('cates', {time:Date.now(), data:this.Cates})

    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   let rightContent = this.Cates[0].children;

    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // es7 async await来发送请求  res就是相相遇promise的.then
    // 现在 不用引入js文件  就可以直接使用async
    // 这里如果没有请求到数据 不会往下执行剩下的代码的  这个要在getCates()前面加上async
    const res = await request({ url:"/categories" })
    // this.Cates = res.data.message;  改造 将.data.message加到promise的resolve里面
    this.Cates = res
    // 把接口的数据存入本地存储中
    // 存储时间撮Date.now()
    wx.setStorageSync('cates', {time:Date.now(), data:this.Cates});

    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent
    })

  },
  handleItemTap(e) {
    console.log(e);
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,

      // 每次切换页面的时候到顶部的距离 每次都要触发
      scrollTop: 0
    })
  }
})