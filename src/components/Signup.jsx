import React, { useState } from 'react'
import {TextField, Paper} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';

const Signup = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({name:'', email:'', password:''});
    const [loading, setLoading] = useState(false);

    const handleChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://daily-diary-backend.vercel.app/api/v1/auth/registeruser", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
            });
            const json = await response.json();
            if (json.success) {
              localStorage.setItem('token', json.authToken);
              navigate("/");
              toast.success('Registration successful!');
              setLoading(false);
            } else {
              toast.error('Improper credenttials');
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
            <h1 className='login-headertext'>Sign-Up</h1>
            <Paper sx={{padding:"2rem"}}>
                <form>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.name} name = 'name' type = 'name' label='Full Name' color='secondary' fullWidth required/>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.email} name = 'email' type = 'email' label='Registered Email-ID' color='secondary' fullWidth required/>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.password} helperText='Minimum 8 characters' name='password' type='password' label='Password' color='secondary' fullWidth required/>
                    <button type="submit" className="btn normal-submit-btn" onClick={handleSubmit}>Sign-Up</button>
                </form>
                <p className='login-info'>Existing user ? <Link to={'/login'}>Login here</Link></p>
            </Paper>
        </div>
    </div>
  )
}

export default Signup
