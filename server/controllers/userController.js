//服务端: 和数据库相关的检查
const userModel = require("../model/userModel.js");
const brcypt = require("bcrypt");

module.exports.register = async (req,res,next) => {
    try{
        const {username,password,email} = req.body;

        //数据库里找找有没有这个username
        const usernameCheck = await userModel.findOne({username});  
        if(usernameCheck){
            return res.json({msg:"Username already used", status: false});
        }

        //数据库里找找有没有这个email
        const emailCheck = await userModel.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already used", status: false});
        }

        //上面两个都没return,说明是新user, 加密password, 创建新用户
        const hashedPassword = await brcypt.hash(password,10);
        const user = await userModel.create({
            email,
            username,
            password: hashedPassword,
        });

        delete user.password;
        return res.json({status: true, user})
    }catch(err) {
        console.error("Error occurred in register function:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}


module.exports.login = async (req,res,next) => {
    try{
        const {username,password} = req.body;

        //数据库里找找有没有这个username
        /*
        {
            _id: new ObjectId('66ed570537ea939fe057ff76'),
            username: 'admin',
            email: 'admin@gmail.com',
            password: '$2b$10$IU0dLKKKQLMnQjawDRiKCucstFvI2I9k.hlw5AKVVMeR5in/BA8mG',
            isAvatarImageSet: false,
            avatarImage: '',
            __v: 0
            } @@usernamecheck
        */
        const usernameCheck = await userModel.findOne({username});  
        console.log(usernameCheck,"@@usernamecheck");
        if(!usernameCheck){
            return res.json({msg:"Incorrect username or password",status: false});
        }

        const isPasswordValid = await brcypt.compare(password, usernameCheck.password);
        if(!isPasswordValid){
            return res.json({msg:"Incorrect username or password",status: false});
        }

        delete usernameCheck.password;
        return res.json({status: true, usernameCheck})

    }catch(err) {
        console.error("Error occurred in register function:", err);
        next(err);

    }
}

module.exports.setAvatar = async (req,res,next) => {
    try{
        //拿到前端发过来的东西
        const userId = req.params.id;
        const avatarImage = req.body.image;
        //去数据库里面找这个 user
        const userData = await userModel.findByIdAndUpdate(userId,{
            isAvatarImageSet: true,
            avatarImage,
        })
        
        //返回数据给前端
        return res.json({
            isSet:userData.isAvatarImageSet,
            image:avatarImage
        })

    }catch(err) {
        console.error("Error occurred in setAvatar function:", err);
        next(err);
    }
}

//查找用户是否存在, 存在就返回这个用户
module.exports.getAllUsers = async (req,res,next) =>{
    try{
        ////下面是一个查询语句
        const users = await userModel.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);     
    }catch(err){
        next(err);
    }
}