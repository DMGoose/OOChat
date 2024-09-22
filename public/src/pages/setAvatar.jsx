import React,{ useState, useEffect } from 'react';
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import loader from "../assets/loader.gif"
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes"
import {Buffer} from "buffer"


function SetAvatar() {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);


    //toastOptions: 和 validation 相关的参数
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true, 
        draggable: true,
        theme: "dark",
    }


    //设置头像的逻辑
    const setProfilePicture = async () => {
        const storedUser = localStorage.getItem('oochat-app-user');
        if (!storedUser) {
            toast.error("User not found. Please log in again.", toastOptions);
            navigate("/login");  // 重定向到登录页面
            return;
        }

        const user = await JSON.parse(localStorage.getItem('oochat-app-user'));

        if(selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        }else{

            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            })

            console.log("axios发请求给setAvatar返回来的data",data)

            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('oochat-app-user', JSON.stringify(user));
                navigate('/');
            }else{
                toast.error("Error setting avatar, please try again");
            }
        }
    }

    //调用api, 并给setAvatar设置值
    useEffect(()=>{
        
        //持久化
        if(!localStorage.getItem('oochat-app-user')){
            navigate("/")
        }

        async function getAvatarAPI(){
            const data = [];
            for(let i = 0; i < 4; i++){
                const image = await axios.get(`${api}/${Math.round(Math.random()*1000)}`);
                console.log("Image:", image);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        }
        getAvatarAPI();
    },[])

    return(
    <>
    {
        isLoading? <Container><img src={loader} alt="loader" className='loader'/> </Container> : 
            (<Container>
        <div className="title-container">
            <h1>
                Pick an avatar as your profile picture
            </h1>
        </div>

        <div className="avatars">
            {avatars.map((avatar,index)=>{
                return(
                    <div key={index} className={`avatar ${selectedAvatar === index? "selected" : ""}`}>
                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelectedAvatar(index)}/>
                    </div>
                )
            })}
        </div>
        <button className='submit-btn' onClick={()=>setProfilePicture()}>Set as Profile Picture</button>
    </Container>
    )
    }
    
    <ToastContainer />
    </>
) 
}


const Container = styled.div`
    display:flex;

    flex-direction:column;

    height :100vh;
    width: 100wh;
    display: flex;
    justify-content : center;
    gap : 3rem;
    align-items : center;
    background-color: #131324;

    .loader{
        max-inline-size:100%;
    }
    .title-container{
        h1{
            color: white;
        }
    }
        
    .avatars{
        display:flex;
        gap:2rem;
        .avatar{
            border:0.4rem solid transparent;
            padding:0.4rem;
            border-radius:5rem;
            justify-content:center;
            align-items: center;
            transition: 0.2s ease-in-out;
            img{
                height:6rem;
            }
        }
        .selected{
            border:0.4rem solid #4e0eff;
        }
        
        
    }
    .submit-btn{
        background-color: #4e0eff;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        &:hover {
            background-color: #4e0eff;
        }
    }
`


export default SetAvatar;