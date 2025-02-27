function scheduleHtmlParser(json_str) {
  console.log("**************************************************************");
  console.log("***************************START******************************");
  console.log("**************************************************************");
  courses_json = JSON.parse(json_str)
  const courseInfos = []
  let jici=0;
  const dayArray = {
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "日": 0,
  }
  console.log(courses_json.length);
  for (let i = 0; i < courses_json.length; i++) {

    //任课教师截取

    const result = courses_json[i];


    const name = result.kcmc;//课程名称
    const teacher = result.xm;//教师姓名

    console.log(name + "=====" + teacher + i);

    //课程数据 周长度
    const zcd = result.zcd;

    //数据处理
    const pattern = /[\d+-\d+,\d+-\d+]+周/g;
    const zcdmatchResults = zcd.match(pattern);

    //这里如果匹配到多次，就是单双周区分的
    for (let j = 0; j < 1; j++) {//(let j = 0; j < zcdmatchResults.length; j++)

      //1-1,3-3,5-5,7-7,9-9,11-11,13-13,15-15周，星期五，第5-6小节，软件楼C318
      //1-16周，星期二，第7-8小节，软件楼C410
      //这块我们先拉到是多少小节
      //接下来可能是
      //1-1,3-3,5-5,7-7,9-9,11-11,13-13,15-15周，星期五，第5-6小节，软件楼C318
      //1-16周，星期二，第7-8小节，软件楼C410
      //这块我们先拉到是多少小节
      let classData = result.xqjmc;//星期几名称

      var dayPattern = /星期(.{1})/;
      var dayMatch = classData.match(dayPattern);
      
      if (dayMatch) {
          var dayKey = dayMatch[1];
          var day = dayArray[dayKey];
      
          if (day === undefined) {
              console.warn(`dayArray中没有找到对应的键：${dayKey}`);
          } else {
              //console.log(`匹配到的星期是：${dayKey}，对应的值是：${day}`);
          }
      } else {
          console.warn("未匹配到星期信息");
      }
      
      var jc = result.jc;//节次//或者截取jcs
      console.log(jc);
      var sectionPattern = /(\d+)-(\d+)节/;
      //节数
      var sectionArray = jc.match(sectionPattern)
      //获得哪一节课，并且完成构建
      var sections = [];
      for (let sec = Number(sectionArray[1]); sec <= Number(sectionArray[2]); sec++) {
        sections.push(sec);
      }
      //地点截取position

      
      //地点
      var position = result.cdmc//场地名称

      
      //替换节数为空,确保下面不会误判
      classData = classData.replace(sectionArray[0], '');
      //return classData;

      const weeks = []
      //const weeksPattern = /(\d+)-(\d+)/g;
      const weeksPattern = /(\d+)(?:-(\d+))?/g;
      const weeksPatternbijiao = /(\d+-\d+)/g;
      //这里来获取分别哪几周上
      const weeksArray = zcdmatchResults.toString().match(weeksPattern);
      const weeksArraybj = zcdmatchResults.toString().match(weeksPatternbijiao);
      //这里把周期分割

      //这里把周期分割
      for (let weekIndex = 0; weekIndex < weeksArray.length; weekIndex++) {

        //这里获取到的基本上是1-1这样的
        const weeksData = weeksArray[weekIndex];
        //子级别的判断
        const mWeekPattern = /(\d+)(?:-(\d+))/;
        //这里来获取分别哪几周上
        const mWeekArray = weeksData.match(mWeekPattern);
        //判断是否相等
        if (weeksArray.length === 1 &&  mWeekArray === null) {
          //这里确切的说，就是1-1这样的
          weeks.push(Number(weeksArray[weekIndex]))
          
        } else {
          //这种情况下，为1-16这样的
          //这样就要遍历后传入
          for (let week = Number(mWeekArray[1]); week <= Number(mWeekArray[2]); week++) {
            weeks.push(week)
          }

        }

      }

      //接下来

      const courseTemp = {
        name: name,
        teacher: teacher,
        position: position,
        weeks: weeks,
        day: day,
        sections: sections
      }
      courseInfos.push(courseTemp)
      console.log("=="+jici+"=="+courseTemp);
    }
    console.log("=="+"==");

  }

  return courseInfos
}
