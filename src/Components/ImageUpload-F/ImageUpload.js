import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import {db, storage}from "../../Fire_base";
import firebase from "firebase";
import "./imageUpload.css";


function ImageUpload({username, hideBtn}) {

    const [image, setImage]= useState(null);
    const[progress, setProgress]=useState(0);
    const [captions, setCaption]=useState('');

        const handleUpload=()=>{
            //    Upload image fucntion
            const uploadTask=storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    //   progress function
                        const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes)* 100 
                        );
                        setProgress(progress);
                },(error)=>{
                //  ERROR FUNCTION
                console.log(error);
                alert(error.message);
                },
                ()=>{
                    //  Upload complete function..
                    //  Downloading image back from firebase
                    storage
                        .ref("images")// go to ref folder (images) in Firebase storage
                            .child(image.name)// Go to image name child
                        .getDownloadURL()// and get me the download url link
                        .then(url=>(
                            //  POST IMAGE INSIDE FIRESTORE DATABASE NOW
                            db.collection("posts")
                                .add({
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    captions: captions,
                                    imageURL: url,
                                    username: username,
                                
                                }
                            )
                        )

                    );
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                }                 
            )  
        }       
    

    const handleChange= (e)=>{
        if (e.target.files[0]) {
            setImage(e.target.files[0]);      
        } 
        // e.target.files[0]? (setImage(e.target.files[0]))     
    }
    return (
      <div hideBtn={hideBtn} className="imageUpload">
    {/* I wanna have the following */}
      {/* Caption Input*/}
      {/* File chooser/picker for images and videos */}
      {/* Post Button */}              
      <progress className="imageupload_progressbar" value={progress} max="100"/>
      <input className="input1" type="text" placeholder="Enter Your captions" onChange={e=> setCaption(e.target.value)} value={captions}/>
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
