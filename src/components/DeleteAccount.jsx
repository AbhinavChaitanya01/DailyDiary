import React, { useState } from 'react'
import {TextField, Paper} from '@mui/material';
import {useNavigate } from 'react-router-dom';
import  toast  from 'react-hot-toast';
import Loader from './Loader';
import HomeIcon from '@mui/icons-material/Home';

const DeleteAccount = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({password:''});
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
            const response = await fetch("https://daily-diary-backend.vercel.app/api/v1/auth/deleteuser", {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
              },
              body: JSON.stringify({ password: credentials.password})
            });
            const json = await response.json();
            if (json.status) {
              navigate("/signup");
              toast.success('Account deleted. Do give us another chance.');
              setLoading(false);
            } else {
              toast.error('Wrong Password!');
              navigate('/')
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
            <p className='basic-intro' style={{paddingTop:'20px'}}>Delete Account</p>
        </div>
        <div className='sub-box'>
            <Paper sx={{padding:"2rem"}}>
                <form>
                    <TextField size='small' color='error' sx={{marginBottom:"2rem"}} onChange={handleChange} value={credentials.password} helperText='* Are you sure you want to delete your account. Remember you shall not be able to retrieve your posts once this is executed.' name = 'password' type = 'password' label='Enter account password' fullWidth required/>
                    <div style={{textAlign:'center'}}>
                        <button type="submit" className="btn btn-danger" onClick={handleSubmit}>Delete Account</button>
                    </div>
                </form>
            </Paper>
        </div>
    </div>
  )
}

export default DeleteAccount
