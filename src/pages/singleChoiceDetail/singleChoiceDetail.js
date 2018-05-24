var that;
var Bmob = require('../../utils/bmob.js');

Page({
  

  data: {
    choseQuestions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    choseQuestionBank: '',
    currentUserId: null,
    questionList:[],
    nowQuestion:[],
    nowQuestionNumber:'',
    choseCharacter:'',
    score:0,
    // blank:"blank",
    loading:true
  },

  
  onLoad: function () {
    that = this;
    var choseQuestionBank = getApp().globalData.choseQuestionBank;
    that.setData({
      choseQuestionBank: choseQuestionBank
    });
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var choseQuestionBank = that.data.choseQuestionBank;
    var loadQuestionBank;
    var singleQuestionList = new Array();
    if (choseQuestionBank =="征兵业务知识题库"){
      loadQuestionBank="QB2";
    }
    
    var querySingleQuestionBank = new Bmob.Query(loadQuestionBank);
    querySingleQuestionBank.equalTo("type","==", "SC");
		querySingleQuestionBank.limit(500);
		querySingleQuestionBank.find().then(results=>{
			console.log("第一次单选共查询到 " + results.length + " 条记录");
// 			for (var i = 0; i < results.length; i++) {
// 				questionList.push(results[i])
// 				questionList[i].userChose = "空";
// 			}
			singleQuestionList=results;
			querySingleQuestionBank.equalTo("type","==", "SC");
			querySingleQuestionBank.limit(500);
			querySingleQuestionBank.skip(500);
			querySingleQuestionBank.find().then(res=>{
				console.log("第二次单选共查询到 " + res.length + " 条记录");
				singleQuestionList.concat(res);
				var newSingleQuestionList = that.getRandomSingleChoice(singleQuestionList,20)
				for (var i = 0; i < newSingleQuestionList.length; i++) {
					newSingleQuestionList[i].userChose="空";
				}
				
				getApp().globalData.singleChoiceAnswerNow = newSingleQuestionList;
				
				that.setData({
					questionList: newSingleQuestionList,
					nowQuestion: newSingleQuestionList[0],
					nowQuestionNumber:0,
					loading: false
				});
			})
			
		},err=>{
			console.log(err);
		});
    
    var queryMultiQuestionBank = new Bmob.Query(loadQuestionBank);
    queryMultiQuestionBank.equalTo("type","==",  "MC");
		queryMultiQuestionBank.limit(500);
		queryMultiQuestionBank.find().then(results=>{
   			console.log("多项题共查询到 " + results.length + " 条记录");
// 			for (var i = 0; i < results.length; i++) {
// 				multiQuestionList.push(results[i])
// 			}
			var newMultiQuestionList = that.getRandomSingleChoice(results, 20)
			
			for(var i=0;i<newMultiQuestionList.length;i++){
				newMultiQuestionList[i].userChose = "空";
			}
			getApp().globalData.multiChoiceAnswerNow = newMultiQuestionList;
// 			that.setData({
// 				newMultiQuestionList: newMultiQuestionList,
// 				loading:false
// 			});
		},err=>{
			console.log("多项选项查询失败: " + error.code + " " + error.message);
		})
    
		var queryTrueFalseQuestionBank = new Bmob.Query(loadQuestionBank);
		queryTrueFalseQuestionBank.equalTo("type","==",  "DC");
		queryTrueFalseQuestionBank.limit(500);
		queryTrueFalseQuestionBank.find().then(results=>{
			console.log("判断题共查询到 " + results.length + " 条记录");
// 			for (var i = 0; i < results.length; i++) {
// 				multiQuestionList.push(results[i])
// 			}
			var newtruefalseQuestionList = that.getRandomSingleChoice(results, 20)
			for(var i=0;i<newtruefalseQuestionList.length;i++){
				newtruefalseQuestionList[i].userChose = "空";
			}
			getApp().globalData.truefalseAnswerNow = newtruefalseQuestionList;
// 			that.setData({
// 				newTruefalseQuestionList: newtruefalseQuestionList,
// 				loading:false
// 			});
		},err=>{
			console.log("判断题查询失败: " + error.code + " " + error.message);
		})
    
  },


  getRandomSingleChoice: function (arr, count){
    if(count>arr.length)
      return arr;
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
 
  onShow: function () {
    console.log("Showing");
  },
  chose: function (event) {
    var questionList = that.data.questionList;
    var questionCount= that.data.questionList.length;
    var nowQuestionNumber = that.data.nowQuestionNumber;
    var answer = questionList[nowQuestionNumber].answer[0];
    var choseValue = event.currentTarget.dataset.option;
    if (choseValue == answer) {
      getApp().globalData.score++;
      // var score = that.data.score + 1;
      questionList[nowQuestionNumber].answerResult = "correct";
      questionList[nowQuestionNumber].userChose = choseValue;
      that.setData({
        questionList: questionList,
        choseCharacter: choseValue,
        // score:score,
      });
      that.nextQuestion = setTimeout(function () {
        if (nowQuestionNumber == questionCount-1) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
        else if (nowQuestionNumber != questionCount-1) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }
    else if (choseValue != answer) {
      questionList[nowQuestionNumber].answerResult = "error";
      questionList[nowQuestionNumber].userChose = choseValue;
      that.setData({
        questionList: questionList,
        choseCharacter: choseValue,
      });
      that.nextQuestion = setTimeout(function () {
        if (nowQuestionNumber == questionCount-1) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
        else if (nowQuestionNumber != questionCount - 1) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }

  },


  // frontQuestion:function(){
  //   var questionList = that.data.questionList;
  //   var frontQuestionNumber = that.data.nowQuestionNumber-1;
  //   that.setData({
  //     nowQuestion: questionList[frontQuestionNumber],
  //     nowQuestionNumber: frontQuestionNumber,
  //   })
  //   console.log(that.data.questionList)
  // },

  afterQuestion: function () {
    var nowQuestionNumber = that.data.nowQuestionNumber
    var questionList = that.data.questionList;
    var afterQuestionNumber = nowQuestionNumber + 1;
    if (questionList[nowQuestionNumber].answerResult==null){
      questionList[nowQuestionNumber].answerResult = "blank";
      questionList[nowQuestionNumber].userChose = "空";
      that.setData({
        nowQuestion: questionList[afterQuestionNumber],
        nowQuestionNumber: afterQuestionNumber,
        questionList: questionList
      })
    }
    else if (questionList[nowQuestionNumber].answerResult != null){
      that.setData({
        nowQuestion: questionList[afterQuestionNumber],
        nowQuestionNumber: afterQuestionNumber,
      })
    }
    console.log(that.data.questionList)
  },





  answerCard:function(){
    getApp().globalData.singleChoiceAnswerNow = that.data.questionList,
    //getApp().globalData.multiChoiceAnswerNow = that.data.newMultiQuestionList;
    wx.navigateTo({
      url: '../answerCard/answerCard'
    });
  },

  overSingleChoice:function(questionNumber){
    getApp().globalData.singleChoiceAnswerNow = that.data.questionList;
    //getApp().globalData.multiChoiceAnswerNow = that.data.newMultiQuestionList;
    if (questionNumber == that.data.questionList.length-1){
      wx.redirectTo({
        url: '../multiChoiceExplain/multiChoiceExplain'
      });
    }
  }
 
})