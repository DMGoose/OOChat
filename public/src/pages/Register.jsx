import React,{ useState, useEffect } from 'react';
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/logo192.png"
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import {registerRoute} from "../utils/APIRoutes"
function Register() {

    const navigate = useNavigate();

    const [values,setValues] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
    });

    //localstorage持久化, 刷新之后不用重新登陆, 因为就是去看localstorage有没有这个item
    useEffect(()=>{
        if(localStorage.getItem('oochat-app-user')){
            navigate("/")
        }
    },[])

    //toastOptions: 和 validation 相关的参数
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
            console.log("Register Validation passed");
            console.log(registerRoute,"@@@registerRoute");
            const {username,email,password} = values;
            const {data} = await axios.post(registerRoute,{
                username, 
                email, 
                password,
            });
            
            console.log("这是注册返回来的data",data);
            if(data.status === false){ 
                toast.error(data.msg,toastOptions);
            }
            if(data.status === true){
                localStorage.setItem('oochat-app-user', JSON.stringify(data.user)) 
            }
            navigate("/");  //自动跳转到主页
        }
    };

    //handle validation
    const handleValidation = (event) => {
        const {username,email,password,confirmPassword} = values;
        if(password !== confirmPassword){
            toast.error("Password and confirm password should be the same.",toastOptions);
            return false;
        }else if(username.length < 3){
            toast.error("Username should be greater than 3 characters.",toastOptions);
            return false;
        }else if(password.length < 8){
            toast.error("Password should be greater than 8 characters.",toastOptions);
            return false;
        }else if(email === ""){
            toast.error("Email is required.",toastOptions);
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
                    <input type="text" placeholder='Username' name="username" onChange={(e) => handleChange(e)} />
                    <input type="email" placeholder='Email' name="email" onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder='Password' name="password" onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder='Confirm Password' name="confirmPassword" onChange={(e) => handleChange(e)} />
                    <button type="submit">Create Account</button>
                    <span> Already have an account ? <Link to='/login'> Login </Link> </span>

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

export default Register;