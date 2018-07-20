<template>
    <div class='footter'>
        <div class='item indexPage' @click='jump("index")'><span :class='[currentPage=="index"?"active itemTxt":"itemTxt"]'>首页</span></div>
        <div class='item rankPage' @click='jump("rank")'><span :class='[currentPage=="rank"?"active itemTxt":"itemTxt"]'>排行</span></div>
        <div class='item matchPage' @click='jump("match")'><span :class='[currentPage=="match"?"active itemTxt":"itemTxt"]'></span></div>
        <div class='item arenaPage' @click='jump("arena")'><span :class='[currentPage=="arena"?"active itemTxt":"itemTxt"]'>擂台</span></div>
        <div class='item myPage' @click='jump("my")'><span :class='[currentPage=="my"?"active itemTxt":"itemTxt"]'>我的</span></div>
    </div>
</template>
<script type="text/javascript">
import urlConfig from '../../api/api.js'

export default {
    data() {
        return {
            currentPage: "",
            userid: '',
            isMpEnv: ''
        }
    },
    created() {
        let condition2 = location.href.indexOf('arena.html') > -1;
        let condition3 = location.href.indexOf('myEarnings.html') > -1;
        let condition4 = location.href.indexOf('match.html') > -1;
        let condition5 = location.href.indexOf('rankentry.html') > -1;
        this.currentPage = condition2 ? 'arena' : condition3 ? 'my' : condition4 ? 'match' : condition5 ? 'rank' : 'index';
        this.isMpEnv = this.getQueryString('isMp');
        this.checkLogin();
    },
    methods: {
        getQueryString(name) {
            let result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },
        checkLogin() {
            $.ajax({
                url: urlConfig.checkLogin,
                dataType: 'jsonp',
                success: data => {
                    if (data.islogin == 'True') {
                        this.userid = data.userid;
                    }
                }
            })
        },
        jump(target) {
            if (this.currentPage == target) {
                console.log(212)
                return;
            }
            switch (target) {
                case 'index':
                    if (this.isMpEnv == 'true') {
                        wx.miniProgram.redirectTo({ url: '/pages/index/index' })
                    } else {
                        window.location.replace(urlConfig.domain + '/front/index.html');
                    }
                    break;
                case 'rank':
                    if (this.isMpEnv == 'true') {
                        wx.miniProgram.redirectTo({
                            url: '/pages/rankentry/rankentry?isMp=true&hxid=' + this.userid
                        });
                    } else {
                        window.location.replace(urlConfig.domain + '/front/rankentry.html?hxid=' + this.userid);
                    }
                    break;
                case 'match':
                    if (this.isMpEnv == 'true') {
                        wx.miniProgram.redirectTo({
                            url: '/pages/match/match?userid=' + this.userid
                        });
                    } else {
                        window.location.replace(urlConfig.domain + '/front/match.html?userid=' + this.userid);
                    }
                    break;
                case 'arena':
                    // this.Util.common.msgTipNoMask('擂台开发中');
                    if (this.isMpEnv == 'true') {
                        wx.miniProgram.redirectTo({
                            url: '/pages/arena/arena?userid=' + this.userid
                        });
                    } else {
                        window.location.replace(urlConfig.domain + '/front/arena.html?userid=' + this.userid);
                    }
                    break;
                case 'my':
                    if (this.isMpEnv == 'true') {
                        wx.miniProgram.redirectTo({ url: '/pages/myEarnings/myEarnings?userid=' + this.userid })
                    } else {
                        window.location.replace(urlConfig.domain + '/front/myEarnings.html?userid=' + this.userid);
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
</script>
<style lang='less'>
.footter {
    position: fixed;
    bottom: 0;
    z-index: 20;
    height: 1.34rem;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    display: -webkit-box;
    background-image: linear-gradient(-180deg, #414CEE 0%, #2356E3 100%);
    background-repeat: no-repeat;
    background-position: 0 .34rem;
    box-shadow: inset 0 0 0 0 rgba(255, 255, 255, 0.30);
    font-size:.24rem !important;
    .item {
        flex: 1;
        -webkit-box-flex:1;
        -webkit-flex:1;
        background-size: .96rem .96rem;
        background-repeat: no-repeat;
        background-position: center 0;
        background-image: url(../../images/index2.png);
        text-align: center;
        .itemTxt {
            color: rgba(255, 255, 255, .5);
            position: relative;
            display: inline-block;
            height: .48rem;
            line-height: .4rem;
            margin-top: .86rem;
        }
        .active {
            color: #F7D400;
        }
        .active:after {
            content: '';
            position: absolute;
            background-image: linear-gradient(-180deg, #FFDF5F 0%, #FF9C28 100%);
            border-radius: 1rem;
            width: .8rem;
            height: .08rem;
            bottom: 0rem;
            left: -.16rem;
        }
    }
    .matchPage {
        background-image: url(../../images/match2.png);
        background-size: 1.12rem 1.2rem;
        .active:after {
            left: -.4rem;
        }
    }
    .arenaPage {
        background-image: url(../../images/arena2.png);
    }
    .rankPage {
        background-image: url(../../images/rank2.png);
    }
    .myPage {
        background-image: url(../../images/my2.png);
    }
}
</style>