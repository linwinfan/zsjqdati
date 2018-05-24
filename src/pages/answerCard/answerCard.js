var that;

Page({

  data: {
    singleQuestionList:[],
    multiQuestionList: [],
		truefalseQuestionList:[],
    // noMulti:null
    loading: true

  }, 
 

  onLoad: function (){
    that = this;
    // var noMulti;
    var getSingleQuestionList = getApp().globalData.singleChoiceAnswerNow; 
    var getMultiQuestionList = getApp().globalData.multiChoiceAnswerNow;  
		var getTruefalseQuestionList = getApp().globalData.truefalseAnswerNow;
    for (var i = 0; i < getSingleQuestionList.length; i++) {
      getSingleQuestionList[i].number = i + 1;
    }
    for (var i = 0; i < getMultiQuestionList.length; i++) {
      getMultiQuestionList[i].number = i + 1;
    }
		for (var i = 0; i < getTruefalseQuestionList.length; i++) {
			getTruefalseQuestionList[i].number = i + 1;
		}

    that.setData({
      singleQuestionList: getSingleQuestionList,
      multiQuestionList: getMultiQuestionList,
			truefalseQuestionList:getTruefalseQuestionList,
      loading: false
    });
    console.log(getApp().globalData.multiChoiceAnswerNow)
    console.log(that.data.multiQuestionList)
  },

 
  onShow: function () {
  },

  continueAnswer:function(){
    wx.navigateBack(); 
  },

  assignment:function(){
    wx.reLaunch({
      url: '../result/result'
    });
  }



 
})