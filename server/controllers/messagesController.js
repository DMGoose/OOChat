const messageModel = require("../model/messageModel");

module.exports.addMessage= async (req,res,next) =>{
    //add message into the database
    try{
        const{from, to, message} = req.body;
        //如果有消息, 就在database创建这个data object
        const data = await messageModel.create({
            message: {text:message},
            users:[from,to],
            sender: from,
        });
        if(data){
            return res.json({msg:"Message added successfully"})
        }
        return res.json({msg:"Failed to add Message into database"}) ;
    }
    catch(err){
        next(err);
    }
}

module.exports.getAllMessage= async (req,res,next) =>{
    try{
        //从数据库里拿出所有的message
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all:[to,from],
            },
        }).sort({updateAt:1})
        const projectMessages = messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectMessages);
    }
    catch(err){
        next(err);
    }
}



