var that;
var Bmob = require('../../utils/bmob.js');
Page({

  
  data: {
    historyQuestionBank:[],
    // singleQuestionList:[],
    // multiQuestionList:[],
    // score:null

  },

  
  onLoad: function (options) {
    that=this;
    //var historyQuestionBank=new Array();
    var currentUser = Bmob.User.current();
    //var currentUserId = currentUser.id;
    //var History = Bmob.Object.extend("history");
    var queryHistory = new Bmob.Query("history");
    queryHistory.equalTo("user", "==",currentUser.id);
		queryHistory.order("-createdAt");
		queryHistory.find().then(results=>{
			console.log("共查询到 " + results.length + " 条记录");
// 			for (var i = 0; i < results.length; i++) {
// 				historyQuestionBank[i] = results[i];
// 			}
			//console.log(historyQuestionBank);
			that.setData({
				historyQuestionBank: results,
			});
		})
		.catch(err=>{console.log(err)});
  },

  showDetail:function(e){
    // wx.showModal({
    //   title: '暂未开放',
    //   showCancel: false,
    //   content: '测试期间,此功能暂未开放',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.historyQuestionBank[index].objectId;
    var choseQuestionBank = that.data.historyQuestionBank[index].choseQuestionBank;
    //var History = Bmob.Object.extend("history");
    var queryHistory = new Bmob.Query("history");
		queryHistory.get(objectId).then(result=>{
			console.log(result)
			
			getApp().globalData.singleChoiceAnswerNow = result.singleQuestionList;
			getApp().globalData.multiChoiceAnswerNow = result.multiQuestionList;
			getApp().globalData.truefalseAnswerNow = result.tfQuestionList;
			getApp().globalData.score = result.score;
			getApp().globalData.totalscore = result.totalscore;
			getApp().globalData.choseQuestionBank = result.choseQuestionBank;
			wx.navigateTo({
				url: '../historyResult/historyResult'
			});
		}).catch(err=>{console.log(err)});
    
    console.log(getApp().globalData.singleChoiceAnswerNow)
   
  }
  

 
})