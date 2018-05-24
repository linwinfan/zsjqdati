var that;
var Bmob = require('../../utils/bmob.js');
Page({

  data: {
    choseQuestions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
		tfchoseQuestions: ['√', '×'],
    singleQuestionList:[],
    multiQuestionList:[],
		truefalseQuestionList:[],
    choseType:'',
    nowQuestion:[],
    correctAnswer:'',
    userAnswer:'',
    loading:true
    
  },  

  onLoad: function (options) {
    that = this;
    var index = options.index;
    var choseType = options.choseType;
    console.log(index);
    console.log(choseType);
    
		that.setQuestionData(choseType,index);
		
		
  },

	setQuestionData:function(choseType,index){
		if( index<0){
			if(choseType=='single'){
				index=0
			}else if (choseType == 'multi') {
				choseType='single'
				index=getApp().globalData.singleChoiceAnswerNow.length-1
			}else if (choseType == 'truefalse') {
				choseType='multi'
				index=getApp().globalData.multiChoiceAnswerNow.length-1
			}
		}
		if (choseType == 'single') {
			
			var getSingleQuestionList = getApp().globalData.singleChoiceAnswerNow;
			if(index>getSingleQuestionList.length-1)
			{
				that.setQuestionData('multi',0)
			}else{
				//var getMultiQuestionList = getApp().globalData.multiChoiceAnswerNow;
				var nowQuestion = getSingleQuestionList[index];
				var correctAnswer = nowQuestion.answer[0];
				var userAnswer = nowQuestion.userChose[0];
				that.setData({
					choseType:choseType,
					singleQuestionList:getSingleQuestionList,
					nowQuestion: nowQuestion,
					correctAnswer: correctAnswer,
					userAnswer: userAnswer,
					loading: false
				});
			}
		}
		else if (choseType == 'multi') {
			if(index>getApp().globalData.multiChoiceAnswerNow.length-1)
			{
				that.setQuestionData('truefalse',0)
			}else{
				var nowQuestion = getApp().globalData.multiChoiceAnswerNow[index]
				var correctAnswerList = nowQuestion.answer;
				var correctAnswer = correctAnswerList.toString()
				var userAnswerList = nowQuestion.userChose;
				var userAnswer = userAnswerList.toString()
				that.setData({
					choseType:choseType,
					multiQuestionList:getApp().globalData.multiChoiceAnswerNow,
					nowQuestion: nowQuestion,
					correctAnswer: correctAnswer,
					userAnswer: userAnswer,
					loading:false
				});
			}
		}
		else if(choseType=="truefalse"){
			var getTruefalseQuestionList = getApp().globalData.truefalseAnswerNow;
			if(index>getTruefalseQuestionList.length-1)
			{index=getTruefalseQuestionList.length-1}
			//var getMultiQuestionList = getApp().globalData.multiChoiceAnswerNow;
			var nowQuestion = getTruefalseQuestionList[index];
			var correctAnswer = nowQuestion.answer[0];
			var userAnswer = nowQuestion.userChose[0];
			that.setData({
				choseType:choseType,
				truefalseQuestionList:getTruefalseQuestionList,
				nowQuestion: nowQuestion,
				correctAnswer: correctAnswer,
				userAnswer: userAnswer,
				loading: false
			});
		}
	},

  frontQuestion:function(){
		
    that.setQuestionData(that.data.choseType,that.data.nowQuestion.number-2)
  },



  afterQuestion: function () {
		that.setQuestionData(that.data.choseType,that.data.nowQuestion.number)
    
  },

  answerCard: function () {
    wx.navigateBack(); 
  }



  



 
})