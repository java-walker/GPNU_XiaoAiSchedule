// 别忘了加async
async function scheduleHtmlProvider() {
  // 此步为必须，用于加载这个工具，后续会增加更多方法
  await loadTool('AIScheduleTools')

  try {

  // 使用它们的时候务必带上await，否则没有系统alert的时停效果
  
  // Prompt的参数比较多，所以传了个对象，最后会返回用户输入的值
  const year = await AISchedulePrompt({
    titleText: '学年', // 标题内容，字体比较大，超过10个字不给显示的喔，也可以不传就不显示
    tipText: '请输入本学年开始的年份', // 提示信息，字体稍小，支持使用``达到换行效果，具体使用效果建议真机测试，也可以不传就不显示
    defaultText: '2024', // 文字输入框的默认内容，不传会显示版本号，所以空内容要传个''
    validator: value => { // 校验函数，如果结果不符预期就返回字符串，会显示在屏幕上，符合就返回false
      console.log(value)
      if (value <  '2023') return '这里的结果不可以< 2023'
      return false
  }})



  const term = await AISchedulePrompt({
  titleText: '学期',
  tipText: '请输入本学期的学期(1,2,3 分别表示上、下、短学期)',
  defaultText: '2',
  validator: value => {
    if (value === '1' || value === '2' || value === '3') {
      return false
    }
    return '请输入正确的学期'
  }
})
let xqm = '0' ;
console.log(term,xqm);
if (term === '1') {
  xqm = '3'
} else if (term === '2') {
  xqm = '12'
} else if (term === '3') {
  xqm = '16'
}


console.log(term,xqm);

 const res = await fetch("https://jwglxt.gpnu.edu.cn/jwglxt/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N253508", {
  "headers": {
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "x-requested-with": "XMLHttpRequest"
  },
  "body": `xnm=${year}&xqm=${xqm}&kzlx=ck&xsdm=`, // 使用模板字符串替换为变量
  "method": "POST",
  "mode": "cors",
})

const ret = await res.json()
return JSON.stringify(ret.kbList)


} catch (error) {
    await AIScheduleAlert('请确定你已经登陆了教务系统')
    return 'do not continue'
  }

}
