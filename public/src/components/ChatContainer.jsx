import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components"
import Logout from './Logout';
import ChatInput from './ChatInput';
import Messages from './Messages';
import axios from "axios";
import { sendMessageRoute, getAllMessageRoute } from "../utils/APIRoutes";
import {v4 as uuidv4} from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {

    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });

        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        })

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {  //如果不是undefined
            socket.current.on("msg-receive", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            })
        }
    }, [])


    //this will run everytime when there is a new arrival message
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
        //it will scroll into the view the new messages, so it will have an animation effect
    }, [messages])

    //只要currentChat一改变, 那么就去发请求去后端获取messages, 然后遍历展示出来
    useEffect(() => {
        async function setMessagesWhenChatChange() {
            if (currentChat) {
                const response = await axios.post(getAllMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            }
            setMessagesWhenChatChange();
        }
    }, [currentChat])

    return (
        <>
            {
                currentChat && (
                    <Container>
                        <div className="chat-header">
                            <div className="user-details">
                                <div className="avatar">
                                    <img
                                        src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                        alt=""
                                    />
                                </div>
                                <div className="username">
                                    <h3>{currentChat.username}</h3>
                                </div>
                            </div>
                            <Logout />
                        </div>
                        <div className="chat-messages">
                            {
                                messages.map((message) => {
                                    return (
                                        <div ref={scrollRef} key={uuidv4()}>
                                            <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                                                <div className="content">
                                                    <p>
                                                        {message.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Messages />
                        <ChatInput handleSendMsg={handleSendMsg} />
                    </Container>
                )
            }

        </>

    );
}

const Container = styled.div`
padding-top: 1rem;
.chat-header{
display:flex;
justify-content:space-between;
align-items:center;
padding: 0 2rem;
.user-details{
    display:flex;
    align-items:center;
    gap:1rem;
    .avatar{
    img{
        height: 3rem;
        }
    }
    .username{
        h3{
            color: white;
        }
    }
}
}
 .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }

`;

export default ChatContainer;