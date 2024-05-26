import { Typography, TextField, Box, IconButton, Grid, Button} from '@mui/material';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import './Entry.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import DiaryContext from '../context/DiaryContext';
import Loader from './Loader';
import HomeIcon from '@mui/icons-material/Home';


const CreateEntry = () => {
    let context = useContext(DiaryContext);
  const date  = dayjs().format('YYYY-MM-DD');
  const navigate = useNavigate(); 
  const [entryText, setEntryText] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const maxCharacters = 4000;
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null); 

  const {
    getPostByDate, createPost
  } = context;

  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(!localStorage.getItem('token')){
        navigate('/login');
    }
      const fetchExistingPost = async()=>{
        try{
            const response = await getPostByDate(date);
            if(!(response.length==0))navigate(`/diaryentry/${date}`)
        }catch(error){
            console.error("Some error occured", error);
            toast.error('Some error occured');
        }
      }
      fetchExistingPost();
    },[])
  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    setImage(file);
  };
  const handleCreate = async () => {
    setLoading(true);
    try {
        const images = [];
        if (image1) images.push(image1);
        if (image2) images.push(image2);
        const response = await createPost(date, entryText, images, bgColor);
        if (response.status) {
            toast.success('Diary entry created successfully!');
            navigate(`/diaryentry/${date}`);
        } else {
            toast.error(response.message);
        }
        setLoading(false)
    } catch (error) {
      setLoading(false)
        console.error("Failed to create diary entry:", error);
        toast.error('Failed to create diary entry');
    }
  };

  const handleTextChange = (event) => {
    if (event.target.value.length <= maxCharacters) {
      setEntryText(event.target.value);
    }
  };

  const handleColorChange = (color) => {
    setBgColor(color.hex);
  };

  const handleClickOutside = (event) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  const navigateHome = () => {
    navigate('/');
  };

  if(loading){
    return <Loader/>
  }
  return (
    <div className='main-login-div'>
      <div style={{textAlign: 'center', padding:'10px'}}>
       <HomeIcon onClick={navigateHome} sx={{color: '#fff', fontSize: '2rem'}}></HomeIcon>
      </div>
      <div className='diary-entry-div'>
        <Typography sx={{ fontFamily: 'Handlee', fontSize: '1rem', paddingBottom: '10px', color: '#fff' }}>
          {date}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', color: '#fff' }}>
          <Typography sx={{ fontFamily: 'Handlee', fontSize: '1.2rem', marginRight: 'auto' }}>
            Dear Diary,
          </Typography>
          <IconButton onClick={() => setShowColorPicker(!showColorPicker)} color="inherit">
            <ColorLensIcon />
          </IconButton>
        </Box>
        {showColorPicker && (
          <Box ref={colorPickerRef} sx={{ position: 'absolute', zIndex: 2 }}>
            <SketchPicker color={bgColor} onChangeComplete={handleColorChange} />
          </Box>
        )}
        <TextField
          fullWidth
          multiline
          rows={16}
          value={entryText}
          onChange={handleTextChange}
          placeholder="Write your diary entry here..."
          sx={{
            fontFamily: 'Handlee',
            fontSize: '1.2rem',
            marginBottom: '10px',
            backgroundColor: bgColor,
            borderRadius: '20px',
          }}
        />
        <Typography sx={{ fontFamily: 'Handlee', fontSize: '0.7rem', color: '#fff', marginBottom: '10px' }}>
          {maxCharacters - entryText.length} characters remaining
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {image1 && (
                <img src={URL.createObjectURL(image1)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '20px', marginBottom: '20px' }} />
              )}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-image1"
                type="file"
                onChange={(event) => handleImageUpload(event, setImage1)}
              />
              <label htmlFor="upload-image1">
                <Button variant="contained" component="span" sx={{ backgroundColor: '#fdd835', color: '#000000' }} startIcon={<CloudUploadIcon />}>
                  Upload Image 1
                </Button>
              </label>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {image2 && (
                <img src={URL.createObjectURL(image2)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '20px', marginBottom: '20px'}} />
              )}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-image2"
                type="file"
                onChange={(event) => handleImageUpload(event, setImage2)}
              />
              <label htmlFor="upload-image2">
                <Button variant="contained" component="span" sx={{ backgroundColor: '#fdd835', color: '#000000' }} startIcon={<CloudUploadIcon />}>
                  Upload Image 2
                </Button>
              </label>
            </Box>
          </Grid>
        </Grid>
        <Typography sx={{ fontFamily: 'Handlee', fontSize: '1.5rem', paddingTop:'10px' ,paddingBottom: '10px', color: '#fff' }}>
          Good night Diary!
        </Typography>
        <div style={{textAlign:"center"}}>
          <button className='btn btn-warning btn-lg' style={{fontFamily: 'Handlee', marginTop: '20px', fontWeight:'bold'}} onClick={handleCreate}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEntry;
