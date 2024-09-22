require("dotenv").config(); // 加载环境变量
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  //used for connect with mongoDB server
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();


app.use(cors()); //允许跨域请求
app.use(express.json()); // // 解析 JSON 请求体

app.use("/api/auth", userRoutes); //以 /api/auth 开头的请求都会使用你定义的路由逻辑
app.use("/api/messages", messagesRoutes); 


//connect to MongoDB
//process 是 Node.js 中的一个全局对象
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

  


const server = app.listen(process.env.PORT, ()=> {
    console.log('Server started on port '+ process.env.PORT);
});

const io = socket(server,{
  cors:{
    origin:"http://localhost:3000",
    credentials: true,
  }
})

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
  //有connection 就 存到 global.chatSocket
  global.chatSocket = socket;
  //只有有user login, 我们establish a socket connection by add user
  socket.on("add-user",(userId)=>{
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);

    if(sendUserSocket){  //if the user is online
      //emit the message  to the user
      socket.to(sendUserSocket).emit("msg-receive",data.message);
    }
    //如果不在线, 先存在database
  })
});
