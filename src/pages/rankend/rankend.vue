<template>
    <div id="container">
        <div class="phhead">
            <div class="phstatus">
                <ul>
                    <li class="phstatus_left">
                        <span>{{date.qs}}期</span><b :class="date.id==1?'':'gray'">{{date.id==1?'进行中':'已结束'}}</b>
                        <p>{{date.star}}至{{date.end}}</p>
                    </li>
                    <li class="phstatus_right">
                        <span>更新时间</span>
                        <p>{{date.update}}</p>
                    </li>
                </ul>
                <div class="TheFirstThree">
                    <div class="commonum">
                        <div v-show="istwo" class="posnum">
                            <span><img  @click="persons(twoData.client_id)"  :src="twoData.logoUrl" alt=""><i></i></span>
                            <p  @click="persons(twoData.client_id)">{{twoData.nickName}}<img  v-if="twoData.userRank!=-2" :src='"../../images/level"+twoData.userRank+".png"' alt=""></p>
                            <b>{{toDecimal(twoData.rate)}}%</b>
                            <i class="ranknum">2</i>
                        </div>
                        <div v-show="!istwo">
                            <span class="is">?</span>
                        </div>
                    </div>
                    <div class="first commonum">
                        <div v-show="isone" class="posnum">
                            <span><img  @click="persons(oneData.client_id)" :src="oneData.logoUrl" alt=""><i></i></span>
                            <p  @click="persons(oneData.client_id)">{{oneData.nickName}}<img  v-if="oneData.userRank!=-2" :src='"../../images/level"+oneData.userRank+".png"' alt=""></p>
                            <b>{{toDecimal(oneData.rate)}}%</b>
                            <i class="ranknum">1</i>
                        </div>
                        <div v-show="!isone">
                            <span class="is">?</span>
                        </div>
                    </div>
                    <div class="commonum">
                        <div v-show="isthree" class="posnum">
                            <span class="thred"><img @click="persons(threeData.client_id)"  :src="threeData.logoUrl" alt=""><i></i></span>
                            <p @click="persons(threeData.client_id)">{{threeData.nickName}}<img  v-if="threeData.userRank!=-2"  :src='"../../images/level"+threeData.userRank+".png"' alt=""></p>
                            <b>{{toDecimal(threeData.rate)}}%</b>
                            <i class="ranknum">3</i>
                        </div>
                        <div v-show="!isthree">
                            <span class="is">?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ul v-if="flag" id="rankList">
            <li v-for="(item, index) in listData">
                <div class="ranks">
                    <span>{{index+4}}</span>
                </div>
                <img id="rankhead" @click="persons(item.client_id)" :src="item.logoUrl" alt=""><span @click="persons(item.client_id)" >{{item.nickName}}</span>
                <img class="rankdw" v-if="item.userRank!=-2"  :src='"../../images/level"+item.userRank+".png"' alt="">
                <div class="Profit">{{toDecimal(item.rate)}}%</div>
            </li>
        </ul>
        <div class="norank" v-else>
            <img src="../../images/leaderboard_emptystates1.png" alt="">
        </div>
    </div>    
</template>
<script>
import urlConfig from '../../api/index.js'
export default {
    data: function () {
        return {
            oneData: {userRank:-2},
            twoData: {userRank:-2},
            threeData: {userRank:-2},
            listData: [],
            date:{},
            hxid:"",
            flag:true,
            isone:true,
            istwo:true,
            isthree:true,
        }
    },
    created: function () {
        this.isMp = this.getUrlParam("isMp");
        dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": "MINIAPP","所属平台":"微信小程序","页面名称":"股神争霸—往期排行榜（详情）" });
        this.date = {
            qs: this.getUrlParam("qs"),
            star: this.getUrlParam("star"),
            end: this.getUrlParam("end"),
            update: this.getUrlParam("update"),
            id: this.getUrlParam("id"),
        }
        this.hxid = this.getUrlParam("hxid");
        if (this.date.id == 1) {
            document.title = "进行中"
        }
        this.getendlist()
    },
    methods: {
        getendlist: function () {
            var that = this;
            $.ajax({
                type: "post",
                url: urlConfig.oldYieldRate+"periods="+that.date.qs,
                dataType: "jsonp",
                success: function (data) {
                    //					console.log(data);
                    if (data.resultKey == "ok") {
                        if(data.data.oldYieldRate.length<4){
                            that.flag=false;
                        }
                        var data=data.data.oldYieldRate.sort(that.sorts("rank"))
                        that.oneData=data.slice(0,1)[0];
                        that.twoData=data.slice(1,2)[0];
                        that.threeData=data.slice(2,3)[0];
                        
                        if(that.oneData===undefined){
                            that.isone=false;
                            that.oneData={userRank:-2}
                        }else{
                            if(that.getByteLen(that.oneData.nickName)>6){
                                that.oneData.nickName=that.oneData.nickName.substring(0,2)+"...";
                            }
                        }
                        if(that.twoData===undefined){
                            that.istwo=false;
                            that.twoData={userRank:-2}
                        }else{
                            if(that.getByteLen(that.twoData.nickName)>6){
                                that.twoData.nickName=that.twoData.nickName.substring(0,2)+"...";
                            }
                        }
                        if(that.threeData===undefined){
                            that.isthree=false;
                            that.threeData={userRank:-2}
                        }else{
                            if(that.getByteLen(that.threeData.nickName)>6){
                                that.threeData.nickName=that.threeData.nickName.substring(0,2)+"...";
                            }
                        }
                        that.listData = data.slice(3);
                    }
                }
            });
        },
        getByteLen:function(str){
            return str.replace(/[\u0391-\uFFE5]/g,"aa").length;
        },
        sorts: function (property) {
            return function (x, y) {
                var a=x[property] ,b= y[property];
                if(isNaN(a)){
                    return a.localeCompare(b)
                }else{
                    return a-b
                }
            }
        },
        getUrlParam: function (string) {
            //构造一个含有目标参数的正则表达式对象  
            var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
            //匹配目标参数  
            var r = window.location.search.substr(1).match(reg);
            //返回参数值  
            if (r != null) return unescape(r[2]);
            return null;
        },
        prevhref: function() {
            dplus_Click("点击事件", 
            {   "产品分类": "股神争霸",
                "PLATFORM": "MINIAPP",
                "所属平台":"微信小程序",
                "事件功能":"往期排名详情-往期排名",
                "类型":"互动"
            });
            // location.href = "file:///D:/rankingList/previousRanking.html?hxid="+this.hxid;
            // location.href = "https://stockmatch.hexun.com/front/previousRanking.html?hxid=" + this.hxid;
            if(this.isMp!==""  && this.isMp !== null){
                wx.miniProgram.navigateTo({ url:"/pages/previousRanking/previousRanking?hxid=" + this.hxid+"&isMp=true"})
            }else{
                location.href = urlConfig.domain+"/front/previousRanking.html?hxid=" + this.hxid;
            }
            
        },
        persons:function(client_id){
            if(this.isMp!==""  && this.isMp !== null){
                wx.miniProgram.navigateTo({ url:"/pages/personalRecord/personalRecord?userId=" + client_id+","+this.hxid+"&isMp=true"})
            }else{
                location.href=urlConfig.domain+"/front/personalRecord.html?userId="+client_id+","+this.hxid;
            }
        },
        toDecimal:function(x) {    
            var f = parseFloat(x);    
            if (isNaN(f)) {    
                return "--";    
            }    
            var f = Math.round(x*100)/100;    
            var s = f.toString();    
            var rs = s.indexOf('.');    
            if (rs < 0) {    
                rs = s.length;    
                s += '.';    
            }    
            while (s.length <= rs + 2) {    
                s += '0';    
            }    
            return s;    
        }
    }
}
</script>
<style lang="less" scoped>
#container{
    font-size:.28rem;
    box-sizing: border-box;
    background: #d1e8ff;
    min-height: 100%;
}
.phhead{
    width: 100%;
    background-image:linear-gradient(top,#439AFF,#5778FF);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    padding: 0 .2rem;
    .phstatus{
        width: 100%;
        ul{
            overflow: hidden;
            li{
                width: 50%;
                color: #a6c8ff;
                font-size: .24rem;
                padding-top: .24rem;
                line-height: .4rem
            }
            .phstatus_left{
                float: left;
                span{
                    color: #fff;
                    font-weight: 100;
                    font-size: .32rem;
                    position: relative;
                    top: .02rem;
                    padding-right: 10px;       
                }
                b{
                    color:#fff;
                    padding: 2px 5px;
                    font-size: .24rem;
                    background: #70D249;
                    border-radius: 5px;
                }
                b.gray{
                    background: #ACACAC;
                }
                p{
                    font-size: .24rem;
                    margin-top: 1px;
                }
            }
            .phstatus_right{
                text-align: right;
                float: right;
            }
        }
        .TheFirstThree{
            width: 100%;
            display: flex;
            display: -webkit-flex;
            align-items:flex-end;
            margin: .2rem 0 .2rem;
        }
        .TheFirstThree div.commonum{
            flex: 1;
            text-align: center;
            width: 2.2rem;
            height: 2.8rem;
            background-image:linear-gradient(top,#5075FF,#3B79DD);
            border-radius: 5px 5px 0 0;
            overflow: hidden;
            padding: .2rem;
            box-sizing: border-box;
            animation: rotateY 500ms linear;
            .is{
                font-size: 1rem;
                color: rgba(255,255,255,0.20);
            }

        }
        .TheFirstThree div.commonum .posnum{
            position: relative;
        }
        .TheFirstThree div.commonum .posnum .ranknum{
            position: absolute;
            right: 0;
            top: -.5rem;
            color: rgba(255,255,255,.6);
            font-size: .28rem;
        }
        .TheFirstThree div.commonum p{
            color: #fff;
            margin-bottom: 5px;
        }
        .TheFirstThree div.commonum p img{
            width: auto;
            height: .32rem;
            vertical-align: bottom;
        }
        .TheFirstThree div.commonum b{
            font-size: .32rem;
            color: #fff;
            font-weight: bold;
        }
        .TheFirstThree div.commonum span{
            display: block;
            position: relative;
            width: .76rem;
            height: .76rem;
            border-radius: 50%;
            margin: .5rem auto 5px;
        }
        .TheFirstThree div.commonum span i{
            position: absolute;
            width: .56rem;
            height: .56rem;
            background: url("../../images/second2.png") no-repeat;
            background-size: 100%;
            left: -.3rem;
            top: -.2rem;
            transform: rotate(-45deg);
        }
        .TheFirstThree div.commonum span.thred i{
            background: url("../../images/third2.png") no-repeat;
            background-size: 100%;
        }
        .TheFirstThree div.commonum span img{
            width: .76rem;
            height: .76rem;
            border-radius: 50%;
            border: 2px solid #F8D763;
        }


        .TheFirstThree div.first{
            height: 3.2rem;
            width: 2.3rem;
            background-image:linear-gradient(top,#6AA0FF,#3B79DD);
            
        }
        .TheFirstThree div.first span{
            width: 1.1rem;
            height: 1.1rem;
        }
        .TheFirstThree div.first span img{
            width: 1.1rem;
            height: 1.1rem;
        }
        .TheFirstThree div.first span i{
            width: .56rem;
            height: .56rem;
            background: url("../../images/first2.png") no-repeat;
            background-size: 100%;
            left: -.2rem;
            top: -.2rem;
        }
        
    }
}
@keyframes rotate {
    0%   { transform: rotateX(-90deg); opacity: 0;}
    100% { transform: rotateX(0deg); opacity: 1;}
}
@keyframes rotateY {
    0%   { transform: rotateY(180deg); opacity: 0;}
    100% { transform: rotateY(0deg); opacity: 1;}
}
#rankList{
    padding: 0 .1rem;
    li{
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        background-image:linear-gradient(top,#439AFF,#5778FF);
        margin-bottom: .1rem;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
        border-radius: 6px;
        padding: 0 0 0 .4rem;
        font-size: .28rem;
        color: #fff;
        overflow: hidden;
        animation: rotate 500ms linear;
        .ranks{
            display: inline-block;
            span{
                display: inline-block;
                width: .52rem;
                height:.52rem;
                color: #fff;
                img{
                    width: .52rem;
                    height:.52rem;
                }
            }
        }
        #rankhead{
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.2);
            margin-right: 10px;
        }
        .rankdw{
            width: auto;
            height:.32rem;
            border-radius: 0
        }
        .Profit{
            float: right;
            padding-right: .2rem;
        }
    }
    li.active{
        background-image:linear-gradient(top,#C38BFF,#8F88FF);
    }
}
.norank{
    margin: 2.5rem 0 0;
    text-align: center;
    color: #779EC2;
    width: 100%;
    img{
        width: 1.36rem;
        height: 1.24rem;
        margin: 0 auto .2rem;
    }
    h3{
        width: 100%;
        font-size: .32rem;
    }
}
</style>
