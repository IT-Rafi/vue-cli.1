
<template>
    <div id="container">
      <div class="content">
        <h4 class="title">
          <img src="../../images/iconrank@2x.png" alt="">
          <span>收益榜</span>|<span>{{users.periods}}期</span>
          <b :class="users.proceed==1?'':'gray'">{{users.proceed==1?'进行中':'已结束'}}</b>
        </h4>
        <div class="profitRank">
            <ul  v-if="isshow">
              <li v-for="(item, index) in profitData">
                <div class="ranks">
                    <span v-if="index==0"><img src="../../images/first2.png" alt=""></span>
                    <span v-else-if="index==1"><img src="../../images/second2.png" alt=""></span>
                    <span v-else-if="index==2"><img src="../../images/third2.png" alt=""></span>
                    <span v-else>{{index+1}}</span>
                </div>
                <img id="rankhead" :src="item.logoUrl" @click="persons(item.client_id)"  alt=""><span @click="persons(item.client_id)">{{item.nickName}}</span>
                <img  v-if="item.userRank!=-2"  class="rankdw" :src='"../../images/level"+item.userRank+".png"' alt="">
                <div class="Profit">{{toDecimal(item.rate)}}%</div>
              </li>
            </ul>
            <div class="norank" v-else>
              <img src="../../images/leaderboard_emptystates1.png" alt="">
              <h3>暂无数据</h3>
            </div>
            <p class="lookMore" @click="torankingList">查看更多<img src="../../images/icon@2x.png" alt=""></p>
        </div>
        <h4 class="title">
          <img src="../../images/icondw@2x.png" alt="">
          <span>段位榜</span>
        </h4>
        <div class="profitRank">
            <ul v-if="rankisshow">
              <li v-for="(item, index) in rankData">
                <div class="rankph">
                      <span v-if="index==0" class="one">{{index+1}}</span>
                      <span v-else-if="index==1" class="two">{{index+1}}</span>
                      <span v-else-if="index==2" class="three">{{index+1}}</span>
                      <span v-else>{{index+1}}</span>
                  </div>
                <img id="rankhead" :src="item.logoUrl" @click="persons(item.hexunId)"  alt=""><span @click="persons(item.hexunId)">{{item.nickName}}</span>
                <img  v-if="item.rank!=-2"  class="rankdw" :src='"../../images/level"+item.rank+".png"' alt="">
                <div class="Profit nomt"><p>{{item.promotionTime}}</p><span>晋级</span></div>
              </li>
            </ul>
            <div class="norank" v-else>
              <img src="../../images/leaderboard_emptystates1.png" alt="">
              <h3>暂无数据</h3>
            </div>
            <p class="lookMore" @click="torankList">查看更多<img src="../../images/icon@2x.png" alt=""></p>
        </div>
        <h4 class="title">
          <img src="../../images/gold.png" alt="">
          <span>奖金榜</span>
        </h4>
        <div class="profitRank">
            <ul v-if="goldisshow">
              <li v-for="(item, index) in goldData">
                <div class="rankph">
                      <span v-if="index==0" class="one">{{index+1}}</span>
                      <span v-else-if="index==1" class="two">{{index+1}}</span>
                      <span v-else-if="index==2" class="three">{{index+1}}</span>
                      <span v-else>{{index+1}}</span>
                  </div>
                <img id="rankhead" :src="item.logoUrl" @click="persons(item.hexunId)"  alt=""><span @click="persons(item.hexunId)">{{item.nickName}}</span>
                <img  v-if="item.userRank!=-2"  class="rankdw" :src='"../../images/level"+item.userRank+".png"' alt="">
                <div class="Profit nomt"><p>{{toDecimal(item.totalIncome)}}元</p><span>累计</span></div>
              </li>
            </ul>
            <div class="norank" v-else>
              <img src="../../images/leaderboard_emptystates1.png" alt="">
              <h3>暂无数据</h3>
            </div>
            <p class="lookMore" @click="togoldList">查看更多<img src="../../images/icon@2x.png" alt=""></p>
        </div>
      </div>  
      <section class="mess suc-tc tx-tc hide">
          <div class="txt-c">
              <p class='suc-text c-fff'></p>
          </div>
      </section>
      <Footter></Footter>
    </div>
</template>    
    <script>
import urlConfig from "../../api/api.js";
import Footter from '../footer/Footter'
export default {
  components: {
    Footter,
  },
  data: function() {
    return {
      users: {},
      profitData:[],
      rankData:[],
      goldData:[],
      isshow:true,
      rankisshow:true,
      goldisshow:true,
    };
  },
  created() {
    var hxid = this.getUrlParam("hxid");
    this.isMp = this.Util.common.getQueryString("isMp");
    if (this.isMp == "true") {
      dplus_Click("页面浏览", {
        产品分类: "股神争霸",
        PLATFORM: "MINIAPP",
        页面名称: "股神争霸-排行榜",
        所属平台: "微信小程序"
      });
    }
    if (hxid) {
      this.userid = hxid;
    } else {
      this.userid = "";
    }
    
    
      this.getUsermage();
      this.getprofitRank();
      this.getRank();
      this.getgoldRank();
      // this.getdw()
  },
  methods: {
    getUsermage: function() {
      var that = this;
      $.ajax({
        type: "get",
        url: urlConfig.oneyieldRate + "?hexunId=" + that.userid,
        dataType: "jsonp",
        success: function(data) {
          console.log(data);
          if (data.resultKey == "ok") {
            that.users = data.data.oneyieldRate[0];
            
          }
        }
      });
    },
    getprofitRank: function () {
        var that = this;
        $.ajax({
            type: "post",
            url: urlConfig.chickenList+"?hexunId=" + that.userid,
            dataType: "jsonp",
            success: function (data) {
                if (data.resultKey == "ok" && data.data.yieldrate != "") {
                    console.log(data);
                    that.profitData=(data.data.yieldrate).sort(that.sorts("rank")).slice(0,3);
                    for(var i=0;i<that.profitData.length;i++){
                        if(that.getByteLen(that.profitData[i].nickName)>14){
                            that.profitData[i].nickName=that.profitData[i].nickName.substring(0,6)+"...";
                        }
                    }
                    // that.profitData = (that.profitData).sort(that.sorts("rank"));
                }else{
                  that.isshow=false;
                }
            }
        });
    },
    getRank: function () {
        var that = this;
        $.ajax({
            type: "post",
            url: urlConfig.rankList+"pageSize=3&pageNO=1",
            dataType: "jsonp",
            success: function (data) {
                if (data.resultKey == "ok" && data.data.rankingList != "") {
                    console.log(data);
                    that.rankData=data.data.rankingList
                    for(var i=0;i<that.rankData.length;i++){
                        if(that.getByteLen(that.rankData[i].nickName)>14){
                            that.rankData[i].nickName=that.rankData[i].nickName.substring(0,6)+"...";
                        }
                    }
                    // that.profitData = (data.data.yieldrate).sort(that.sorts("rank"));
                }else{
                  that.rankisshow=false;
                }
            }
        });
    },
    getgoldRank: function () {
        var that = this;
        $.ajax({
            type: "post",
            url: urlConfig.matchRealTotalRanking + "pageSize=3&pageNO=1",
            dataType: "jsonp",
            success: function (data) {
                if (data.resultKey == "ok" && data.data.rank != "") {
                    console.log(data);
                    that.goldData=data.data.rank
                    for(var i=0;i<that.goldData.length;i++){
                        if(that.getByteLen(that.goldData[i].nickName)>14){
                            that.goldData[i].nickName=that.goldData[i].nickName.substring(0,6)+"...";
                        }
                    }
                    // that.profitData = (data.data.yieldrate).sort(that.sorts("rank"));
                }else{
                  that.goldisshow=false;
                }
            }
        });
    },
    getByteLen: function(str) {
      return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    },
    sorts: function(property) {
      return function(x, y) {
        var a = x[property],
          b = y[property];
        if (isNaN(a)) {
          return a.localeCompare(b);
        } else {
          return a - b;
        }
      };
    },
    toDecimal: function(x) {
      var f = parseFloat(x);
      if (isNaN(f)) {
        return "--";
      }
      var f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    persons: function(client_id) {
      console.log(client_id);
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url:
            "/pages/personalRecord/personalRecord?userId=" +
            client_id +
            "," +
            this.userid +
            "&isMp=true"
        });
      } else {
        location.href =
          urlConfig.domain +
          "/front/personalRecord.html?userId=" +
          client_id +
          "," +
          this.userid;
      }
    },
    mycenter:function(){
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url:
            "/pages/myEarnings/myEarnings?userid=" +
            this.userid+
            "&isMp=true"
        });
      } else {
        location.href =
          urlConfig.domain +
          "/front/myEarnings.html?userid=" +
          this.userid
      }
    },
    torankingList:function(){
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url:
            "/pages/rankList/rankList?hxid=" +
            this.userid+
            "&isMp=true"
        });
      } else {
        location.href =
          urlConfig.domain +
          "/front/rankingList.html?hxid=" +
          this.userid
      }
    },
    torankList:function(){
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url:
            "/pages/levelList/levelList?hxid=" +
            this.userid+
            "&isMp=true"
        });
      } else {
        location.href =
          urlConfig.domain +
          "/front/rankList.html?hxid=" +
          this.userid
      }
    },
    togoldList:function(){
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url:
            "/pages/goldList/goldList?isMp=true&hxid=" +
            this.userid
        });
      } else {
        location.href =
          urlConfig.domain +
          "/front/goldList.html?hxid=" +
          this.userid
      }
    },
    rule: function(client_id) {
      console.log(client_id);
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url: "/pages/rule/rule?&isMp=true&flag=2"
        });
      } else {
        location.href = urlConfig.domain + "/front/rule.html?flag=2";
      }
    },
    getUrlParam: function(string) {
      //构造一个含有目标参数的正则表达式对象
      var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
      //匹配目标参数
      var r = window.location.search.substr(1).match(reg);
      //返回参数值
      if (r != null) return unescape(r[2]);
      return null;
    }
  }
};
</script>
<style lang='less' scoped>
#container {
  font-size: 0.28rem;
  box-sizing: border-box;
  background: #272F7D;
  min-height: 100%;
  padding: 0 0 1.4rem;
}
.content{
  padding: 0 .2rem;
}
.title{
  padding: .2rem 0;
  font-size: .24rem;
  line-height: .4rem;
  color:rgba(255, 255, 255, 0.3);
  img{
    width: .4rem;
    height: .4rem;
    vertical-align: bottom;
  }
  span{
    padding:0 .1rem;
    color: #fff;
  }
  b{
    color: #fff;
    padding: 2px 5px;
    font-size: .24rem;
    background: #70d249;
    border-radius: 5px;
  }
  b.gray{
      background: #ACACAC;
  }
}
.profitRank{
  padding: 0 0 .1rem;
  border-radius: 5px;
  background-image: linear-gradient(left, #5778ff, #439aff);
  li{
    padding:.2rem;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
    color: #fff;
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
    .rankph {
      display: inline-block;
      span {
        border-radius: 2px;
        margin-right: 0.1rem;
        display: inline-block;
        width: 0.36rem;
        height: 0.36rem;
        line-height: 0.36rem;
        text-align: center;
      }
      span.one {
        background: #cdb46e;
      }
      span.two {
        background: #a5b3e0;
      }
      span.three {
        background: #dfc1a8;
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
        margin-top: .2rem;
        span{
          color:rgba(255, 255, 255, 0.5)
        }
    }
    .Profit.nomt{
      margin-top: 0;
      text-align: right
    }
  }
  li:last-child{
    border-bottom: 1px solid rgba(255, 255, 255, 0.3)
  }
}
.lookMore{
  text-align: center;
  color: #F7D400;
  font-size: .28rem;
  padding: .1rem 0 0;
  img{
    width: .28rem;
    height: .24rem;
    margin-top: -.05rem;
  }
}
@keyframes rotate {
  0% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
.norank {
  text-align: center;
  color: #779ec2;
  width: 100%;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5); 
  padding-bottom: .1rem;
  img {
    width: .68rem;
    height: .62rem;
    margin: 0 auto 0.2rem;
  }
  h3 {
    width: 100%;
    font-size: 0.32rem;
  }
  p {
    width: 100%;
    font-size: 0.28rem;
    margin: 0.1rem 0;
  }
  div {
    width: 1.76rem;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    font-size: 0.28rem;
    color: #fff;
    background-image: linear-gradient(left, #5778ff, #439aff);
    border-radius: 6px;
    margin: 0 auto;
  }
}
.mess {
    position: absolute;
    width: 80%;
    left: 10%;
    top: 30%;
    background: #fff;
    border-radius: .2rem;
    z-index: 20;
}
.suc-tc {
    width: 56%;
    font-size: .3rem;
    position: fixed;
    left: 22%;
    top: 40%;
    background: rgba(0, 0, 0, .6);
    border-radius: .25rem;
    z-index: 20;
    padding: .2rem .2rem;
    color: #fff
}
.hide{
    display: none
}
</style>
    
