var that;
var Bmob = require('../../utils/bmob.js');

Page({
  

  data: {
    choseQuestions: ['√', '×'],
    choseQuestionBank: '',
    currentUserId: null,
    questionList:[],
    nowQuestion:[],
    nowQuestionNumber:'',
    choseCharacter:'',
    score:0,
    loading:true
  },

  
  onLoad: function () {
    that = this;
    console.log('onLoad')
    var choseQuestionBank = getApp().globalData.choseQuestionBank;
    var questionList = getApp().globalData.truefalseAnswerNow;
    that.setData({
    	questionList: questionList,
    	nowQuestion: questionList[0],
    	nowQuestionNumber: 0,
			loading:false
    });
    console.log(that.data.nowQuestion)
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
    getApp().globalData.truefalseAnswerNow = that.data.questionList,
    wx.navigateTo({
      url: '../answerCard/answerCard'
    });
  },

	submit:function(){
		that=this;
    
		getApp().globalData.truefalseAnswerNow=that.data.questionList;
		
    wx.redirectTo({
      url: '../result/result'
    });
  },
	
})