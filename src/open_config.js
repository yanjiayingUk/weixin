const titbit = require('titbit');
const crypto = require('crypto');

var app = new titbit();

var {router} = app;

router.get('/wx/msg', async c => {
    var token = 'jiulanyouji';

    var urlargs = [
        c.query.nonce,
        c.query.timestamp,
        token
    ];

    urlargs.sort();  //字典排序

    var onestr = urlargs.join(''); //拼接成字符串
    
	//生成sha1签名字符串
    var hash = crypto.createHash('sha1');
    var sign = hash.update(onestr);
		
    if (c.query.signature === sign.digest('hex')) {
        c.res.body = c.query.echostr;
    }
});

router.post('/wx/msg',async c=>{
    try{
        let data=await new Prommise((rv,rj)=>{
            xmlparse(c.bosy,{explicitArray:false},(err,result)=>{
                if(err){
                    rj(err);
                }
                else{
                    rv(result.xml);
                }
            })
        })
        //如果不是文本消息则直接返回
        if(data.MsgType!=='text'){
            return ;
        }
        //按照公众平台开发文档格式化消息字符串
        let retText=`
        <xml>
            <FromUserName>${data.ToUserName}</FromUserName>
            <ToUserName>${data.FromUserName}</ToUserName>
            <MsgType><![CDATA[text]]>{</MsgType>
            <Content>${data.Content}</Content>
            <CreateTime>${parseInt(Date.now()/1000)}</CreateTime>
        </xml>
        `;
        c.res.body=retText;//返回消息
    }
    catch(err){
        console.log(err);
    }
})

app.run(8003, 'localhost');
