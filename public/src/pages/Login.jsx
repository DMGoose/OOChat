import React,{ useState, useEffect } from 'react';
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/logo192.png"
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import {loginRoute} from "../utils/APIRoutes"
function Login() {

    const navigate = useNavigate();

    const [values,setValues] = useState({
        username:"",
        password:"",
    });

    //localstorage持久化, 刷新之后不用重新登陆, 因为就是去看localstorage有没有这个item
    useEffect(()=>{
        if(localStorage.getItem('oochat-app-user')){
            navigate("/")
        }
    },[])

    //和 validation 相关的参数
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true, 
        draggable: true,
        theme: "dark",
    }

    //submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(handleValidation()){  //如果user 通过验证(返回true)
            console.log("Login Validation passed");
            console.log(loginRoute,"@@@loginRoute");
            const {username,password} = values;
            const {data} = await axios.post(loginRoute,{
                username, 
                password,
            });

            //服务端 response 返回一个 res.json({status: true, user}), 就是data
            console.log("这是登录返回来的data",data);
            if(data.status === false){ 
                toast.error(data.msg,toastOptions);
            }
            if(data.status === true){
                localStorage.setItem('oochat-app-user', JSON.stringify(data.usernameCheck))
                navigate("/");  //自动跳转到主页
            }
        }
    };

    //handle validation
    const handleValidation = (event) => {
        const {username,password} = values;
        if(password === ""){
            toast.error("Email and Password is required",toastOptions);
            return false;
        }else if(username.length === ""){
            toast.error("Email and Password is required",toastOptions);
            return false;
        }
        return true;
    }

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    };


    return (
        <div>
            <FormContainer>
                <form onSubmit={(event) => { handleSubmit(event) }}>
                    <div className='brand'>
                        <img src={Logo} alt="Logo" />
                        <h1>OOchat</h1>
                    </div>
                    <input type="text" placeholder='Username' name="username" onChange={(e) => handleChange(e)} min="3"/>
                    <input type="password" placeholder='Password' name="password" onChange={(e) => handleChange(e)} />
                    <button type="submit">Login</button>
                    <span> Don't have an account ? <Link to='/register'> Register </Link> </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </div>
    );
}

//创建一个样式化组件的方式 , ``里面可以写css代码
const FormContainer = styled.div`
    height :100vh;
    width: 100wh;
    display: flex;
    justify-content : center;
    gap : 1rem;
    align-items : center;
    background-color: #131324;
    .brand{
        display:flex;
        align-items : center;
        gap: 1rem;
        justify-content : center;
        img{
            heigh: 5rem;
        }
        h1{
            color: white;
            text-transform: uppercase;
        }
    }
    
    form{
        display: flex;
        flex-direction: column;
        gap:2rem;
        background-color:#00000076;
        border-radius:2rem;
        padding: 3rem 5rem;
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        button {
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
        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

export default Login;