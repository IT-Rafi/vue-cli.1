<template>
    <div class='modalDiv'>
        <!-- 遮罩层 -->
        <div class="maskCell"></div>
        <div class='modalCon'>
            <span v-if='closeBtn' class='close' @click='closeModal'></span>
            <div class='warnDiv'>
                <p class='warnTxt'>{{title}}</p>
                <div v-if='canInput' class='inputOutter'>
                    <div class='inputDiv' :class="[isFocus?'hasFocus':'',inputError==''?'':'hasError']">
                        <input type="number" v-model='openNum' placeholder="请输入数量" @focus='isFocus=true' @blur='isFocus=false'><span><span class='wan'>万</span> 预选赛资金</span>
                    </div>
                </div>
                <p class='inputError' v-if='canInput'>{{inputError}}</p>
                <p class='warnCon' :class="[canInput?'smallSize':'']">{{modalMsg}}</p>
            </div>
            <div class='operateDiv'>
                <p v-if='btnObj.geted' class='geted' @click='closeModal'></p>
                <p v-if='btnObj.openA' class='openA' @click='confirm'></p>
                <p v-if='btnObj.doMiss' class='doMiss' @click='doMiss'></p>
                <p v-if='btnObj.cfml' class='cfm-l' @click='confirm'></p>
                <p v-if='btnObj.cfmsCancle' class='cfms-cancle'>
                    <span class='cancle' @click='closeModal'></span>
                    <span class='confirm' @click='confirm'></span>
                </p>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    props: {
        modalMsg: { type: String, required: true },
        btnObj: { type: Object, required: true },
        closeBtn: { type: Boolean, required: false, default: false },
        cfmOperate: { type: String, required: true },
        canInput: { type: Boolean, required: false, default: false },
        title: { type: String, required: false, default: '提醒' },
        level: { type: Number, required: false, default: 1 }
    },
    data() {
        return {
            openNum: null,
            inputError: '',
            isValid: false,
            regExp: /^[1-9]\d*$/,
            isFocus: false
        }
    },
    watch: {
        openNum(newVal, oldVal) {
            if (newVal === null || newVal === undefined || newVal === '' || newVal === '0') {
                this.inputError = '输入不能为空或0';
            } else if (!this.regExp.test(newVal)) {
                this.inputError = '请输入首位不为0的正整数';
            } else if (Number(newVal) > this.level) {
                this.inputError = '您最多只能启用' + this.level + '万金币';
            } else {
                this.inputError = '';
                this.openNum = Number(newVal);
                this.isValid = true;
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        confirm() {
            if (this.cfmOperate == 'openA') {
                this.$emit('openActual');
            } else if (this.cfmOperate == 'openM') {
                if (this.canInput) {
                    if (this.isValid) {
                        this.$emit('openMimic', this.openNum * 10000);
                    }
                } else {
                    if (this.level == -1) {
                        this.$emit('openMimic', 5000);

                    } else {
                        this.$emit('openMimic', 10000);

                    }
                }

            } else if (this.cfmOperate == 'confirmOpenA') {
                this.$emit('confirmOpenActual');
            } else {
                this.$emit('closeModal');
            }
        },
        doMiss() {
            this.$emit('doMission');
        },

    }
}
</script>
<style lang='less'>
.modalDiv {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    .maskCell {
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        z-index: 10;
        position: fixed;
        top: 0px;
        left: 0px;
    }
    .modalCon {
        width: 6.4rem;
        height: 4.2rem;
        background: #FFFFFF;
        border-radius: .12rem;
        position: absolute;
        margin: auto;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        .close {
            background-image: url(../../images/close-new2.png);
            display: inline-block;
            width: .64rem;
            height: .64rem;
            background-size: .64rem .64rem;
            position: absolute;
            right: -.32rem;
            top: -.32rem;
        }
        .warnDiv {
            font-family: PingFangSC-Regular;
            font-size: .32rem;
            .warnTxt {
                height: 1.2rem;
                text-align: center;
                line-height: 1.4rem;
                color: #333;
            }
            .warnCon {
                width: 5.6rem;
                height: 1.6rem;
                color: #666666;
                margin: 0 auto;
                line-height: .52rem;
            }
            .inputError {
                margin: .14rem auto 0 auto;
                color: #FF5A58;
                /*height: .4rem;*/
                /*line-height: .4rem;*/
                font-size: .28rem;
                width: 5.6rem;
                letter-spacing: .02rem;
            }
            .inputOutter {
                width: 5.6rem;
                margin: 0 auto;
                height: .9rem;
            }
            .inputDiv {
                width: 5.6rem;
                height: .8rem;
                line-height: .8rem;
                font-size: .28rem;
                background: #DCF4FF;
                box-shadow: inset .02rem .02rem .02rem 0 rgba(184, 214, 255, 0.40);
                border-radius: .08rem;
                input {
                    background: #DCF4FF;
                    padding-left: .2rem;
                    font-size: .32rem;
                    border: none;
                    height: .72rem;
                    line-height: .72rem;
                    letter-spacing: .02rem;
                    width: 3.5rem;
                    margin: .04rem;
                }
                .wan {
                    color: #FF5A58;
                    font-size: .32rem;
                    font-weight: bolder;
                }
            }
            .hasFocus {
                border: #54B0E2 solid .03rem;
                box-sizing: content-box;
            }
            .hasError {
                border: #FF5A58 solid .03rem !important;
                box-sizing: content-box;
                background: rgba(255, 90, 88, 0.1) !important;

                input {
                    background: rgba(255, 90, 88, 0) !important;
                }
            }
            .smallSize {
                font-size: .28rem;
                height: 1rem;
                line-height: .4rem;
                margin-top: .16rem;
            }
        }
        .operateDiv {
            height: 1.4rem;
            padding: .25rem .2rem;
            background: #F2F2F2;
            border-radius: 0 0 6px 6px;
            .geted, .doMiss, .openA, .cfm-l {
                width: 3.6rem;
                height: .96rem;
                background-size: 3.6rem .96rem;
                background-image: url(../../images/knowBtn2.png);
                margin: 0 auto;
            }
            .doMiss {
                background-image: url(../../images/doMission2.png)
            }
            .openA {
                background-image: url(../../images/useActual2.png);
            }
            .cfm-l {
                background-image: url(../../images/confirm-l2.png);
            }
            .cfms-cancle {
                width: 5.6rem;
                height: .96rem;
                margin: 0 auto;
                .cancle, .confirm {
                    float: left;
                    width: 2.75rem;
                    height: .96rem;
                    background-size: 2.75rem .96rem;
                    background-image: url(../../images/cancel2.png);
                }
                .confirm {
                    float: right;
                    background-image: url(../../images/confirm-h2.png);
                }
            }
        }
    }
}
</style>