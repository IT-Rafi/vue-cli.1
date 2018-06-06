<template>
    <div id="container">
        <div class="preovis"  v-for="(item, index) in listData"  @click="location(item.proceed,item.periods,item.rate,item.startDate.substring(5),item.endDate.substring(5),item.updateTime)">
            <div class="preovisLeft">
                <span>{{item.periods}}期</span>
                <b :class="item.proceed==1?'':'gray'">{{item.proceed==1?'进行中':'已结束'}}</b>
                <p>{{item.startDate.substring(5)}}至{{item.endDate.substring(5)}}</p>
            </div>
            <div class="preovisrRight" v-if="item.rate>0">
                <div><img :src="item.logoUrl" alt=""><i></i></div>{{item.nickName}}
                <img id="img" v-if="item.userRank!=-2"  :src='"../../images/level"+item.userRank+".png"' >
            </div>
        </div>
    </div>
</template>
<script>
import urlConfig from '../../api/index.js'
export default {
    data: function () {
        return {
            listData: [],
            currentIndex: 0,
            currentPage: 1,
            flog: true,
            isshow: true
        }
    },
    watch: {
        currentPage: function (newVal) {
            if (newVal) {
                this.getRanklist();
            }
        },
        listData: function (newVla) {
            if (newVla === "") {
                this.isshow = !this.isshow
            }
        }
    },
    created: function () {
        this.isMp = this.getUrlParam("isMp");
        dplus_Click("页面浏览", { "产品分类": "股神争霸", "PLATFORM": "MINIAPP","所属平台":"微信小程序","页面名称":"股神争霸—往期排行榜（列表）" });
        var hxid = this.getUrlParam("hxid");
        if (hxid) {
            this.userid = hxid;
        } else {
            this.userid = ""
        }
        this.getRanklist()
        var that = this;
        $(window).scroll(function() {
            if ((that.Util.common.getScrollTop() + that.Util.common.getClientHeight()) == (that.Util.common.getScrollHeight())) {
                if (that.flog) {
                    that.currentPage++;
                }
            }
        });
        
    },
    methods: {
        getRanklist: function () {
            var that = this;
            $.ajax({
                type: "post",
                url: urlConfig.previousyieldRate+"&pageNO=" + that.currentPage,
                dataType: "jsonp",
                success: function (data) {
                    //					console.log(data);
                    if (data.resultKey == "ok") {
                        console.log(data);
                        
                        that.listData = that.listData.concat(data.data.previousyieldrate);
                        for(var i=0;i<that.listData.length;i++){
                            if(that.getByteLen(that.listData[i].nickName)>=9){
                                that.listData[i].nickName=that.listData[i].nickName.substring(0,4)+"...";
                            }
                        }
                    } else {
                        that.flog = false;
                    }
                }
            });
            
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
        getByteLen:function(str){
            return str.replace(/[\u0391-\uFFE5]/g,"aa").length;
        },
        location: function(id, qs, rate, star, end, update) {
            dplus_Click("点击事件", 
            {   "产品分类": "股神争霸",
                "PLATFORM": "MINIAPP",
                "所属平台":"微信小程序",
                "事件功能":"进入往期排名",
                "类型":"互动"
            });
            var update = update.split(" ")[0];
            if (rate > 0) {
                // location.href = "https://stockmatch.hexun.com/front/rankend.html?qs=" + qs + "&star=" + star + "&end=" + end + "&update=" + update + "&hxid=" + this.userid + "&id=" + id;
                
                if(this.isMp!==""  && this.isMp !== null){
                    wx.miniProgram.navigateTo({ url:"/pages/rankend/rankend?qs=" + qs + "&star=" + star + "&end=" + end + "&update=" + update + "&hxid=" + this.userid + "&id=" + id+"&isMp=true"})
                }else{
                    location.href = urlConfig.domain+"/front/rankend.html?qs=" + qs + "&star=" + star + "&end=" + end + "&update=" + update + "&hxid=" + this.userid + "&id=" + id;
                }
            }
        }
    }
}
</script>
<style lang='less' scoped>
#container{
    font-size:.28rem;
    padding: .3rem .2rem 0;
    box-sizing: border-box;
    min-height: 100%;
    background: #d1e8ff;
}
.preovis{
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    padding: .3rem .2rem;
    box-sizing: border-box;
    margin-bottom: .2rem;
    background-image:linear-gradient(top,#439AFF,#5778FF);
    animation: rotate 500ms linear;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
}
@keyframes rotate {
  0%   { transform: rotateX(-90deg); opacity: 0;}
  100% { transform: rotateX(0deg); opacity: 1;}
}
.preovisLeft{
    float: left;
     b{
        padding: 2px 5px;
        font-size: .24rem;
        background: #70D249;
        border-radius: 5px;
        color: #fff;
    }
    b.gray{
        background: #ACACAC;
    }
}
.preovisLeft img{
    width: 1.04rem;
    height:0.36rem;
    vertical-align: bottom;
}
.preovisLeft span{
    color: #fff;
    font-size: .32rem;
    padding-right: 10px;
    position: relative;
    top: .02rem;
}
.preovisLeft p{
    font-size: 0.24rem;
    color:#a6c8ff;
    margin-top: 5px;
}
.preovisrRight{
    float: left;
    margin-top: .1rem;
    color:#fff;
    position: relative;
    margin-left: 1rem;
}
.preovisrRight #img{
    width: auto;
    height: .32rem;
    vertical-align: middle;
}
.preovisrRight div{
    display: inline-block;
    position: relative;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10px;
}
.preovisrRight div img{
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.2);
    position: absolute;
    left: 0;
    top: 0;
}
.preovisrRight div i{
    position: absolute;
    left: -.2rem;
    top: -.2rem;
    width: .5rem;
    height: .5rem;
    
    transform: rotate(-45deg);
    background: url(../../images/first2.png) no-repeat;
    background-size: 100%;
}
</style>
