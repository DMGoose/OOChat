//this is the database model
//模型是操作 MongoDB 数据库的接口，使用 Mongoose 模型，你可以对数据库集合执行 CRUD（创建、读取、更新、删除）操作

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        message: {
            text: {
                type: 'string',
                required: true,
            },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            //mongoose.Schema.Types.ObjectId 是 Mongoose 中的一个类型，用来表示 MongoDB 中的 ObjectId。
            //ObjectId 是 MongoDB 中每条记录的唯一标识符

            ref: "userModel",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

//mongoose.model() 的作用是在 Mongoose 中定义并注册一个模型（model）
module.exports = mongoose.model("messageModel", messageSchema);