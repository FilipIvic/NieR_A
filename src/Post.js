import React, {useState, useEffect} from 'react'
import './Post.css';

import firebase from 'firebase'
import {db} from './firebase'

import Avatar from '@material-ui/core/Avatar'
import { Button } from '@material-ui/core';


function Post({postId, user, username, caption, imageUrl}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if(postId){
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    comment: doc.data()
                })))
            })
        }

        return() => {
            unsubscribe()
        }
    }, [postId])
 
    const postComment = (event) => {
        event.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    const handleDelete = () => {
       if(window.confirm("Are you sure you want to delete post?")){
            db.collection("posts").doc(postId).delete().then(() => {
                console.log("Document successfully deleted!")
            }).catch((error) => {
                console.error("Error removing document: ", error)
            })
       }
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="" src="avatar1"></Avatar>
                <h3>{username}</h3>
                {(user && user.displayName === username) ? (
                    <div className="post__deleteButton">
                        <Button onClick={handleDelete}> <strong>Delete</strong> </Button>
                    </div> 
                ): null}
            </div>
            <img className="post__image" alt={username} src={imageUrl}></img> 
            <h4 className="post__text"> 
                <strong>{username}</strong>
                {` ${caption}`} 
            </h4>        
            <div className="post__comments">
            {comments.map(({id, comment}) => (
                <p key={id} className="app__comment">
                    <strong>{comment.username}</strong>
                    {` ${comment.text}`}
                </p>
            ))}
            </div>

            {user ? (
                <form className="post__commentBox">
                    <input className="post__input" type="text" placeholder="Add a comment..." value={comment} 
                        onChange={(e) => setComment(e.target.value)}>
                    </input>
                    <button disabled={!comment} className="post__button" type="submit" onClick={postComment}> Post </button>
                </form>
            ): null}          
        </div>
    )
}

export default Post
