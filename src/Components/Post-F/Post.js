import React, {useState, useEffect} from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase"
import {db} from '../../Fire_base'
//http://pngimg.com/uploads/instagram/instagram_PNG1.png

function Post({username,postID, captions ,user, imageURL}) {
    const [comments, setComments]= useState([]);
    const [comment1, setComment1]=useState('')
    
    //     Listener for comments of a specific post Id
    useEffect(() => {
        let unsubscribe;
        if (postID) {
            unsubscribe = db
            .collection("posts")
            .doc(postID)
            .collection("comments")
            .orderBy("timestamps", "desc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            })
        }
        return()=>{
            unsubscribe(); 
        };
    }, [postID])

    const postComment =(event)=>{
        event.preventDefault();
        db.collection("posts").doc(postID).collection("comments").add({
            text: comment1,
            username: user?.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        setComment1('')
       // setComments(comment1)
    
    }

    return (
        <div className="post">
            {/*Post header with avatar img & username & location*/}
            <div className="post_header">
                <Avatar
                 src=""  alt="Robot"/>            
                <h1>{username}</h1>           
            </div>
            <img className="post_Image"  src={imageURL}  alt=""/>

            {/* Post username & caption */}
            <div className="postUser_story">
                <h4 className="postStory_text"><strong>{username}:  </strong> {captions}</h4>
            </div>
            {/* Comments section */}
            <div className="post_comments">
                {comments.map((comment1)=>(
                    <p>
                        <strong>{comment1?.username}: </strong> {comment1?.text} <br/>
                <p>{comment1?.timestamp}</p>
                    </p>
                ))}
            </div>
            {user &&  (
                    <form className="post_commentBox">
                    <input
                    className="post_CommentInput"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment1}
                    onChange={(e)=> setComment1(e.target.value)}/>
                    <button
                    className="post_CommentButton"
                    disabled={!comment1}
                    type="submit"
                    onClick={postComment}> Post</button>
                </form>
            )}
            
        </div>
    )
}

export default Post
