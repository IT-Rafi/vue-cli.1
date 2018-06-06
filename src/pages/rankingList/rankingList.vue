
<template>
    <div id="container">
        <div class="phhead">
            <div class="phstatus">
                <ul>
                    <li class="phstatus_left">
                        <span>{{users.periods}}期</span><b :class="users.proceed==1?'':'gray'">{{users.proceed==1?'进行中':'已结束'}}</b>
                        <p>{{users.startDate}}至{{users.endDate}}</p>
                    </li>
                    <li class="phstatus_right">
                        <span>更新时间</span>
                        <p>{{users.updateTime}}</p>
                    </li>
                </ul>
            </div>
            <div class="phusermsg">
                <ul>
                    <li class="left">
                        <img class="photo" :src="users.logoUrl" alt=""><span>{{users.nickName}}</span><img v-if="users.userRank!=-2" class="ranknum" :src='"../../images/level"+users.userRank+".png"' alt="">
                    </li>
                    <li class="right">
                        <div>
                            <span>当前排名</span>
                            <p>收益率</p>
                        </div>
                        <div class="sy">
                            <span>{{users.rank}}</span>
                            <p :class="users.rate<0?'green':''">{{users.rate}}%</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div id="dd"><img src="../../images/dd.png" alt=""></div>
        <ul v-if="isshow" id="rankList">
            <li v-for="(item, index) in listData" :class="index<=2?'active':''">
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
            <h3>虚位以待</h3>
            <p>暂无人上榜，快去交易打榜吧</p>
            <div  @click="goenter">去交易</div>
        </div>
        <div class="seize"></div>
        <div class="wqph" @click="prevhref"><img src="../../images/lookwq.png" alt=""></div>

        <span @click="reset" class="sx">
            <img src="../../images/icon_sx.png" alt="刷新按钮">
        </span>
        <p id="loading">
            <img src="../../images/loading.gif" alt="">
        </p>
        <div class='mask hide'></div>
        <section class="mess suc-tc tx-tc hide">
            <div class="txt-c">
                <p class='suc-text c-fff'></p>
            </div>
        </section>
        <modalComponent v-if='modalShow' :modalMsg='modalMsg' :btnObj='btnObj' :closeBtn='closeBtn' :cfmOperate="cfmOperate" :title='modalTitle' :canInput='modalHasInput' :level='userLevel' @closeModal='closeModal' @openMimic='openMimic' @openActual='openActual' @confirmOpenActual='confirmOpenActual' @doMission='doMission'></modalComponent>
    </div>
</template>    
    <script>
    import urlConfig from '../../api/index.js'
    import modalComponent from './modalComponent.vue'
    export default {
        components: {
            modalComponent: modalComponent
        },
        data: function () {
            return {
                users: {userRank:-2},
                isprev: true,
                listData: [],
                isshow: true,
                modalShow:false,
                modalMsg: '',
                btnObj: {},
                modalTitle: '',
                modalHasInput: false,
                userLevel: -2,
                cfmOperate: "", //openM,close
                closeBtn: null,
                coinNum:0
            }
        },
        mounted: function () {
            $("#loading").show()
        },
        created(){
            var hxid = this.getUrlParam("hxid");
            this.isMp = this.Util.common.getQueryString('isMp');
            if (this.isMp == 'true') {
                dplus_Click("页面浏览", 
                {   "产品分类": "股神争霸",
                     "PLATFORM": "MINIAPP",
                     "页面名称":"股神争霸—实时排行榜", 
                     "所属平台":"微信小程序"
                });
            }
            if (hxid) {
                this.userid = hxid;
            } else {
                this.userid = ""
            }
            this.getUsermage();
            // this.getPrev();
            this.getRanklist()
            this.getCoinNum(this.userid)
            // this.validMimicAccount(this.userid)
        },
        methods: {
            getUsermage: function () {
                var that = this;
                $.ajax({
                    type: "post",
                    url: urlConfig.oneyieldRate+"?hexunId=" + that.userid,
                    dataType: "jsonp",
                    success: function (data) {
                        console.log(data);
                        if (data.resultKey == "ok" && data.data.oneyieldRate != "") {
                            console.log(data.data.oneyieldRate[0]);
                            that.users = data.data.oneyieldRate[0];
                            if(that.getByteLen(that.users.nickName)>14){
                                that.users.nickName=that.users.nickName.substring(0,5)+"...";
                            }
                            that.users.updateTime = that.users.updateTime.split(" ")[0];
                            that.users.startDate = that.users.startDate.substring(5);
                            that.users.endDate = that.users.endDate.substring(5);
                            if (that.users.rate == "") {
                                that.users.rate = "--"
                            } else {
                                that.users.rate = that.toDecimal(that.users.rate)
                            }
                            if (that.users.rank == "") {
                                that.users.rank = "--"
                            }
                        }
                    }
                });
            },
            goenter: function () {
                dplus_Click("点击事件", 
                {   "产品分类": "股神争霸",
                     "PLATFORM": "MINIAPP",
                     "所属平台":"微信小程序",
                     "事件功能":"去交易",
                     "类型":"互动"
                });
                this.confirmOpenMimic()
            },
            prevhref: function () {
                dplus_Click("点击事件", 
                {   "产品分类": "股神争霸",
                     "PLATFORM": "MINIAPP",
                     "所属平台":"微信小程序",
                     "事件功能":"实时排名-往期排名",
                     "类型":"互动"
                });
                if (this.isMp == 'true') {
                    wx.miniProgram.navigateTo({ url: "/pages/previousRanking/previousRanking?hxid=" + this.userid + "&isMp=true" })
                } else {
                    location.href = urlConfig.domain+"/front/previousRanking.html?hxid=" + this.userid;
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
            // getPrev: function () {
            //     var that = this;
            //     $.ajax({
            //         type: "post",
            //         url: urlConfig.previousyieldRate+"hexunId=" + that.userid + "&pageNO=1",
            //         dataType: "jsonp",
            //         success: function (data) {
            //             //                  console.log(data);
            //             if (data.resultKey == "ok" && data.data.previousyieldrate == "") {
            //                 that.isprev = false;
            //             }
            //         }
            //     });
            // },
            getRanklist: function () {
                var that = this;
                $.ajax({
                    type: "post",
                    url: urlConfig.chickenList+"?hexunId=" + that.userid,
                    dataType: "jsonp",
                    success: function (data) {
                        //                  console.log(data);
                        if (data.resultKey == "ok" && data.data.yieldrate != "") {
                            console.log(data);
                            for(var i=0;i<that.listData.length;i++){
                                if(that.getByteLen(that.listData[i].nickName)>14){
                                    that.listData[i].nickName=that.listData[i].nickName.substring(0,6)+"...";
                                }
                            }
                            that.listData = (data.data.yieldrate).sort(that.sorts("rank"));
                        } else {
                            that.isshow = false
                        }
                        $("#loading").hide()
                    }
                });
            },
            getByteLen:function(str){
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length;
            },
            sorts: function (property) {
                return function (x, y) {
                    var a = x[property],
                        b = y[property];
                    if (isNaN(a)) {
                        return a.localeCompare(b)
                    } else {
                        return a - b
                    }
                }
            },
            reset: function () {
                dplus_Click("点击事件", 
                {   "产品分类": "股神争霸",
                     "PLATFORM": "MINIAPP",
                     "所属平台":"微信小程序",
                     "事件功能":"实时排名-刷新",
                     "类型":"互动"
                });
                this.getRanklist();
                this.getUsermage();
                $("#loading").show()
            },
            persons: function (client_id) {
                if (this.isMp == 'true') {
                    wx.miniProgram.navigateTo({ url: "/pages/personalRecord/personalRecord?userId=" + client_id+","+this.userid + "&isMp=true" })
                } else {
                    location.href = urlConfig.domain+"/front/personalRecord.html?userId=" + client_id+","+this.userid;
                }

            },
            toDecimal: function (x) {
                var f = parseFloat(x);
                if (isNaN(f)) {
                    return "--";
                }
                var f = Math.round(x * 100) / 100;
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
            },
            closeModal() {
                this.modalShow = false;
            },
            //拿到和讯id去获取模拟盘的情况并处理
            openMimic(openNum) {
                this.closeModal();
                $.ajax({
                    url: urlConfig.regMimic + '?hexunId=' + this.userid + '&parAmount=' + openNum,
                    dataType: 'jsonp',
                    success: data => {
                        console.log(data)
                        // debugger
                        if (data.resultKey == 'ok') {
                            if (data.data.account == null) {
                                this.Util.common.msgTip('模拟盘注册接口：未返回account对象');
                                return;
                            }
                            if (data.data.account.isNewUser) {
                                this.showModal('股神争霸新用户您好，30000金币已放入您的钱包，快去预选赛大显身手吧', 'geted');
                                this.coinNum = Number(this.coinNum) + 20000;
                                this.$nextTick(() => {
                                    if (this.coinNum >= 10000) {
                                        $('.progress').width('100%');
                                        $('.coin-icon').css('left', '2.95rem');
                                    } else {
                                        $('.progress').width((this.coinNum / 100).toFixed(2) + '%');
                                        $('.coin-icon').css('left', (3.05 * (Number(this.coinNum).toFixed(2) / 10000) - 0.08) + 'rem');
                                    }
                                })
                            } else {
                                if (this.isMpEnv == 'true') {
                                    wx.miniProgram.navigateTo({ url: '/pages/simulation/simulation?client_id=' + this.userid + '&fund_account=' + data.data.account.accountId })
                                } else {
                                    window.location.href = urlConfig.mimicEnv + '?client_id=' + this.userid + '&fund_account=' + data.data.account.accountId;
                                }
                            }

                        } else {
                            this.Util.common.msgTip('模拟盘注册接口：' + data.errorMessage)
                        }
                    }
                })
            },
            getCoinNum(userid) {
                $.ajax({
                    url: urlConfig.coinNum + userid,
                    dataType: 'jsonp',
                    success: data => {
                        if (data.respCode == 'T') {
                            
                            this.coinNum = Number(data.result.data.toFixed(0));
                            this.$nextTick(() => {
                                console.log(this.coinNum)
                                if (this.coinNum >= 10000) {
                                    $('.progress').width('100%');
                                    $('.coin-icon').css('left', '2.95rem');
                                } else {
                                    $('.progress').width((this.coinNum / 100).toFixed(0) + '%');
                                    $('.coin-icon').css('left', (3.05 * (Number(this.coinNum) / 10000) - 0.08) + 'rem');
                                }
                            })
                        } else {
                            this.Util.common.msgTip('大网金币接口exception')
                        }
                    }
                })
            },
            // validMimicAccount(userid) {
            //     $.ajax({
            //         url: urlConfig.queryMimic + '?hexunId=' + userid,
            //         dataType: 'jsonp',
            //         success: data => {
            //             console.log(data)
            //             //确定接口正常response
            //             if (data.resultKey == 'ok') {
            //                 let res = data.data.persionyieldRate;
            //                 this.nextPeriod = res.periods;
            //                 this.mimicTips = res.isTranstion == 0 ? res.periods.slice(2, 6) + '期即将开赛' : res.periods.slice(2, 6) + '期已开赛';
            //                 this.actualTips = res.isTranstion == 0 ? res.periods.slice(2, 6) + '期即将开赛' : res.periods.slice(2, 6) + '期已开赛';
            //                 if (res.personData.status == 0) {
            //                     //在期，显示模拟盘情况
            //                     this.mimicStatus = 'hasMimic';
            //                     this.mimicObj = res.personData;
            //                 } else if (res.personData.status == 1) {
            //                     //不在期，有战报
            //                     this.mimicStatus = 'report';
            //                     this.mimicReportObj = res.personData;
            //                 } else {
            //                     this.mimicStatus = 'openMimic';

            //                 }
            //             } else {
            //                 //系统错误
            //                 this.Util.common.msgTip('模拟盘非实时查询接口：' + data.errorMessage);
            //             }
            //         },
            //         error: (XMLHttpRequest, textStatus, errorThrown) => {
            //             console.log(textStatus)
            //         }
            //     })
            // },
            confirmOpenMimic() {
                $.ajax({
                    url: urlConfig.queryMimicRT + '?hexunId=' + this.userid,
                    dataType: 'jsonp',
                    success: data => {
                        console.log(data)
                        if (data.resultKey == 'ok') {
                            //判断是否有模拟盘记录
                            if (data.businessKey == 'user_is_null') {
                                this.openMimic(10000);
                            } else {
                                this.userLevel = data.data.fundAccount.rank;
                                //不在期
                                if (data.data.fundAccount.status == 0) {
                                    this.$nextTick(() => {
                                        console.log(this.coinNum)
                                        if (this.coinNum < 10000) {
                                            //金币不足
                                            this.showModal(
                                                '您的金币不足10000，不能参与预选赛，做任务免费得金币', 'doMiss');
                                        } else {
                                            // this.showModal('您将消费10000金币参与' + this.nextPeriod.slice(2, 6) + '期预选赛', 'cfmsCancle', 'openM', false);
                                            //这里去判断段位
                                            if (data.data.fundAccount.rank == -2 || data.data.fundAccount.rank == 1 || data.data.fundAccount.rank == 0 || data.data.fundAccount.rank == -1) {
                                              
                                                let num = data.data.fundAccount.rank == -1 ? '5000' : '10000';
                                                this.showModal('您将消费' + num + '金币参与' + this.nextPeriod.slice(2, 6) + '期预选赛', 'cfmsCancle', 'openM', false);
                                            } else {
                                                this.showModal(
                                                    '您是股神' + data.data.fundAccount.rank + '段，单次预选赛最高可以使用' + data.data.fundAccount.rank + '万金币', 'cfmsCancle', 'openM', false, true, '启用资金');
                                            }
                                        }
                                    })

                                } else {
                                    //在期，跳转模拟盘
                                    if (this.isMpEnv == 'true') {
                                        wx.miniProgram.navigateTo({ url: '/pages/simulation/simulation?client_id=' + this.userid + '&fund_account=' + data.data.fundAccount.accountId })
                                    } else {
                                        window.location.href = urlConfig.mimicEnv + '?client_id=' + this.userid + '&fund_account=' + data.data.fundAccount.accountId;
                                    }
                                }

                            }

                        } else {
                            this.Util.common.msgTip('模拟盘查询接口：' + data.errorMessage);
                        }
                    }
                })


            },
            doMission() {
                this.closeModal();
                if (this.isMpEnv == 'true') {
                    wx.miniProgram.navigateTo({ url: "/pages/InvitingFriends/InvitingFriends?userId=" + this.userid + '&isMp=true' });
                } else {
                    this.Util.common.msgTip('分享赚金币功能只可在小程序使用');
                }

            },
            openActual() {
                this.closeModal();
                $.ajax({
                    url: urlConfig.regActual + '?hexunId=' + this.userid,
                    dataType: 'jsonp',
                    success: data => {
                        if (data.resultKey == 'ok') {
                            this.modalShow = false;
                            this.Util.common.msgTip('审核提交成功');
                        } else {
                            this.modalShow = false;
                            this.Util.common.msgTip('申请审核接口：' + data.errorMessage);
                        }
                    }
                })
            },
            confirmOpenActual() {
                this.showModal(
                    '您将消费' + this.actualNum + '牛币参与锦标赛，审核通过后下一交易日开赛。', 'cfmsCancle', 'openA', false);
            },
            showModal(msg, btn, cfmOperate = 'close', close = true, canInput = false, title = '提醒') {
                let btnArr = btn.split(',');
                this.modalMsg = msg;
                this.btnObj = {};
                this.closeBtn = close;
                this.modalTitle = title;
                this.modalHasInput = canInput;
                this.cfmOperate = cfmOperate;
                btnArr.map(item => {
                    this.btnObj[item] = true;
                })
                this.modalShow = true;
            },
        }
    }
    </script>
    <style lang='less' scoped>
        #container{
            font-size:.28rem;
            box-sizing: border-box;
            background: #d1e8ff;
            min-height: 100%;
        }
        .phhead{
            width: 100%;
            height: 2.4rem;
            background-image:linear-gradient(top,#439AFF,#5778FF);
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
            padding: 0 .2rem;
            .phstatus{
                width: 100%;
                height: 1.2rem;
                border-bottom: 1px dashed rgba(255,255,255,.3);
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
            }
            .phusermsg{
                width: 100%;
                height: 1.2rem;
                ul{
                    display: flex;
                    padding: .2rem 0;
                    box-sizing: border-box;
                    li{
                        flex: 1;
                        font-size: .28rem;
                        color: #fff
                    }
                    li.left{
                        margin-top: .1rem;
                        border-right: 1px solid rgba(255,255,255,.3);
                    }
                    li.left img.photo{
                        width: .6rem;
                        height: .6rem;
                        border-radius: 50%;
                        border: 1px solid #439AFF;
                        overflow: hidden;
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                    li.left img.ranknum{
                        width: auto;
                        height: .32rem;
                        vertical-align: middle;
                    }
                    li.right{
                        display: flex;
                        padding-left: .4rem;
                        div{
                            flex: 1
                        }
                        div.sy{
                            text-align: right;
                        }
                    }
                }
            }
        }
        #dd{
            width: 100%;
            height: 1rem;
            padding: 0 .2rem;
            margin: .2rem 0;
            position: relative;
            img{
                width: 100%;
                height: 1rem;
            }

        }
        .green{
            color: #00FFA2;
        }
        .sx{
            position: fixed;
            bottom: .6rem;
            right: .3rem;;
        }
        .sx img{
            width: .88rem;
            height: .88rem;
        }
        @keyframes rotate {
            0%   { transform: rotateX(-90deg); opacity: 0;}
            100% { transform: rotateX(0deg); opacity: 1;}
        }

        /* 有排行显示 */
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
            margin: 1.5rem 0 0;
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
            p{
                width: 100%;
                font-size: .28rem;
                margin: .1rem 0;
            }
            div{
                width: 1.76rem;
                height: .8rem;
                text-align: center;
                line-height: .8rem;
                font-size: .28rem;
                color: #fff;
                background-image:linear-gradient(top,#439AFF,#5778FF);
                border-radius: 6px;
                margin: 0 auto;
            }
        }
        .seize{
            width: 100%;
            height: 1.2rem;
        }
        .wqph{
            width:100%;
            height: 1.2rem;
            line-height: 1.2rem;
            background:#8E93FF;
            position: fixed;
            bottom: 0;
            left: 0;
            text-align: center;
            img{
                width: 3.56rem;
                height: 1.12rem;
            }
        }
        #loading{
            position: fixed;
            width: 2rem;
            height: 2rem;
            margin: -1rem 0 0 -1rem;
            left: 50%;
            top: 50%;
            background: rgba(0,0,0,.5);
            border-radius: 10px;
            text-align: center;
            line-height: 2.3rem;
        }
        #loading img{
            vertical-align: inherit;
            width: .6rem;
            height: .6rem;
        }

       
        .pt30 {
            padding-top: 0.3rem;
        }
        .ft36 {
            font-size: .36rem;
        }
        .red {
            color: #ee5050;
        }
        .fc_9 {
            color: #999;
        }
        .ft24 {
            font-size: 0.241rem;
        }
        .tx-tc-btn {
            padding: .2rem .3rem;
        }
        .pt20 {
            padding-top: 0.2rem;
        }
        .btn-100 {
            width: 100%;
            height: .8rem;
            line-height: .8rem;
        }
        .btn-red {
            background: #ee5050;
            box-shadow: 0px 2px 5px #ee5050;
            display: inline-block;
            font-size: .28rem;
            cursor: pointer;
            border-radius: 999rem;
            text-align: center;
            color: #fff;
        }

        .error{
            position: absolute;
            width: 80%;
            left: 10%;
            top: 30%;
            text-align: center;
            color: #ee5050;
            background: #fff;
            padding: .2rem;
            box-sizing: border-box;
            border-radius: 5px;
            display:none;
        }
        .mask {
            background: rgba(0, 0, 0, .5);
            width: 100%;
            height: 100%;
            z-index: 19;
            position: fixed;
            top: 0px;
            left: 0px;
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
    
