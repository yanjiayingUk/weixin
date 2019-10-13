const formatMsg=require('./fmtwxmsg.js');
function help(){
    return '你好，这是一个微信测试号，会原样返回用户消息'；
}
//处理用户发过来的消息
//第一个参数是解析后的用户信息
//第二个参数是要返回的消息对象
//基本处理过程：根据用户发过来的消息判断消息类型并进行判断
function userMsg(wxmsg,retmsg){
    //关键词自动回复
    if(wxmsg.MsgType==='text'){
        retmsg.msgtype='text';//设置要返回的消息类型为text
        switch(wxmsg.Content){
            case 'help':
            case '?':
            case '? ':
            case '帮助':
                retmsg.msg=help();
                return formatMsg(retmsg);//格式化消息返回
            case 'about':
                retmsg.msg='我是这个测试号的开发者';
                return formatMsg(retmsg);
            default:
                //非关键字原样返回消息
                retmsg.msg=wxmsg.Content;
                return formatMsg(retmsg);
        }
    }
    //非文本类型的消息处理
    switch(wxmsg.MsgType){
        case 'image':
        case 'voice':
            retmsg.msgtype=wxmsg.MsgType;
            retmsg.msg=wxmsg.MediaId;
            return formatMsg(retmsg);
        default:
            //因为消息类型为空，所以会默认为的文本消息
            //提示类型不被支持
            return formatMsg(retmsg);
    }
}

exports.userMsg = userMsg;
exports.help = help;

exports.msgDispatch = function msgDispatch(wxmsg, retmsg) {
    return userMsg(wxmsg, retmsg);
};