import React, { useState } from 'react';
import './Login.css';
import {TextField, Paper} from '@mui/material';
import {useNavigate } from 'react-router-dom';
import  toast  from 'react-hot-toast';
import Loader from './Loader';
import HomeIcon from '@mui/icons-material/Home';

const ChangePassword = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({password:'', newPassword:''});
    const [loading, setLoading] = useState(false);

    const navigateHome = () => {
        navigate('/');
      };
    const handleChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://daily-diary-backend.vercel.app/api/v1/auth/changepassword", {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
              },
              body: JSON.stringify({password: credentials.password, newPassword: credentials.newPassword})
            });
            const json = await response.json();
            if (json.status) {
              navigate("/");
              toast.success('Password changed successfully.');
              setLoading(false);
            } else {
              toast.error('Password did not match!');
              navigate('/changepassword')
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
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <HomeIcon onClick={navigateHome} sx={{ color: '#fff', fontSize: '2rem' }}></HomeIcon>
            </div>
            <p className='basic-intro' style={{paddingTop: '2rem'}}>Change Password</p>
        </div>
        <div className='sub-box'>
            <Paper sx={{padding:"2rem"}}>
                <form>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.password} name = 'password' type = 'password' label='Enter old password' color='secondary' fullWidth required/>
                    <TextField size='small' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.newPassword} name='newPassword' type='password' label='Enter new password' color='secondary' fullWidth required/>
                    <button type="submit" className="btn normal-submit-btn" onClick={handleSubmit}>Change Password</button>
                </form>
            </Paper>
        </div>
    </div>
  )
}

export default ChangePassword
