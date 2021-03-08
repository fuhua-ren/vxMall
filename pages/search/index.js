import { request } from "../../request/index.js"
Page({
  data: {

  },
  // 输入值就会触发这个事件
  handleInput(e) {
    // 校验输入框合法性
    const {value} = e.datail
    if(!value.trim()) {
      return
    }

  },
  
})