var that;
var Bmob = require('../../utils/bmob.js');
Page({

 
  data: {
    score:0,
    totalscore:0,
    choseQuestionBank:'',
    singleQuestionList: [],
    multiQuestionList: [],
		tfQuestionList: [],
    loading:true,
    defeatNumber:0,
    averageScore:0,
    correctRate:0
  },


  onLoad: function (options) {
    that=this;

    var choseQuestionBank = getApp().globalData.choseQuestionBank;
    that.setData({
      choseQuestionBank: choseQuestionBank
    });
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var getSingleQuestionList = getApp().globalData.singleChoiceAnswerNow;
    var getMultiQuestionList = getApp().globalData.multiChoiceAnswerNow;
		var getTfQuestionList = getApp().globalData.truefalseAnswerNow;
    for (var i = 0; i < getSingleQuestionList.length; i++) {
      getSingleQuestionList[i].number = i + 1;
    }
    for (var j = 0; j < getMultiQuestionList.length; j++) {
      getMultiQuestionList[j].number = j + 1;
    }
   
    var score = getApp().globalData.score;
    var totalscore = getApp().globalData.totalscore;
    that.getCorrectRate();
    that.getDefeatNumber();
    that.getAverageScore();
    that.setData({
      score: score,
      totalscore:totalscore,
      singleQuestionList: getSingleQuestionList,
      multiQuestionList: getMultiQuestionList,
			tfQuestionList:getTfQuestionList,
      loading:false
    });

    that.getCorrectRate();
    console.log(getSingleQuestionList);
  },

  getDefeatNumber:function(){
    var choseQuestionBank = that.data.choseQuestionBank;
    //var History = Bmob.Object.extend("history");
    var queryHistory = new Bmob.Query("history");
    
		queryHistory.equalTo("choseQuestionBank","==", choseQuestionBank);
		queryHistory.equalTo("score",">",that.data.score)
		queryHistory.count().then(res=>{
			that.setData({
				defeatNumber: res+1,
				loading: false
			});
		});
// 		queryHistory.find({
// 			success: function (results) {
// 				for (var i = 0; i < results.length; i++) {
// 					var score = results[i].attributes.score;
// 					if(that.data.score>score){
// 						defeatNumber++;
// 					}
// 				}
// 				that.setData({
// 					defeatNumber: defeatNumber,
// 				});
// 			},
// 			error: function (error) {
// 				console.log("查询失败: " + error.code + " " + error.message);
// 			}
// 		});
  },

  
  getAverageScore:function(){
    var choseQuestionBank = that.data.choseQuestionBank;
    //var QBAttributes = Bmob.Object.extend("QBAttributes");
    var queryQBAttributes = new Bmob.Query("QBAttributes");
		queryQBAttributes.equalTo("choseQuestionBank","==", choseQuestionBank);
		queryQBAttributes.find().then(res=>{
			if(res.length>0){
				var averageScore = res[0].averageScore;
				var newAverageScore = averageScore.toFixed(1);
				that.setData({
					averageScore: newAverageScore,
				});
			}
			
		}).catch(err=>{console.log(err)});
  },

  getCorrectRate:function(){
    var correctRate = that.data.score / that.data.totalscore*100;
    var newCorrectRate = correctRate.toFixed(1);
    console.log(that.data.score)
    that.setData({
      correctRate: newCorrectRate,
    });
  },
 
  showDetail: function (e) {
		console.log(e.currentTarget.dataset)
    var index = e.currentTarget.dataset.index;
    var choseType = e.currentTarget.dataset.chosetype;
    wx.navigateTo({
    		url: '../analysis/analysis?choseType='+choseType+'&index=' + index
    	});
  },


  allAnalysis:function(){
    var index = 0;
    wx.navigateTo({
      url: '../analysis/analysis?choseType=single&index=' + index
    });
  },

  returnMainPage:function(){
    wx.switchTab({
      url: '../choiceMain/choiceMain'
    })
  }


 
})