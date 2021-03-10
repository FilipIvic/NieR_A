import React, {useState, useEffect} from 'react'
import './App.css';

import Post from './Post'
import ImageUpload from './ImageUpload'

import {db, auth} from './firebase'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Input } from '@material-ui/core'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
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
}))

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [show, setShow] = useState(false)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser]= useState(null)

  const handleShowChange = () => {
    setShow(!show)
  }

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in...
        console.log(authUser)
        setUser(authUser)
      }else{
        //user has logged out...
        setUser(null)
      }
    })

    return() => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data() 
      })))
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault()

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
    
    setOpen(false)
    setShow(false)
  }

  const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setUser(user)
    setOpenSignIn(false)
    setShow(false)
  }
  
  return (
    <div className="app">

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              {/* <img className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""/> */}
              <h3> NieR A </h3>
            </center>
  	        <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" onClick={signUp}> Sign Up </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={()=>setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              {/* <img className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""/> */}
              <h3> NieR A </h3>
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit" onClick={signIn}> Log In </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        {/* <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          // src={require('./Images/Nier_A.png')}
          alt=""/> */}
        <h3> NieR A </h3>

        {user ? (
          <Modal open={show} onClose={()=>setShow(false)}>
            <div style={modalStyle} className={classes.paper}>
              <form className="app__signup">
                <ImageUpload username={user.displayName} showIcon={show} handleShowChange={() => handleShowChange()}/>
              </form>
            </div>
          </Modal>): null}
        
        {user ? (
          <div className="app__loginContainer">
            <Button><strong>{user.displayName}</strong></Button>
            <Button onClick={() => auth.signOut()}> Logout </Button>
            <Button onClick={() => setShow(true)}>
                <AddCircleOutlineIcon className="app__addButton"></AddCircleOutlineIcon>
            </Button>
          </div> 
        ):(
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}> Log In </Button> 
            <Button onClick={() => setOpen(true)}> Sign Up </Button> 
          </div>)}
      </div>

      <div className="app__posts">
        <div className="app__post">
        {posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))}
        </div>
      </div>
    </div>
  )
}

export default App;