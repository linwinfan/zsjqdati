var that;
var Bmob = require('../../utils/bmob.js');
Page({

 
  data: {
    choseQuestions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    choses: { 'A': false, 'B': false, 'C': false, 'D': false, 'E': false, 'F': false, 'G': false, 'H': false, 'I': false, 'J': false},
    choseQuestionBank: '',
    currentUserId: null,
    questionList: [],
    nowQuestion: [],
    nowQuestionNumber: '',
    choseCharacter: [],
    score: 0

  },


  onLoad: function () {
		console.log('onLoad')
    that = this;
    var choseQuestionBank = getApp().globalData.choseQuestionBank;
    var questionList = getApp().globalData.multiChoiceAnswerNow;
    that.setData({
      questionList: questionList,
      nowQuestion: questionList[0],
      nowQuestionNumber: 0
    });
    console.log(that.data.nowQuestion)
    //console.log(getApp().globalData.multiChoiceAnswerNow)
  },


  onShow: function () {
  
  },

  chose: function (event) {
    console.log(event);
    //var questionList = that.data.questionList;
    //var nowQuestionNumber = that.data.nowQuestionNumber;
    //var answer = questionList[nowQuestionNumber].answer[0];
    var choseValue = event.currentTarget.dataset.option;
    var choseCharacter = that.data.choseCharacter;
    choseCharacter.push(choseValue);
    var cs = that.data.choses;
    cs[choseValue]=true;
    that.setData({
      choses:cs,
    });
  },

  notChose: function (event) {
    var choseValue = event.currentTarget.dataset.option;
    var choseCharacter = that.data.choseCharacter;
    that.findCharacter(choseValue, choseCharacter);
    var cs = that.data.choses;
    cs[choseValue] = false;
    that.setData({
      choses: cs,
    });
  },

  findCharacter: function (characher, choseList) {
    for (var i = 0; i < choseList.length; i++) {
      if (choseList[i] == characher) {
        choseList.splice(i, 1);
       break;
       }
    }
  },


  afterQuestion: function () {
		that=this;
    var nowQuestionNumber = that.data.nowQuestionNumber
    var questionList = that.data.questionList;
    questionList[nowQuestionNumber].userChose = that.data.choseCharacter;
    
    var answerResult = that.contrastAnswer(questionList[nowQuestionNumber].userChose, questionList[nowQuestionNumber].answer)
    questionList[nowQuestionNumber].answerResult = answerResult;
		if(nowQuestionNumber==questionList.length-1){
			that.overChoice(nowQuestionNumber)
		}
		else
		{
			var afterQuestionNumber = nowQuestionNumber + 1;
			console.log(questionList[nowQuestionNumber])
			that.setData({
				nowQuestion: questionList[afterQuestionNumber],
				nowQuestionNumber: afterQuestionNumber,
				questionList: questionList,
				choses: { 'A': false, 'B': false, 'C': false, 'D': false, 'E': false, 'F': false, 'G': false, 'H': false, 'I': false, 'J': false },
				choseCharacter:[]
			}) 
		}
		
    

    //console.log(questionList[nowQuestionNumber].userChose)
    //console.log(questionList[nowQuestionNumber].answer)
    //console.log(nowQuestionNumber)
    //console.log(that.data.questionList)
  },

  answerCard: function () {
    getApp().globalData.multiChoiceAnswerNow = that.data.questionList
    wx.navigateTo({
      url: '../answerCard/answerCard'
    });
  },

  contrastAnswer: function (array1,array2){
    var answerResult;
    var correctNumber=0;
    var errorChose=new Array();
    if (array1.length==0){
      answerResult = 'blank'
    }
    if (array1.length != 0 && array1.length != array2.length){
      answerResult='error'
    }
    else if (array1.length == array2.length){
      for (var i = 0; i < array1.length;i++){
        for (var j = 0; j < array2.length; j++){
          if (array1[i] == array2[j]){
            correctNumber = correctNumber+1;
            console.log(correctNumber+"分数")
          }
        }
      }
      if (array1.length == array2.length && array2.length==correctNumber){
        answerResult = 'correct'
        getApp().globalData.score = getApp().globalData.score+2;
      }
      else{
        answerResult = 'error'
      }
      console.log(correctNumber)
    }
   
    console.log(getApp().globalData.score+"66666")
    return answerResult;
  },

  

	overChoice:function(questionNumber){
		getApp().globalData.multiChoiceAnswerNow = that.data.questionList;
		//getApp().globalData.multiChoiceAnswerNow = that.data.newMultiQuestionList;
		if (questionNumber == that.data.questionList.length-1){
			wx.redirectTo({
				url: '../truefalseExplain/truefalseExplain'
			});
		}
	},


})