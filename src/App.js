import React, {useState, useEffect} from 'react';
import Post from './Components/Post-F/Post'
import './App.css';
import {Input, Button} from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {db, auth} from './Fire_base';
import ImageUpload from "./Components/ImageUpload-F/ImageUpload";
import InstagramEmbed from 'react-instagram-embed';

//import Modal from 
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App( hideBtn) {
  const [openSignin, setOpenSignIn]=useState(false)
  const [posts, setPosts] =useState([]);
  const [open, setOpen]= useState(false);
  const classes = useStyles();
  const [modalStyle]= useState(getModalStyle);
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const[username, setUsername]=useState("");
  const [User, setUser]=useState(null)

//---onSnapshot()-- Listens and uploads new data to database collection when ever changes or new post is added
  //  UseEffect runs a piece of code based on a speicific condition
  useEffect(()=>{
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot=>{//  Access firestore database "posts" collection
      //everytime a new post is added this code will run
    setPosts(snapshot.docs.map(doc=>({
      id: doc.id,//post id
      post: doc.data()//post data (captions, username, post image)
    })));
    //  HOW TO PULL A POST BY ID 
    })
  },[]);

  useEffect(() => {
   const unsubscribe= auth.onAuthStateChanged((authUser)=>{
     if (authUser){
        //--user has logged in---
        console.log(authUser);
        setUser(authUser);

          if(authUser.displayName){
          // dont update username
         } else {
          // if we just created someone
              return authUser.updateProfile({
              displayName: username,
          })
        }
     }  else {
        //--user has loggeg out
        setUser(null)
     } 
   })
   //   Perform some clean up action before re triggering
   return ()=>{unsubscribe()};
  }, [User, username])

  const SignUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return  authUser.user.updateProfile({ displayName: username})
    })
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message));//show login error message
    setOpen(false)
   
  
  }

   
  const SignIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))
    setOpenSignIn(false);
  }
  return (
    <div className="App">
      <Modal 
      open={open}
      onClose={()=> setOpen(false)}
      >   
          <div style={modalStyle} className={classes.paper}>
            {/* MODAL OPENS WITH SIGN UP FORM */}
            <form className="app_signup">
              <center>
                  <img src="http://pngimg.com/uploads/instagram/instagram_PNG5.png" alt=""
                  className="app_headerImage"/>
              </center>
                  <Input placeholder="Email" type= "email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <Input placeholder="Password" type= "password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <Input placeholder="Username" type= "text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                  <Button type="submit" onClick={SignUp}>Sign Up</Button>        
                </form>           
          </div>
      </Modal>
      <Modal 
      open={openSignin}
      onClose={()=> setOpenSignIn(false)}
      >  
        <div style={modalStyle} className={classes.paper}>
           {/* MODAL OPENS WITH SIGN IN FORM AFTER ACCOUNT IS CREATEd */}
            {/* MODAL OPENS WITH SIGN UP FORM */}
            <form className="app_signup">
                  <center>
                    <img src="http://pngimg.com/uploads/instagram/instagram_PNG5.png" alt=""
                    className="app_headerImage"/>
                  </center>
                    <Input placeholder="Email" type= "email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <Input placeholder="Password" type= "password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <Button type="submit" onClick={SignIn}>Sign In</Button>        
              </form>           
        </div>
      </Modal>
      
      <div className="app_header">
        <img src="https://pngimg.com/uploads/instagram/instagram_PNG5.png" alt=""
        className="app_headerImage"/>

        {User? ( //if a user isnt present show sign in button , otherwise show sign in 
        <>
        <Button style={{backgroundColor:'lightgrey'}} onClick={()=> auth.signOut()}>Sign Out</Button>
  </>
      ) : (
        <div className="app_logIncntnr">
           <Button style={{backgroundColor:'lightgrey'}} onClick={()=> setOpenSignIn(true)}>Sign In</Button>
        <Button style={{backgroundColor:'lightgrey'}} onClick={()=> setOpen(true)}>Sign Up</Button>
        </div>
      )}    
      </div>
      {User?.displayName ? (<>
        <h3 className ="welcomebck">{` Welcome back  ${User?.displayName}`}</h3>
      <ImageUpload hideBtn username={User?.displayName}/>
      </>
      ): (<h3>Sorry must log in to upload</h3>)}
     
     <div className="app_post">
       <div className="app_postLeft">
          {/* POST */}
        {posts.map(({id,post})=>(//setting the POST values from the posts useState props
            <Post key={id} user={User} postID={id} username= {post?.username} captions={post?.captions} imageURL={post?.imageURL}/>
          ))}
       </div>
          <div className="app_postRight">
          <InstagramEmbed 
        url='https://www.instagram.com/p/CF4vBn-BM0R/'
        maxWidth={320}
        minWidth={160}
        minHeight={200}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
    />
          <InstagramEmbed 
        url='https://www.instagram.com/p/CF3MlYugZZ4/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
    />
          
        <InstagramEmbed 
        url='https://www.instagram.com/p/CF40v1iFyam/'
        maxWidth={320}
        
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
    />
          </div>
     </div>     
    </div>
  );
}

export default App;
    