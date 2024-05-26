import React, { useState } from 'react';
import './Login.css';
import {TextField, Paper} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import  toast  from 'react-hot-toast';
import Loader from './Loader';

const Login = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({email:'', password:''});
    const [loading, setLoading] = useState(false);

    const handleChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://daily-diary-backend.vercel.app/api/v1/auth/loginuser", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });
            const json = await response.json();
            if (json.success) {
              localStorage.setItem('token', json.authToken);
              navigate("/");
              toast.success('Logged in successfully!');
              setLoading(false);
            } else {
              toast.error('Invalid credentials');
              setLoading(false);
            }
        } catch (error) {
          console.error('Error:', error);
          toast.error('An error occurred');
        }finally{
          setLoading(false);
        }
    };
    if(loading){
      return <Loader />;
    }
  return (
    <div className='main-login-div'>
        <div className='login-intro-div'>
            <p className='login-page-welcome'>Welcome to DailyDiary</p>
            <p className='basic-intro'>Your personal diary and daily logger.</p>
        </div>
        <div className='sub-box'>
            <h1 className='login-headertext'>Login</h1>
            <Paper sx={{padding:"2rem"}}>
                <form>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.email} name = 'email' type = 'email' label='Registered Email-ID' color='secondary' fullWidth required/>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.password} name='password' type='password' label='Password' color='secondary' fullWidth required/>
                    <button type="submit" className="btn normal-submit-btn" onClick={handleSubmit}>Login</button>
                </form>
                <p className='login-info'>New to DailyDiary ? <Link to={'/signup'}>Sign-up here</Link></p>
                <p style={{fontFamily:'Montserrat', fontSize:'0.9rem', textAlign:'center'}}><Link to={'/forgotpassword'}>Forgot Password</Link></p>
            </Paper>
        </div>
    </div>
  )
}

export default Login;
