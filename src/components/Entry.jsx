import { Typography, TextField, Box, IconButton, Grid, Button, Modal } from '@mui/material';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import './Entry.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import DiaryContext from '../context/DiaryContext';
import dayjs from 'dayjs';
import Loader from './Loader';
import HomeIcon from '@mui/icons-material/Home';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const Entry = () => {
  const context = useContext(DiaryContext);
  const navigate = useNavigate();
  const { date } = useParams();
  const { getPostByDate, deletePost, updatePost } = context;

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const maxCharacters = 4000;
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [retainedImages, setRetainedImages] = useState([]); 
  const [postExists, setIfPostExists] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editMode, toggleEditMode] = useState(false);
  const currentDate = dayjs().format('YYYY-MM-DD');
  const isNextDayDisabled = dayjs(date).isSameOrAfter(currentDate);
  const [id, setPostID] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    setLoading(false);
    setEntryText('');
    setImage1(null);
    setImage2(null);
    setRetainedImages([]); 
    setBgColor('#ffffff');
    setIfPostExists(true);
    toggleEditMode(false);
    setPostID('');
    const fetchExistingPost = async () => {
      try {
        setLoading(true);
        const response = await getPostByDate(date);
        if (!response.length) {
          setIfPostExists(false);
          setLoading(false);
          return;
        }
        setPostID(response[0]._id);
        if (response[0].content) setEntryText(response[0].content);
        if (response[0].images && response[0].images.length > 0) {
          if (response[0].images[0]) setImage1(response[0].images[0]);
          if (response[0].images[1]) setImage2(response[0].images[1]);
          setRetainedImages(response[0].images);
        }
        if (response[0].color) {
          setBgColor(response[0].color);
        }
        setLoading(false);
      } catch (error) {
        console.error("Some error occurred", error);
        toast.error('Some error occurred');
        setLoading(false);
      }
    };
    fetchExistingPost();
  }, [date, getPostByDate, navigate]);

  const handleDeleteConfirmation = () => {
    setConfirmationOpen(true);
  };
  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    setImage(file);
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
  }

  const handlePostUpdate = async () => {
    setLoading(true);
    try {
      const images = [];
      const newRetainedImages = [];

      if (image1 && typeof image1 === 'object' && 'name' in image1) {
        images.push(image1);
      } else if (image1) {
        newRetainedImages.push(image1);
      }
      if (image2 && typeof image2 === 'object' && 'name' in image2) {
        images.push(image2);
      } else if (image2) {
        newRetainedImages.push(image2);
      }
      const response = await updatePost(id, date, entryText, images, bgColor, newRetainedImages);
      toggleEditMode(false);
      toast.success('Diary entry updated successfully!');
      navigate(`/diaryentry/${date}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to update diary entry:", error);
      toast.error('Failed to update diary entry');
    }
  }

  const handleDeletePost = async () => {
    setLoading(true);
    try {
      const response = await deletePost(id);
      setConfirmationOpen(false);
      toast.success('Diary entry deleted successfully!');
      navigate(`/diaryentry/${date}`);
      window.location.reload();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to delete diary entry:", error);
      toast.error('Failed to delete diary entry');
    }
  }

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

  const navigateToDate = (offset) => {
    const newDate = dayjs(date).add(offset, 'day').format('YYYY-MM-DD');
    navigate(`/diaryentry/${newDate}`);
  };

  const navigateHome = () => {
    navigate('/');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='main-login-div'>
      <Modal open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', maxWidth: '400px', margin: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this entry? You can write a diary entry on the same day only.
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn btn-danger" style={{ marginRight: '10px' }} onClick={handleDeletePost}>
              Yes
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirmationOpen(false)}>
              No
            </button>
          </div>
        </div>
      </Modal>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <HomeIcon onClick={navigateHome} sx={{ color: '#fff', fontSize: '2rem' }}></HomeIcon>
      </div>
      <div className='diary-entry-div'>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', color: '#fff' }}>
          <button className='btn btn-warning btn-sm' sx={{ margin: '10px' }} onClick={() => navigateToDate(-1)}>
            Previous Day
          </button>
          <Typography sx={{ fontFamily: 'Handlee', fontSize: '1rem', paddingBottom: '10px', color: '#fff' }}>
            {date}
          </Typography>
          <button className='btn btn-warning btn-sm' sx={{ margin: '10px' }} onClick={() => navigateToDate(1)} disabled={isNextDayDisabled}
            style={{ opacity: isNextDayDisabled ? 0.5 : 1, cursor: isNextDayDisabled ? 'not-allowed' : 'pointer' }}
          >
            Next Day
          </button>
        </Box>
        {postExists ?
          <div>
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
              disabled={!editMode}
              sx={{
                fontFamily: 'Handlee',
                fontSize: '1.2rem',
                marginBottom: '10px',
                backgroundColor: bgColor,
                borderRadius: '20px',
                '& .Mui-disabled': {
                  color: '#000000',
                  WebkitTextFillColor: '#000000',
                },
              }}
            />
            <Typography sx={{ fontFamily: 'Handlee', fontSize: '0.7rem', color: '#fff', marginBottom: '10px' }}>
              {maxCharacters - entryText.length} characters remaining
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {image1 && (
                    editMode && typeof image1 === 'object' && 'name' in image1 ?
                      <img src={URL.createObjectURL(image1)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '20px', marginBottom: '20px' }} />
                      : <img src={image1} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '20px', marginBottom: '20px' }} />
                  )}
                  {editMode ? <>
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
                    </label></> : <></>}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {image2 && (
                    editMode && typeof image2 === 'object' && 'name' in image2 ?
                      <img src={URL.createObjectURL(image2)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '20px', marginBottom: '20px' }} />
                      : <img src={image2} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '20px', marginBottom: '20px' }} />
                  )}
                  {editMode ? <>
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
                    </label></> : <></>}
                </Box>
              </Grid>
            </Grid>
            <Typography sx={{ fontFamily: 'Handlee', fontSize: '1.5rem', paddingTop: '10px', paddingBottom: '10px', color: '#fff' }}>
              Good night Diary!
            </Typography>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              {editMode ? <></> : <button className='btn btn-success' style={{ display: 'block', margin: '15px' }} onClick={() => { toggleEditMode(true) }}>Edit this Entry</button>}
              {editMode ? <button className='btn btn-primary' style={{ display: 'block', margin: '15px' }} onClick={handlePostUpdate}>Save Changes</button> : <></>}
              <button className='btn btn-danger' style={{ display: 'block', margin: '15px' }} onClick={handleDeleteConfirmation}>Delete this Entry</button>
            </div>
          </div> :
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <Typography sx={{ fontFamily: 'Playfair Display', fontSize: '2rem', paddingBottom: '10px', color: '#fff' }}>
              You did not talk to your Diary on {date}. Make sure you express yourself today!
            </Typography>
          </div>
        }
      </div>
    </div>
  );
};

export default Entry;
