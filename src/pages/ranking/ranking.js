var that;
var Bmob = require('../../utils/bmob.js');
Page({

 
  data: {
    QBList: ['征兵业务知识题库'],
    choseQB: '征兵业务知识题库',
    id:0,
    ranking_list:[],
    loading: true,
    page_index: 0,
    has_more: true,
    listBlock:0,
    like:false
  },


   
  onLoad: function (options) {
    
		that=this;
		that.loadRanking();
    
  },

  loadRanking:function(){
    that=this;
    var listBlock = that.data.listBlock;
    var page_size = 20;
    var choseQB = that.data.choseQB;

    var queryHistory = new Bmob.Query("history");
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    queryHistory.equalTo("choseQuestionBank","==", choseQB);
    queryHistory.order('-_maxScore');
		queryHistory._extraOptions={"max":"score","groupby":"realName,dept,likeNumber"}
    queryHistory.skip(that.data.page_index * page_size);
    queryHistory.limit(page_size);
		queryHistory.find().then(results=>{
			var resultList = that.data.ranking_list;
			for (var j = listBlock * 20; j < listBlock * 20 + results.length; j++) {
				results[j].number = j + 1;
				results[j].hadLike = that.contains(results[j].likeList, currentUserId)
	
			}
			listBlock++;
			that.setData({
				ranking_list: resultList.concat(results),
				loading: false,
				listBlock: listBlock
			})
			if (results.length < page_size) {
				that.setData({
					has_more: false
				});
			}
			console.log(that.data.ranking_list)

		}).catch(err=>{console.log(err)});
  },

  // clickItem:function(e){
  //   var index = e.currentTarget.dataset.index;
  //   console.log(index)
  //   var objectId = that.data.ranking_list[index].id;
  //   that.like(objectId);
  // },

  like: function (e){
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.ranking_list[index].objectId;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
		console.log(objectId);
    var queryHistory = new Bmob.Query("history");
		queryHistory.get(objectId).then(result=>{
			var likeList = result.likeList;
			if(!likeList) likeList=[];
			var hadLike = that.contains(likeList, currentUserId)
			if (!hadLike){
				
				likeList.push(currentUserId)
				var likeNumber = likeList.length;
				result.set('likeList', likeList);
				result.set('likeNumber', likeNumber);
				result.save();
				var addLikeNumber = that.data.ranking_list;
				addLikeNumber[index].likeNumber++;
				addLikeNumber[index].hadLike=true;
				that.setData({
					ranking_list: addLikeNumber
				});
			}
		}).catch(err=>{console.log(err)});
    
  },

  

  choseQB: function (e) {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值  
    that.setData({
      id: index,
      choseQB: that.data.QBList[index],
      loading: true,
      listBlock:0,
      ranking_list:[],
      page_index: 0,
      has_more: true
    })
    that.loadRanking();
  },

  onReachBottom: function () {
    if (!that.data.has_more) {
      return;
    }
    var page_index = that.data.page_index;
    that.setData({
      page_index: ++page_index
    });
    that.loadRanking();
  },

  
  contains:function(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '征兵业务知识题库',
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