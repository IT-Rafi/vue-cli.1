export default {
    install(Vue) {

        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
        // 例子：
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        Date.prototype.Format = function(fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        var commonUtils = {
            getClientHeight: function() {
                var clientHeight = 0;
                if (document.body.clientHeight && document.documentElement.clientHeight) {
                    clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
                } else {
                    clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
                }
                return clientHeight;
            },

            getScrollHeight: function() {
                return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            },

            getScrollTop: function() {
                var scrollTop = 0;
                if (document.documentElement && document.documentElement.scrollTop) {
                    scrollTop = document.documentElement.scrollTop;
                } else if (document.body) {
                    scrollTop = document.body.scrollTop;
                }
                return scrollTop;
            },
            getQueryString: function(name) {
                var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
                if (result == null || result.length < 1) {
                    return "";
                }
                return result[1];
            },


            msgTip: function(msg, duration) {
                $('.suc-text').text(msg);
                $('.mask').removeClass('hide');
                $('.suc-tc').removeClass('hide');

                setTimeout(function() {
                    $('.mask').addClass('hide');
                    $('.tx-tc').addClass('hide');
                }, duration || 2000)
            },
            msgTipNoMask: function(msg, duration) {
                $('.suc-text').text(msg);
                $('.suc-tc').removeClass('hide');

                setTimeout(function() {
                    $('.mask').addClass('hide');
                    $('.tx-tc').addClass('hide');
                }, duration || 2000)
            }
        }
        Vue.prototype.Util = {
            common: commonUtils,
        };
    }
}