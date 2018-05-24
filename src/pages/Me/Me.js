var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;
Page({

  data: {
    userInfo: {},
    currentUserId:null
  },

 
  onLoad: function () {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
		/*
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo,
        currentUserId: currentUserId
      })
    })*/
  },

  onShow: function () {
  
  },

  testHistory:function(){
		var User = Bmob.User.current();
		console.log(User);
		if(User.register==true){
			wx.navigateTo({
				url: '../testHistory/testHistory'
			})
		}else{
			wx.navigateTo({
				url: '../register/register'
			})
		}

  },

  personalInformation: function () {

    var User = Bmob.User.current();
		console.log(User);
		if(User.register==true){
			wx.navigateTo({
				url: '../personalInformation/personalInformation'
			})
		}else{
			wx.navigateTo({
				url: '../register/register'
			})
		}
		

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '题库',
      path: '/pages/choiceMain/choiceMain',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
 
})