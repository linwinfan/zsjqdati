var Bmob = require('utils/bmob.js');
Bmob.initialize("6dd43f67b504ac3b87edcad852bba1bd", "2e436a2ea7d296d9aa7abf5641cc23ba");
 
App({
  onLaunch: function () {
		Bmob.User.auth().then(res => {
      console.log(res)
      console.log('一键登陆成功')

			//测试批量修改
// 			var queryTrueFalseQuestionBank = new Bmob.Query('QB2');
// 			queryTrueFalseQuestionBank.equalTo("type","==",  "DC");
// 			queryTrueFalseQuestionBank.equalTo("answer","==",  ["B"]);
// 			queryTrueFalseQuestionBank.limit(50);
// 			queryTrueFalseQuestionBank.find().then(res=>{
// 				res.set('answer',["×"])
// 				res.saveAll();
// 			})
// 			queryTrueFalseQuestionBank = new Bmob.Query('QB2');
// 			queryTrueFalseQuestionBank.equalTo("type","==",  "DC");
// 			queryTrueFalseQuestionBank.equalTo("answer","==",  ["A"]);
// 			queryTrueFalseQuestionBank.limit(50);
// 			queryTrueFalseQuestionBank.find().then(res=>{
// 				res.set('answer',["√"])
// 				res.saveAll();
// 			})
    }).catch(err => {
      console.log(err)
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: { 
    userInfo: null,
    singleChoiceAnswerNow:[],
    multiChoiceAnswerNow: [],
		truefalseAnswerNow:[],
    choseQuestionBank:'',
    score:0

  }
})