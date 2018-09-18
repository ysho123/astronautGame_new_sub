cc.Class({
    extends: cc.Component,

    properties: {
        rankInfoPrefab: cc.Prefab,
        contentNode: cc.Node,
        noData: {
           default : null,
           type : cc.Node
        },
        myNoData: {
           default : null,
           type : cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        let model = wx.getSystemInfoSync().model;
        if(model == 'iPhone X'){
            this.node.getComponent(cc.Canvas).fitWidth = true;
            this.node.getComponent(cc.Canvas).designResolution = cc.size(710,1550);
        }

        // 拿好友的
        wx.getFriendCloudStorage({
            keyList : ['score'],
            success : (res)=>{
                this.drawRankList(res.data);
            }
        });
    },

    // called every frame
    update: function (dt) {

    },
    drawRankList(data){
        var that = this;

        let resultArr = this.shaixuan(data);

        // 内容区域随着内容增加而增加
        this.contentNode.height = 120*resultArr.length ;
        if( resultArr.length > 0 ){
            this.sortArr(resultArr).forEach((item,key)=>{
                this.noData.active = false;

                let newNode = cc.instantiate(this.rankInfoPrefab);
                if( key <= 2 ){
                     newNode.getChildByName('rank_num').getComponent('cc.Label').node.color = new cc.color(255,216,59);
                }else{
                     newNode.getChildByName('rank_num').getComponent('cc.Label').node.color = new cc.color(255,255,255);
                }
                newNode.getChildByName('rank_num').getComponent('cc.Label').string = key+1; 
                // 头像
                cc.loader.load({url : item.avatarUrl, type : 'jpg'} , function(err, texture){
                    newNode.getChildByName('avatar').getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(texture);
                });
               
                //昵称
                newNode.getChildByName('name').getComponent('cc.Label').string = item.nickname; 
                //距离分数  
                newNode.getChildByName('score').getComponent('cc.Label').string = item.KVDataList[0]['value'];
                this.contentNode.addChild(newNode);
            });
        }else{
            this.noData.active = true;
        }
     
    },

    shaixuan(data){
        let resultArr = data.filter((item,key)=>{
            return !!(item.KVDataList[0]);
        })
        return resultArr;
    },
        
    // 排序
    sortArr(arr){
        for(let j=0;j<arr.length;j++){
            for(let i=arr.length-1;i>0;i--){
                    let compareNum1 = parseInt(arr[i].KVDataList[0]['value']);
                    let compareNum2 = parseInt(arr[i-1].KVDataList[0]['value']);

                    if( compareNum1 > compareNum2 ){
                        let temp = arr[i];
                        arr[i] = arr[i-1];
                        arr[i-1] = temp;
                    }
            }
        }
        return arr;
    }
});
