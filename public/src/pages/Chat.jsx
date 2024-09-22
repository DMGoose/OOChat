import React,{useState, useEffect, useRef} from 'react';
import styled from "styled-components"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from "../components/Contacts"
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";

function Chat() {

    const socket = useRef();

    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);


    // 检查是否已经登录, 没登陆就去登, 登录了就保存到CurrentUser
    useEffect(()=>{
        async function checkIfLoginOrNot(){
            //如果没登陆, 就去登录
            if(!localStorage.getItem('oochat-app-user')){
                navigate("/login")
            }else{
                //如果已经登陆了
                setCurrentUser(await JSON.parse(localStorage.getItem('oochat-app-user')));
                setIsLoaded(true);
            }
        }
        checkIfLoginOrNot();
    },[])


    useEffect(()=>{
        if(currentUser){
            socket.current = io(host);
            //只要current user login, 就把currentUser_id传递到 后端的gloabl map
            socket.current.emit("add-user",currentUser._id);
        }
    },[currentUser])


    //如果用户登录了并设置了头像，加载用户数据
    //保存currentUser到contacts里面, 如果currentUser发生改变, 那么我们就执行这个
    useEffect( ()=>{
        async function saveCurrentUserToContacts(){
            if(currentUser){
                //currentUser有头像, 去数据库拿user数据(这里是data), 然后放到contacts数组里面
                if(currentUser.isAvatarImageSet){
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    console.log("allUserRoute去数据库查询返回来的data",data)
                    setContacts(data.data);
                }else{
                    //没设置头像, 去设置
                    navigate("/setAvatar")
                }
            }
        }
        saveCurrentUserToContacts();
    },[currentUser])

    //点击contacts组件的时候， 就会在contacts组件里 设置currentChat是哪个
    //传给 contacts组件 的方法, 用于点击的时候, 会change current chat, 就是切换为另一个chat(contact)对象
    const handleChatChange = (chat) =>{
        setCurrentChat(chat);
    }


    return (
    <Container>
        <div className="container">
            <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
            {
                isLoaded && currentChat === undefined ? 
                (<Welcome currentUser={currentUser}/>) : 
                (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
            }

            
        </div>
        <div className="chat-messages"></div>
        <div className="chat-input"></div>
    </Container>
)}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;