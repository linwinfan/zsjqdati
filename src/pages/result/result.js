var that;
var Bmob = require('../../utils/bmob.js');
Page({


  data: {
    score:0,
    choseQuestionBank:'',
    singleQuestionList: [],
    multiQuestionList: [],
		truefalseQuestionList: [],
    loading:true,
    defeatNumber: 0,
    averageScore: 0,
    correctRate: 0
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
		var getTruefalseQuestionList = getApp().globalData.truefalseAnswerNow;
    console.log(getSingleQuestionList);
    for (var i = 0; i < getSingleQuestionList.length; i++) {
      getSingleQuestionList[i].number = i + 1;
    }
    for (var j = 0; j < getMultiQuestionList.length; j++) {
      getMultiQuestionList[j].number = j + 1;
    }
		for (var j = 0; j < getTruefalseQuestionList.length; j++) {
			getTruefalseQuestionList[j].number = j + 1;
		}
   
    var score = getApp().globalData.score;
    that.setData({
      score: score,
      singleQuestionList: getSingleQuestionList,
      multiQuestionList: getMultiQuestionList,
			truefalseQuestionList:getTruefalseQuestionList,
      loading: false
    });
//     console.log(getSingleQuestionList);
//     var saveSingleQuestionList=new Array();
//     var saveMultiQuestionList = new Array();
//     for (var i = 0; i < getSingleQuestionList.length;i++){
//       saveSingleQuestionList[i] = getSingleQuestionList[i];
//       
//     }
//     for (var i = 0; i < getMultiQuestionList.length; i++) {
//       saveMultiQuestionList[i] = getMultiQuestionList[i];
//     }
    //console.log(saveSingleQuestionList)
    //console.log(saveMultiQuestionList)
		that.insertHistory(currentUserId,score,getSingleQuestionList,getMultiQuestionList,getTruefalseQuestionList,choseQuestionBank);
    //that.deleteHistory(currentUserId, choseQuestionBank, currentUserId, score, saveSingleQuestionList, saveMultiQuestionList)
  },

	insertHistory: function (userId, score, getSingleQuestionList, getMultiQuestionList, getTruefalseQuestionList,choseQuestionBank){
	

	    var currentUser = Bmob.User.current();
	    //var currentUserId = currentUser.id;
			
			var History = Bmob.Query("history");
			History.set("user", currentUser.objectId);
			History.set("dept", currentUser.dept);
			History.set("realName", currentUser.realName);
			History.set("userPic", currentUser.userPic);
			History.set("likeList", []);
			History.set("score", score);
			History.set("totalscore", getSingleQuestionList.length + getMultiQuestionList.length*2+getTruefalseQuestionList.length);
			History.set("likeNumber", 0);
			History.set("singleQuestionList", getSingleQuestionList);
			History.set("multiQuestionList", getMultiQuestionList);
			History.set("tfQuestionList", getTruefalseQuestionList);
			History.set("choseQuestionBank", choseQuestionBank);
			History.save().then(res=>{
				console.log(res)
				that.saveQBAttributes();
				//that.getHistory();
				that.getDefeatNumber();
			}).catch(err=>console.log(err));
			
	  },

  setOverPeople: function (overPeople){
    console.log(overPeople)
    var History = Bmob.Object.extend("history");
    var queryHistory = new Bmob.Query(History);
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    queryHistory.get(currentUserId,{
      success: function (result) {
        result.set('overPeople', overPeople);
        result.save();
      },
      error: function (object, error) {

      }
    });
  },

  showDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var choseType = e.currentTarget.dataset.chosetype;
    wx.navigateTo({
        url: '../analysis/analysis?choseType='+chosetype+'&index=' + index
      });
  },


  saveQBAttributes: function () {
    var choseQuestionBank = that.data.choseQuestionBank;

    var queryQBAttributes = new Bmob.Query("QBAttributes");
		queryQBAttributes.equalTo("choseQuestionBank","==",choseQuestionBank);
		queryQBAttributes.limit(1);
		queryQBAttributes.find().then(results=>{
			if(results.length==1){
				var result = results[0];
				var peopleNumber = result.PeopleNumber + 1;
				var allScore = getApp().globalData.score + result.allScore;
				var averageScore = allScore / peopleNumber;
				var newAverageScore = averageScore.toFixed(1);
				var correctRate = getApp().globalData.score / 60 * 100;
				var newCorrectRate = correctRate.toFixed(1);
				result.set('PeopleNumber', peopleNumber);
				result.set('allScore', allScore);
				result.set('averageScore', averageScore);
				result.save().then(res=>{console.log(res)}).catch(err=>console.log(err));
				that.setData({
					// defeatNumber: ,
					averageScore: newAverageScore,
					correctRate: newCorrectRate
				});
			}else{
				var query = new Bmob.Query("QBAttributes");
				query.set("choseQuestionBank",choseQuestionBank);
				query.set('PeopleNumber', 1);
				query.set('allScore', getApp().globalData.score);
				query.set('averageScore', getApp().globalData.score);
				query.save().then(res=>{console.log(res)}).catch(err=>console.log(err));
			}
			
		}).catch(err=>{
			console.log(err)
			if(err.code==101){
				var query = new Bmob.Query("QBAttributes");
				query.set("choseQuestionBank",choseQuestionBank);
				query.set('PeopleNumber', 1);
				query.set('allScore', getApp().globalData.score);
				query.set('averageScore', getApp().globalData.score);
				query.save().then(res=>{console.log(res)}).catch(err=>console.log(err));
				}
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
  },

  getDefeatNumber: function () {
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

  },


  


 
})