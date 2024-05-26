import React, { useState } from 'react'
import {TextField, Paper} from '@mui/material';
import {useNavigate } from 'react-router-dom';
import  toast  from 'react-hot-toast';
import Loader from './Loader';

const ForgotPassword = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({email:''});
    const [loading, setLoading] = useState(false);

    const handleChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://daily-diary-backend.vercel.app/api/v1/auth/forgotpassword", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: credentials.email})
            });
            const json = await response.json();
            if (json.status) {
              navigate("/login");
              toast.success('Mail Sent to this email ID');
              setLoading(false);
            } else {
              toast.error('Email ID is not registered');
              navigate('/login')
              setLoading(false);
            }
        } catch (error) {
          console.error('Error:', error);
          toast.error('An error occurred');
        }finally{
          setLoading(false);
        }
    }
    if(loading){
        return <Loader />;
    }
  return (
    <div className='main-login-div'>
        <div className='login-intro-div'>
            <p className='login-page-welcome'>Welcome to DailyDiary</p>
            <p className='basic-intro'>Forgot password?</p>
        </div>
        <div className='sub-box'>
            <Paper sx={{padding:"2rem"}}>
                <form>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.email} helperText='*We will send a random password to your registered email. Use it to login and change your password thereafter. Do check your inbox and spam.' name = 'email' type = 'email' label='Registered Email-ID' color='secondary' fullWidth required/>
                    <button type="submit" className="btn normal-submit-btn" onClick={handleSubmit}>Get Password</button>
                </form>
            </Paper>
        </div>
    </div>
  )
}

export default ForgotPassword
