var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;
Page({

  data: {
    userInfo: {},
    currentUserId: null,
    realName:'',
    dept:'',
    telephone:''
  },


  onLoad: function () {
    that = this;
    var currentUser = Bmob.User.current();
		that.setData({
			dept: currentUser.dept,
			telephone: currentUser.telephone,
			realName: currentUser.realName,
		})
    // var currentUserId = currentUser.id;
//     app.getUserInfo(function (userInfo) {
//       console.log(userInfo)
//       //更新数据
//       that.setData({
//         userInfo: userInfo,
//         currentUserId: currentUserId
//       })
//     })

  },
  
  onShow: function () {
  
  },


})