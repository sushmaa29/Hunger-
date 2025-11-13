import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/storeContext'
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {

    const {url,setToken}=useContext(StoreContext);

    const [currState, setCurrState] = useState("Sign Up");
    const [data,setData]=useState({
        name:"",
        email:"",
        password:""
    });

    const onChahgeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value;
        setData(data=>({...data,[name]:value}));
    }

    // useEffect(()=>{console.log(data)},[data]);

    const onLogin=async(event)=>{
        event.preventDefault();

        let newUrl=url;

        if(currState==="Login"){
            newUrl+="/api/user/login";
        }
        else{
            newUrl+='/api/user/register';
        }



        const response=await axios.post(newUrl,data);

        if(response.data.success){
            // if successful then we will get a token form the response which we have send form the backen 
            // to save the token we will create one state variable to save the token 
            setToken(response.data.token);
            
            // we will store the token in our local storage
            localStorage.setItem("token",response.data.token);
            setShowLogin(false);
        }
        else{
            alert(response.data.message);
        }
    }


    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input  name='name' value={data.name} onChange={onChahgeHandler} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' value={data.email} onChange={onChahgeHandler}  type="email" placeholder='Your email' />
                    <input name='password' value={data.password} onChange={onChahgeHandler}  type="password" placeholder='Password' required />
                </div>
                <button type='submit'>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
