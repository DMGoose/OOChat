//this is the database model
//模型是操作 MongoDB 数据库的接口，使用 Mongoose 模型，你可以对数据库集合执行 CRUD（创建、读取、更新、删除）操作

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    isAvatarImageSet: {
      type: Boolean,
      default: false,
    },
    avatarImage: {
      type: String,
      default: "",
    },
  });

//mongoose.model() 的作用是在 Mongoose 中定义并注册一个模型（model）
module.exports = mongoose.model("userModel", userSchema);