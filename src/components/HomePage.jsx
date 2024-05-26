import React, { useEffect, useState } from 'react';
import { Paper, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(()=>{
    try{
      if (!localStorage.getItem("token"))navigate('/login')
    }catch(error){
      console.error("Error fetching data:", error);
    }
  })
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      if(today === formattedDate)navigate('/createentry')
      else navigate(`/diaryentry/${formattedDate}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logout successful');
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {
    navigate('/changepassword');
    setAnchorEl(null);
  };

  const handleDeleteAccount = () => {
    navigate('/deleteaccount')
    setAnchorEl(null);
  };

  const shouldDisableDate = (date) => {
    return date.isAfter(dayjs(), 'day');
  };

  const handleTodayEntry = () =>{
    navigate('/createentry')
  }
  return (
    <div className='main-login-div'>
        <div className='today-post-box'>
        <Paper sx={{ padding: '1rem'}}>
          <div className='inner-today-post-info'>
            <Typography sx={{ fontFamily: 'Sacramento', marginRight: '20px', fontWeight: 'bold', fontSize: '1.5rem' }}>
              Write/View Today's Diary Entry
            </Typography>
            <button className='btn btn-warning btn-sm' onClick={handleTodayEntry}>Write Diary</button>
          </div>
        </Paper>
        </div>
        <div className='home-icon-div'>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{color:'#fff'}}/>
          </IconButton>
          <IconButton color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon sx={{color:'#fff'}}/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
            <MenuItem onClick={handleDeleteAccount}>Delete Account</MenuItem>
          </Menu>
        </div>
      <div className='date-box'>
        <Paper>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
              sx={{
                '& .MuiPickersDay-root': {
                  color: '#062400',
                  fontWeight: 'bold',
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#437512',
                  color: '#ffffff',
                },
                '& .MuiPickersDay-root.Mui-selected.Mui-focusVisible': {
                  backgroundColor: '#437512',
                  color: '#ffffff',
                },
                '& .MuiPickersDay-root.Mui-selected:focus': {
                  backgroundColor: '#437512',
                  color: '#ffffff',
                },
                '& .MuiPickersDay-root:hover': {
                  backgroundColor: '#C3DA8C',
                },
                '& .MuiPickersDay-root.Mui-focusVisible': {
                  backgroundColor: '#437512',
                  color: '#ffffff',
                },
                '& .MuiPickersDay-root:focus': {
                  backgroundColor: '#437512',
                  color: '#ffffff',
                },
              }}
            />
            <Typography sx={{ fontFamily: 'Handlee', fontSize: '15px', padding: '0px 0px 10px 10px' }}>
              * Click on date to view your diary entry on that date
            </Typography>
          </LocalizationProvider>
        </Paper>
      </div>
      <div style={{height: '100px', width: '50vw'}}>
      </div>
    </div>
  );
};

export default HomePage;
