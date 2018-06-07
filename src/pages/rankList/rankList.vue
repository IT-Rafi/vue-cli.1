
<template>
    <div id="container">
        <div class="phhead">
            <div class="phstatus">
                <ul>
                    <li class="phstatus_right">
                        <span @click="rule"><i>?</i>段位是什么?</span>
                    </li>
                </ul>
            </div>
            <div class="phusermsg">
                <ul>
                    <li class="left">
                        <img class="photo" :src="users.logoUrl" alt=""><span>{{users.nickName}}</span><img v-if="users.rank!=-2" class="ranknum" :src='"../../images/level"+users.rank+".png"' alt="">
                    </li>
                    <li class="right">
                      <div> 
                        <span>当前排名</span>
                      </div>
                      <div class="sy">
                        <span>{{users.num}}</span>
                      </div>
                    </li>
                </ul>
            </div>
        </div>
        <ul v-if="isshow" id="rankList">
            <li v-for="(item, index) in listData">
                <div class="ranks">
                    <span v-if="index==0" class="one">{{index+1}}</span>
                    <span v-else-if="index==1" class="two">{{index+1}}</span>
                    <span v-else-if="index==2" class="three">{{index+1}}</span>
                    <span v-else>{{index+1}}</span>
                </div>
                <img id="rankhead" :src="item.logoUrl" @click="persons(item.hexunId)"  alt=""><span @click="persons(item.hexunId)">{{item.nickName}}</span>
                <img  v-if="item.userRank!=-2"  class="rankdw" :src='"../../images/level"+item.rank+".png"' alt="">
                <div class="Profit"><p>{{item.promotionTime}}</p><span>晋级</span></div>
            </li>
        </ul>
        <div class="norank" v-else>
            <img src="../../images/leaderboard_emptystates1.png" alt="">
            <h3>暂无数据</h3>
        </div>
       </div>
</template>    
    <script>
import urlConfig from "../../api/index.js";
export default {
  data: function() {
    return {
      users: { rank: -2, num: 0 },
      listData: [],
      isshow: true,
      flog: true,
      currentPage: 1
    };
  },
  watch: {
    currentPage: function(newVal) {
      if (newVal) {
        this.getRanklist();
      }
    },
    listData: function(newVla) {
      if (newVla === "") {
        this.isshow = !this.isshow;
      }
    }
  },
  created() {
    var hxid = this.getUrlParam("hxid");
    this.isMp = this.Util.common.getQueryString("isMp");
    if (this.isMp == "true") {
      dplus_Click("页面浏览", {
        产品分类: "股神争霸",
        PLATFORM: "MINIAPP",
        页面名称: "股神争霸—段位榜",
        所属平台: "微信小程序"
      });
    }
    if (hxid) {
      this.userid = hxid;
    } else {
      this.userid = "";
    }
    this.getUsermage();
    this.getRanklist();
    var that = this;
    $(window).scroll(function() {
      if (
        that.Util.common.getScrollTop() + that.Util.common.getClientHeight() ==
        that.Util.common.getScrollHeight()
      ) {
        if (that.flog) {
          that.currentPage++;
        }
      }
    });
  },
  methods: {
    getUsermage: function() {
      var that = this;
      $.ajax({
        type: "get",
        url: urlConfig.userInfos + "hexunId=" + that.userid,
        dataType: "jsonp",
        success: function(data) {
          console.log(data);
          if (data.resultKey == "ok") {
            that.users = data.data.userRankInfo;
            if (that.getByteLen(that.users.nickName) > 14) {
              that.users.nickName = that.users.nickName.substring(0, 5) + "...";
            }
            if (that.users.num == "" || that.users.num == 0) {
              that.users.num = "--";
            } else {
              that.users.num = that.users.num;
            }
            if (that.users.rank === "") {
              that.users.rank = "--";
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
        url: urlConfig.rankList + "pageSize=10&pageNO=" + that.currentPage,
        dataType: "jsonp",
        success: function(data) {
          console.log(data);
          if (data.resultKey == "ok") {
            // console.log(data);

            that.listData = that.listData.concat(data.data.rankingList);
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
.phhead {
  width: 100%;
  background-image: linear-gradient(top, #439aff, #5778ff);
  border-radius: 0 0 5px 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  padding: 0 0.2rem;
  .phstatus {
    width: 100%;
    height: 0.5rem;
    ul {
      overflow: hidden;
      li {
        width: 50%;
        font-size: 0.24rem;
        padding-top: 0.24rem;
        line-height: 0.4rem;
      }
      .phstatus_right {
        text-align: right;
        float: right;
        color: #fff;
        span i {
          display: inline-block;
          width: 0.3rem;
          height: 0.3rem;
          text-align: center;
          line-height: 0.3rem;
          border-radius: 50%;
          background: #fff;
          color: #439aff;
          margin-right: 0.1rem;
        }
      }
    }
  }
  .phusermsg {
    width: 100%;
    height: 1.2rem;
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
        margin-top: 0.1rem;
        border-right: 1px solid rgba(255, 255, 255, 0.3);
      }
      li.left img.photo {
        width: 0.6rem;
        height: 0.6rem;
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
        margin-top: 0.2rem;
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
#rankList {
  padding: 0 0.1rem;
  margin-top: 0.2rem;
  li {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    background-image: linear-gradient(top, #439aff, #5778ff);
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
    background-image: linear-gradient(top, #439aff, #5778ff);
    border-radius: 6px;
    margin: 0 auto;
  }
}
</style>
    
