import React from "react";
import DiaryContext from "./DiaryContext";

const DiaryState =(props)=>{
    const host = "https://daily-diary-backend.vercel.app";
    const getPostByDate = async(date) =>{
        const response = await fetch(`${host}/api/v1/diaryentry/userpostsbydate/${date}`,{
            method: "GET",
            headers:{
                'auth-token': localStorage.getItem('token')
            },
        })
        const data = await response.json();
        return data;
    }
    const createPost = async(date, content, images, color) =>{
        try {
            const formData = new FormData();
            formData.append('date', date);
            formData.append('content', content);
            formData.append('color', color);
            images.forEach((image) => {
                formData.append(`images`, image);
            });
            const response = await fetch(`${host}/api/v1/diaryentry/createentry`, {
                method: "POST",
                headers: {
                    'auth-token': localStorage.getItem('token')
                },
                body: formData
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to create post:", error);
            throw error;
        }
    }
    const deletePost = async(id) =>{
        try{
            const response = await fetch(`${host}/api/v1/diaryentry/deleteentry/${id}`,{
                method:'DELETE',
                headers:{
                  'auth-token': localStorage.getItem('token')
                }
              })
            const json = await response.json();
            return json;
        }catch(error){
            console.error("Failed to create post:", error);
            throw error;
        }
    }
    const updatePost = async (id, date, content, images, color, retainedImages) => {
        try {
            const formData = new FormData();
            formData.append('date', date);
            formData.append('content', content);
            formData.append('color', color);
            images.forEach((image) => {
                formData.append('images', image);
            });
            retainedImages.forEach((image) => {
                formData.append('retainedImages', image);
            });
    
            const response = await fetch(`${host}/api/v1/diaryentry/updateentry/${id}`, {
                method: 'PUT',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
                body: formData,
            });
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to update post:', error);
            throw error;
        }
    };
    
    return (
        <DiaryContext.Provider value={{getPostByDate, createPost, deletePost, updatePost}}>
            {props.children}
        </DiaryContext.Provider>
    )
}

export default DiaryState;