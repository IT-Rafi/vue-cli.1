
<template>
    <div id="container">
      <ul class="goldnav">
        <li :class="checked?'active':''" @click="check(0)">奖金榜</li>
        <li :class="!checked?'active':''" @click="check(1)">最新奖金</li>
      </ul>
      <div class="goldMore" v-if="!checked">
        <p class="uptime">更新时间 {{moreUptime}}</p>
        <ul v-if="newisshow">
            <li v-for="(item, index) in newlistData">
              <div>
                <img class="More-head" :src="item.logoUrl" @click="persons(item.hexunId)"  alt=""><span @click="persons(item.hexunId)">{{item.nickName}}</span>
                <img  v-if="item.userRank!=-2"  class="More-rankdw" :src='"../../images/level"+item.userRank+".png"' alt="">
              </div>
              <span class="">{{item.periods}}期</span>
              <span class="more-rig">{{toDecimal(item.income)}}元</span>
            </li>
        </ul>
        <div class="norank" v-else>
            <img src="../../images/leaderboard_emptystates1.png" alt="">
            <h3>暂无数据</h3>
        </div>
      </div>
      <div class="golduser" v-else>
        <p class="uptime">更新时间 {{userUptime}}</p>
        <div class="phhead" v-if="users.flog">
            <div class="phusermsg">
                <ul>
                    <li class="left" @click="mycenter">
                        <img class="photo" :src="users.logoUrl" alt=""><span>{{users.nickName}}</span><img v-if="users.userRank!=-2" class="ranknum" :src='"../../images/level"+users.userRank+".png"' alt="">
                    </li>
                    <li class="right">
                      <div> 
                        <span>当前排名</span>
                        <p>累计奖金</p>
                      </div>
                      <div class="sy">
                        <span>{{users.rank}}</span>
                        <p>{{users.totalIncome}}</p>
                      </div>
                    </li>
                </ul>
            </div>
        </div>
        <ul v-if="isshow" id="goldList">
            <li v-for="(item, index) in listData">
                <div class="ranks">
                    <span v-if="index==0" class="one">{{index+1}}</span>
                    <span v-else-if="index==1" class="two">{{index+1}}</span>
                    <span v-else-if="index==2" class="three">{{index+1}}</span>
                    <span v-else>{{index+1}}</span>
                </div>
                <img id="rankhead" :src="item.logoUrl" @click="persons(item.hexunId)"  alt=""><span @click="persons(item.hexunId)">{{item.nickName}}</span>
                <img  v-if="item.userRank!=-2"  class="rankdw" :src='"../../images/level"+item.userRank+".png"' alt="">
                <div class="Profit"><p>{{toDecimal(item.totalIncome)}}元</p><span>累计</span></div>
            </li>
        </ul>
        <div class="norank" v-else>
            <img src="../../images/leaderboard_emptystates1.png" alt="">
            <h3>暂无数据</h3>
        </div>
      </div>
      
    </div>
</template>    
    <script>
import urlConfig from "../../api/api.js";
export default {
  data: function() {
    return {
      users: { rank: -2, num: 0 },
      listData: [],
      newlistData: [],
      isshow: true,
      newisshow: true,
      flog: true,
      newflog: true,
      currentPage: 1,
      newcurrentPage: 1,
      checked:true,
      moreUptime:"",
      userUptime:"",
    };
  },
  watch: {
    currentPage: function(newVal) {
      if (newVal) {
        this.getRanklist();
      }
    },
    newcurrentPage: function(newVal) {
      if (newVal) {
        this.getNewGoldlist();
      }
    },
    listData: function(newVla) {
      if (newVla === "") {
        this.isshow = !this.isshow;
      }
    },
    newlistData: function(newVla) {
      if (newVla === "") {
        this.newisshow = !this.newisshow;
      }
    }
  },
  created() {
    var hxid = this.getUrlParam("hxid");
    // var status = this.getUrlParam("status");
    this.isMp = this.Util.common.getQueryString("isMp");
    // if(status==1){
    //   this.checked=false
    // }
    if (this.isMp == "true") {
      dplus_Click("页面浏览", {
        产品分类: "股神争霸",
        PLATFORM: "MINIAPP",
        页面名称: "股神争霸-奖金榜",
        所属平台: "微信小程序"
      });
    }
    if (hxid) {
      this.userid = hxid;
    }
    
    
      this.getUsermage(this.userid);
      this.getRanklist();
      this.getNewGoldlist()
    
    var that = this;
    $(window).scroll(function() {
      console.log(that.checked)
      if (
        that.Util.common.getScrollTop() + that.Util.common.getClientHeight() ==
        that.Util.common.getScrollHeight()
      ) {
        if(!that.checked){
          console.log(1)
          if (that.flog) {
            that.newcurrentPage++;
          }
        }else{
          console.log(2)
          if (that.newflog) {
            that.currentPage++;
          }
        }
        
      }
    });
  },
  methods: {
    getUsermage: function(userid) {
      var that = this;
      $.ajax({
        type: "get",
        url: urlConfig.personReaUserRank + "hexunId=" + userid,
        dataType: "jsonp",
        success: function(data) {
          console.log(data);
          if (data.resultKey == "ok") {
            that.users = data.data.rank;
            if (that.getByteLen(that.users.nickName) >= 12) {
              that.users.nickName = that.users.nickName.substring(0, 5) + "...";
            }
            if (that.users.num == "" || that.users.num == 0) {
              that.users.num = "--";
            } else {
              that.users.num = that.users.num;
            }
            if (that.users.rank === -1) {
              that.users.flog=false
            }else{
              that.users.flog=true
            }
          }
        }
      });
    },
    getUrlParam: function(string) {
      //构造一个含有目标参数的正则表达式对象
      var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
      //匹配目标参数
      var r = window.location.search.substr(1).match(reg);
      //返回参数值
      if (r != null) return unescape(r[2]);
      return null;
    },
    getRanklist: function() {
      var that = this;
      $.ajax({
        type: "post",
        url: urlConfig.matchRealTotalRanking + "pageSize=10&pageNO=" + that.currentPage,
        dataType: "jsonp",
        success: function(data) {
          
          if (data.resultKey == "ok") {
            console.log(data);

            that.listData = that.listData.concat(data.data.rank);
            that.userUptime=that.listData[0].updateTime
            console.log(that.listData);
            for (var i = 0; i < that.listData.length; i++) {
              if (that.getByteLen(that.listData[i].nickName) > 14) {
                that.listData[i].nickName =
                  that.listData[i].nickName.substring(0, 6) + "...";
              }
            }
          } else {
            that.flog = false;
          }
        }
      });
    },
    getNewGoldlist: function() {
      var that = this;
      $.ajax({
        type: "post",
        url: urlConfig.matchReaUserRanking + "pageSize=15&pageNO=" + that.newcurrentPage,
        dataType: "jsonp",
        success: function(data) {
          
          if (data.resultKey == "ok") {
            console.log(data);

            that.newlistData = that.newlistData.concat(data.data.rank);
            that.moreUptime=that.newlistData[0].updateTime
            console.log(that.newlistData);
            console.log(that.newlistData);
            for (var i = 0; i < that.newlistData.length; i++) {
              if (that.getByteLen(that.newlistData[i].nickName) > 14) {
                that.newlistData[i].nickName =
                  that.newlistData[i].nickName.substring(0, 6) + "...";
              }
            }
            // for (var i = 0; i < that.listData.length; i++) {
            //   if (that.getByteLen(that.listData[i].nickName) > 14) {
            //     that.listData[i].nickName =
            //       that.listData[i].nickName.substring(0, 6) + "...";
            //   }
            // }
          } else {
            that.newflog = false;
          }
        }
      });
    },
    check:function(checked){
      
      if(checked!==0){
        this.checked=false
      }else{
        this.checked=true
      }
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
    rule: function(client_id) {
      console.log(client_id);
      if (this.isMp == "true") {
        wx.miniProgram.navigateTo({
          url: "/pages/rule/rule?&isMp=true&flag=2"
        });
      } else {
        location.href = urlConfig.domain + "/front/rule.html?flag=2";
      }
    }
  }
};
</script>
<style lang='less' scoped>
#container {
  font-size: 0.28rem;
  box-sizing: border-box;
  background: #d1e8ff;
  min-height: 100%;
}
.uptime{
    color: #73779D;
    font-size: .24rem;
    text-align: right;
    padding: .2rem 0;
}
.goldMore{
  width: 100%;
  padding: 0 .1rem;
  
  
  ul{
    background: linear-gradient(left, #3176FF, #497FFF); 
    padding: .2rem .2rem 0.2rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 #83ADFF;
    li{
      overflow: hidden;
      margin-bottom: .3rem;
      color: rgba(255, 255, 255, 0.8);
      div{
        display: inline-block;
        width: 3.8rem;
      }
      .More-head{
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
        border: 1px solid #439aff;
        overflow: hidden;
        vertical-align: middle;
        margin-right: 10px;
      }
      .More-rankdw{
        width: auto;
        height: .32rem;
      }
      .more-rig{
        float: right;
        margin-top: .12rem
      }
    }
  }
}
.goldnav{
  background:linear-gradient(left, #3176FF, #497FFF); 
  display: flex;
  height: 1.2rem;
  line-height: 1.2rem;
  padding: 0 .1rem;
  li{
    flex: 1;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    border-bottom:2px solid #6e9eff;
  }
  li.active{
    border-bottom:2px solid #fff;
    color: #fff;
  }
}
.golduser{
  padding: 0 .1rem;
}
.phhead{  
    width: 100%;
    // padding: .1rem 0.1rem;
    margin-bottom: 0.2rem;
  .phusermsg {
    width: 100%;
    height: 1.2rem;
    background-image: linear-gradient(left, #A398FD, #6182F0);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    ul {
      display: flex;
      padding: 0.2rem 0;
      box-sizing: border-box;
      li {
        flex: 1;
        font-size: 0.28rem;
        color: #fff;
      }
      li.left {
        border-right: 1px solid rgba(255, 255, 255, 0.3);
        padding-left: .3rem
      }
      li.left img.photo {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        border: 1px solid #439aff;
        overflow: hidden;
        vertical-align: middle;
        margin-right: 10px;
      }
      li.left img.ranknum {
        width: auto;
        height: 0.32rem;
        vertical-align: middle;
      }
      li.right {
        display: flex;
        padding-left: 0.4rem;
        div {
          flex: 1;
        }
        div.sy {
          text-align: center;
        }
      }
    }
  }
}  

/* 有排行显示 */
#goldList {
  // padding: 0 0.1rem;
  li {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    background-image: linear-gradient(left, #5778ff, #439aff);
    margin-bottom: 0.1rem;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 0 0 0 0.4rem;
    font-size: 0.28rem;
    color: #fff;
    overflow: hidden;
    animation: rotate 500ms linear;
    .ranks {
      display: inline-block;
      span {
        border-radius: 2px;
        margin-right: 0.1rem;
        display: inline-block;
        width: auto;
        height: 0.36rem;
        line-height: 0.36rem;
        text-align: center;
        padding: 0 .1rem;
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
    #rankhead {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-right: 10px;
    }
    .rankdw {
      width: auto;
      height: 0.32rem;
      border-radius: 0;
    }
    .Profit {
      float: right;
      padding-right: 0.2rem;
      line-height: 0.4rem;
      margin-top: 0.2rem;
      span {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.24rem;
        display: block;
        text-align: right;
      }
    }
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
  margin: 1.5rem 0 0;
  text-align: center;
  color: #779ec2;
  width: 100%;
  img {
    width: 1.36rem;
    height: 1.24rem;
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
</style>
    
