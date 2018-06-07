if (process.env.NODE_ENV === 'production') {
    // 接口生产地址
    var urlEnv = 'https://api-stockmatch.hexun.com';
    var callwxEnv = 'https://callwx.hexun.com';
    var callvipEnv = 'https://callvip.hexun.com';
    var mimicEnv = 'https://mimicmatch.hexun.com'
} else {
    // 接口测试地址
    var urlEnv = 'https://test-stockmatch.hexun.com';
    var callwxEnv = 'https://test-callwx.hexun.com';
    var callvipEnv = 'https://test-callvip.hexun.com';
    var mimicEnv = 'https://test-mimicmatch.hexun.com'
}
const urlConfig = {
    //首页接口
    domain: urlEnv.replace(/api-/, ''),
    mimicEnv: mimicEnv,
    whiteList: `${urlEnv}/api/experience/existHexunId`,
    queryMimic: `${urlEnv}/api/redis/persionyieldRate`,
    queryMimicRT: `${urlEnv}/api/validAccount/query`, //实时查表来判断是否有在期模拟盘，redis有延迟
    regMimic: `${urlEnv}/api/account/regAccount`,
    mimicInfo: `${urlEnv}/api/front/income/account/get_total_info`,
    actualInfo: `${urlEnv}/api/front/income/account/get_real_report_info`,
    actualRate: `${urlEnv}/api/realAssets/query`,
    queryActual: `${urlEnv}/api/front/income/account/valid/real_account`,
    regActual: `${urlEnv}/api/front/income/comfirm/approval`,
    withdraw: `${urlEnv}/api/front/income/apply/cash`,
    addCookie: 'https://wizard-stock.hexun.com/ucenter/addcookie.aspx',
    getMimicRecord: `${urlEnv}/api/front/income/account/get_detail_info`,
    getActualRecord: `${urlEnv}/api/realAccount/detail`,
    checkLogin: 'https://regtool.hexun.com/wapreg/checklogin.aspx?format=json&encode=no',
    getRecord: `${urlEnv}/api/redis/transactionStockCodeData`,
    stockMarket: 'https://hqwiapi.hexun.com/a/quotelist',
    honerList: `${urlEnv}/api/redis/previousHonourYieldRate`,
    chickenList: `${urlEnv}/api/redis/yieldRate`,
    transTime: `${urlEnv}/api/redis/isTransaction`,
    coinNum: `${callwxEnv}/share/api/gold_sum?user_id=`,
    queryBalance: `${callvipEnv}/payapi/service?service=query_balance`,
    getWXTXurl: `${callvipEnv}/jsapi/wxtx/getWXtxUrl`,
    awardNew: `${urlEnv}/api/gold/operUser`,
    userInfo: `${callwxEnv}/share/open_api/load_user_info?user_id=`,
    queryRank: `${urlEnv}/api/account/rank/info?hexunId=`,
    //ranklingList
    oneyieldRate:`${urlEnv}/api/redis/oneyieldRate`,
    previousyieldRate:`${urlEnv}/api/redis/previousyieldRate`,
    oldYieldRate:`${urlEnv}/api/redis/oldYieldRate?`,//往期详情
    previousyieldRate:`${urlEnv}/api/redis/previousyieldRate?`,//往期排行
    usermsg:`${callvipEnv}/share/open_api/load_user_info?`,
    getMyStockCodeRealList:`${urlEnv}/api/real/redis/getMyStockCodeRealList?`,//历史战绩
    getMyStockCodeList:`${urlEnv}/api/redis/getMyStockCodeList?`,//历史战绩
    rankInfo:`${urlEnv}/api/account/rank/info?`,//段位
    userInfos:`${urlEnv}/api/account/rank/userInfo?`,//我的排名
    rankList:`${urlEnv}/api/account/rank/redis/rankingList?`//排行榜列表
    //其他页面

}
export default urlConfig